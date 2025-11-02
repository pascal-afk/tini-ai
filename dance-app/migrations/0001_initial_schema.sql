-- Dance Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  bpm INTEGER, -- Beats per minute
  time_signature TEXT DEFAULT '4/4',
  source TEXT, -- 'upload', 'instagram', 'youtube', etc.
  source_id TEXT, -- Original video ID from source
  analyzed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dance Moves Table
CREATE TABLE IF NOT EXISTS moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'foundation', 'toprock', 'footwork', 'freeze', 'power', etc.
  difficulty TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  start_time_ms INTEGER NOT NULL, -- Start time in milliseconds
  end_time_ms INTEGER NOT NULL, -- End time in milliseconds
  start_count TEXT, -- e.g., "1", "5-and", "7"
  end_count TEXT, -- e.g., "4", "8", "2-and"
  bar_number INTEGER, -- Which bar (set of 8 counts)
  beat_alignment TEXT, -- JSON: {"1": "step_left", "2": "bounce", ...}
  thumbnail_url TEXT, -- Snapshot of the move
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Choreographies Table (for custom dance combinations)
CREATE TABLE IF NOT EXISTS choreographies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT, -- User identifier (for future community feature)
  total_bars INTEGER, -- Total number of 8-count bars
  is_public BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Choreography Moves Junction Table
CREATE TABLE IF NOT EXISTS choreography_moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  choreography_id INTEGER NOT NULL,
  move_id INTEGER NOT NULL,
  sequence_order INTEGER NOT NULL, -- Order in the choreography
  bar_position INTEGER NOT NULL, -- Which bar in the choreography
  notes TEXT, -- Custom notes for this move in context
  FOREIGN KEY (choreography_id) REFERENCES choreographies(id),
  FOREIGN KEY (move_id) REFERENCES moves(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_moves_video_id ON moves(video_id);
CREATE INDEX IF NOT EXISTS idx_moves_category ON moves(category);
CREATE INDEX IF NOT EXISTS idx_moves_difficulty ON moves(difficulty);
CREATE INDEX IF NOT EXISTS idx_choreography_moves_choreography ON choreography_moves(choreography_id);
CREATE INDEX IF NOT EXISTS idx_choreography_moves_sequence ON choreography_moves(choreography_id, sequence_order);
