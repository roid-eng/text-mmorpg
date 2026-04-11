-- ================================================================
-- Migration 009: 상점 시스템 DB 추가
-- 실행 위치: Supabase Dashboard → SQL Editor
-- ================================================================

-- items 테이블 컬럼 추가
ALTER TABLE text_mmorpg_items
  ADD COLUMN price INT NOT NULL DEFAULT 0,
  ADD COLUMN is_shop_item BOOLEAN NOT NULL DEFAULT false;

-- 상점 판매 아이템 및 가격 설정
-- 소비 아이템 신규 추가
INSERT INTO text_mmorpg_items
  (name, description, type, atk_bonus, def_bonus, level_req, drop_zone_id, price, is_shop_item)
VALUES
('체력 회복제',
  '마시면 HP가 50 회복된다. 여행자들이 애용하는 기본 물약.',
  'consumable', 0, 0, 1, null, 30, true),
('고급 체력 회복제',
  '농축된 치유 성분이 담긴 물약. HP가 150 즉시 회복된다.',
  'consumable', 0, 0, 10, null, 80, true),
('귀환 주문서',
  '읽는 순간 시작 지역으로 돌아간다. 위기 탈출용.',
  'consumable', 0, 0, 1, null, 50, true);

-- 기존 장비 상점 등록 및 가격 설정
-- 아르단 드롭 장비 (Lv1~5)
UPDATE text_mmorpg_items SET price = 80,  is_shop_item = true WHERE name = '낡은 단검';
UPDATE text_mmorpg_items SET price = 100, is_shop_item = true WHERE name = '가죽 갑옷';
UPDATE text_mmorpg_items SET price = 120, is_shop_item = true WHERE name = '녹슨 검';
UPDATE text_mmorpg_items SET price = 80,  is_shop_item = true WHERE name = '낡은 지팡이';
UPDATE text_mmorpg_items SET price = 80,  is_shop_item = true WHERE name = '천 로브';
UPDATE text_mmorpg_items SET price = 90,  is_shop_item = true WHERE name = '나무 활';
UPDATE text_mmorpg_items SET price = 80,  is_shop_item = true WHERE name = '낡은 메이스';

-- 실바란 드롭 장비 (Lv6~15)
UPDATE text_mmorpg_items SET price = 300, is_shop_item = true WHERE name = '고블린의 단검';
UPDATE text_mmorpg_items SET price = 280, is_shop_item = true WHERE name = '거미줄 갑옷';
UPDATE text_mmorpg_items SET price = 450, is_shop_item = true WHERE name = '트롤의 대검';
UPDATE text_mmorpg_items SET price = 380, is_shop_item = true WHERE name = '정령석 지팡이';

-- 균열 드롭 장비 (Lv16~20)
UPDATE text_mmorpg_items SET price = 700,  is_shop_item = true WHERE name = '용암날 단검';
UPDATE text_mmorpg_items SET price = 680,  is_shop_item = true WHERE name = '균열석 갑옷';
UPDATE text_mmorpg_items SET price = 650,  is_shop_item = true WHERE name = '용암 굳힌 방패';

-- 고성 드롭 장비 (Lv21~25)
UPDATE text_mmorpg_items SET price = 1200, is_shop_item = true WHERE name = '저주받은 기사검';
UPDATE text_mmorpg_items SET price = 1100, is_shop_item = true WHERE name = '원혼의 망토';
UPDATE text_mmorpg_items SET price = 1000, is_shop_item = true WHERE name = '망자의 지팡이';

-- 제단 드롭 장비 (Lv26~30)
UPDATE text_mmorpg_items SET price = 2000, is_shop_item = true WHERE name = '봉인의 대검';
UPDATE text_mmorpg_items SET price = 1900, is_shop_item = true WHERE name = '제단의 성의';
UPDATE text_mmorpg_items SET price = 1800, is_shop_item = true WHERE name = '망각한 신의 지팡이';
