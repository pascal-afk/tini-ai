// Enhanced API Routes for Video Editor & Progressive Learning
import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

export const enhancedRoutes = new Hono<{ Bindings: Bindings }>()

// ============================================
// Progressive Learning Routes
// ============================================

// Get moves by learning level
enhancedRoutes.get('/api/moves/level/:level', async (c) => {
  const { DB } = c.env
  const level = c.req.param('level')
  
  const { results } = await DB.prepare(`
    SELECT m.*, v.title as video_title, v.video_url
    FROM moves m
    JOIN videos v ON m.video_id = v.id
    WHERE m.learning_level <= ?
    ORDER BY m.learning_level ASC, m.bar_number ASC
  `).bind(level).all()
  
  return c.json({ moves: results, level: parseInt(level) })
})

// Get bar presets (for progressive learning)
enhancedRoutes.get('/api/videos/:id/presets', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  
  const { results } = await DB.prepare(`
    SELECT * FROM bar_presets
    WHERE video_id = ?
    ORDER BY learning_level ASC
  `).bind(videoId).all()
  
  return c.json({ presets: results })
})

// Apply bar preset to video
enhancedRoutes.post('/api/videos/:id/apply-preset', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  const { preset_id } = await c.req.json()
  
  const preset = await DB.prepare(`
    SELECT * FROM bar_presets WHERE id = ?
  `).bind(preset_id).first()
  
  if (!preset) {
    return c.json({ error: 'Preset not found' }, 404)
  }
  
  // Get moves for visible bars
  const visibleBars = JSON.parse(preset.visible_bars as string)
  const placeholders = visibleBars.map(() => '?').join(',')
  
  const { results: moves } = await DB.prepare(`
    SELECT * FROM moves 
    WHERE video_id = ? AND bar_number IN (${placeholders})
    ORDER BY bar_number ASC, start_time_ms ASC
  `).bind(videoId, ...visibleBars).all()
  
  return c.json({
    preset,
    moves,
    visible_bars: visibleBars,
    muted_bars: JSON.parse(preset.muted_bars as string)
  })
})

// ============================================
// Audio Track Routes
// ============================================

// Get all audio tracks for a video
enhancedRoutes.get('/api/videos/:id/audio-tracks', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  
  const { results } = await DB.prepare(`
    SELECT * FROM audio_tracks
    WHERE video_id = ?
    ORDER BY is_default DESC, created_at DESC
  `).bind(videoId).all()
  
  return c.json({ audio_tracks: results })
})

// Add new audio track
enhancedRoutes.post('/api/videos/:id/audio-tracks', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  const { name, audio_url, track_type, bpm, generation_source } = await c.req.json()
  
  const result = await DB.prepare(`
    INSERT INTO audio_tracks (video_id, name, audio_url, track_type, bpm, generation_source)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(videoId, name, audio_url, track_type, bpm, generation_source).run()
  
  return c.json({ id: result.meta.last_row_id, message: 'Audio track added' })
})

// ============================================
// Video Snippet Routes
// ============================================

// Get move snippet with different speeds
enhancedRoutes.get('/api/moves/:id/snippets', async (c) => {
  const { DB } = c.env
  const moveId = c.req.param('id')
  
  const move = await DB.prepare(`
    SELECT m.*, v.video_url, v.bpm
    FROM moves m
    JOIN videos v ON m.video_id = v.id
    WHERE m.id = ?
  `).bind(moveId).first()
  
  if (!move) {
    return c.json({ error: 'Move not found' }, 404)
  }
  
  // Return snippet URLs at different speeds
  return c.json({
    move: {
      id: move.id,
      name: move.name,
      start_time_ms: move.start_time_ms,
      end_time_ms: move.end_time_ms
    },
    snippets: {
      slow_0_25x: move.slow_motion_url || move.snippet_url,
      slow_0_5x: move.slow_motion_url || move.snippet_url,
      normal_1_0x: move.normal_speed_url || move.snippet_url,
      source_video: move.video_url
    },
    playback_speeds: JSON.parse(move.playback_speeds || '["0.25", "0.5", "0.75", "1.0"]')
  })
})

// Extract move snippet (server-side processing)
enhancedRoutes.post('/api/moves/:id/extract-snippet', async (c) => {
  const { DB } = c.env
  const moveId = c.req.param('id')
  const { speed = 1.0 } = await c.req.json()
  
  const move = await DB.prepare(`
    SELECT m.*, v.video_url
    FROM moves m
    JOIN videos v ON m.video_id = v.id
    WHERE m.id = ?
  `).bind(moveId).first()
  
  if (!move) {
    return c.json({ error: 'Move not found' }, 404)
  }
  
  // Note: Actual video processing would happen here
  // For MVP, we return the parameters needed for client-side extraction
  return c.json({
    message: 'Snippet extraction parameters',
    video_url: move.video_url,
    start_time: move.start_time_ms / 1000,
    end_time: move.end_time_ms / 1000,
    duration: (move.end_time_ms - move.start_time_ms) / 1000,
    playback_speed: speed,
    // Client should use these params with HTML5 video API or video.js
    extraction_params: {
      seek_to: move.start_time_ms / 1000,
      duration: (move.end_time_ms - move.start_time_ms) / 1000,
      playback_rate: speed
    }
  })
})

// ============================================
// Video Editor Session Routes
// ============================================

// Get edit session
enhancedRoutes.get('/api/edit-sessions/:id', async (c) => {
  const { DB } = c.env
  const sessionId = c.req.param('id')
  
  const session = await DB.prepare(`
    SELECT * FROM edit_sessions WHERE id = ?
  `).bind(sessionId).first()
  
  if (!session) {
    return c.json({ error: 'Session not found' }, 404)
  }
  
  return c.json({ session })
})

// Create new edit session
enhancedRoutes.post('/api/edit-sessions', async (c) => {
  const { DB } = c.env
  const { video_id, session_name, selected_bars, playback_speed, overlay_config } = await c.req.json()
  
  const result = await DB.prepare(`
    INSERT INTO edit_sessions (video_id, session_name, selected_bars, playback_speed, overlay_config)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    video_id,
    session_name || 'Untitled Session',
    JSON.stringify(selected_bars || [1, 2, 3, 4]),
    playback_speed || 1.0,
    JSON.stringify(overlay_config || {})
  ).run()
  
  return c.json({ id: result.meta.last_row_id, message: 'Edit session created' })
})

