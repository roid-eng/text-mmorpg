/**
 * game.js — Core game loop and screen orchestration
 */

const MONSTER_ASCII = {
  '들쥐': ` (•_•)\n /   \\\n(     )`,
  '초원 늑대': ` /\\_/\\\n( o.o )\n > ^ <`,
  '광폭한 멧돼지': `  (oo)\n / || \\\n/  ||  \\`,
  '숲 고블린': `  /\\\n (o o)\n /|_|\\\n  / \\`,
  '독거미': ` \\ | /\n-- o --\n / | \\`,
  '고목숲 트롤': `  ||||\n (o  o)\n / || \\\n/  ||  \\`,
  '빛의 정령': `  \\ | /\n -- * --\n  / | \\`,
  '용암 도마뱀': ` /\\/\\\n( oo )\n \\/\\/`,
  '화염 임프': ` (🔥)\n /|\\\n / \\`,
  '균열의 골렘': ` [##]\n (  )\n /||\\n /  \\`,
  '저주받은 기사': ` [==]\n (xx)\n /||\\n /  \\`,
  '악령': `  ~~~\n ( o )\n  \\_/`,
  '고성의 마법사': `  /\\\n (oo)\n /||\\n  / \\`,
  '봉인의 수호자': ` [##]\n (==)\n /||\\n /  \\`,
  '제단의 사도': `  /\\\n (o*)\n /||\\n  / \\`,
  '망각한 신의 파편': `  /\\  /\\\n (  \\/  )\n (  ..  )\n  \\____/`
};
window.MONSTER_ASCII = MONSTER_ASCII;

const ZONE_ASCII = {
  1: `~🌾~ 아르단 평야 ~🌾~`,
  2: `🌲 실바란 고목숲 🌲`,
  3: `/\\/\\ 이그나르의 균열 🔥`,
  4: `⛩  아르카넨 고성  ⛩`,
  5: `✦  망각의 제단  ✦`
};

