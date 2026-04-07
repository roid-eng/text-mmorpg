/**
 * supabase.js — Supabase client initialization & table schema reference
 * Mytharion Text MMORPG
 *
 * All tables use the prefix: text_mmorpg_
 *
 * ================================================================
 * TABLE SCHEMA
 * ================================================================
 *
 * [text_mmorpg_players]
 * Stores one row per authenticated user (linked to Supabase Auth).
 *
 *   id          uuid        PK, references auth.users(id)
 *   username    text        UNIQUE NOT NULL
 *   language    text        'en' | 'ko', default 'en'
 *   last_login  timestamptz
 *   created_at  timestamptz default now()
 *
 * ----------------------------------------------------------------
 *
 * [text_mmorpg_characters]
 * One or more characters per player.
 *
 *   id          uuid        PK, default gen_random_uuid()
 *   player_id   uuid        FK → text_mmorpg_players(id)
 *   name        text        NOT NULL
 *   class       text        'warrior' | 'mage' | 'archer' | 'cleric'
 *   level       int         default 1
 *   exp         int         default 0
 *   stat_str    int         NOT NULL  (Strength     → physical attack)
 *   stat_con    int         NOT NULL  (Constitution → max HP)
 *   stat_dex    int         NOT NULL  (Dexterity    → hit / dodge)
 *   stat_int    int         NOT NULL  (Intelligence → magic damage)
 *   stat_wiz    int         NOT NULL  (Wisdom       → max MP, MP regen)
 *   hp          int         NOT NULL
 *   hp_max      int         NOT NULL
 *   mp          int         NOT NULL
 *   mp_max      int         NOT NULL
 *   zone_id     text        default 'zone_start'
 *   created_at  timestamptz default now()
 *
 * ----------------------------------------------------------------
 *
 * [text_mmorpg_items]
 * Static item definitions. Dropped in specific zones.
 *
 *   id            int(SERIAL) PK
 *   name          text        NOT NULL
 *   description   text
 *   type          text        'weapon' | 'armor' | 'consumable' | 'etc'
 *   stat_str      int         NOT NULL default 0
 *   stat_con      int         NOT NULL default 0
 *   stat_dex      int         NOT NULL default 0
 *   stat_int      int         NOT NULL default 0
 *   stat_wiz      int         NOT NULL default 0
 *   atk_bonus     int         NOT NULL default 0
 *   def_bonus     int         NOT NULL default 0
 *   level_req     int         NOT NULL default 1
 *   drop_zone_id  int         FK → text_mmorpg_zones(id)
 *   created_at    timestamptz default now()
 *
 * ----------------------------------------------------------------
 *
 * [text_mmorpg_inventory]
 * Items held by a character.
 *
 *   id           uuid    PK, default gen_random_uuid()
 *   character_id uuid    FK → text_mmorpg_characters(id)
 *   item_id      text    NOT NULL  (static item key, e.g. 'wpn_iron_sword')
 *   item_name    text    NOT NULL
 *   item_type    text    'weapon' | 'armor' | 'consumable' | 'etc'
 *   quantity     int     default 1
 *   equipped     bool    default false
 *   created_at   timestamptz default now()
 *
 * ----------------------------------------------------------------
 *
 * [text_mmorpg_chat]
 * Global asynchronous chat log.
 *
 *   id         uuid    PK, default gen_random_uuid()
 *   player_id  uuid    FK → text_mmorpg_players(id)
 *   username   text    NOT NULL  (denormalized for read speed)
 *   message    text    NOT NULL
 *   created_at timestamptz default now()
 *
 * ================================================================
 * SQL — Run in Supabase Dashboard → SQL Editor
 * ================================================================
 *
 * -- Players
 * CREATE TABLE text_mmorpg_players (
 *   id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *   username   text UNIQUE NOT NULL,
 *   language   text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ko')),
 *   last_login timestamptz,
 *   created_at timestamptz NOT NULL DEFAULT now()
 * );
 *
 * -- Characters
 * CREATE TABLE text_mmorpg_characters (
 *   id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   player_id  uuid NOT NULL REFERENCES text_mmorpg_players(id) ON DELETE CASCADE,
 *   name       text NOT NULL,
 *   class      text NOT NULL CHECK (class IN ('warrior','mage','archer','cleric')),
 *   level      int  NOT NULL DEFAULT 1,
 *   exp        int  NOT NULL DEFAULT 0,
 *   stat_str   int  NOT NULL,
 *   stat_con   int  NOT NULL,
 *   stat_dex   int  NOT NULL,
 *   stat_int   int  NOT NULL,
 *   stat_wiz   int  NOT NULL,
 *   hp         int  NOT NULL,
 *   hp_max     int  NOT NULL,
 *   mp         int  NOT NULL,
 *   mp_max     int  NOT NULL,
 *   zone_id    text NOT NULL DEFAULT 'zone_start',
 *   created_at timestamptz NOT NULL DEFAULT now()
 * );
 *
 * -- Items
 * CREATE TABLE text_mmorpg_items (
 *   id           SERIAL PRIMARY KEY,
 *   name         text NOT NULL,
 *   description  text,
 *   type         text NOT NULL CHECK (type IN ('weapon','armor','consumable','etc')),
 *   stat_str     int  NOT NULL DEFAULT 0,
 *   stat_con     int  NOT NULL DEFAULT 0,
 *   stat_dex     int  NOT NULL DEFAULT 0,
 *   stat_int     int  NOT NULL DEFAULT 0,
 *   stat_wiz     int  NOT NULL DEFAULT 0,
 *   atk_bonus    int  NOT NULL DEFAULT 0,
 *   def_bonus    int  NOT NULL DEFAULT 0,
 *   level_req    int  NOT NULL DEFAULT 1,
 *   drop_zone_id int  REFERENCES text_mmorpg_zones(id),
 *   created_at   timestamptz NOT NULL DEFAULT now()
 * );
 *
 * -- Inventory
 * CREATE TABLE text_mmorpg_inventory (
 *   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   character_id uuid NOT NULL REFERENCES text_mmorpg_characters(id) ON DELETE CASCADE,
 *   item_id      text NOT NULL,
 *   item_name    text NOT NULL,
 *   item_type    text NOT NULL CHECK (item_type IN ('weapon','armor','consumable','etc')),
 *   quantity     int  NOT NULL DEFAULT 1,
 *   equipped     bool NOT NULL DEFAULT false,
 *   created_at   timestamptz NOT NULL DEFAULT now()
 * );
 *
 * -- Chat
 * CREATE TABLE text_mmorpg_chat (
 *   id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   player_id  uuid NOT NULL REFERENCES text_mmorpg_players(id) ON DELETE CASCADE,
 *   username   text NOT NULL,
 *   message    text NOT NULL,
 *   created_at timestamptz NOT NULL DEFAULT now()
 * );
 *
 * -- Row Level Security (enable on all tables)
 * ALTER TABLE text_mmorpg_players    ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE text_mmorpg_characters ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE text_mmorpg_inventory  ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE text_mmorpg_chat       ENABLE ROW LEVEL SECURITY;
 *
 * -- Players: only owner can read/write own row
 * CREATE POLICY "players_self" ON text_mmorpg_players
 *   FOR ALL USING (auth.uid() = id);
 *
 * -- Characters: only owner can read/write own characters
 * CREATE POLICY "characters_self" ON text_mmorpg_characters
 *   FOR ALL USING (
 *     player_id = (SELECT id FROM text_mmorpg_players WHERE id = auth.uid())
 *   );
 *
 * -- Inventory: only owner can read/write own inventory
 * CREATE POLICY "inventory_self" ON text_mmorpg_inventory
 *   FOR ALL USING (
 *     character_id IN (
 *       SELECT id FROM text_mmorpg_characters WHERE player_id = auth.uid()
 *     )
 *   );
 *
 * -- Chat: all authenticated users can read; only owner can insert own messages
 * CREATE POLICY "chat_read_all"  ON text_mmorpg_chat FOR SELECT USING (true);
 * CREATE POLICY "chat_insert_self" ON text_mmorpg_chat FOR INSERT
 *   WITH CHECK (player_id = auth.uid());
 *
 * ================================================================
 */

const SUPABASE_URL = 'https://ooknyhnrlysdubqrypen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9va255aG5ybHlzZHVicXJ5cGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDQwODQsImV4cCI6MjA2NTI4MDA4NH0.uAgqBw7DzZY1FpeKn5a1TY75hq0Sg0a0FhfX4KgYABQ';

// Supabase JS v2 loaded via CDN in HTML, or import via npm:
// import { createClient } from '@supabase/supabase-js'
const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
