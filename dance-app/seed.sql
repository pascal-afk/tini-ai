-- Sample video from existing tini-ai website
INSERT INTO videos (title, video_url, thumbnail_url, duration_seconds, bpm, time_signature, source, analyzed) 
VALUES (
  'Nadja Beach Dance - Landscape',
  'https://page.gensparksite.com/get_upload_url/f05ff999cfeefff50b6f172df059b235c4cd5c7f072dd4ebf3e614b84c10d9fd/default/51f788e5-446f-45eb-8921-75014095f4a2',
  'https://page.gensparksite.com/get_upload_url/f05ff999cfeefff50b6f172df059b235c4cd5c7f072dd4ebf3e614b84c10d9fd/default/51f788e5-446f-45eb-8921-75014095f4a2',
  30,
  120,
  '4/4',
  'upload',
  TRUE
);

-- Sample dance moves for the video (8-count breakdown)
-- Bar 1: Intro/Groove
INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Hip-Hop Bounce',
  'Basic bounce on the beat. Bend knees slightly and bounce to the rhythm. This establishes your groove and connection to the music.',
  'foundation',
  'beginner',
  0,
  2000,
  '1',
  '4',
  1
);

INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Step Touch Right',
  'Step to the right with right foot (count 5), bring left foot to meet it (count 6). Keep bouncing.',
  'foundation',
  'beginner',
  2000,
  3000,
  '5',
  '6',
  1
);

INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Step Touch Left',
  'Step to the left with left foot (count 7), bring right foot to meet it (count 8). Prepare for next move.',
  'foundation',
  'beginner',
  3000,
  4000,
  '7',
  '8',
  1
);

-- Bar 2: Arm Waves
INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Body Wave',
  'Smooth wave motion through the body. Start from chest, roll through torso to hips. Counts 1-4.',
  'toprock',
  'intermediate',
  4000,
  6000,
  '1',
  '4',
  2
);

INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Arm Roll',
  'Roll both arms in circular motion. Right arm leads on 5, left follows. Syncopated movement on "5-and-6-and".',
  'toprock',
  'intermediate',
  6000,
  8000,
  '5',
  '8',
  2
);

-- Bar 3: Footwork Combo
INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Running Man',
  'Classic hip-hop move. Slide back with right foot (1), hop and switch (and-2). Repeat with left. Fast syncopation.',
  'footwork',
  'intermediate',
  8000,
  10000,
  '1',
  '4',
  3
);

INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Kick Ball Change',
  'Quick footwork: Kick right foot forward (5), step on ball of right foot (and), step left foot (6). Repeat.',
  'footwork',
  'intermediate',
  10000,
  12000,
  '5',
  '8',
  3
);

-- Bar 4: Freeze/Pose
INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Attitude Pose',
  'Strike a pose with attitude. Hit on count 1 (strong beat), hold for 2 beats, slight bounce on 3-4.',
  'freeze',
  'beginner',
  12000,
  14000,
  '1',
  '4',
  4
);

INSERT INTO moves (video_id, name, description, category, difficulty, start_time_ms, end_time_ms, start_count, end_count, bar_number) 
VALUES (
  1,
  'Hair Flip',
  'Signature move: Flip hair with attitude on count 5. Accent the snare beat. Hold pose through 6-7-8.',
  'freeze',
  'beginner',
  14000,
  16000,
  '5',
  '8',
  4
);

-- Sample Choreography
INSERT INTO choreographies (name, description, created_by, total_bars, is_public)
VALUES (
  'Beach Vibes Basic',
  'Beginner-friendly choreography focusing on foundation moves and basic hip-hop grooves.',
  'Nadja',
  4,
  TRUE
);

-- Link moves to choreography
INSERT INTO choreography_moves (choreography_id, move_id, sequence_order, bar_position, notes)
VALUES 
  (1, 1, 1, 1, 'Start with basic bounce to feel the beat'),
  (1, 2, 2, 1, 'Add lateral movement'),
  (1, 3, 3, 1, 'Complete the foundation'),
  (1, 4, 4, 2, 'Introduce body isolation'),
  (1, 5, 5, 2, 'Add arm styling'),
  (1, 6, 6, 3, 'Level up with footwork'),
  (1, 7, 7, 3, 'Quick foot patterns'),
  (1, 8, 8, 4, 'Finish with attitude'),
  (1, 9, 9, 4, 'Signature ending');
