/**
 * combat.js — Auto combat loop with skill intervention
 *
 * Flow:
 *   1. Player enters zone or selects target
 *   2. Monster lore description displayed
 *   3. Auto-combat resolves round by round
 *   4. Player may activate a skill between rounds
 *   5. Combat ends: victory / retreat / defeat
 */

const Combat = (() => {
  let state = null;
  let onLog = () => {};
  let onStatsUpdate = () => {};
  let skipDelay = null;

  function setLogHandler(fn)   { onLog = fn; }
  function setStatsHandler(fn) { onStatsUpdate = fn; }

  // 메인 게임 로그 (story/system 결과 메시지용)
  function log(text, type = 'system') { onLog(text, type); }

  // 전투 패널 전용 로그
  function combatLog(text, type = 'system') {
    const el = document.getElementById('combat-log');
    if (!el) return;
    const line = document.createElement('div');
    line.className = `log-line-${type}`;
    line.textContent = text;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  function updateMonsterHp() {
    if (!state) return;
    const { hp, hp_max } = state.monster;
    const pct = Math.max(0, Math.round(hp / hp_max * 100));
    const fill = document.getElementById('combat-hp-bar-fill');
    const text = document.getElementById('combat-hp-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${hp} / ${hp_max}`;
  }

  function showCombatPanel() {
    const panel  = document.getElementById('combat-panel');
    const nameEl = document.getElementById('combat-monster-name');
    const logEl  = document.getElementById('combat-log');
    if (panel)  panel.style.display = 'block';
    if (nameEl) nameEl.textContent = state.monster.name;
    if (logEl)  logEl.innerHTML = '';
    updateMonsterHp();
  }

  function hideCombatPanel() {
    const panel = document.getElementById('combat-panel');
    if (panel) panel.style.display = 'none';
  }

  function calcPlayerDmg(char, monsterDef, monsterCon) {
    const atk = char.atk || 0;
    const cls = char.class;

    if (cls === 'mage' || cls === 'cleric') {
      // 마법 데미지: DEF 관통
      const stat_int = cls === 'mage' ? char.stat_int : char.stat_wiz;
      return Math.max(1,
        Math.floor((atk + stat_int * 0.5) * (0.85 + Math.random() * 0.3))
      );
    } else {
      // 물리 데미지
      const atk_stat = cls === 'warrior' ? char.stat_str : char.stat_dex;
      const def = monsterDef || 0;
      const con = monsterCon || 0;
      return Math.max(1,
        Math.floor((atk + atk_stat * 0.5) * (0.85 + Math.random() * 0.3))
        - Math.floor(def + con * 0.3)
      );
    }
  }

  function calcMonsterDmg(monster, char) {
    const dodge_chance = Math.min(0.3, (char.stat_dex || 0) * 0.005);
    if (Math.random() < dodge_chance) return null; // 회피
    return Math.max(1, Math.floor(monster.atk * (0.85 + Math.random() * 0.3)));
  }

  function delay(ms) {
    return new Promise(res => {
      skipDelay = res;
      setTimeout(res, ms);
    });
  }

  async function start(character, monster) {
    state = {
      character: { ...character },
      monster:   { ...monster },
      round:     0,
      active:    true,
    };

    showCombatPanel();
    combatLog(monster.description, 'story');
    combatLog(`전투 시작: ${character.name} vs ${monster.name}`, 'system');

    // 궁수 선제 공격
    if (state.character.class === 'archer') {
      const preemptDmg = calcPlayerDmg(state.character, state.monster.def, state.monster.stat_con);
      state.monster.hp = Math.max(0, state.monster.hp - preemptDmg);
      combatLog(`[선제 사격] ${state.character.name}의 공격 → ${state.monster.name} -${preemptDmg} HP (${state.monster.hp}/${state.monster.hp_max})`, 'player-attack');
      updateMonsterHp();
      if (state.monster.hp <= 0) { resolve('victory'); return; }
    }

    while (state && state.active) {
      nextRound();
      if (state && state.active) await delay(1000);
    }
  }

  function nextRound() {
    if (!state || !state.active) return;
    state.round++;
    skipDelay = null;
    combatLog(`── 라운드 ${state.round} ──`, 'system');

    // Player auto-attack
    const playerDmg = calcPlayerDmg(state.character, state.monster.def, state.monster.stat_con);
    state.monster.hp = Math.max(0, state.monster.hp - playerDmg);
    combatLog(`${state.character.name}의 공격 → ${monster().name} -${playerDmg} HP (${monster().hp}/${monster().hp_max})`, 'player-attack');
    updateMonsterHp();

    if (monster().hp <= 0) { resolve('victory'); return; }

    // Monster auto-attack
    const monsterDmg = calcMonsterDmg(state.monster, state.character);
    if (monsterDmg === null) {
      combatLog(`${state.character.name}이(가) 공격을 회피했다!`, 'dodge');
    } else {
      state.character.hp = Math.max(0, state.character.hp - monsterDmg);
      combatLog(`${monster().name}의 공격 → ${state.character.name} -${monsterDmg} HP (${state.character.hp}/${state.character.hp_max})`, 'monster-attack');
    }
    onStatsUpdate(state.character);

    if (state.character.hp <= 0) { resolve('defeat'); return; }
  }

  function manualAttack() {
    if (!state || !state.active) return;
    if (skipDelay) { skipDelay(); skipDelay = null; }
  }

  function useSkill(skill) {
    if (!state || !state.active) return;
    if (state.character.mp < skill.mpCost) {
      log('MP가 부족합니다.', 'system');
      return;
    }
    state.character.mp -= skill.mpCost;
    skill.effect(state);
    log(`[스킬] ${skill.name} 사용 (MP -${skill.mpCost})`, 'system');
    nextRound();
  }

  function retreat() {
    if (!state || !state.active) return;
    state.character.hp = Math.max(1, Math.floor(state.character.hp * 0.9));
    combatLog('전투에서 후퇴했습니다.', 'system');
    combatLog(`HP 10% 감소 (현재 HP: ${state.character.hp})`, 'monster-attack');
    onStatsUpdate(state.character);
    resolve('retreat');
  }

  function resolve(outcome) {
    if (!state) return;
    state.active = false;
    skipDelay = null;

    if (outcome === 'victory') {
      combatLog(`승리! ${state.monster.expReward} EXP 획득.`, 'item');
      if (state.monster.loot) {
        state.monster.loot.forEach(item => combatLog(`아이템 획득: ${item.name}`, 'item'));
      }
    } else if (outcome === 'defeat') {
      combatLog('쓰러졌습니다. 체력을 회복하십시오.', 'system');
    }

    hideCombatPanel();
    Game.onCombatEnd(state.character, outcome, state.monster);
    state = null;
  }

  function monster() { return state.monster; }
  function getState() { return state; }

  return { start, nextRound, useSkill, retreat, manualAttack, setLogHandler, setStatsHandler, getState };
})();
