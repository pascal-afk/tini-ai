-- Move Lyrics Feature
-- Beat-by-beat movement instructions synchronized with video

-- Move Lyrics Table
CREATE TABLE IF NOT EXISTS move_lyrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  move_id INTEGER NOT NULL,
  beat_number INTEGER NOT NULL, -- 1-8 within the bar
  absolute_beat INTEGER NOT NULL, -- Absolute beat number from video start
  timestamp_ms INTEGER NOT NULL, -- Exact timestamp in video
  
  -- Main instruction (short, punchy)
  instruction TEXT NOT NULL, -- "Blick fokussieren, volle Präsenz"
  
  -- Detailed breakdown by body part
  torso_action TEXT, -- "Bounce aus den Knien"
  right_arm_action TEXT, -- "Locker schwingen"
  left_arm_action TEXT, -- "Öffnet die Seite"
  legs_action TEXT, -- "Gewicht verlagern"
  head_action TEXT, -- "Leichter Nod"
  
  -- Additional context
  key_pose_description TEXT, -- "Tiefe, solide Ausgangsposition"
  energy_level TEXT, -- "high", "medium", "low", "explosive"
  emphasis TEXT, -- What to focus on: "timing", "isolation", "flow", "power"
  
  -- Teaching notes
  tip TEXT, -- "Stay loose! Der Groove kommt aus der Seele"
  common_mistake TEXT, -- "Oberkörper zu steif"
  
  -- Display settings
  display_duration_ms INTEGER DEFAULT 500, -- How long to show this lyric
  highlight_color TEXT DEFAULT '#667eea', -- Color for current beat
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (move_id) REFERENCES moves(id)
);

-- Count-In Lyrics (before the actual choreography starts)
CREATE TABLE IF NOT EXISTS count_in_lyrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  beat_number INTEGER NOT NULL, -- Usually 5, 6, 7, 8
  description TEXT NOT NULL, -- "Einatmen und die Startpose einnehmen"
  action TEXT NOT NULL, -- "Einatmen, Schultern sind locker"
  timestamp_ms INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Move Lyrics Presets (different detail levels)
CREATE TABLE IF NOT EXISTS lyrics_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, -- "Simple", "Detailed", "Body Parts Only"
  description TEXT,
  show_body_parts BOOLEAN DEFAULT TRUE,
  show_tips BOOLEAN DEFAULT FALSE,
  show_key_pose BOOLEAN DEFAULT FALSE,
  detail_level TEXT DEFAULT 'medium', -- "simple", "medium", "detailed"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_move_lyrics_move ON move_lyrics(move_id);
CREATE INDEX IF NOT EXISTS idx_move_lyrics_beat ON move_lyrics(absolute_beat);
CREATE INDEX IF NOT EXISTS idx_move_lyrics_timestamp ON move_lyrics(timestamp_ms);
CREATE INDEX IF NOT EXISTS idx_count_in_video ON count_in_lyrics(video_id);

-- Insert sample count-in lyrics for video 1
INSERT INTO count_in_lyrics (video_id, beat_number, description, action, timestamp_ms) VALUES
  (1, 5, 'Vorbereitung', 'Einatmen, Schultern sind locker', -2000),
  (1, 6, 'Vorbereitung', 'Leicht in die Knie gehen, Spannung aufbauen', -1500),
  (1, 7, 'Vorbereitung', 'Blick nach vorn fokussieren, volle Präsenz zeigen', -1000),
  (1, 8, 'Vorbereitung', 'Leichter Kopf-Nod im Takt, bereit für ersten Move', -500);

-- Insert sample move lyrics for Bar 1
INSERT INTO move_lyrics (
  move_id, beat_number, absolute_beat, timestamp_ms,
  instruction, torso_action, right_arm_action, left_arm_action, 
  legs_action, head_action, key_pose_description, energy_level, emphasis, tip
) VALUES
  -- Beat 1
  (1, 1, 1, 0,
   'Tiefer Bounce aus den Knien',
   'Startet den Groove mit sauberem Bounce',
   'Lockerer Swing nach innen',
   'Öffnet die Seite',
   'Starke Foundation, Knie führen',
   'Fokus geradeaus, volle Präsenz',
   'Tiefe, solide Ausgangsposition - in the pocket',
   'medium', 'timing',
   'Der Groove kommt aus den Knien, nicht aus den Füßen!'),
  
  -- Beat 2
  (1, 2, 2, 500,
   'Gewicht nach rechts verlagern',
   'Smoother Lean nach rechts',
   'Schwingt lässig vor dem Körper',
   'Folgt der Bewegung mit',
   'Klares Gewicht auf rechts, links slidet',
   'Folgt dem Flow des Oberkörpers',
   'Flüssige Gewichtsverlagerung',
   'medium', 'flow',
   'Die Schultern führen die Bewegung an'),
  
  -- Beat 3
  (1, 3, 3, 1000,
   'Dynamischer Lean nach links',
   'Starker, kontrollierter Lean',
   'Offener Whip nach außen',
   'Bleibt tief, gibt Stabilität',
   'Tiefer Side-Lunge für Basis',
   'Blick geht leicht mit nach rechts',
   'Dynamischer Akzent, schafft Raum',
   'high', 'power',
   'Der Move braucht eine solide Basis'),
  
  -- Beat 4
  (1, 4, 4, 1500,
   'Zurück zur Mitte sammeln',
   'Richtet sich auf, reset für nächsten Hit',
   'Zieht sauber zur Brust',
   'Zieht ebenfalls ran',
   'Füße schnell und präzise in die Mitte',
   'Fokus wieder nach vorne',
   'Zurück zur Mitte, Energie sammeln',
   'medium', 'timing',
   'Die Hände sind scharf, nicht schlaff');

-- Insert lyrics presets
INSERT INTO lyrics_presets (name, description, show_body_parts, show_tips, detail_level) VALUES
  ('Simple', 'Nur die Hauptanweisung', FALSE, FALSE, 'simple'),
  ('Standard', 'Anweisung + Body Parts', TRUE, FALSE, 'medium'),
  ('Detailed', 'Alles: Anweisung, Body Parts, Tips', TRUE, TRUE, 'detailed'),
  ('Body Focus', 'Nur Body Part Aktionen', TRUE, FALSE, 'medium');
