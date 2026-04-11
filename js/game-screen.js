/**
 * game-screen.js — Game screen handlers
 */

let _character = null;

(async () => {
  const session = await Auth.getSession();
  _character    = await Character.getActive(session.user.id);
  await Game.start(_character);
  await Game.showZone();
  subscribeChat();
})();

function authLogout() {
  Auth.signOut();
}

function actionExplore() {
  Game.explore();
}

function actionRest() {
  Game.rest();
}

function actionInventory() {
  Game.showInventory();
}

function actionChat() {
  const panel = document.getElementById('chat-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function actionShop() {
  Game.openShopModal();
}

function actionRanking() {
  Game.showRanking();
}

async function sendChat() {
  const input   = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message || !_character) return;
  input.value = '';

  const session = await Auth.getSession();
  await supabaseClient.from('text_mmorpg_chat').insert({
    player_id: session.user.id,
    username:  _character.name,
    message,
  });
}

async function sendSideChat() {
  const input   = document.getElementById('chat-side-input');
  const message = input.value.trim();
  if (!message || !_character) return;
  input.value = '';

  const session = await Auth.getSession();
  await supabaseClient.from('text_mmorpg_chat').insert({
    player_id: session.user.id,
    username:  _character.name,
    message,
  });
}

function appendChatLine(text) {
  const line = document.createElement('div');
  line.className = 'log-line-chat';
  line.textContent = text;

  const main = document.getElementById('chat-log');
  if (main) { main.appendChild(line.cloneNode(true)); main.scrollTop = main.scrollHeight; }

  const side = document.getElementById('chat-side-log');
  if (side) { side.appendChild(line); side.scrollTop = side.scrollHeight; }
}

function subscribeChat() {
  supabaseClient
    .channel('chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'text_mmorpg_chat' }, payload => {
      const { username, message } = payload.new;
      appendChatLine(`[${username}] ${message}`);
    })
    .subscribe();
}