// Update edit session
enhancedRoutes.put('/api/edit-sessions/:id', async (c) => {
  const { DB } = c.env
  const sessionId = c.req.param('id')
  const { selected_bars, active_audio_track_id, playback_speed, overlay_config } = await c.req.json()
  
  await DB.prepare(`
    UPDATE edit_sessions
    SET selected_bars = ?,
        active_audio_track_id = ?,
        playback_speed = ?,
        overlay_config = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    JSON.stringify(selected_bars),
    active_audio_track_id,
    playback_speed,
    JSON.stringify(overlay_config),
    sessionId
  ).run()
  
  return c.json({ message: 'Session updated' })
})

// ============================================
// Move Tags Routes
// ============================================

// Get all move tags
enhancedRoutes.get('/api/move-tags', async (c) => {
  const { DB } = c.env
  
  const { results } = await DB.prepare(`
    SELECT * FROM move_tags ORDER BY category, name
  `).all()
  
  // Group by category
  const tagsByCategory: Record<string, any[]> = {}
  results.forEach((tag: any) => {
    if (!tagsByCategory[tag.category]) {
      tagsByCategory[tag.category] = []
    }
    tagsByCategory[tag.category].push(tag)
  })
  
  return c.json({ tags: results, tagsByCategory })
})

// Get moves by body part
enhancedRoutes.get('/api/moves/body-part/:part', async (c) => {
  const { DB } = c.env
  const bodyPart = c.req.param('part')
  
  const { results } = await DB.prepare(`
    SELECT m.*, v.title as video_title
    FROM moves m
    JOIN videos v ON m.video_id = v.id
    WHERE m.body_parts LIKE ?
    ORDER BY m.learning_level ASC
  `).bind(`%"${bodyPart}"%`).all()
  
  return c.json({ moves: results, body_part: bodyPart })
})

// ============================================
// Bar Visibility & Muting Routes
// ============================================

// Toggle bar mute
enhancedRoutes.post('/api/moves/toggle-mute', async (c) => {
  const { DB } = c.env
  const { move_ids, is_muted } = await c.req.json()
  
  const placeholders = move_ids.map(() => '?').join(',')
  
  await DB.prepare(`
    UPDATE moves
    SET is_muted = ?
    WHERE id IN (${placeholders})
  `).bind(is_muted ? 1 : 0, ...move_ids).run()
  
  return c.json({ message: 'Mute status updated', affected: move_ids.length })
})

// Get muted bars for video
enhancedRoutes.get('/api/videos/:id/muted-bars', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  
  const { results } = await DB.prepare(`
    SELECT DISTINCT bar_number
    FROM moves
    WHERE video_id = ? AND is_muted = TRUE
    ORDER BY bar_number
  `).bind(videoId).all()
  
  const mutedBars = results.map((r: any) => r.bar_number)
  
  return c.json({ muted_bars: mutedBars })
})

export default enhancedRoutes
