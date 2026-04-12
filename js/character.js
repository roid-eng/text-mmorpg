/**
 * character.js — Character creation, loading, and stat management
 */

const Character = (() => {
  const STARTING_ITEMS = {
    warrior: [4, 2],
    mage:    [6, 7],
    archer:  [8, 2],
    cleric:  [9, 7],
  };

  // Base stats per class at level 1
  const CLASS_BASE = {
    warrior: { stat_str: 12, stat_con: 10, stat_dex: 6,  stat_int: 3,  stat_wiz: 4  },
    mage:    { stat_str: 4,  stat_con: 5,  stat_dex: 6,  stat_int: 12, stat_wiz: 10 },
    archer:  { stat_str: 8,  stat_con: 6,  stat_dex: 12, stat_int: 4,  stat_wiz: 5  },
    cleric:  { stat_str: 5,  stat_con: 8,  stat_dex: 5,  stat_int: 6,  stat_wiz: 12 },
  };

  // Stat growth per level-up
  const CLASS_GROWTH = {
    warrior: { stat_str: 3, stat_con: 2, stat_dex: 1, stat_int: 0, stat_wiz: 1 },
    mage:    { stat_str: 0, stat_con: 1, stat_dex: 1, stat_int: 3, stat_wiz: 2 },
    archer:  { stat_str: 2, stat_con: 1, stat_dex: 3, stat_int: 0, stat_wiz: 1 },
    cleric:  { stat_str: 1, stat_con: 2, stat_dex: 1, stat_int: 1, stat_wiz: 3 },
  };

  function deriveHpMp(stats) {
    return {
      hp_max: stats.stat_con * 10,
      mp_max: stats.stat_wiz * 8,
    };
  }

  async function create(playerId, name, className) {
    const base = CLASS_BASE[className];
    const { hp_max, mp_max } = deriveHpMp(base);

    const { data, error } = await supabaseClient
      .from('text_mmorpg_characters')
      .insert({
        player_id: playerId,
        name,
        class: className,
        ...base,
        hp: hp_max,
        hp_max,
        mp: mp_max,
        mp_max,
        zone_id: '6',
      })
      .select()
      .single();

    if (error) throw error;

    const itemIds = STARTING_ITEMS[className] || [];
    if (itemIds.length > 0) {
      const { data: items } = await supabaseClient
        .from('text_mmorpg_items')
        .select('id, name, type')
        .in('id', itemIds);
      if (items && items.length > 0) {
        await supabaseClient.from('text_mmorpg_inventory').insert(
          items.map(item => ({
            character_id: data.id,
            item_id:      String(item.id),
            item_name:    item.name,
            item_type:    item.type,
            equipped:     false,
          }))
        );
      }
    }

    return data;
  }

  async function getActive(playerId) {
    const { data, error } = await supabaseClient
      .from('text_mmorpg_characters')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  function levelUpStats(character) {
    const growth = CLASS_GROWTH[character.class];
    const updated = { ...character, level: character.level + 1, exp: 0 };
    for (const [key, val] of Object.entries(growth)) {
      updated[key] += val;
    }
    const { hp_max, mp_max } = deriveHpMp(updated);
    updated.hp_max = hp_max;
    updated.mp_max = mp_max;
    updated.hp = Math.min(updated.hp, hp_max);
    updated.mp = Math.min(updated.mp, mp_max);
    return updated;
  }

  async function save(character) {
    const { error } = await supabaseClient
      .from('text_mmorpg_characters')
      .update(character)
      .eq('id', character.id);
    if (error) throw error;
  }

  return { create, getActive, levelUpStats, save, CLASS_BASE };
})();
