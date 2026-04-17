-- 신규 NPC: 숲의 현자 실바 (zone_id=2, 실바란 고목숲)
INSERT INTO text_mmorpg_npcs (name, zone_id, description)
VALUES ('숲의 현자 실바', 2, '실바란 고목숲의 현자. 고대 봉인의 기운을 읽을 수 있는 드루이드.');

-- 실바 NPC 대사 (dialogue_type별)
INSERT INTO text_mmorpg_npc_dialogues (npc_id, sequence, speaker, text, dialogue_type)
VALUES
((SELECT id FROM text_mmorpg_npcs WHERE name='숲의 현자 실바'), 1, '숲의 현자 실바', '이 숲은 오래전부터 봉인의 기운을 품고 있었지. 하지만 최근 들어 그 기운이 흔들리고 있어.', 'default'),
((SELECT id FROM text_mmorpg_npcs WHERE name='숲의 현자 실바'), 1, '숲의 현자 실바', '독버섯 포자들이 이상하게 날뛰고 있네. 봉인이 약해진 탓이야. 5마리만 처치해줄 수 있겠나?', 'quest_offer'),
((SELECT id FROM text_mmorpg_npcs WHERE name='숲의 현자 실바'), 1, '숲의 현자 실바', '아직 독버섯 포자들이 남아있어. 서둘러줘.', 'in_progress_1'),
((SELECT id FROM text_mmorpg_npcs WHERE name='숲의 현자 실바'), 1, '숲의 현자 실바', '균열의 위치... 이그나르 쪽에서 강한 기운이 느껴지네. 직접 확인해줘.', 'in_progress_2'),
((SELECT id FROM text_mmorpg_npcs WHERE name='숲의 현자 실바'), 1, '숲의 현자 실바', '숲의 수호자가 오염되었어. 저 상태로는 숲 전체가 위험해. 처치해야만 해.', 'in_progress_3'),
((SELECT id FROM text_mmorpg_npcs WHERE name='숲의 현자 실바'), 1, '숲의 현자 실바', '고마워. 하지만 이건 시작에 불과해. 균열이 점점 커지고 있어. 이그나르로 가야 할 것 같군.', 'completed');

-- 2막 스토리 퀘스트 3개
INSERT INTO text_mmorpg_quests (title, description, quest_category, type, target_name, target_count, reward_exp, reward_gold, difficulty)
VALUES
('숲의 이상', '숲의 현자 실바의 부탁. 봉인이 약해지며 날뛰는 독버섯 포자를 처치하라.', 'main', 'monster', '독버섯 포자', 5, 400, 200, 'normal'),
('봉인석의 위치', '실바의 말대로 이그나르의 균열에서 강한 기운이 느껴진다. 직접 방문하여 확인하라.', 'main', 'explore', '이그나르의 균열', 1, 500, 250, 'normal'),
('숲의 수호자', '봉인의 기운에 오염된 숲의 수호자가 나타났다. 처치하여 고목숲을 지켜라.', 'main', 'boss', '고목숲의 군주', 1, 1200, 600, 'hard');