const Game = (() => {
  let character = null;
  let logEl = null;
  let currentZoneName = null;
  let equippedBonuses = { atk: 0, def: 0 };
  let restInterval = null;

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

    await restoreEquippedBonuses();

    Combat.setStatsHandler(updatedChar => {
      character = { ...character, hp: updatedChar.hp, mp: updatedChar.mp };
      renderStats();
    });

    log(`Mytharion에 오신 것을 환영합니다, ${character.name}.`, 'story');
    log(`직업: ${character.class}  |  레벨: ${character.level}`, 'system');
    renderStats();
  }

  async function restoreEquippedBonuses() {
    const { data: equipped } = await supabaseClient
      .from('text_mmorpg_inventory')
      .select('item_id')
      .eq('character_id', character.id)
      .eq('equipped', true);
    if (!equipped || equipped.length === 0) return;

    const itemIds = equipped.map(r => Number(r.item_id));
    const { data: items } = await supabaseClient
      .from('text_mmorpg_items')
      .select('atk_bonus, def_bonus')
      .in('id', itemIds);
    if (!items) return;

    equippedBonuses.atk = items.reduce((sum, i) => sum + (i.atk_bonus || 0), 0);
    equippedBonuses.def = items.reduce((sum, i) => sum + (i.def_bonus || 0), 0);
  }

  function renderStats() {
    if (!character) return;

    const hpPct = Math.round(character.hp / character.hp_max * 100);
    const mpPct = Math.round(character.mp / character.mp_max * 100);

    const setText  = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setWidth = (id, pct)  => { const el = document.getElementById(id); if (el) el.style.width = pct + '%'; };

    // PC 스탯 패널
    setText('stat-name',  character.name);
    setText('stat-class', character.class);
    setText('stat-level', `Lv.${character.level}`);
    setWidth('stat-hp-bar', hpPct);
    setText('stat-hp-text', `HP ${character.hp}/${character.hp_max}`);
    setWidth('stat-mp-bar', mpPct);
    setText('stat-mp-text', `MP ${character.mp}/${character.mp_max}`);
    setText('stat-gold', `Gold: ${character.gold || 0}`);
    setText('stat-atk',  (equippedBonuses.atk > 0 || equippedBonuses.def > 0)
      ? `ATK+${equippedBonuses.atk} DEF+${equippedBonuses.def}` : '');
    const expNeeded = character.level * 100;
    const expPct    = Math.min(100, Math.floor((character.exp / expNeeded) * 100));
    setWidth('stat-exp-bar', expPct);
    setText('stat-exp-text', `EXP ${character.exp}/${expNeeded}`);

    // 모바일 헤더
    setText('mobile-stat-text',
      `Lv.${character.level} ${character.class} | HP ${character.hp}/${character.hp_max} | Gold ${character.gold || 0}`);
  }

  function renderNodeMap(zoneId, zoneName, connections) {
    const canvas = document.getElementById('node-map');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.fillStyle = '#0a0c0f';
    ctx.fillRect(0, 0, W, H);

    const DIR_OFFSET = {
      '북쪽':   { dx:   0, dy: -70 },
      '남쪽':   { dx:   0, dy:  70 },
      '동쪽':   { dx:  70, dy:   0 },
      '서쪽':   { dx: -70, dy:   0 },
      '북동쪽': { dx:  55, dy: -55 },
      '북서쪽': { dx: -55, dy: -55 },
      '남동쪽': { dx:  55, dy:  55 },
      '남서쪽': { dx: -55, dy:  55 },
    };

    const connectedNodes = [];

    if (connections) {
      connections.forEach(conn => {
        const off = DIR_OFFSET[conn.direction] || { dx: 0, dy: -60 };
        const nx = cx + off.dx, ny = cy + off.dy;

        connectedNodes.push({ x: nx, y: ny, zoneId: conn.to_zone.id });

        // 연결선
        ctx.strokeStyle = '#1e2a35';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        // 연결 지역 노드
        ctx.fillStyle = '#a06010';
        ctx.beginPath();
        ctx.arc(nx, ny, 8, 0, Math.PI * 2);
        ctx.fill();

        // 연결 지역명
        ctx.fillStyle = '#c8d8e8';
        ctx.font = '9px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(conn.to_zone.name, nx, ny + 20);
      });
    }

    // 현재 지역 노드 (앰버, 중앙)
    ctx.fillStyle = '#e8a020';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    const mapZoneName = document.getElementById('map-zone-name');
    if (mapZoneName) mapZoneName.textContent = zoneName;

    // 클릭 이벤트: 연결 노드 클릭 시 이동
    canvas.onclick = (e) => {
      const rect   = canvas.getBoundingClientRect();
      const scaleX = canvas.width  / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top)  * scaleY;
      connectedNodes.forEach(n => {
        const dist = Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2);
        if (dist < 20) moveToZone(n.zoneId);
      });
    };
    canvas.style.cursor = 'pointer';
  }

  // 전투 중 액션 버튼 비활성화 / 활성화 (전투 패널 내부, Logout, 후퇴 버튼 제외)
  function setActionsDisabled(disabled) {
    const combatModal = document.getElementById('combat-modal');
    document.querySelectorAll('button.btn').forEach(btn => {
      if (btn.textContent.trim() === 'Logout') return;
      if (btn.textContent.trim() === '[ 후퇴 ]') return;
      if (combatModal && combatModal.contains(btn)) return; // 스킬/공격 버튼은 Combat이 직접 관리
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

    const zoneHeader = ZONE_ASCII[zoneId];
    if (zoneHeader) log(zoneHeader, 'story');
    log(`[ ${zone.name} ]`, 'story');
    log(zone.description, 'story');
    if (zone.level_min != null && zone.level_max != null) {
      log(`레벨 권장: ${zone.level_min}~${zone.level_max}`, 'system');
    }

    const panel   = document.getElementById('zone-actions');
    const btnWrap = document.getElementById('zone-move-buttons');

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

    // 마을 여부 판단
    const isVillage = zoneId === 6 || zone.name.includes('마을');

    // 기존 마을 패널 제거
    const existingVillagePanel = document.getElementById('village-panel');
    if (existingVillagePanel) existingVillagePanel.remove();

    // EXPLORE 버튼 마을에서 비활성화
    const exploreBtn = document.getElementById('btn-explore');
    if (exploreBtn) {
      exploreBtn.disabled = isVillage;
      exploreBtn.style.opacity = isVillage ? '0.4' : '';
    }

    if (isVillage) {
      log('이 지역에는 몬스터가 없습니다.', 'system');
      const villagePanel = document.createElement('div');
      villagePanel.id = 'village-panel';
      villagePanel.style.marginTop = '10px';
      villagePanel.innerHTML = `
        <div class="panel-title">[ 마을 시설 ]</div>
        <button class="btn" onclick="actionShop()" style="width:100%; margin-bottom:6px;">[ 아르단 잡화점 ]</button>
        <button class="btn" style="width:100%; margin-bottom:6px; opacity:0.4;" disabled>[ 퀘스트 게시판 ] (준비 중)</button>
      `;
      panel.appendChild(villagePanel);
    }

    panel.style.display = 'block';
    renderNodeMap(zoneId, zone.name, connections);
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

    // 비선공 몬스터 — 모달로 표시
    const passive = monsters.filter(m => !m.is_aggressive);
    if (passive.length === 0) return;

    const list = document.getElementById('monster-modal-list');
    list.innerHTML = '';

    passive.forEach(m => {
      const card = document.createElement('div');
      card.className = 'monster-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
          <div>
            <div class="amber" style="margin-bottom:4px;">${m.name}</div>
            <div class="muted" style="font-size:0.8rem;">${m.description || ''}</div>
          </div>
          <button class="btn" style="white-space:nowrap; flex-shrink:0;">[ 싸우기 ]</button>
        </div>
      `;
      card.querySelector('button').onclick = () => startCombat(m);
      list.appendChild(card);
    });

    const overlay = document.getElementById('monster-modal-overlay');
    overlay.style.display = 'flex';
  }

  function closeMonsterModal() {
    const overlay = document.getElementById('monster-modal-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function mapMonster(m) {
    return {
      name:        m.name,
      description: m.description || `${m.name}과 마주쳤다.`,
      hp:          m.hp,
      hp_max:      m.hp,
      atk:         m.atk,
      def:         m.def,
      stat_con:    m.stat_con || 0,
      expReward:   m.exp,
      goldReward:  m.gold_reward || 0,
      loot:        null,
    };
  }

  async function startCombat(monster) {
    closeMonsterModal();

    // 현재 직업 + 레벨 이하 스킬 로드
    const { data: skills } = await supabaseClient
      .from('text_mmorpg_skills')
      .select('*')
      .eq('class', character.class)
      .lte('unlock_level', character.level)
      .order('unlock_level', { ascending: true });

    setActionsDisabled(true);
    Combat.start(character, mapMonster(monster), skills || [], equippedBonuses);
  }

  async function onCombatEnd(updatedChar, outcome, monster, goldEarned = 0) {
    character = { ...character, ...updatedChar };

    if (outcome === 'victory') {
      character.exp += monster.expReward;
      character.gold = (character.gold || 0) + goldEarned;
      const expNeeded = character.level * 100;
      if (character.exp >= expNeeded) {
        character = Character.levelUpStats(character);
        log(`레벨 업! → Lv.${character.level}`, 'levelup');
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
        log(`${dropped.name} 을 획득했습니다!`, 'item');
      }
    } else if (outcome === 'retreat') {
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
      log('✨ 체력을 회복하여 다시 일어섰습니다.', 'levelup');
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
        ${row.item_type === 'consumable'
          ? `<button class="btn" style="padding:2px 8px; font-size:0.75rem;" onclick="Game.useItem('${row.id}', '${row.item_id}')">[ 사용 ]</button>`
          : row.equipped
            ? `<button class="btn" style="padding:2px 8px; font-size:0.75rem;" onclick="Game.unequipItem('${row.id}', '${row.item_id}')">[ 해제 ]</button>`
            : `<button class="btn" style="padding:2px 8px; font-size:0.75rem;" onclick="Game.equipItem('${row.id}', '${row.item_id}')">[ 장착 ]</button>`}
      `;
      list.appendChild(line);
    });
  }

  async function equipItem(inventoryId, itemId) {
    const { data: item } = await supabaseClient
      .from('text_mmorpg_items')
      .select('name, type, atk_bonus, def_bonus')
      .eq('id', parseInt(itemId))
      .single();

    if (!item) return;

    // 같은 타입의 기존 장착 아이템 조회
    const { data: sameTypeEquipped } = await supabaseClient
      .from('text_mmorpg_inventory')
      .select('id, item_id')
      .eq('character_id', character.id)
      .eq('equipped', true)
      .eq('item_type', item.type);

    if (sameTypeEquipped && sameTypeEquipped.length > 0) {
      // 기존 장착 해제 + 보너스 제거
      const oldItemIds = sameTypeEquipped.map(r => Number(r.item_id));
      const { data: oldItemDefs } = await supabaseClient
        .from('text_mmorpg_items')
        .select('id, atk_bonus, def_bonus')
        .in('id', oldItemIds);
      (oldItemDefs || []).forEach(old => {
        equippedBonuses.atk = Math.max(0, equippedBonuses.atk - (old.atk_bonus || 0));
        equippedBonuses.def = Math.max(0, equippedBonuses.def - (old.def_bonus || 0));
      });
      await supabaseClient
        .from('text_mmorpg_inventory')
        .update({ equipped: false })
        .in('id', sameTypeEquipped.map(r => r.id));
    }

    // 새 아이템 장착
    await supabaseClient
      .from('text_mmorpg_inventory')
      .update({ equipped: true })
      .eq('id', inventoryId);

    equippedBonuses.atk += item.atk_bonus || 0;
    equippedBonuses.def += item.def_bonus || 0;
    log(`${item.name} 을 장착했습니다.`, 'system');

    renderStats();
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

  async function useItem(inventoryId, itemId) {
    const { data: invRow } = await supabaseClient
      .from('text_mmorpg_inventory')
      .select('item_name')
      .eq('id', inventoryId)
      .single();
    if (!invRow) return;

    const itemName = invRow.item_name;
    let logMsg = '';

    if (itemName === '체력 회복제') {
      const heal = 50;
      character.hp = Math.min(character.hp_max, character.hp + heal);
      logMsg = `${itemName} 사용. HP +${heal}`;
    } else if (itemName === '고급 체력 회복제') {
      const heal = 150;
      character.hp = Math.min(character.hp_max, character.hp + heal);
      logMsg = `${itemName} 사용. HP +${heal}`;
    } else if (itemName === '귀환 주문서') {
      logMsg = `${itemName} 사용. 시작 지역으로 귀환합니다.`;
      await supabaseClient.from('text_mmorpg_inventory').delete().eq('id', inventoryId);
      character.zone_id = '1';
      await Character.save(character);
      renderStats();
      log(logMsg, 'item');
      document.getElementById('inventory-panel').style.display = 'none';
      await moveToZone(1);
      return;
    } else {
      log(`${itemName}: 사용할 수 없는 아이템입니다.`, 'system');
      return;
    }

    await supabaseClient.from('text_mmorpg_inventory').delete().eq('id', inventoryId);
    await Character.save(character);
    renderStats();
    log(logMsg, 'item');
    document.getElementById('inventory-panel').style.display = 'none';
    await showInventory();
  }

  // --- REST ---

  function rest() {
    if (restInterval) {
      _stopRest(false);
      return;
    }

    const restBtn = document.getElementById('btn-rest');
    setActionsDisabled(true);
    if (restBtn) {
      restBtn.disabled = false;
      restBtn.textContent = '[ 휴식 중단 ]';
    }

    const zoneId = parseInt(character.zone_id);
    const isVillageRest = zoneId === 6 || (currentZoneName && currentZoneName.includes('마을'));

    if (isVillageRest) {
      log('[ 아르단 마을 ] 편안한 휴식. 회복 속도가 증가합니다.', 'story');
    } else {
      log('휴식을 시작합니다.', 'system');
    }

    const hpPerSec = Math.max(1, Math.floor((character.stat_con || 1) * (isVillageRest ? 1.0 : 0.5)));
    const mpPerSec = Math.max(1, Math.floor((character.stat_wiz || 1) * (isVillageRest ? 0.6 : 0.3)));

    restInterval = setInterval(() => {
      const hpFull = character.hp >= character.hp_max;
      const mpFull = character.mp >= character.mp_max;

      if (!hpFull) character.hp = Math.min(character.hp_max, character.hp + hpPerSec);
      if (!mpFull) character.mp = Math.min(character.mp_max, character.mp + mpPerSec);

      renderStats();

      if (character.hp >= character.hp_max && character.mp >= character.mp_max) {
        _stopRest(true);
      }
    }, 1000);
  }

  async function _stopRest(completed) {
    if (restInterval) {
      clearInterval(restInterval);
      restInterval = null;
    }

    await supabaseClient
      .from('text_mmorpg_characters')
      .update({ hp: character.hp, mp: character.mp })
      .eq('id', character.id);

    const restBtn = document.getElementById('btn-rest');
    if (restBtn) {
      restBtn.textContent = '[ Rest ]';
    }
    setActionsDisabled(false);

    if (completed) {
      log('휴식이 완료됐습니다.', 'system');
    } else {
      log('휴식을 중단합니다.', 'system');
    }
  }

  async function showRanking() {
    const panel = document.getElementById('ranking-panel');
    if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }

    const list = document.getElementById('ranking-list');
    list.innerHTML = '<span class="muted">불러오는 중...</span>';
    panel.style.display = 'block';

    const { data: rows, error } = await supabaseClient
      .from('text_mmorpg_ranking')
      .select('rank, character_name, class, level, exp, zone_name')
      .limit(20);

    if (error) { list.innerHTML = '<span class="muted">불러오기 실패</span>'; return; }
    if (!rows || rows.length === 0) { list.innerHTML = '<span class="muted">랭킹 데이터가 없습니다.</span>'; return; }

    list.innerHTML = '';
    rows.forEach(row => {
      const isMe = row.character_name === character.name;
      const line = document.createElement('div');
      line.style.cssText = 'padding:2px 0;';
      const text = `${row.rank}위  ${row.character_name} (${row.class})  Lv.${row.level} — ${row.zone_name || '알 수 없음'}`;
      if (isMe) {
        line.innerHTML = `<span class="amber">${text}</span>`;
      } else {
        line.textContent = text;
      }
      list.appendChild(line);
    });
  }

  // --- SHOP ---

  function openShopModal() {
    const overlay = document.getElementById('shop-modal-overlay');
    if (overlay) overlay.style.display = 'flex';
    shopTab('buy');
  }

  function closeShopModal() {
    const overlay = document.getElementById('shop-modal-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function shopTab(tab) {
    const buyList = document.getElementById('shop-buy-list');
    const sellList = document.getElementById('shop-sell-list');
    const buyBtn  = document.getElementById('shop-tab-buy');
    const sellBtn = document.getElementById('shop-tab-sell');

    if (tab === 'buy') {
      buyList.style.display  = 'flex';
      sellList.style.display = 'none';
      buyBtn.classList.add('shop-tab-active');
      sellBtn.classList.remove('shop-tab-active');
      loadShopItems();
    } else {
      buyList.style.display  = 'none';
      sellList.style.display = 'flex';
      buyBtn.classList.remove('shop-tab-active');
      sellBtn.classList.add('shop-tab-active');
      loadSellItems();
    }
  }

  async function loadShopItems() {
    const list = document.getElementById('shop-buy-list');
    list.innerHTML = '<span class="muted">불러오는 중...</span>';

    const { data: items, error } = await supabaseClient
      .from('text_mmorpg_items')
      .select('*')
      .eq('is_shop_item', true)
      .lte('level_req', character.level)
      .order('level_req', { ascending: true });

    if (error || !items || items.length === 0) {
      list.innerHTML = '<span class="muted">판매 중인 아이템이 없습니다.</span>';
      return;
    }

    list.innerHTML = '';
    items.forEach(item => {
      const canAfford = character.gold >= item.price;
      const card = document.createElement('div');
      card.className = 'monster-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
          <div>
            <div class="amber" style="margin-bottom:2px;">${item.name}</div>
            <div class="muted" style="font-size:0.8rem; margin-bottom:4px;">${item.description || ''}</div>
            <div style="font-size:0.85rem;">${item.price} Gold</div>
          </div>
          <button class="btn" style="white-space:nowrap; flex-shrink:0;${canAfford ? '' : ' opacity:0.4;'}"
            ${canAfford ? '' : 'disabled'}>[ 구매 ]</button>
        </div>
      `;
      if (canAfford) card.querySelector('button').onclick = () => buyItem(item.id);
      list.appendChild(card);
    });
  }

  async function buyItem(itemId) {
    const { data: item } = await supabaseClient
      .from('text_mmorpg_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (!item) return;
    if (character.gold < item.price) { log('골드가 부족합니다.', 'system'); return; }

    character.gold -= item.price;
    await supabaseClient.from('text_mmorpg_inventory').insert({
      character_id: character.id,
      item_id:      String(item.id),
      item_name:    item.name,
      item_type:    item.type,
      equipped:     false,
    });
    await Character.save(character);
    renderStats();
    log(`${item.name} 구매. -${item.price} Gold`, 'item');
    loadShopItems();
  }

  async function loadSellItems() {
    const list = document.getElementById('shop-sell-list');
    list.innerHTML = '<span class="muted">불러오는 중...</span>';

    const { data: rows, error } = await supabaseClient
      .from('text_mmorpg_inventory')
      .select('*')
      .eq('character_id', character.id);

    if (error || !rows || rows.length === 0) {
      list.innerHTML = '<span class="muted">매입 가능한 아이템이 없습니다.</span>';
      return;
    }

    const itemIds = [...new Set(rows.map(r => Number(r.item_id)))];
    const { data: itemDefs } = await supabaseClient
      .from('text_mmorpg_items')
      .select('id, price, is_shop_item')
      .in('id', itemIds);

    const itemMap = {};
    (itemDefs || []).forEach(i => { itemMap[String(i.id)] = i; });

    const sellable = rows.filter(r => {
      const def = itemMap[r.item_id];
      return def && def.is_shop_item && def.price > 0 && !r.equipped;
    });

    if (sellable.length === 0) {
      list.innerHTML = '<span class="muted">매입 가능한 아이템이 없습니다.</span>';
      return;
    }

    list.innerHTML = '';
    sellable.forEach(row => {
      const def = itemMap[row.item_id];
      const sellPrice = Math.floor(def.price * 0.5);
      const card = document.createElement('div');
      card.className = 'monster-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
          <div>
            <div class="amber" style="margin-bottom:2px;">${row.item_name}${row.equipped ? ' <span class="muted">[장착 중]</span>' : ''}</div>
            <div style="font-size:0.85rem;">+${sellPrice} Gold</div>
          </div>
          <button class="btn" style="white-space:nowrap; flex-shrink:0;">[ 매입 ]</button>
        </div>
      `;
      card.querySelector('button').onclick = () => sellItem(row.id, row.item_id);
      list.appendChild(card);
    });
  }

  async function sellItem(inventoryId, itemId) {
    const { data: invRow } = await supabaseClient
      .from('text_mmorpg_inventory')
      .select('equipped')
      .eq('id', inventoryId)
      .single();

    const { data: item } = await supabaseClient
      .from('text_mmorpg_items')
      .select('name, price, atk_bonus, def_bonus')
      .eq('id', Number(itemId))
      .single();

    if (!item) return;
    const sellPrice = Math.floor(item.price * 0.5);

    if (invRow?.equipped) {
      equippedBonuses.atk = Math.max(0, equippedBonuses.atk - (item.atk_bonus || 0));
      equippedBonuses.def = Math.max(0, equippedBonuses.def - (item.def_bonus || 0));
    }

    await supabaseClient.from('text_mmorpg_inventory').delete().eq('id', inventoryId);
    character.gold = (character.gold || 0) + sellPrice;
    await Character.save(character);
    renderStats();
    log(`${item.name} 매입. +${sellPrice} Gold`, 'item');
    loadSellItems();
  }

  return { start, log, showZone, explore, onCombatEnd, showInventory, equipItem, unequipItem, useItem, showRanking, rest, closeMonsterModal, openShopModal, closeShopModal, shopTab };
})();
