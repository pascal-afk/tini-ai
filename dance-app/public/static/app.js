// Global state
let currentVideo = null;
let currentMoves = [];
let beatInterval = null;
let currentBeat = 1;
let currentBar = 1;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadVideos();
  loadChoreographies();
  setupVideoPlayer();
});

// Load all videos
async function loadVideos() {
  try {
    const response = await axios.get('/api/videos');
    const videos = response.data.videos;
    
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = videos.map(video => `
      <div class="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden" 
           onclick="selectVideo(${video.id})">
        <div class="aspect-video bg-gray-200 relative">
          <img src="${video.thumbnail_url || 'https://via.placeholder.com/640x360?text=Dance+Video'}" 
               class="w-full h-full object-cover" alt="${video.title}">
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition flex items-center justify-center">
            <i class="fas fa-play-circle text-white text-5xl opacity-0 hover:opacity-100 transition"></i>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 mb-2">${video.title}</h3>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span><i class="fas fa-clock mr-1"></i>${video.duration_seconds}s</span>
            <span><i class="fas fa-drum mr-1"></i>${video.bpm} BPM</span>
            <span><i class="fas fa-music mr-1"></i>${video.time_signature}</span>
          </div>
        </div>
      </div>
    `).join('');
    
    // Auto-select first video
    if (videos.length > 0) {
      selectVideo(videos[0].id);
    }
  } catch (error) {
    console.error('Error loading videos:', error);
  }
}

// Select and load video with moves
async function selectVideo(videoId) {
  try {
    const response = await axios.get(`/api/videos/${videoId}`);
    currentVideo = response.data.video;
    currentMoves = response.data.moves;
    
    // Update video player
    const videoElement = document.getElementById('danceVideo');
    videoElement.src = currentVideo.video_url;
    
    // Display moves breakdown
    displayMoves(currentMoves);
    
    // Reset beat counter
    currentBeat = 1;
    currentBar = 1;
    updateBeatCounter();
    
  } catch (error) {
    console.error('Error loading video:', error);
  }
}

