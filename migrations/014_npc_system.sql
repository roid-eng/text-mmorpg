-- NPC 테이블
CREATE TABLE text_mmorpg_npcs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  zone_id INT REFERENCES text_mmorpg_zones(id),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- NPC 대사 테이블
CREATE TABLE text_mmorpg_npc_dialogues (
  id SERIAL PRIMARY KEY,
  npc_id INT REFERENCES text_mmorpg_npcs(id),
  sequence INT NOT NULL,
  speaker TEXT NOT NULL,
  text TEXT NOT NULL
);

-- RLS
ALTER TABLE text_mmorpg_npcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_mmorpg_npc_dialogues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "npcs_read_all" ON text_mmorpg_npcs
  FOR SELECT USING (true);

CREATE POLICY "npc_dialogues_read_all" ON text_mmorpg_npc_dialogues
  FOR SELECT USING (true);

-- NPC 데이터 (1막 — 장로 에르난)
INSERT INTO text_mmorpg_npcs (name, zone_id, description) VALUES
('장로 에르난', 6, '아르단 마을을 오랫동안 지켜온 노인. 고대 신의 전쟁에 대한 지식을 품고 있다.');

-- 장로 에르난 대사 (npc_id=1)
INSERT INTO text_mmorpg_npc_dialogues (npc_id, sequence, speaker, text) VALUES
(1, 1, '장로 에르난', '오랜만에 낯선 이를 보는군. 이 마을은 요즘 심상치 않네.'),
(1, 2, '장로 에르난', '평야의 짐승들이 달라졌어. 예전엔 먼저 달려들지 않았는데...'),
(1, 3, '장로 에르난', '전설에 따르면, 신들의 봉인이 약해지면 세상이 흔들린다고 했지.'),
(1, 4, '장로 에르난', '오래된 이야기지만... 고대에 신들이 서로 전쟁을 벌였다네. 그 흔적이 아직 세계 곳곳에 남아있어.'),
(1, 5, '장로 에르난', '자네가 평야를 좀 살펴봐 줄 수 있겠나? 짐승들을 자극하는 무언가가 있을 걸세.'),
(1, 6, '장로 에르난', '부탁하네. 이 마을의 미래가 걸려 있어.');
