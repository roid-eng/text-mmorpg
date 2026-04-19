-- 신규 NPC: 균열의 탐험가 카이로스 (zone_id=3, 이그나르의 균열)
INSERT INTO text_mmorpg_npcs (name, zone_id, description)
VALUES ('균열의 탐험가 카이로스', 3, '이그나르의 균열을 탐사하는 모험가. 고대 봉인의 붕괴를 막으려 한다.');

-- 카이로스 NPC 대사 (dialogue_type별)
INSERT INTO text_mmorpg_npc_dialogues (npc_id, sequence, speaker, text, dialogue_type)
VALUES
((SELECT id FROM text_mmorpg_npcs WHERE name='균열의 탐험가 카이로스'), 1, '균열의 탐험가 카이로스', '이 균열은 단순한 지형이 아니야. 고대 봉인의 흔적이 곳곳에 남아있어.', 'default'),
((SELECT id FROM text_mmorpg_npcs WHERE name='균열의 탐험가 카이로스'), 1, '균열의 탐험가 카이로스', '균열 안쪽에 용암 도마뱀들이 날뛰고 있어. 봉인이 약해진 탓이지. 5마리만 처치해줄 수 있나?', 'quest_offer'),
((SELECT id FROM text_mmorpg_npcs WHERE name='균열의 탐험가 카이로스'), 1, '균열의 탐험가 카이로스', '아직 용암 도마뱀이 남아있어. 균열 깊숙이 들어가봐.', 'in_progress_1'),
((SELECT id FROM text_mmorpg_npcs WHERE name='균열의 탐험가 카이로스'), 1, '균열의 탐험가 카이로스', '봉인의 핵심... 아르카넨 고성에서 강한 기운이 느껴져. 직접 확인해줘.', 'in_progress_2'),
((SELECT id FROM text_mmorpg_npcs WHERE name='균열의 탐험가 카이로스'), 1, '균열의 탐험가 카이로스', '이그나르의 화신이 모습을 드러냈어. 저걸 처치하지 않으면 균열이 더 벌어질 거야.', 'in_progress_3'),
((SELECT id FROM text_mmorpg_npcs WHERE name='균열의 탐험가 카이로스'), 1, '균열의 탐험가 카이로스', '해냈군. 하지만 봉인의 핵심은 아르카넨 고성에 있어. 서둘러야 해.', 'completed');

-- 3막 스토리 퀘스트 3개
INSERT INTO text_mmorpg_quests (title, description, quest_category, type, target_name, target_count, reward_exp, reward_gold, difficulty)
VALUES
('균열의 탐사',
 '균열의 탐험가 카이로스의 부탁. 봉인이 약해지며 날뛰는 용암 도마뱀을 처치하라.',
 'main', 'monster', '용암 도마뱀', 5, 800, 400, 'normal'),

('봉인의 핵심',
 '카이로스의 말대로 아르카넨 고성에서 강한 기운이 느껴진다. 직접 방문하여 확인하라.',
 'main', 'explore', '아르카넨 고성', 1, 1000, 500, 'normal'),

('균열의 지배자',
 '봉인의 기운에 오염된 이그나르의 화신이 나타났다. 처치하여 균열을 안정시켜라.',
 'main', 'boss', '이그나르의 화신', 1, 2500, 1200, 'hard');
