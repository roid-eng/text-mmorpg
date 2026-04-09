-- ================================================================
-- Migration 005: 실바란 몬스터 DEF 밸런스 하향 조정
-- 실행 위치: Supabase Dashboard → SQL Editor
-- ================================================================

-- 실바란 고목숲 몬스터 DEF 하향 (zone_id=2)
-- 기존 → 변경
-- 숲 고블린:   12 → 6
-- 독거미:       8 → 4
-- 고목숲 트롤: 18 → 10
-- 빛의 정령:   10 → 5

UPDATE text_mmorpg_monsters SET def = 6  WHERE name = '숲 고블린'   AND zone_id = 2;
UPDATE text_mmorpg_monsters SET def = 4  WHERE name = '독거미'      AND zone_id = 2;
UPDATE text_mmorpg_monsters SET def = 10 WHERE name = '고목숲 트롤' AND zone_id = 2;
UPDATE text_mmorpg_monsters SET def = 5  WHERE name = '빛의 정령'   AND zone_id = 2;
