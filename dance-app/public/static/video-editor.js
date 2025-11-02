// Instagram-Style Mobile Video Editor
// Touch-optimized for smartphone editing

class DanceVideoEditor {
  constructor(videoElement, config = {}) {
    this.video = videoElement
    this.config = {
      bpm: config.bpm || 120,
      bars: config.bars || 4,
      ...config
    }
    
    this.selectedBars = [1, 2, 3, 4] // All bars selected by default
    this.mutedBars = []
    this.playbackSpeed = 1.0
    this.currentAudioTrack = null
    this.overlayConfig = {
      showCounts: true,
      showBodyParts: false,
      showRhythm: false
    }
    
    this.init()
  }
  
  init() {
    this.createEditorUI()
    this.setupVideoControls()
    this.setupTouchEvents()
  }
  
  // Create mobile-optimized editor UI
  createEditorUI() {
    const editorContainer = document.createElement('div')
    editorContainer.className = 'video-editor-container'
    editorContainer.innerHTML = `
      <!-- Bar Selection Timeline -->
      <div class="bar-timeline touch-scrollable">
        <div class="timeline-label">Select Bars:</div>
        <div class="bar-buttons" id="barButtons">
          ${this.generateBarButtons()}
        </div>
      </div>
      
      <!-- Playback Speed Control -->
      <div class="speed-control">
        <label>
          <i class="fas fa-gauge"></i> Speed
        </label>
        <div class="speed-buttons">
          <button class="speed-btn" data-speed="0.25">0.25x</button>
          <button class="speed-btn" data-speed="0.5">0.5x</button>
          <button class="speed-btn" data-speed="0.75">0.75x</button>
          <button class="speed-btn active" data-speed="1.0">1.0x</button>
        </div>
      </div>
      
      <!-- Learning Level Selector -->
      <div class="learning-level-selector">
        <label>
          <i class="fas fa-layer-group"></i> Focus
        </label>
        <div class="level-buttons">
          <button class="level-btn" data-level="1">
            <i class="fas fa-shoe-prints"></i>
            <span>Feet</span>
          </button>
          <button class="level-btn" data-level="2">
            <i class="fas fa-person"></i>
            <span>Body</span>
          </button>
          <button class="level-btn" data-level="3">
            <i class="fas fa-hands"></i>
            <span>Arms</span>
          </button>
          <button class="level-btn active" data-level="4">
            <i class="fas fa-fire"></i>
            <span>All</span>
          </button>
        </div>
      </div>
      
      <!-- Overlay Options -->
      <div class="overlay-controls">
        <label>
          <i class="fas fa-layer-group"></i> Overlay
        </label>
        <div class="overlay-toggles">
          <button class="toggle-btn active" data-overlay="counts">
            <i class="fas fa-hashtag"></i> Counts
          </button>
          <button class="toggle-btn" data-overlay="bodyparts">
            <i class="fas fa-user"></i> Body Parts
          </button>
          <button class="toggle-btn" data-overlay="rhythm">
            <i class="fas fa-music"></i> Rhythm
          </button>
        </div>
      </div>
      
      <!-- Audio Track Selector -->
      <div class="audio-selector">
        <label>
          <i class="fas fa-volume-high"></i> Audio
        </label>
        <select id="audioTrackSelect" class="audio-select">
          <option value="original">Original Sound</option>
          <option value="metronome">Practice Metronome</option>
          <option value="drum_pattern">AI Drum Pattern</option>
          <option value="mute">Muted</option>
        </select>
      </div>
      
      <!-- Bar Muting Switches -->
      <div class="bar-muting">
        <label>
          <i class="fas fa-volume-xmark"></i> Mute Bars
        </label>
        <div class="mute-switches" id="muteSwitches">
          ${this.generateMuteSwitches()}
        </div>
      </div>
      
      <!-- Export/Save Controls -->
      <div class="editor-actions">
        <button class="action-btn secondary" onclick="editor.saveSession()">
          <i class="fas fa-save"></i> Save
        </button>
        <button class="action-btn primary" onclick="editor.exportVideo()">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    `
    
    // Insert editor above video player
    this.video.parentElement.insertBefore(editorContainer, this.video)
    
    this.attachEventListeners()
  }
  
