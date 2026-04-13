-- is_boss 컬럼 추가
ALTER TABLE text_mmorpg_monsters
  ADD COLUMN is_boss BOOLEAN NOT NULL DEFAULT false;

-- 보스 몬스터 5종 추가
INSERT INTO text_mmorpg_monsters
  (zone_id, name, description, hp, atk, def, exp, gold_reward, is_aggressive, level, is_boss)
VALUES
(1, '광폭화된 평야의 군주',
  '아르단 평야를 지배하는 거대한 멧돼지. 봉인이 약해지면서 신의 기운에 오염되어 광폭화됐다.',
  180, 30, 12, 500, 300, true, 5, true),
(2, '타락한 숲의 수호자',
  '실바란 고목숲을 지키던 고대 정령. 봉인의 균열로 타락하여 침입자를 무차별 공격한다.',
  480, 90, 30, 1500, 900, true, 15, true),
(3, '이그나르의 파편',
  '불의 신 이그나르의 의식이 파편화된 존재. 균열에서 솟아오른 용암과 불꽃으로 이루어져 있다.',
  960, 165, 45, 3000, 1800, true, 20, true),
(4, '고성의 군주',
  '아르카넨 고성을 지배하는 언데드 군주. 신들의 전쟁에서 쓰러진 영웅이 저주로 깨어났다.',
  1260, 225, 54, 5000, 3000, true, 25, true),
(5, '봉인된 신의 화신',
  '망각의 제단에 봉인된 신의 힘이 실체화된 최종 존재. Mytharion의 운명이 이 전투에 달려있다.',
  1950, 315, 84, 10000, 6000, true, 30, true);
