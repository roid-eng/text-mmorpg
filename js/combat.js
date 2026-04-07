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
  let state = null;       // active combat session
  let onLog = () => {};   // callback to print lines to the game log

  function setLogHandler(fn) {
    onLog = fn;
  }

  function log(text, type = 'combat') {
    onLog(text, type);
  }

  function rollDmg(atk, variance = 0.2) {
    const low  = Math.floor(atk * (1 - variance));
    const high = Math.ceil(atk  * (1 + variance));
    return Math.max(1, low + Math.floor(Math.random() * (high - low + 1)));
  }

  function calcPlayerAtk(char) {
    return char.stat_str + (char.class === 'mage' ? char.stat_int : 0);
  }

  function start(character, monster) {
    state = {
      character: { ...character },
      monster:   { ...monster },
      round:     0,
      active:    true,
    };

    log(monster.description, 'story');
    log(`전투 시작: ${character.name} vs ${monster.name}`, 'system');
    nextRound();
  }

  function nextRound() {
    if (!state || !state.active) return;
    state.round++;
    log(`── 라운드 ${state.round} ──`, 'system');

    // Player auto-attack
    const playerDmg = rollDmg(calcPlayerAtk(state.character));
    state.monster.hp = Math.max(0, state.monster.hp - playerDmg);
    log(`${state.character.name}의 공격 → ${monster().name} -${playerDmg} HP (${monster().hp}/${monster().hp_max})`, 'combat');

    if (monster().hp <= 0) { resolve('victory'); return; }

    // Monster auto-attack
    const monsterDmg = rollDmg(state.monster.atk);
    state.character.hp = Math.max(0, state.character.hp - monsterDmg);
    log(`${monster().name}의 공격 → ${state.character.name} -${monsterDmg} HP (${state.character.hp}/${state.character.hp_max})`, 'combat');

    if (state.character.hp <= 0) { resolve('defeat'); return; }
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
    log('전투에서 물러났습니다.', 'system');
    resolve('retreat');
  }

  function resolve(outcome) {
    if (!state) return;
    state.active = false;

    if (outcome === 'victory') {
      log(`승리! ${state.monster.expReward} EXP 획득.`, 'loot');
      if (state.monster.loot) {
        state.monster.loot.forEach(item => log(`아이템 획득: ${item.name}`, 'loot'));
      }
    } else if (outcome === 'defeat') {
      log('쓰러졌습니다. 체력을 회복하십시오.', 'system');
    }

    Game.onCombatEnd(state.character, outcome, state.monster);
    state = null;
  }

  function monster() { return state.monster; }
  function getState() { return state; }

  return { start, nextRound, useSkill, retreat, setLogHandler, getState };
})();
