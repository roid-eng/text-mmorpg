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

  async function explore() {
    // 1. zone_id 확인 — 숫자가 아니면(legacy 'zone_start' 등) 시작 지역으로 초기화
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

    // 2. 현재 지역 정보 조회
    const { data: zone, error: zoneErr } = await supabaseClient
      .from('text_mmorpg_zones')
      .select('*')
      .eq('id', zoneId)
      .single();
    if (zoneErr || !zone) { log('지역 정보를 불러올 수 없습니다.', 'system'); return; }

    // 3. 연결된 방향 조회 (목적지 이름 포함)
    const { data: connections, error: connErr } = await supabaseClient
      .from('text_mmorpg_zone_connections')
      .select('id, direction, description, to_zone:to_zone_id(id, name)')
      .eq('from_zone_id', zoneId);
    if (connErr) { log('연결 정보를 불러올 수 없습니다.', 'system'); return; }

    // 4. 지역 정보 로그 출력
    log(`[ ${zone.name} ]`, 'story');
    log(zone.description, 'story');
    if (zone.level_min != null && zone.level_max != null) {
      log(`레벨 권장: ${zone.level_min}~${zone.level_max}`, 'system');
    }

    // 5. 방향 버튼 렌더링
    const panel     = document.getElementById('zone-actions');
    const title     = document.getElementById('zone-actions-title');
    const btnWrap   = document.getElementById('zone-direction-buttons');

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

  async function moveToZone(toZoneId, arrivalDescription) {
    // 캐릭터 zone_id 업데이트
    character.zone_id = String(toZoneId);
    await Character.save(character);

    // 이동 묘사 출력
    if (arrivalDescription) log(arrivalDescription, 'story');

    // 새 지역 탐색으로 이어서 렌더링
    await explore();
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

  return { start, log, explore, onCombatEnd };
})();
