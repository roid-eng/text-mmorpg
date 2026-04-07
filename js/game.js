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

  // 전투 중 모든 버튼 비활성화 / 활성화 (Logout 제외)
  function setActionsDisabled(disabled) {
    document.querySelectorAll('button.btn').forEach(btn => {
      if (btn.textContent.trim() === 'Logout') return;
      btn.disabled = disabled;
    });
  }

  // 지역 정보 + 이동 버튼만 렌더링 (몬스터 조우 없음)
  async function renderZone(zoneId) {
    const { data: zone, error: zoneErr } = await supabaseClient
      .from('text_mmorpg_zones')
      .select('*')
      .eq('id', zoneId)
      .single();
    if (zoneErr || !zone) { log('지역 정보를 불러올 수 없습니다.', 'system'); return; }

    const { data: connections, error: connErr } = await supabaseClient
      .from('text_mmorpg_zone_connections')
      .select('id, direction, description, to_zone:to_zone_id(id, name)')
      .eq('from_zone_id', zoneId);
    if (connErr) { log('연결 정보를 불러올 수 없습니다.', 'system'); return; }

    log(`[ ${zone.name} ]`, 'story');
    log(zone.description, 'story');
    if (zone.level_min != null && zone.level_max != null) {
      log(`레벨 권장: ${zone.level_min}~${zone.level_max}`, 'system');
    }

    const panel   = document.getElementById('zone-actions');
    const title   = document.getElementById('zone-actions-title');
    const btnWrap = document.getElementById('zone-direction-buttons');

    title.textContent = '이동';
    btnWrap.innerHTML = '';

    if (!connections || connections.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'muted';
      empty.textContent = '이동할 수 있는 곳이 없습니다.';
      btnWrap.appendChild(empty);
    } else {
      connections.forEach(conn => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = `[ ${conn.direction}으로 이동 — ${conn.to_zone.name} ]`;
        btn.onclick = () => moveToZone(conn.to_zone.id, conn.description);
        btnWrap.appendChild(btn);
      });
    }

    panel.style.display = 'block';
  }

  // EXPLORE 클릭 시: 지역 렌더링 + 몬스터 조우
  async function explore() {
    let zoneId = parseInt(character.zone_id);
    if (isNaN(zoneId)) {
      const { data: startZone, error } = await supabaseClient
        .from('text_mmorpg_zones')
        .select('id')
        .eq('is_start', true)
        .single();
      if (error || !startZone) { log('시작 지역을 찾을 수 없습니다.', 'system'); return; }
      zoneId = startZone.id;
      character.zone_id = String(zoneId);
      await Character.save(character);
    }

    await renderZone(zoneId);
    await loadMonsters(zoneId);
  }

  // 지역 이동: 지역 렌더링만 (몬스터 조우 없음)
  async function moveToZone(toZoneId, arrivalDescription) {
    character.zone_id = String(toZoneId);
    await Character.save(character);
    if (arrivalDescription) log(arrivalDescription, 'story');
    await renderZone(toZoneId);
  }

  async function loadMonsters(zoneId) {
    const { data: monsters, error } = await supabaseClient
      .from('text_mmorpg_monsters')
      .select('*')
      .eq('zone_id', zoneId);
    if (error || !monsters || monsters.length === 0) return;

    // 선공 몬스터 — 랜덤 1마리 자동 조우
    const aggressive = monsters.filter(m => m.is_aggressive);
    if (aggressive.length > 0) {
      const target = aggressive[Math.floor(Math.random() * aggressive.length)];
      log(`${target.name}이(가) 달려든다!`, 'combat');
      startCombat(target);
      return;
    }

    // 비선공 몬스터 — 선택 버튼 출력
    const passive = monsters.filter(m => !m.is_aggressive);
    if (passive.length > 0) {
      log('주변에서 발견된 것들:', 'system');
      const btnWrap = document.getElementById('zone-direction-buttons');

      const sep = document.createElement('div');
      sep.className = 'panel-title';
      sep.style.marginTop = '8px';
      sep.textContent = '전투';
      btnWrap.appendChild(sep);

      passive.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = `[ ${m.name}와 싸우기 ]`;
        btn.onclick = () => startCombat(m);
        btnWrap.appendChild(btn);
      });
    }
  }

  function mapMonster(m) {
    return {
      name:        m.name,
      description: m.description || `${m.name}과 마주쳤다.`,
      hp:          m.hp,
      hp_max:      m.hp,
      atk:         m.atk,
      def:         m.def,
      expReward:   m.exp,
      loot:        null,
    };
  }

  function startCombat(monster) {
    document.getElementById('zone-actions').style.display = 'none';
    setActionsDisabled(true);
    Combat.start(character, mapMonster(monster));
  }

  async function onCombatEnd(updatedChar, outcome, monster) {
    character = { ...character, ...updatedChar };

    if (outcome === 'victory') {
      character.exp += monster.expReward;
      const expNeeded = character.level * 100;
      if (character.exp >= expNeeded) {
        character = Character.levelUpStats(character);
        log(`레벨 업! → Lv.${character.level}`, 'system');
      }
      await Character.save(character);
    } else if (outcome === 'defeat') {
      character.hp = Math.floor(character.hp_max * 0.3);
      const { data: startZone } = await supabaseClient
        .from('text_mmorpg_zones')
        .select('id')
        .eq('is_start', true)
        .single();
      character.zone_id = startZone ? String(startZone.id) : character.zone_id;
      await Character.save(character);
    }

    renderStats();
    await renderZone(parseInt(character.zone_id));
    setActionsDisabled(false);
  }

  return { start, log, explore, onCombatEnd };
})();