// Display moves grouped by bar
function displayMoves(moves) {
  const movesContainer = document.getElementById('movesContainer');
  
  // Group moves by bar
  const movesByBar = {};
  moves.forEach(move => {
    const bar = move.bar_number;
    if (!movesByBar[bar]) {
      movesByBar[bar] = [];
    }
    movesByBar[bar].push(move);
  });
  
  // Generate HTML
  const barsHTML = Object.keys(movesByBar).sort((a, b) => a - b).map(bar => {
    const barMoves = movesByBar[bar];
    return `
      <div class="mb-8">
        <h3 class="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <i class="fas fa-bars"></i>
          Bar ${bar} (8 counts)
        </h3>
        <div class="space-y-4">
          ${barMoves.map(move => `
            <div class="move-card bg-white p-4 rounded-lg shadow" 
                 data-move-id="${move.id}"
                 data-start="${move.start_time_ms}"
                 data-end="${move.end_time_ms}">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="text-2xl font-bold text-purple-600">
                    ${move.start_count}${move.start_count !== move.end_count ? '-' + move.end_count : ''}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">${move.name}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="difficulty-badge difficulty-${move.difficulty}">
                        ${move.difficulty}
                      </span>
                      <span class="text-sm text-gray-500">
                        <i class="fas fa-tag mr-1"></i>${move.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button onclick="jumpToMove(${move.start_time_ms})" 
                        class="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm">
                  <i class="fas fa-play mr-1"></i>Play
                </button>
              </div>
              <p class="text-gray-700 mt-2 ml-14">${move.description}</p>
              <div class="mt-2 ml-14 text-sm text-gray-500">
                <i class="fas fa-clock mr-1"></i>
                ${(move.start_time_ms / 1000).toFixed(1)}s - ${(move.end_time_ms / 1000).toFixed(1)}s
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  movesContainer.innerHTML = barsHTML;
}

// Setup video player events
function setupVideoPlayer() {
  const video = document.getElementById('danceVideo');
  
  video.addEventListener('timeupdate', () => {
    if (!currentVideo || !currentMoves.length) return;
    
    const currentTime = video.currentTime * 1000; // Convert to ms
    
    // Highlight active move
    document.querySelectorAll('.move-card').forEach(card => {
      const start = parseInt(card.dataset.start);
      const end = parseInt(card.dataset.end);
      
      if (currentTime >= start && currentTime <= end) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    // Update beat counter based on BPM
    if (currentVideo.bpm) {
      updateBeatCounterByTime(currentTime, currentVideo.bpm);
    }
  });
  
  video.addEventListener('play', () => {
    startBeatCounter();
  });
  
  video.addEventListener('pause', () => {
    stopBeatCounter();
  });
}

// Update beat counter based on video time and BPM
function updateBeatCounterByTime(currentTimeMs, bpm) {
  // Calculate time per beat in ms
  const msPerBeat = (60 / bpm) * 1000;
  
  // Calculate current beat (1-8)
  const totalBeats = Math.floor(currentTimeMs / msPerBeat);
  currentBeat = (totalBeats % 8) + 1;
  
  // Calculate current bar
  currentBar = Math.floor(totalBeats / 8) + 1;
  
  updateBeatCounter();
}

// Update beat counter visual
function updateBeatCounter() {
  const beatElements = document.querySelectorAll('.beat-counter');
  beatElements.forEach((el, index) => {
    const beat = index + 1;
    if (beat === currentBeat) {
      el.classList.remove('inactive');
      el.classList.add('active');
    } else {
      el.classList.remove('active');
      el.classList.add('inactive');
    }
  });
  
  document.getElementById('currentBar').textContent = currentBar;
}

// Start beat counter animation
function startBeatCounter() {
  if (!currentVideo || beatInterval) return;
  
  const bpm = currentVideo.bpm || 120;
  const msPerBeat = (60 / bpm) * 1000;
  
  beatInterval = setInterval(() => {
    currentBeat++;
    if (currentBeat > 8) {
      currentBeat = 1;
      currentBar++;
    }
    updateBeatCounter();
  }, msPerBeat);
}

// Stop beat counter
function stopBeatCounter() {
  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
}

// Jump to specific move in video
function jumpToMove(startTimeMs) {
  const video = document.getElementById('danceVideo');
  video.currentTime = startTimeMs / 1000;
  video.play();
}

// Load choreographies
async function loadChoreographies() {
  try {
    const response = await axios.get('/api/choreographies');
    const choreographies = response.data.choreographies;
    
    const choreoList = document.getElementById('choreographiesList');
    choreoList.innerHTML = choreographies.map(choreo => `
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
           onclick="viewChoreography(${choreo.id})">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">${choreo.name}</h3>
            <p class="text-gray-700 mb-3">${choreo.description || ''}</p>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <span><i class="fas fa-bars mr-1"></i>${choreo.total_bars} bars</span>
              <span><i class="fas fa-user mr-1"></i>${choreo.created_by}</span>
            </div>
          </div>
          <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <i class="fas fa-play mr-2"></i>Learn
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading choreographies:', error);
  }
}

// View choreography details
async function viewChoreography(choreoId) {
  try {
    const response = await axios.get(`/api/choreographies/${choreoId}`);
    const { choreography, moves } = response.data;
    
    // Show modal or navigate to choreography page
    alert(`Choreography: ${choreography.name}\n${moves.length} moves\n\nThis feature will be expanded in Phase 3!`);
  } catch (error) {
    console.error('Error loading choreography:', error);
  }
}

// Filter moves by category
async function filterMoves(category) {
  try {
    const response = await axios.get(`/api/moves/search?category=${category}`);
    const moves = response.data.moves;
    displayMoves(moves);
  } catch (error) {
    console.error('Error filtering moves:', error);
  }
}
