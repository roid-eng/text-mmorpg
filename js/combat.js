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
    return new Promise(res => setTimeout(res, ms));
  }

  async function start(character, monster) {
    state = {
      character: { ...character },
      monster:   { ...monster },
      round:     0,
      active:    true,
    };

    log(monster.description, 'story');
    log(`전투 시작: ${character.name} vs ${monster.name}`, 'system');

    while (state && state.active) {
      nextRound();
      if (state && state.active) await delay(1000);
    }
  }

  function nextRound() {
    if (!state || !state.active) return;
    state.round++;
    log(`── 라운드 ${state.round} ──`, 'system');

    // Player auto-attack
    const playerDmg = calcPlayerDmg(state.character, state.monster.def, state.monster.stat_con);
    state.monster.hp = Math.max(0, state.monster.hp - playerDmg);
    log(`${state.character.name}의 공격 → ${monster().name} -${playerDmg} HP (${monster().hp}/${monster().hp_max})`, 'combat');

    if (monster().hp <= 0) { resolve('victory'); return; }

    // Monster auto-attack
    const monsterDmg = calcMonsterDmg(state.monster, state.character);
    if (monsterDmg === null) {
      log(`${state.character.name}이(가) 공격을 회피했다!`, 'combat');
    } else {
      state.character.hp = Math.max(0, state.character.hp - monsterDmg);
      log(`${monster().name}의 공격 → ${state.character.name} -${monsterDmg} HP (${state.character.hp}/${state.character.hp_max})`, 'combat');
    }

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
