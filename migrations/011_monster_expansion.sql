-- monsters 테이블에 level 컬럼 추가
ALTER TABLE text_mmorpg_monsters
  ADD COLUMN level INT NOT NULL DEFAULT 1;

-- 기존 몬스터 레벨 설정
UPDATE text_mmorpg_monsters SET level = 1  WHERE name = '들쥐';
UPDATE text_mmorpg_monsters SET level = 3  WHERE name = '초원 늑대';
UPDATE text_mmorpg_monsters SET level = 4  WHERE name = '광폭한 멧돼지';
UPDATE text_mmorpg_monsters SET level = 6  WHERE name = '숲 고블린';
UPDATE text_mmorpg_monsters SET level = 9  WHERE name = '독거미';
UPDATE text_mmorpg_monsters SET level = 14 WHERE name = '고목숲 트롤';
UPDATE text_mmorpg_monsters SET level = 15 WHERE name = '빛의 정령';
UPDATE text_mmorpg_monsters SET level = 16 WHERE name = '용암 도마뱀';
UPDATE text_mmorpg_monsters SET level = 17 WHERE name = '화염 임프';
UPDATE text_mmorpg_monsters SET level = 19 WHERE name = '균열의 골렘';
UPDATE text_mmorpg_monsters SET level = 21 WHERE name = '저주받은 기사';
UPDATE text_mmorpg_monsters SET level = 23 WHERE name = '악령';
UPDATE text_mmorpg_monsters SET level = 24 WHERE name = '고성의 마법사';
UPDATE text_mmorpg_monsters SET level = 26 WHERE name = '봉인의 수호자';
UPDATE text_mmorpg_monsters SET level = 28 WHERE name = '제단의 사도';
UPDATE text_mmorpg_monsters SET level = 30 WHERE name = '망각한 신의 파편';

-- 신규 몬스터 추가
INSERT INTO text_mmorpg_monsters
  (zone_id, name, description, hp, atk, def, exp, gold_reward, is_aggressive, level)
VALUES
-- 아르단 평야 (zone_id=1)
(1, '슬라임',
  '반투명한 젤리 형태의 생물. 느리지만 몸에 닿으면 끈적하게 달라붙는다.',
  15, 3, 0, 8, 5, false, 1),
(1, '오크',
  '우락부락한 체구의 녹색 전사. 아르단 평야 곳곳에 무리지어 출몰한다.',
  50, 11, 6, 28, 18, false, 4),
(1, '오크 궁수',
  '활을 든 오크. 멀리서도 정확하게 화살을 쏜다.',
  45, 13, 4, 32, 20, true, 5),

-- 실바란 고목숲 (zone_id=2)
(2, '독버섯 포자',
  '고목 사이에 피어난 거대한 버섯. 접근하면 독 포자를 뿜어낸다.',
  55, 18, 3, 45, 28, true, 6),
(2, '오크',
  '우락부락한 체구의 녹색 전사. 아르단 평야 곳곳에 무리지어 출몰한다.',
  50, 11, 6, 28, 18, false, 4),
(2, '오크 궁수',
  '활을 든 오크. 멀리서도 정확하게 화살을 쏜다.',
  45, 13, 4, 32, 20, true, 5),
(2, '오크 전사',
  '전투에 특화된 오크 엘리트. 일반 오크보다 크고 강하다.',
  135, 28, 15, 85, 54, false, 12),

-- 아르카넨 고성 (zone_id=4)
(4, '좀비',
  '전쟁의 잔재가 깨어난 언데드. 느리지만 멈추지 않는다.',
  320, 58, 10, 260, 165, false, 21),
(4, '해골',
  '뼈만 남은 전사. 가볍고 날래다. 먼저 달려드는 습성이 있다.',
  280, 65, 8, 275, 175, true, 22);
