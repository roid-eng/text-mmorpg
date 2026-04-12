-- 아르단 마을 지역 추가
INSERT INTO text_mmorpg_zones
  (name, level_min, level_max, description, is_start)
VALUES
('마을 — 아르단 마을', 1, 99,
  '낮은 담장으로 둘러싸인 작은 마을. 아르단 평야의 풍요로운 땅에 기대어 오랫동안 자리를 지켜온 곳이다. 상인들의 호객 소리와 모닥불 냄새가 여행자를 반긴다.',
  false);

-- 노드 연결 (아르단 평야 ↔ 아르단 마을)
-- 아르단 평야 zone_id = 1
-- 아르단 마을 zone_id = 6 (INSERT 후 확인 필요)
INSERT INTO text_mmorpg_zone_connections
  (from_zone_id, to_zone_id, direction, description)
VALUES
(1, 6, '서쪽', '마을의 불빛이 보이기 시작한다.'),
(6, 1, '동쪽', '황금빛 초원이 펼쳐진다.');
