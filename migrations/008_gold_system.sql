-- ================================================================
-- Migration 008: 골드 시스템 추가
-- 실행 위치: Supabase Dashboard → SQL Editor
-- ================================================================

-- 1. characters 테이블에 gold 컬럼 추가
ALTER TABLE text_mmorpg_characters
  ADD COLUMN gold INT NOT NULL DEFAULT 0;

-- 2. monsters 테이블에 gold_reward 컬럼 추가
ALTER TABLE text_mmorpg_monsters
  ADD COLUMN gold_reward INT NOT NULL DEFAULT 0;

-- 3. 몬스터별 골드 보상 설정
UPDATE text_mmorpg_monsters SET gold_reward = 6   WHERE name = '들쥐';
UPDATE text_mmorpg_monsters SET gold_reward = 15  WHERE name = '초원 늑대';
UPDATE text_mmorpg_monsters SET gold_reward = 22  WHERE name = '광폭한 멧돼지';
UPDATE text_mmorpg_monsters SET gold_reward = 35  WHERE name = '숲 고블린';
UPDATE text_mmorpg_monsters SET gold_reward = 38  WHERE name = '독거미';
UPDATE text_mmorpg_monsters SET gold_reward = 60  WHERE name = '고목숲 트롤';
UPDATE text_mmorpg_monsters SET gold_reward = 75  WHERE name = '빛의 정령';
UPDATE text_mmorpg_monsters SET gold_reward = 100 WHERE name = '용암 도마뱀';
UPDATE text_mmorpg_monsters SET gold_reward = 110 WHERE name = '화염 임프';
UPDATE text_mmorpg_monsters SET gold_reward = 140 WHERE name = '균열의 골렘';
UPDATE text_mmorpg_monsters SET gold_reward = 175 WHERE name = '저주받은 기사';
UPDATE text_mmorpg_monsters SET gold_reward = 190 WHERE name = '악령';
UPDATE text_mmorpg_monsters SET gold_reward = 200 WHERE name = '고성의 마법사';
UPDATE text_mmorpg_monsters SET gold_reward = 265 WHERE name = '봉인의 수호자';
UPDATE text_mmorpg_monsters SET gold_reward = 285 WHERE name = '제단의 사도';
UPDATE text_mmorpg_monsters SET gold_reward = 345 WHERE name = '망각한 신의 파편';
