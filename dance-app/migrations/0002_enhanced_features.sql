-- Enhanced Features Migration
-- Video Snippets, Progressive Learning, Audio Tracks

-- Add video snippet fields to moves table
ALTER TABLE moves ADD COLUMN snippet_url TEXT; -- Extracted move snippet
ALTER TABLE moves ADD COLUMN slow_motion_url TEXT; -- 0.5x speed version
ALTER TABLE moves ADD COLUMN normal_speed_url TEXT; -- 1.0x speed version
ALTER TABLE moves ADD COLUMN playback_speeds TEXT DEFAULT '["0.25", "0.5", "0.75", "1.0"]'; -- Available speeds

-- Add body part focus for progressive learning
ALTER TABLE moves ADD COLUMN body_parts TEXT; -- JSON: ["feet", "hips", "torso", "arms", "head"]
ALTER TABLE moves ADD COLUMN learning_level INTEGER DEFAULT 1; -- 1: Footwork, 2: Body+Hips, 3: Arms+Head, 4: Full
ALTER TABLE moves ADD COLUMN isolation_focus TEXT; -- "feet", "body", "arms", "full"

-- Add bar visibility/muting controls
ALTER TABLE moves ADD COLUMN is_muted BOOLEAN DEFAULT FALSE;
ALTER TABLE moves ADD COLUMN overlay_type TEXT; -- "count", "body_part", "rhythm", "none"
ALTER TABLE moves ADD COLUMN overlay_data TEXT; -- JSON with overlay config

-- Audio tracks table for custom drum patterns
CREATE TABLE IF NOT EXISTS audio_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER,
  name TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  track_type TEXT DEFAULT 'original', -- 'original', 'drum_pattern', 'metronome', 'custom'
  bpm INTEGER,
  time_signature TEXT DEFAULT '4/4',
  generation_source TEXT, -- 'ai_generated', 'user_upload', 'library'
  is_default BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Bar muting/visibility presets
CREATE TABLE IF NOT EXISTS bar_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  name TEXT NOT NULL, -- e.g., "Only Footwork", "Body Only", "Full Routine"
  description TEXT,
  visible_bars TEXT NOT NULL, -- JSON: [1, 3, 4] (which bars to show)
  muted_bars TEXT, -- JSON: [2] (which bars to mute audio)
  learning_level INTEGER, -- 1-4 (linked to progressive learning)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Move tags for better categorization and search
CREATE TABLE IF NOT EXISTS move_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT, -- 'body_part', 'difficulty', 'style', 'tempo'
  color TEXT, -- Hex color for UI
  icon TEXT -- FontAwesome icon class
);

-- Junction table for moves and tags
CREATE TABLE IF NOT EXISTS move_tag_relations (
  move_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (move_id, tag_id),
  FOREIGN KEY (move_id) REFERENCES moves(id),
  FOREIGN KEY (tag_id) REFERENCES move_tags(id)
);

-- Video editing sessions (for mobile editor)
CREATE TABLE IF NOT EXISTS edit_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  session_name TEXT,
  selected_bars TEXT, -- JSON: [1, 2, 4]
  active_audio_track_id INTEGER,
  playback_speed REAL DEFAULT 1.0,
  overlay_config TEXT, -- JSON: overlay settings
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (active_audio_track_id) REFERENCES audio_tracks(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_moves_learning_level ON moves(learning_level);
CREATE INDEX IF NOT EXISTS idx_moves_body_parts ON moves(body_parts);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_video ON audio_tracks(video_id);
CREATE INDEX IF NOT EXISTS idx_bar_presets_video ON bar_presets(video_id);
CREATE INDEX IF NOT EXISTS idx_edit_sessions_video ON edit_sessions(video_id);

-- Insert default move tags
INSERT INTO move_tags (name, category, color, icon) VALUES
  -- Body parts
  ('Feet', 'body_part', '#3B82F6', 'fa-shoe-prints'),
  ('Legs', 'body_part', '#10B981', 'fa-person-walking'),
  ('Hips', 'body_part', '#F59E0B', 'fa-circle-dot'),
  ('Torso', 'body_part', '#EF4444', 'fa-person'),
  ('Arms', 'body_part', '#8B5CF6', 'fa-hands'),
  ('Head', 'body_part', '#EC4899', 'fa-head-side'),
  
  -- Difficulty
  ('Slow Motion Recommended', 'difficulty', '#6B7280', 'fa-backward'),
  ('Practice Required', 'difficulty', '#F97316', 'fa-repeat'),
  ('Advanced Timing', 'difficulty', '#DC2626', 'fa-clock'),
  
  -- Style
  ('Old School', 'style', '#92400E', 'fa-compact-disc'),
  ('Viral Move', 'style', '#BE185D', 'fa-fire'),
  ('Signature Nadja', 'style', '#7C3AED', 'fa-star');

-- Insert default bar presets for progressive learning
INSERT INTO bar_presets (video_id, name, description, visible_bars, muted_bars, learning_level) VALUES
  (1, 'Level 1: Footwork Only', 'Focus on feet and leg movements', '[1, 3]', '[]', 1),
  (1, 'Level 2: Add Body Movement', 'Footwork + Body waves and isolations', '[1, 2, 3]', '[]', 2),
  (1, 'Level 3: Add Arms', 'Full body including arm styling', '[1, 2, 3, 4]', '[]', 3),
  (1, 'Level 4: Full Routine', 'Complete choreography with all elements', '[1, 2, 3, 4]', '[]', 4);

-- Insert default audio tracks (metronome for practice)
INSERT INTO audio_tracks (video_id, name, audio_url, track_type, bpm, generation_source, is_default) VALUES
  (1, 'Original Audio', 'https://page.gensparksite.com/get_upload_url/f05ff999cfeefff50b6f172df059b235c4cd5c7f072dd4ebf3e614b84c10d9fd/default/51f788e5-446f-45eb-8921-75014095f4a2', 'original', 120, 'user_upload', TRUE),
  (1, 'Practice Metronome', '', 'metronome', 120, 'library', FALSE);
