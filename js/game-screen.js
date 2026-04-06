/**
 * game-screen.js — Game screen handlers
 */

(async () => {
  const session   = await Auth.getSession();
  const character = await Character.getActive(session.user.id);
  await Game.start(character);
  subscribeChat();
})();

function actionExplore() {
  Game.log('주변을 탐색합니다...', 'story');
  // TODO: load zone monsters and trigger encounter
}

function actionRest() {
  Game.log('잠시 휴식을 취합니다. HP/MP가 일부 회복됩니다.', 'system');
  // TODO: partial HP/MP restore + save
}

function actionInventory() {
  Game.log('[인벤토리] — 준비 중', 'system');
}

function actionChat() {
  const panel = document.getElementById('chat-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

async function sendChat() {
  const input   = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;
  input.value = '';

  const session = await Auth.getSession();
  const { data: player } = await supabase
    .from('text_mmorpg_players')
    .select('username')
    .eq('id', session.user.id)
    .single();

  await supabase.from('text_mmorpg_chat').insert({
    player_id: session.user.id,
    username:  player.username,
    message,
  });
}

function subscribeChat() {
  supabase
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
