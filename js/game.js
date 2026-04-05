/**
 * game.js — Core game loop and screen orchestration
 */

const Game = (() => {
  let character = null;
  let logEl = null;

  function log(text, type = '') {
    if (!logEl) return;
    const line = document.createElement('div');
    line.className = `log-line-${type}`;
    line.textContent = text;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  async function start(char) {
    character = char;
    logEl = document.getElementById('game-log');
    Combat.setLogHandler(log);

    log(`Mytharion에 오신 것을 환영합니다, ${character.name}.`, 'story');
    log(`직업: ${character.class}  |  레벨: ${character.level}  |  지역: ${character.zone_id}`, 'system');
    renderStats();
  }

  function renderStats() {
    const el = document.getElementById('stats');
    if (!el || !character) return;
    el.innerHTML = `
      <span class="amber">${character.name}</span>
      Lv.${character.level} ${character.class}
      &nbsp;|&nbsp; HP ${character.hp}/${character.hp_max}
      &nbsp;|&nbsp; MP ${character.mp}/${character.mp_max}
    `;
  }

  function onCombatEnd(updatedChar, outcome, monster) {
    character = { ...character, ...updatedChar };

    if (outcome === 'victory') {
      character.exp += monster.expReward;
      const expNeeded = character.level * 100;
      if (character.exp >= expNeeded) {
        character = Character.levelUpStats(character);
        log(`레벨 업! → Lv.${character.level}`, 'system');
      }
      Character.save(character);
    } else if (outcome === 'defeat') {
      character.hp = Math.floor(character.hp_max * 0.3);
      character.zone_id = 'zone_start';
      Character.save(character);
    }

    renderStats();
  }

  return { start, log, onCombatEnd };
})();
