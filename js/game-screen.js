/**
 * game-screen.js — Game screen handlers
 */

(async () => {
  const session   = await Auth.getSession();
  const character = await Character.getActive(session.user.id);
  await Game.start(character);
  await Game.showZone();
  subscribeChat();
})();

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

function actionRanking() {
  Game.showRanking();
}

async function sendChat() {
  const input   = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;
  input.value = '';

  const session = await Auth.getSession();
  const { data: player } = await supabaseClient
    .from('text_mmorpg_players')
    .select('username')
    .eq('id', session.user.id)
    .single();

  await supabaseClient.from('text_mmorpg_chat').insert({
    player_id: session.user.id,
    username:  player.username,
    message,
  });
}

function subscribeChat() {
  supabaseClient
    .channel('chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'text_mmorpg_chat' }, payload => {
      const { username, message } = payload.new;
      const chatLog = document.getElementById('chat-log');
      const line = document.createElement('div');
      line.className = 'log-line-chat';
      line.textContent = `[${username}] ${message}`;
      chatLog.appendChild(line);
      chatLog.scrollTop = chatLog.scrollHeight;
    })
    .subscribe();
}
