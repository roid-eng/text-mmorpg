/**
 * combat.js — Auto combat with optional skill intervention
 *
 * Flow per round:
 *   1. Round starts → skill buttons activated (cooldown/MP check)
 *   2. 1.5s wait for skill selection (pendingSkill)
 *   3. If skill selected → skill attack; else → basic attack (auto)
 *   4. Monster HP check → 0: victory (no counter)
 *   5. 1s delay → monster counter-attack
 *   6. Player HP check → 0: defeat
 *   7. Next round begins automatically
 *
 * Log policy:
 *   - During combat: combatLog only (#combat-log)
 *   - After combat: log only (#game-log) for result summary
 */

const Combat = (() => {
  let state = null;
  let onLog = () => {};
  let onStatsUpdate = () => {};

  function setLogHandler(fn)   { onLog = fn; }
  function setStatsHandler(fn) { onStatsUpdate = fn; }

  // Main log (game-log) — combat result only
  function log(text, type = 'system') { onLog(text, type); }

  // Combat panel log (#combat-log)
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
    if (panel) {
      panel.style.animation = 'fadeIn 0.3s ease';
      panel.style.display = 'block';
    }
    if (nameEl) nameEl.textContent = state.monster.name;
    if (logEl)  logEl.innerHTML = '';
    updateMonsterHp();
  }

  async function hideCombatPanel() {
    const panel = document.getElementById('combat-panel');
    if (!panel) return;
    panel.style.animation = 'fadeOut 0.3s ease forwards';
    await new Promise(res => setTimeout(res, 300));
    panel.style.display = 'none';
    panel.style.animation = '';
  }

  // --- Damage calculation ---

  function calcPlayerDmg(char, monsterDef, monsterCon, multiplier = 1) {
    const atk = char.atk || 0;
    const cls = char.class;
    let base;

    if (cls === 'mage' || cls === 'cleric') {
      const statMag = cls === 'mage' ? char.stat_int : char.stat_wiz;
      base = Math.max(1, Math.floor((atk + statMag * 0.5) * (0.85 + Math.random() * 0.3)));
    } else {
      const atkStat = cls === 'warrior' ? char.stat_str : char.stat_dex;
      const def = monsterDef || 0;
      const con = monsterCon || 0;
      base = Math.max(1,
        Math.floor((atk + atkStat * 0.5) * (0.85 + Math.random() * 0.3))
        - Math.floor(def + con * 0.3)
      );
    }

    // Apply ATK buffs (분노, 신의 가호)
    let buffMult = 1;
    (state.buffs || []).forEach(b => {
      if (b.type === 'atk_mult') buffMult *= b.value;
    });

    return Math.max(1, Math.floor(base * multiplier * buffMult));
  }

  function calcMonsterDmg(monster, char) {
    const dodge = Math.min(0.3, (char.stat_dex || 0) * 0.005);
    if (Math.random() < dodge) return null; // 회피
    return Math.max(1, Math.floor(monster.atk * (0.85 + Math.random() * 0.3)));
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  // --- UI rendering ---

  function getOrCreateBuffEl() {
    let el = document.getElementById('combat-buff-status');
    if (!el) {
      el = document.createElement('div');
      el.id = 'combat-buff-status';
      el.style.cssText = 'font-size:0.75rem; color:#e8a020; min-height:1em; margin-bottom:4px;';
      const skillWrap = document.getElementById('skill-buttons');
      if (skillWrap && skillWrap.parentNode) {
        skillWrap.parentNode.insertBefore(el, skillWrap);
      }
    }
    return el;
  }

  function renderBuffStatus() {
    const el = getOrCreateBuffEl();
    const active = (state.buffs || []).filter(b => b.rounds > 0);
    el.textContent = active.map(b => `${b.name} (${b.rounds}라운드 남음)`).join('  ');
  }

  function renderSkillButtons() {
    const wrap = document.getElementById('skill-buttons');
    if (!wrap) return;
    wrap.innerHTML = '';

    const availableSkills = (state.skills || []).filter(skill => {
      const cd = state.cooldowns[skill.id] || 0;
      return cd === 0 && state.character.mp >= skill.mp_cost;
    });

    // Render all skill buttons (disabled ones included)
    (state.skills || []).forEach(skill => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      const cd = state.cooldowns[skill.id] || 0;
      const mpOk = state.character.mp >= skill.mp_cost;

      if (cd > 0) {
        btn.textContent = `[ ${skill.name} (${cd}) ]`;
        btn.disabled = true;
        btn.style.opacity = '0.4';
      } else if (!mpOk) {
        btn.textContent = `[ ${skill.name} (MP:${skill.mp_cost}) ]`;
        btn.disabled = true;
        btn.style.opacity = '0.4';
      } else {
        btn.textContent = `[ ${skill.name} (MP:${skill.mp_cost}) ]`;
        btn.dataset.skillId = skill.id;
        btn.onclick = () => {
          state.pendingSkill = skill;
          // Visual: highlight selected button
          wrap.querySelectorAll('button').forEach(b => b.style.outline = '');
          btn.style.outline = '2px solid #e8a020';
          const hintEl = document.getElementById('skill-select-hint');
          if (hintEl) hintEl.textContent = `[${skill.name}] 선택됨`;
        };
      }
      wrap.appendChild(btn);
    });

    // Show selection hint if any skill is usable
    if (availableSkills.length > 0) {
      const hint = document.createElement('span');
      hint.id = 'skill-select-hint';
      hint.style.cssText = 'font-size:0.75rem; color:#888; align-self:center; margin-left:4px;';
      hint.textContent = '(1.5초 내 선택)';
      wrap.appendChild(hint);
    }
  }

  function setSkillButtonsEnabled(enabled) {
    const wrap = document.getElementById('skill-buttons');
    if (!wrap) return;
    wrap.querySelectorAll('button').forEach(btn => { btn.disabled = !enabled; });
  }

  // --- Combat entry ---

  async function start(character, monster, skills = []) {
    state = {
      character:  { ...character },
      monster:    { ...monster },
      round:      0,
      active:     true,
      skills,
      cooldowns:  {},
      buffs:      [],
      pendingDot: null,
      pendingSkill: null,
    };

    showCombatPanel();
    combatLog(monster.description, 'story');
    combatLog(`전투 시작: ${character.name} vs ${monster.name}`, 'system');

    // Archer preemptive strike
    if (state.character.class === 'archer') {
      const preemptDmg = calcPlayerDmg(state.character, state.monster.def, state.monster.stat_con);
      state.monster.hp = Math.max(0, state.monster.hp - preemptDmg);
      combatLog(`[선제 사격] ${state.character.name}의 공격 → ${state.monster.name} -${preemptDmg} HP (${state.monster.hp}/${state.monster.hp_max})`, 'player-attack');
      updateMonsterHp();
      await delay(800);
      if (state.monster.hp <= 0) { resolveOutcome('victory'); return; }
    }

    beginRound();
  }

  // --- Round lifecycle ---

  async function beginRound() {
    if (!state || !state.active) return;
    state.round++;
    state.pendingSkill = null;
    combatLog(`── 라운드 ${state.round} ──`, 'system');

    // Apply blizzard DoT from previous round
    if (state.pendingDot) {
      const dot = state.pendingDot;
      state.pendingDot = null;
      state.monster.hp = Math.max(0, state.monster.hp - dot.dmg);
      combatLog(`[블리자드] 지속 피해 → ${state.monster.name} -${dot.dmg} HP (${state.monster.hp}/${state.monster.hp_max})`, 'player-attack');
      updateMonsterHp();
      if (state.monster.hp <= 0) { resolveOutcome('victory'); return; }
    }

    // Tick cooldowns
    for (const id in state.cooldowns) {
      if (state.cooldowns[id] > 0) state.cooldowns[id]--;
    }

    // Tick buff durations
    state.buffs = state.buffs
      .map(b => ({ ...b, rounds: b.rounds - 1 }))
      .filter(b => b.rounds > 0);

    renderBuffStatus();

    // Check if any skill is usable this round
    const hasAvailableSkill = (state.skills || []).some(skill => {
      const cd = state.cooldowns[skill.id] || 0;
      return cd === 0 && state.character.mp >= skill.mp_cost;
    });

    if (hasAvailableSkill) {
      renderSkillButtons();
      // Wait for skill selection window
      await delay(1500);
    }

    if (!state || !state.active) return;

    // Lock buttons before executing action
    setSkillButtonsEnabled(false);

    if (state.pendingSkill) {
      const skill = state.pendingSkill;
      state.pendingSkill = null;
      await doSkillAction(skill);
    } else {
      await doBasicAttack();
    }
  }

  // --- Player actions ---

  async function doBasicAttack() {
    if (!state || !state.active) return;

    const dmg = calcPlayerDmg(state.character, state.monster.def, state.monster.stat_con);
    state.monster.hp = Math.max(0, state.monster.hp - dmg);
    combatLog(`${state.character.name}의 공격 → ${state.monster.name} -${dmg} HP (${state.monster.hp}/${state.monster.hp_max})`, 'player-attack');
    updateMonsterHp();

    if (state.monster.hp <= 0) { resolveOutcome('victory'); return; }
    await delay(1000);
    await monsterTurn();
  }

  async function doSkillAction(skill) {
    if (!state || !state.active) return;
    if (state.character.mp < skill.mp_cost) {
      await doBasicAttack();
      return;
    }

    state.character.mp = Math.max(0, state.character.mp - skill.mp_cost);
    state.cooldowns[skill.id] = skill.cooldown || 0;
    onStatsUpdate(state.character);

    await applySkillEffect(skill);
    if (!state || !state.active) return;

    await delay(1000);
    await monsterTurn();
  }

  async function applySkillEffect(skill) {
    const char = state.character;
    const mob  = state.monster;
    const eff  = skill.effect_type;

    if (eff === 'damage') {
      if (Math.random() < 0.1) {
        combatLog(`[${skill.name}] ${mob.name}이(가) 공격을 회피했다!`, 'dodge');
      } else {
        const dmg = calcPlayerDmg(char, mob.def, mob.stat_con, skill.damage_multiplier || 1);
        mob.hp = Math.max(0, mob.hp - dmg);
        combatLog(`[${skill.name}] ${char.name}의 공격 → ${mob.name} -${dmg} HP (${mob.hp}/${mob.hp_max})`, 'player-attack');
        updateMonsterHp();
        if (mob.hp <= 0) { resolveOutcome('victory'); }
      }

    } else if (eff === 'multi_hit') {
      // 연사: 3회 공격
      for (let i = 0; i < 3; i++) {
        if (!state || !state.active) return;
        if (Math.random() < 0.1) {
          combatLog(`[${skill.name}] ${mob.name}이(가) ${i + 1}번째 공격을 회피했다!`, 'dodge');
          if (i < 2) await delay(350);
          continue;
        }
        const dmg = calcPlayerDmg(char, mob.def, mob.stat_con, skill.damage_multiplier || 0.5);
        mob.hp = Math.max(0, mob.hp - dmg);
        combatLog(`[${skill.name}] ${i + 1}번째 공격 → ${mob.name} -${dmg} HP (${mob.hp}/${mob.hp_max})`, 'player-attack');
        updateMonsterHp();
        if (mob.hp <= 0) { resolveOutcome('victory'); return; }
        if (i < 2) await delay(350);
      }

    } else if (eff === 'dot') {
      // 블리자드: 현재 라운드 + 다음 라운드 DoT
      if (Math.random() < 0.1) {
        combatLog(`[${skill.name}] ${mob.name}이(가) 공격을 회피했다!`, 'dodge');
      } else {
        const dmg = calcPlayerDmg(char, mob.def, mob.stat_con, skill.damage_multiplier || 1);
        mob.hp = Math.max(0, mob.hp - dmg);
        combatLog(`[${skill.name}] ${char.name}의 공격 → ${mob.name} -${dmg} HP (${mob.hp}/${mob.hp_max})`, 'player-attack');
        state.pendingDot = { dmg: Math.floor(dmg * 0.5) };
        updateMonsterHp();
        if (mob.hp <= 0) { resolveOutcome('victory'); return; }
      }

    } else if (eff === 'defend') {
      // 방어 태세: 이번 라운드 받는 피해 50% 감소
      state.buffs.push({ id: 'defend', name: '방어 태세', type: 'defend', value: 0.5, rounds: 1 });
      combatLog(`[방어 태세] 피해가 감소합니다.`, 'system');
      renderBuffStatus();

    } else if (eff === 'mana_shield') {
      // 마나 실드: 이번 라운드 피해를 MP로 흡수
      state.buffs.push({ id: 'mana_shield', name: '마나 실드', type: 'mana_shield', rounds: 1 });
      combatLog(`[마나 실드] 이번 피해를 MP로 흡수합니다.`, 'system');
      renderBuffStatus();

    } else if (eff === 'heal') {
      // 치유: hp_max * 0.3 회복
      const healed = Math.floor(char.hp_max * 0.3);
      char.hp = Math.min(char.hp_max, char.hp + healed);
      combatLog(`[${skill.name}] HP +${healed} 회복됐습니다.`, 'dodge');
      onStatsUpdate(char);

    } else if (eff === 'buff') {
      // 분노 / 신의 가호: buff_duration 라운드 ATK 버프
      const duration = skill.buff_duration || 3;
      const value    = skill.buff_value    || 1.5;
      state.buffs = state.buffs.filter(b => b.id !== skill.id);
      state.buffs.push({ id: skill.id, name: skill.name, type: 'atk_mult', value, rounds: duration });
      combatLog(`[${skill.name}] 버프가 발동됩니다. (${duration}라운드)`, 'item');
      renderBuffStatus();
    }
  }

  // --- Monster counter-attack ---

  async function monsterTurn() {
    if (!state || !state.active) return;

    const rawDmg = calcMonsterDmg(state.monster, state.character);

    if (rawDmg === null) {
      combatLog(`${state.character.name}이(가) 공격을 회피했다!`, 'dodge');
    } else {
      let dmg = rawDmg;

      // Defend buff: 50% damage reduction
      const defendBuff = state.buffs.find(b => b.type === 'defend');
      if (defendBuff) {
        dmg = Math.floor(dmg * defendBuff.value);
        combatLog(`[방어 태세] 피해 감소: ${rawDmg} → ${dmg}`, 'system');
      }

      // Mana shield: absorb damage with MP
      const shieldBuff = state.buffs.find(b => b.type === 'mana_shield');
      if (shieldBuff && dmg > 0) {
        if (state.character.mp >= dmg) {
          state.character.mp -= dmg;
          combatLog(`[마나 실드] ${state.monster.name}의 공격 → MP -${dmg} (MP: ${state.character.mp}/${state.character.mp_max})`, 'system');
          dmg = 0;
        } else {
          const absorbed = state.character.mp;
          dmg -= absorbed;
          state.character.mp = 0;
          combatLog(`[마나 실드] MP ${absorbed} 흡수, 잔여 피해 HP 적용`, 'system');
        }
      }

      if (dmg > 0) {
        state.character.hp = Math.max(0, state.character.hp - dmg);
        combatLog(`${state.monster.name}의 공격 → ${state.character.name} -${dmg} HP (${state.character.hp}/${state.character.hp_max})`, 'monster-attack');
      }
    }

    onStatsUpdate(state.character);

    if (state.character.hp <= 0) { resolveOutcome('defeat'); return; }
    await delay(600);
    beginRound();
  }

  // --- Retreat ---

  function retreat() {
    if (!state || !state.active) return;
    state.character.hp = Math.max(1, Math.floor(state.character.hp * 0.9));
    combatLog('전투에서 후퇴했습니다.', 'system');
    combatLog(`HP 10% 감소 (현재 HP: ${state.character.hp})`, 'monster-attack');
    onStatsUpdate(state.character);
    resolveOutcome('retreat');
  }

  // --- Resolution ---

  async function resolveOutcome(outcome) {
    if (!state) return;
    state.active = false;

    const char = state.character;
    const mob  = state.monster;
    state = null;

    // Clean up combat UI
    const wrap = document.getElementById('skill-buttons');
    if (wrap) wrap.innerHTML = '';
    const buffEl = document.getElementById('combat-buff-status');
    if (buffEl) buffEl.textContent = '';

    // Combat result → main log only
    if (outcome === 'victory') {
      combatLog(`승리! ${mob.expReward} EXP 획득.`, 'item');
      log(`⚔ ${mob.name}을 처치했습니다. ${mob.expReward} EXP 획득.`, 'item');
    } else if (outcome === 'defeat') {
      combatLog('쓰러졌습니다.', 'system');
      log('💀 쓰러졌습니다. 아르단 평야로 귀환합니다.', 'monster-attack');
    } else if (outcome === 'retreat') {
      log('🏃 전투에서 후퇴했습니다.', 'system');
    }

    await new Promise(res => setTimeout(res, 1500));
    await hideCombatPanel();
    Game.onCombatEnd(char, outcome, mob);
  }

  function getState() { return state; }

  return { start, retreat, setLogHandler, setStatsHandler, getState };
})();
