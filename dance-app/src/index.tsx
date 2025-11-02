import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// API Routes
// ============================================

// Get all videos
app.get('/api/videos', async (c) => {
  const { DB } = c.env
  
  const { results } = await DB.prepare(`
    SELECT * FROM videos ORDER BY created_at DESC
  `).all()
  
  return c.json({ videos: results })
})

// Get video by ID with all moves
app.get('/api/videos/:id', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  
  // Get video details
  const video = await DB.prepare(`
    SELECT * FROM videos WHERE id = ?
  `).bind(videoId).first()
  
  if (!video) {
    return c.json({ error: 'Video not found' }, 404)
  }
  
  // Get all moves for this video
  const { results: moves } = await DB.prepare(`
    SELECT * FROM moves 
    WHERE video_id = ?
    ORDER BY bar_number ASC, start_time_ms ASC
  `).bind(videoId).all()
  
  return c.json({ video, moves })
})

// Get moves by video ID, grouped by bar
app.get('/api/videos/:id/moves', async (c) => {
  const { DB } = c.env
  const videoId = c.req.param('id')
  
  const { results: moves } = await DB.prepare(`
    SELECT * FROM moves 
    WHERE video_id = ?
    ORDER BY bar_number ASC, start_time_ms ASC
  `).bind(videoId).all()
  
  // Group moves by bar
  const movesByBar: Record<number, any[]> = {}
  moves.forEach((move: any) => {
    const bar = move.bar_number
    if (!movesByBar[bar]) {
      movesByBar[bar] = []
    }
    movesByBar[bar].push(move)
  })
  
  return c.json({ movesByBar, totalBars: Object.keys(movesByBar).length })
})

// Get all choreographies
app.get('/api/choreographies', async (c) => {
  const { DB } = c.env
  
  const { results } = await DB.prepare(`
    SELECT * FROM choreographies 
    WHERE is_public = TRUE
    ORDER BY created_at DESC
  `).all()
  
  return c.json({ choreographies: results })
})

// Get choreography with moves
app.get('/api/choreographies/:id', async (c) => {
  const { DB } = c.env
  const choreoId = c.req.param('id')
  
  // Get choreography details
  const choreography = await DB.prepare(`
    SELECT * FROM choreographies WHERE id = ?
  `).bind(choreoId).first()
  
  if (!choreography) {
    return c.json({ error: 'Choreography not found' }, 404)
  }
  
  // Get all moves in this choreography
  const { results: moves } = await DB.prepare(`
    SELECT cm.*, m.name, m.description, m.category, m.difficulty,
           m.start_count, m.end_count, v.video_url, v.thumbnail_url
    FROM choreography_moves cm
    JOIN moves m ON cm.move_id = m.id
    JOIN videos v ON m.video_id = v.id
    WHERE cm.choreography_id = ?
    ORDER BY cm.sequence_order ASC
  `).bind(choreoId).all()
  
  return c.json({ choreography, moves })
})

// Search moves by category or difficulty
app.get('/api/moves/search', async (c) => {
  const { DB } = c.env
  const category = c.req.query('category')
  const difficulty = c.req.query('difficulty')
  
  let query = 'SELECT m.*, v.title as video_title, v.video_url FROM moves m JOIN videos v ON m.video_id = v.id WHERE 1=1'
  const params: any[] = []
  
  if (category) {
    query += ' AND m.category = ?'
    params.push(category)
  }
  
  if (difficulty) {
    query += ' AND m.difficulty = ?'
    params.push(difficulty)
  }
  
  query += ' ORDER BY m.created_at DESC'
  
  const { results } = await DB.prepare(query).bind(...params).all()
  
  return c.json({ moves: results })
})

// ============================================
// Main Application Route
// ============================================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hip-Hop Dance Trainer - Nadja</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          .beat-counter {
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 50%;
            margin: 0 4px;
            font-weight: bold;
            transition: all 0.1s ease;
          }
          
          .beat-counter.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: scale(1.2);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          
          .beat-counter.inactive {
            background: #f3f4f6;
            color: #9ca3af;
          }
          
          .move-card {
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
          }
          
          .move-card:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .move-card.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border-left-color: #764ba2;
          }
          
          .difficulty-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .difficulty-beginner { background: #dcfce7; color: #166534; }
          .difficulty-intermediate { background: #fef3c7; color: #92400e; }
          .difficulty-advanced { background: #fee2e2; color: #991b1b; }
          
          .video-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .video-controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 12px 20px;
            border-radius: 30px;
            backdrop-filter: blur(10px);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">
                            <i class="fas fa-music text-purple-600 mr-2"></i>
                            Hip-Hop Dance Trainer
                        </h1>
                        <p class="text-gray-600 mt-1">Learn dance moves with Nadja - Beat by beat analysis</p>
                    </div>
                    <a href="https://instagram.com/tini.aii" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition">
                        <i class="fab fa-instagram"></i>
                        Follow @tini.aii
                    </a>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- Video Player Section -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div class="video-container">
                    <video id="danceVideo" class="w-full rounded-lg shadow-md" controls>
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    
                    <!-- Beat Counter Overlay -->
                    <div class="mt-6 text-center">
                        <div class="inline-block bg-white rounded-full shadow-lg px-8 py-4">
                            <div class="text-sm text-gray-500 mb-2">Bar <span id="currentBar">1</span> - 4/4 Time</div>
                            <div id="beatCounter" class="flex justify-center">
                                <div class="beat-counter inactive">1</div>
                                <div class="beat-counter inactive">2</div>
                                <div class="beat-counter inactive">3</div>
                                <div class="beat-counter inactive">4</div>
                                <div class="beat-counter inactive">5</div>
                                <div class="beat-counter inactive">6</div>
                                <div class="beat-counter inactive">7</div>
                                <div class="beat-counter inactive">8</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Video Selection -->
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-video mr-2 text-purple-600"></i>
                    Select Video
                </h2>
                <div id="videoList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Videos will be loaded here -->
                </div>
            </div>

            <!-- Moves Breakdown Section -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    <i class="fas fa-list-ol mr-2 text-purple-600"></i>
                    Move Breakdown
                </h2>
                
                <div id="movesContainer">
                    <!-- Moves will be loaded here -->
                    <div class="text-center text-gray-500 py-12">
                        <i class="fas fa-arrow-up text-4xl mb-4"></i>
                        <p>Select a video to see the move breakdown</p>
                    </div>
                </div>
            </div>

            <!-- Choreographies Section -->
            <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    <i class="fas fa-fire mr-2 text-purple-600"></i>
                    Learn Choreographies
                </h2>
                <div id="choreographiesList" class="space-y-4">
                    <!-- Choreographies will be loaded here -->
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white mt-16 py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; 2025 Tini AI - Dance & Joy from Cyprus</p>
                <div class="mt-4 flex justify-center gap-4">
                    <a href="https://instagram.com/tini.aii" class="hover:text-purple-400 transition">
                        <i class="fab fa-instagram text-2xl"></i>
                    </a>
                    <a href="https://tiktok.com/@tini.aii" class="hover:text-purple-400 transition">
                        <i class="fab fa-tiktok text-2xl"></i>
                    </a>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
