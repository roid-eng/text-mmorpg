/**
 * game.js — Core game loop and screen orchestration
 */

const Game = (() => {
  let character = null;
  let logEl = null;
  let currentZoneName = null;
  let equippedBonuses = { atk: 0, def: 0 };

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
    log(`직업: ${character.class}  |  레벨: ${character.level}`, 'system');
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
      ${currentZoneName ? `&nbsp;|&nbsp; 지역: ${currentZoneName}` : ''}
      ${(equippedBonuses.atk > 0 || equippedBonuses.def > 0)
        ? `&nbsp;|&nbsp; <span class="amber">ATK+${equippedBonuses.atk} DEF+${equippedBonuses.def}</span>`
        : ''}
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

    currentZoneName = zone.name;
    renderStats();

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

  // zone_id 초기화 후 zoneId(int) 반환
  async function resolveZoneId() {
    let zoneId = parseInt(character.zone_id);
    if (isNaN(zoneId)) {
      const { data: startZone, error } = await supabaseClient
        .from('text_mmorpg_zones')
        .select('id')
        .eq('is_start', true)
        .single();
      if (error || !startZone) { log('시작 지역을 찾을 수 없습니다.', 'system'); return null; }
      zoneId = startZone.id;
      character.zone_id = String(zoneId);
      await Character.save(character);
    }
    return zoneId;
  }

  // 초기 로드 / 이동 후: 지역 정보 + 이동 버튼만 표시
  async function showZone() {
    const zoneId = await resolveZoneId();
    if (zoneId) await renderZone(zoneId);
  }

  // EXPLORE 클릭 시: 지역 렌더링 + 몬스터 조우
  async function explore() {
    const zoneId = await resolveZoneId();
    if (!zoneId) return;
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

    const btnWrap = document.getElementById('zone-direction-buttons');

    // 비선공 몬스터 — 항상 선택 버튼 표시
    const passive = monsters.filter(m => !m.is_aggressive);
    if (passive.length > 0) {
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

    // 선공 몬스터 — 30% 확률 조우
    const aggressive = monsters.filter(m => m.is_aggressive);
    if (aggressive.length > 0) {
      if (Math.random() < 0.3) {
        const target = aggressive[Math.floor(Math.random() * aggressive.length)];
        log(`⚠ ${target.name}이(가) 달려든다!`, 'combat');
        startCombat(target);
        return;
      } else {
        log('주변이 조용하다.', 'system');
      }
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

      // 장비 드롭 (40% 확률)
      const zoneId = parseInt(character.zone_id);
      const { data: zoneItems } = await supabaseClient
        .from('text_mmorpg_items')
        .select('*')
        .eq('drop_zone_id', zoneId);
      if (zoneItems && zoneItems.length > 0 && Math.random() < 0.4) {
        const dropped = zoneItems[Math.floor(Math.random() * zoneItems.length)];
        await supabaseClient.from('text_mmorpg_inventory').insert({
          character_id: character.id,
          item_id:      String(dropped.id),
          item_name:    dropped.name,
          item_type:    dropped.type,
          equipped:     false,
        });
        log(`💰 ${dropped.name} 을 획득했습니다!`, 'loot');
      }
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

  async function showInventory() {
    const panel = document.getElementById('inventory-panel');
    if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }

    const list = document.getElementById('inventory-list');
    list.innerHTML = '<span class="muted">불러오는 중...</span>';
    panel.style.display = 'block';

    const { data: rows, error } = await supabaseClient
      .from('text_mmorpg_inventory')
      .select('*')
      .eq('character_id', character.id)
      .order('created_at', { ascending: false });

    if (error) { list.innerHTML = '<span class="muted">불러오기 실패</span>'; return; }
    if (!rows || rows.length === 0) { list.innerHTML = '<span class="muted">아이템이 없습니다.</span>'; return; }

    // 아이템 정의에서 bonus 조회
    const itemIds = [...new Set(rows.map(r => r.item_id))];
    const { data: itemDefs } = await supabaseClient
      .from('text_mmorpg_items')
      .select('id, atk_bonus, def_bonus')
      .in('id', itemIds.map(Number));
    const itemMap = {};
    (itemDefs || []).forEach(i => { itemMap[String(i.id)] = i; });

    list.innerHTML = '';
    rows.forEach(row => {
      const def = itemMap[row.item_id] || {};
      const bonusParts = [];
      if (def.atk_bonus) bonusParts.push(`ATK+${def.atk_bonus}`);
      if (def.def_bonus) bonusParts.push(`DEF+${def.def_bonus}`);
      const bonusStr = bonusParts.join(' ');

      const line = document.createElement('div');
      line.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:3px 0;';
      line.innerHTML = `
        <span>- ${row.item_name} (${row.item_type})${bonusStr ? ` <span class="amber">${bonusStr}</span>` : ''}</span>
        ${row.equipped
          ? `<button class="btn" style="padding:2px 8px; font-size:0.75rem;" onclick="Game.unequipItem('${row.id}', '${row.item_id}')">[ 해제 ]</button>`
          : `<button class="btn" style="padding:2px 8px; font-size:0.75rem;" onclick="Game.equipItem('${row.id}', '${row.item_id}')">[ 장착 ]</button>`}
      `;
      list.appendChild(line);
    });
  }

  async function equipItem(inventoryId, itemId) {
    const { data: item } = await supabaseClient
      .from('text_mmorpg_items')
      .select('name, atk_bonus, def_bonus')
      .eq('id', parseInt(itemId))
      .single();

    await supabaseClient
      .from('text_mmorpg_inventory')
      .update({ equipped: true })
      .eq('id', inventoryId);

    if (item) {
      equippedBonuses.atk += item.atk_bonus || 0;
      equippedBonuses.def += item.def_bonus || 0;
      log(`${item.name} 을 장착했습니다.`, 'system');
    }

    renderStats();
    // 인벤토리 패널 닫고 다시 열어 새로고침
    document.getElementById('inventory-panel').style.display = 'none';
    await showInventory();
  }

  async function unequipItem(inventoryId, itemId) {
    const { data: item } = await supabaseClient
      .from('text_mmorpg_items')
      .select('name, atk_bonus, def_bonus')
      .eq('id', parseInt(itemId))
      .single();

    await supabaseClient
      .from('text_mmorpg_inventory')
      .update({ equipped: false })
      .eq('id', inventoryId);

    if (item) {
      equippedBonuses.atk = Math.max(0, equippedBonuses.atk - (item.atk_bonus || 0));
      equippedBonuses.def = Math.max(0, equippedBonuses.def - (item.def_bonus || 0));
      log(`${item.name} 을 해제했습니다.`, 'system');
    }

    renderStats();
    document.getElementById('inventory-panel').style.display = 'none';
    await showInventory();
  }

  return { start, log, showZone, explore, onCombatEnd, showInventory, equipItem, unequipItem };
})();