  generateBarButtons() {
    let html = ''
    for (let i = 1; i <= this.config.bars; i++) {
      html += `
        <button class="bar-btn active" data-bar="${i}">
          Bar ${i}
          <span class="bar-counts">1-8</span>
        </button>
      `
    }
    return html
  }
  
  generateMuteSwitches() {
    let html = ''
    for (let i = 1; i <= this.config.bars; i++) {
      html += `
        <label class="mute-switch">
          <input type="checkbox" data-bar="${i}">
          <span class="switch-slider"></span>
          <span class="switch-label">Bar ${i}</span>
        </label>
      `
    }
    return html
  }
  
  attachEventListeners() {
    // Bar selection
    document.querySelectorAll('.bar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.toggleBar(e.target.dataset.bar))
    })
    
    // Speed control
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.changeSpeed(parseFloat(e.target.dataset.speed)))
    })
    
    // Learning level
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.changeLearningLevel(parseInt(e.target.dataset.level)))
    })
    
    // Overlay toggles
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.toggleOverlay(e.target.dataset.overlay))
    })
    
    // Mute switches
    document.querySelectorAll('.mute-switch input').forEach(input => {
      input.addEventListener('change', (e) => this.toggleMute(e.target.dataset.bar, e.target.checked))
    })
    
    // Audio track selector
    document.getElementById('audioTrackSelect')?.addEventListener('change', (e) => {
      this.changeAudioTrack(e.target.value)
    })
  }
  
  setupVideoControls() {
    // Set initial playback rate
    this.video.playbackRate = this.playbackSpeed
    
    // Update video on time update
    this.video.addEventListener('timeupdate', () => {
      this.updateVideoDisplay()
    })
  }
  
  setupTouchEvents() {
    // Add touch-friendly scrubbing
    const timeline = document.querySelector('.bar-timeline')
    if (!timeline) return
    
    let isScrubbing = false
    
    timeline.addEventListener('touchstart', (e) => {
      isScrubbing = true
    })
    
    timeline.addEventListener('touchmove', (e) => {
      if (!isScrubbing) return
      e.preventDefault()
      
      const touch = e.touches[0]
      const rect = timeline.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const percentage = x / rect.width
      
      this.video.currentTime = this.video.duration * percentage
    })
    
    timeline.addEventListener('touchend', () => {
      isScrubbing = false
    })
  }
  
  // Bar selection
  toggleBar(barNumber) {
    const bar = parseInt(barNumber)
    const btn = document.querySelector(`.bar-btn[data-bar="${bar}"]`)
    
    if (this.selectedBars.includes(bar)) {
      this.selectedBars = this.selectedBars.filter(b => b !== bar)
      btn.classList.remove('active')
    } else {
      this.selectedBars.push(bar)
      this.selectedBars.sort((a, b) => a - b)
      btn.classList.add('active')
    }
    
    this.updateVideoSegments()
  }
  
  // Playback speed
  changeSpeed(speed) {
    this.playbackSpeed = speed
    this.video.playbackRate = speed
    
    // Update UI
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed)
    })
    
    console.log(`Playback speed: ${speed}x`)
  }
  
  // Learning level (progressive learning)
  async changeLearningLevel(level) {
    this.currentLearningLevel = level
    
    // Update UI
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.level) === level)
    })
    
    // Load moves for this level from API
    try {
      const response = await axios.get(`/api/moves/level/${level}`)
      const moves = response.data.moves
      
      // Update visible bars based on learning level
      const relevantBars = [...new Set(moves.map(m => m.bar_number))]
      this.selectedBars = relevantBars
      
      // Update bar buttons
      document.querySelectorAll('.bar-btn').forEach(btn => {
        const bar = parseInt(btn.dataset.bar)
        btn.classList.toggle('active', relevantBars.includes(bar))
      })
      
      this.updateVideoSegments()
      
      console.log(`Learning level ${level}: ${moves.length} moves`)
    } catch (error) {
      console.error('Error loading learning level:', error)
    }
  }
  
  // Overlay toggles
  toggleOverlay(overlayType) {
    const btn = document.querySelector(`.toggle-btn[data-overlay="${overlayType}"]`)
    
    switch(overlayType) {
      case 'counts':
        this.overlayConfig.showCounts = !this.overlayConfig.showCounts
        break
      case 'bodyparts':
        this.overlayConfig.showBodyParts = !this.overlayConfig.showBodyParts
        break
      case 'rhythm':
        this.overlayConfig.showRhythm = !this.overlayConfig.showRhythm
        break
    }
    
    btn.classList.toggle('active')
    this.updateOverlays()
  }
  
  // Bar muting
  toggleMute(barNumber, isMuted) {
    const bar = parseInt(barNumber)
    
    if (isMuted) {
      if (!this.mutedBars.includes(bar)) {
        this.mutedBars.push(bar)
      }
    } else {
      this.mutedBars = this.mutedBars.filter(b => b !== bar)
    }
    
    console.log(`Bar ${bar} ${isMuted ? 'muted' : 'unmuted'}`)
  }
  
  // Audio track switching
  changeAudioTrack(trackType) {
    this.currentAudioTrack = trackType
    
    // TODO: Implement audio track switching
    // For now, just mute/unmute video
    if (trackType === 'mute') {
      this.video.muted = true
    } else {
      this.video.muted = false
    }
    
    console.log(`Audio track: ${trackType}`)
  }
  
  // Update video display based on current settings
  updateVideoDisplay() {
    const currentTime = this.video.currentTime * 1000 // ms
    const msPerBeat = (60 / this.config.bpm) * 1000
    const msPerBar = msPerBeat * 8
    
    const currentBar = Math.floor(currentTime / msPerBar) + 1
    
    // Check if current bar should be visible
    if (!this.selectedBars.includes(currentBar) && !this.video.paused) {
      // Skip to next visible bar
      const nextBar = this.selectedBars.find(b => b > currentBar)
      if (nextBar) {
        this.video.currentTime = ((nextBar - 1) * msPerBar) / 1000
      } else {
        // No more visible bars, loop to first
        this.video.currentTime = ((this.selectedBars[0] - 1) * msPerBar) / 1000
      }
    }
    
    // Check if bar is muted
    if (this.mutedBars.includes(currentBar)) {
      this.video.volume = 0
    } else if (!this.video.muted) {
      this.video.volume = 1
    }
  }
  
  updateVideoSegments() {
    // Visual feedback for selected bars
    console.log('Selected bars:', this.selectedBars)
  }
  
  updateOverlays() {
    // Update overlay display
    const overlayContainer = document.getElementById('videoOverlay')
    if (!overlayContainer) return
    
    let overlayHTML = ''
    
    if (this.overlayConfig.showCounts) {
      overlayHTML += '<div class="count-overlay"></div>'
    }
    
    if (this.overlayConfig.showBodyParts) {
      overlayHTML += '<div class="bodypart-overlay"></div>'
    }
    
    if (this.overlayConfig.showRhythm) {
      overlayHTML += '<div class="rhythm-overlay"></div>'
    }
    
    overlayContainer.innerHTML = overlayHTML
  }
  
  // Save session
  async saveSession() {
    const sessionData = {
      video_id: 1, // TODO: Get from context
      session_name: `Edit ${new Date().toISOString()}`,
      selected_bars: this.selectedBars,
      playback_speed: this.playbackSpeed,
      overlay_config: this.overlayConfig
    }
    
    try {
      const response = await axios.post('/api/edit-sessions', sessionData)
      alert(`Session saved! ID: ${response.data.id}`)
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Failed to save session')
    }
  }
  
  // Export video
  exportVideo() {
    alert(`Export functionality:
    
Selected Bars: ${this.selectedBars.join(', ')}
Muted Bars: ${this.mutedBars.join(', ') || 'None'}
Playback Speed: ${this.playbackSpeed}x
Audio Track: ${this.currentAudioTrack || 'Original'}

This would export a video with only the selected bars at the chosen speed.
Future implementation will use server-side video processing or client-side canvas recording.`)
  }
}

// Initialize editor when video is loaded
window.initVideoEditor = function(videoElement, config) {
  return new DanceVideoEditor(videoElement, config)
}
