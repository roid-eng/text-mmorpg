-- 퀘스트 정의 테이블
CREATE TABLE text_mmorpg_quests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  quest_category TEXT NOT NULL DEFAULT 'daily',
  type TEXT NOT NULL,
  target_name TEXT,
  target_count INT NOT NULL DEFAULT 1,
  reward_exp INT NOT NULL DEFAULT 0,
  reward_gold INT NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'normal'
);

-- 캐릭터별 퀘스트 진행 테이블
CREATE TABLE text_mmorpg_character_quests (
  id SERIAL PRIMARY KEY,
  character_id UUID REFERENCES text_mmorpg_characters(id),
  quest_id INT REFERENCES text_mmorpg_quests(id),
  progress INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE text_mmorpg_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_mmorpg_character_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quests_read_all" ON text_mmorpg_quests
  FOR SELECT USING (true);

CREATE POLICY "char_quests_select" ON text_mmorpg_character_quests
  FOR SELECT USING (
    character_id IN (
      SELECT id FROM text_mmorpg_characters
      WHERE player_id = auth.uid()
    )
  );

CREATE POLICY "char_quests_insert" ON text_mmorpg_character_quests
  FOR INSERT WITH CHECK (
    character_id IN (
      SELECT id FROM text_mmorpg_characters
      WHERE player_id = auth.uid()
    )
  );

CREATE POLICY "char_quests_update" ON text_mmorpg_character_quests
  FOR UPDATE USING (
    character_id IN (
      SELECT id FROM text_mmorpg_characters
      WHERE player_id = auth.uid()
    )
  );

-- 퀘스트 풀 데이터
INSERT INTO text_mmorpg_quests
  (title, description, quest_category, type, target_name, target_count, reward_exp, reward_gold, difficulty)
VALUES
('슬라임 사냥', '아르단 평야의 슬라임 5마리를 처치하라.', 'daily', 'monster', '슬라임', 5, 50, 30, 'easy'),
('들쥐 퇴치', '아르단 평야의 들쥐 5마리를 처치하라.', 'daily', 'monster', '들쥐', 5, 50, 30, 'easy'),
('오크 토벌', '오크 3마리를 처치하라.', 'daily', 'monster', '오크', 3, 100, 60, 'normal'),
('늑대 사냥', '초원 늑대 3마리를 처치하라.', 'daily', 'monster', '초원 늑대', 3, 100, 60, 'normal'),
('멧돼지 사냥', '광폭한 멧돼지 3마리를 처치하라.', 'daily', 'monster', '광폭한 멧돼지', 3, 100, 60, 'normal'),
('고블린 토벌', '숲 고블린 3마리를 처치하라.', 'daily', 'monster', '숲 고블린', 3, 150, 80, 'normal'),
('오크 전사 토벌', '오크 전사 2마리를 처치하라.', 'daily', 'monster', '오크 전사', 2, 200, 120, 'hard'),
('트롤 사냥', '고목숲 트롤 2마리를 처치하라.', 'daily', 'monster', '고목숲 트롤', 2, 200, 120, 'hard'),
('숲 탐험', '실바란 고목숲을 방문하라.', 'daily', 'explore', '실바란 고목숲', 1, 80, 40, 'easy'),
('균열 탐험', '이그나르의 균열을 방문하라.', 'daily', 'explore', '균열 — 이그나르의 균열', 1, 150, 80, 'normal'),
('고성 탐험', '아르카넨 고성을 방문하라.', 'daily', 'explore', '폐허 — 아르카넨 고성', 1, 200, 120, 'hard');
