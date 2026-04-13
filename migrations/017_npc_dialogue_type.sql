-- npc_dialogues에 dialogue_type 컬럼 추가
ALTER TABLE text_mmorpg_npc_dialogues
  ADD COLUMN dialogue_type TEXT NOT NULL DEFAULT 'default';

-- 기존 대사 타입 분류
UPDATE text_mmorpg_npc_dialogues
SET dialogue_type = 'default'
WHERE npc_id = 1 AND sequence BETWEEN 1 AND 6;

UPDATE text_mmorpg_npc_dialogues
SET dialogue_type = 'quest_offer'
WHERE npc_id = 1 AND sequence BETWEEN 7 AND 8;

-- 진행 상태별 재대화 대사 추가 (장로 에르난)
INSERT INTO text_mmorpg_npc_dialogues
  (npc_id, sequence, speaker, text, dialogue_type)
VALUES
-- 퀘스트1 진행 중 (story_progress=1)
(1, 10, '장로 에르난', '아직 돌아왔군. 광폭한 멧돼지를 처치하고 있는가?', 'in_progress_1'),
(1, 11, '장로 에르난', '서두를 필요는 없네. 하지만 마을이 걱정되는 건 사실이야.', 'in_progress_1'),
(1, 12, '장로 에르난', '조심해서 다녀오게.', 'in_progress_1'),

-- 퀘스트2 진행 중 (story_progress=2)
(1, 13, '장로 에르난', '멧돼지를 처치했군. 수고했네.', 'in_progress_2'),
(1, 14, '장로 에르난', '숲에서 무언가 느껴졌는가? 서쪽 숲을 잘 살펴보게.', 'in_progress_2'),

-- 보스 퀘스트 진행 중 (story_progress=3)
(1, 15, '장로 에르난', '드디어 놈과 맞설 때가 왔군.', 'in_progress_3'),
(1, 16, '장로 에르난', '광폭화된 평야의 군주... 보통 상대가 아닐 걸세. 조심하게.', 'in_progress_3'),

-- 1막 완료 후 (story_progress>=4)
(1, 17, '장로 에르난', '잘 해냈네. 자네 덕분에 마을이 안전해졌어.', 'completed'),
(1, 18, '장로 에르난', '하지만 봉인이 약해지고 있다는 건 변함없네. 숲 쪽도 살펴봐야 할 것 같아.', 'completed'),
(1, 19, '장로 에르난', '고맙네. 자네 같은 사람이 있어서 다행이야.', 'completed');
