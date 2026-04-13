-- characters 테이블에 story_progress 추가
ALTER TABLE text_mmorpg_characters
  ADD COLUMN story_progress INT NOT NULL DEFAULT 0;

-- 1막 스토리 퀘스트 3개 추가
INSERT INTO text_mmorpg_quests
  (title, description, quest_category, type, target_name, target_count, reward_exp, reward_gold, difficulty)
VALUES
('평야의 이상 징후',
  '장로 에르난의 부탁을 받았다. 평야의 광폭한 멧돼지를 처치하고 이상의 원인을 파악하라.',
  'main', 'monster', '광폭한 멧돼지', 3, 150, 80, 'normal'),
('봉인의 흔적',
  '평야 북쪽에서 이상한 기운이 느껴진다. 실바란 고목숲을 방문하여 흔적을 확인하라.',
  'main', 'explore', '실바란 고목숲', 1, 200, 100, 'normal'),
('평야의 군주',
  '봉인의 기운에 오염된 평야의 군주가 나타났다. 처치하여 평야의 평화를 되찾아라.',
  'main', 'boss', '광폭화된 평야의 군주', 1, 500, 300, 'hard');

-- 장로 에르난 추가 대사 (퀘스트 수락 후)
-- npc_id=1 기준, sequence 7부터 시작
INSERT INTO text_mmorpg_npc_dialogues (npc_id, sequence, speaker, text) VALUES
(1, 7, '장로 에르난', '고맙네. 부탁이 있어. 평야의 광폭한 멧돼지들이 예사롭지 않아.'),
(1, 8, '장로 에르난', '3마리만 처치하고 돌아오게. 무엇이 놈들을 자극하는지 알아야 해.');
