-- ================================================================
-- Migration 004: 실바란 고목숲 콘텐츠 추가
-- 실행 위치: Supabase Dashboard → SQL Editor
-- ================================================================

-- 실바란 고목숲 몬스터 4종 추가 (zone_id=2)
INSERT INTO text_mmorpg_monsters
  (zone_id, name, description, hp, atk, def, exp, is_aggressive)
VALUES
(2, '숲 고블린',
  '끼익거리는 소리를 내며 무리지어 다닌다. 혼자 있는 것을 발견하면 달려들 기회를 노린다.',
  80, 20, 12, 55, false),
(2, '독거미',
  '손바닥만 한 거미가 고목 사이에 촘촘한 덫을 친다. 독이 든 이빨로 먹이를 노린다.',
  65, 22, 8, 60, true),
(2, '고목숲 트롤',
  '나무껍질처럼 두꺼운 피부를 가진 거대한 괴물. 평소엔 고목처럼 서 있어 발견이 어렵다.',
  160, 30, 18, 95, false),
(2, '빛의 정령',
  '숲 깊은 곳에서 새어나오는 기묘한 빛의 정체. 고대 신의 잔재가 깃든 정령으로, 침입자를 공격한다.',
  110, 38, 10, 120, true);

-- 중급 장비 4종 추가 (실바란 드롭용, zone_id=2)
-- 컬럼: id(SERIAL), name, description, type, stat_str/con/dex/int/wiz(default 0),
--       atk_bonus, def_bonus, level_req(default 1), drop_zone_id
INSERT INTO text_mmorpg_items
  (name, description, type, atk_bonus, def_bonus, level_req, drop_zone_id)
VALUES
('고블린의 단검',
  '숲 고블린이 즐겨 쓰는 날카로운 단검. 빠른 공격에 특화되어 있다.',
  'weapon', 12, 0, 5, 2),
('거미줄 갑옷',
  '독거미의 질긴 거미줄로 엮은 갑옷. 가볍지만 생각보다 방어력이 높다.',
  'armor', 0, 9, 5, 2),
('트롤의 대검',
  '고목숲 트롤이 휘두르던 거대한 대검. 무게가 상당하지만 그만큼 파괴력이 크다.',
  'weapon', 18, 0, 8, 2),
('정령석 지팡이',
  '빛의 정령에게서 얻은 마력이 깃든 지팡이. 고대 신의 기운이 희미하게 남아 있다.',
  'weapon', 15, 0, 8, 2);
