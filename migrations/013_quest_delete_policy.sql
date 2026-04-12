CREATE POLICY "char_quests_delete" ON text_mmorpg_character_quests
  FOR DELETE USING (
    character_id IN (
      SELECT id FROM text_mmorpg_characters
      WHERE player_id = auth.uid()
    )
  );
