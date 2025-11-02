// Move Lyrics - Beat-by-beat movement instructions (like Karaoke for dancing)
// Patent-pending concept: Real-time synchronized movement instructions

class MoveLyrics {
  constructor(videoElement, config = {}) {
    this.video = videoElement
    this.config = {
      bpm: config.bpm || 120,
      detailLevel: config.detailLevel || 'standard', // simple, standard, detailed
      style: config.style || 'guitar-hero', // guitar-hero, side-by-side, overlay
      showBodyParts: config.showBodyParts !== false,
      showTips: config.showTips || false,
      previewBeats: config.previewBeats || 2,
      ...config
    }
    
    this.lyrics = []
    this.currentBeatIndex = -1
    this.container = null
    
    this.init()
  }
  
  init() {
    this.createLyricsContainer()
    this.setupVideoSync()
  }
  
  // Create the lyrics display container
  createLyricsContainer() {
    const container = document.createElement('div')
    container.className = `move-lyrics-container style-${this.config.style}`
    container.id = 'moveLyricsContainer'
    
    if (this.config.style === 'guitar-hero') {
      container.innerHTML = `
        <div class="lyrics-header">
          <i class="fas fa-music"></i>
          <span>Move Lyrics</span>
          <button class="lyrics-settings-btn" onclick="moveLyrics.showSettings()">
            <i class="fas fa-cog"></i>
          </button>
        </div>
        
        <div class="lyrics-scroll-container" id="lyricsScroll">
          <div class="lyrics-track" id="lyricsTrack">
            <!-- Lyrics will be inserted here -->
          </div>
        </div>
        
        <div class="lyrics-preview">
          <div class="preview-label">Next Move:</div>
          <div class="preview-text" id="previewText">Loading...</div>
        </div>
      `
    } else if (this.config.style === 'overlay') {
      container.innerHTML = `
        <div class="lyrics-overlay-top" id="lyricsOverlayTop">
          <div class="overlay-instruction"></div>
        </div>
        <div class="lyrics-overlay-bottom" id="lyricsOverlayBottom">
          <div class="overlay-next"></div>
        </div>
      `
    }
    
    // Insert after video player
    this.video.parentElement.insertBefore(container, this.video.nextSibling)
    this.container = container
  }
  
  // Load lyrics from API
  async loadLyrics(videoId) {
    try {
      const response = await axios.get(`/api/videos/${videoId}/lyrics`)
      this.lyrics = response.data.lyrics || []
      this.renderLyrics()
    } catch (error) {
      console.error('Error loading lyrics:', error)
      // Use sample data for demo
      this.lyrics = this.generateSampleLyrics()
      this.renderLyrics()
    }
  }
  
  // Generate sample lyrics for demo
  generateSampleLyrics() {
    const sampleLyrics = []
    const beats = [
      {
        beat: 1, 
        instruction: "Tiefer Bounce aus den Knien",
        torso: "Bounce aus den Knien",
        arms: "Locker schwingen",
        tip: "Der Groove kommt aus den Knien!"
      },
      {
        beat: 2,
        instruction: "Gewicht nach rechts verlagern",
        torso: "Smoother Lean nach rechts",
        arms: "Schwingt vor dem Körper",
        tip: "Schultern führen die Bewegung"
      },
      {
        beat: 3,
        instruction: "Dynamischer Lean nach links",
        torso: "Starker Lean nach links",
        arms: "Offener Whip nach außen",
        tip: "Braucht solide Basis!"
      },
      {
        beat: 4,
        instruction: "Zurück zur Mitte sammeln",
        torso: "Reset für nächsten Hit",
        arms: "Sauber zur Brust",
        tip: "Hände sind scharf, nicht schlaff"
      },
      {
        beat: 5,
        instruction: "Breiter Stand, 2000er Vibe",
        torso: "Tiefer Groove, bereit",
        arms: "V-Pose, Ellenbogen führen",
        tip: "Symmetrisch, sehr Pop!"
      },
      {
        beat: 6,
        instruction: "Der Hero-Shot, Poster-Pose",
        torso: "Volle Star-Power",
        arms: "Point nach oben - Hit me!",
        tip: "Kamera ist auf dich gerichtet"
      },
      {
        beat: 7,
        instruction: "Entspannter Groove zurück",
        torso: "Lockerer Bounce",
        arms: "Wird wieder weich",
        tip: "Die Show ist fast vorbei"
      },
      {
        beat: 8,
        instruction: "Cooler Ausklang",
        torso: "Bounce klingt aus",
        arms: "Kommt zur Ruhe",
        tip: "Lächeln für die Kamera!"
      }
    ]
    
    const msPerBeat = (60 / this.config.bpm) * 1000
    
    sampleLyrics.push(...beats.map((beat, index) => ({
      beat_number: beat.beat,
      absolute_beat: index + 1,
      timestamp_ms: index * msPerBeat,
      instruction: beat.instruction,
      torso_action: beat.torso,
      right_arm_action: beat.arms,
      tip: beat.tip,
      energy_level: [3, 6].includes(beat.beat) ? 'high' : 'medium'
    })))
    
    return sampleLyrics
  }
  
  // Render lyrics in the container
  renderLyrics() {
    if (this.config.style === 'guitar-hero') {
      this.renderGuitarHeroStyle()
    } else if (this.config.style === 'overlay') {
      // Overlay style updates in real-time, no pre-rendering needed
    }
  }
  
  renderGuitarHeroStyle() {
    const track = document.getElementById('lyricsTrack')
    if (!track) return
    
    track.innerHTML = this.lyrics.map((lyric, index) => `
      <div class="lyric-item" 
           data-beat="${lyric.beat_number}" 
           data-index="${index}"
           data-timestamp="${lyric.timestamp_ms}">
        <div class="lyric-beat-marker">
          <span class="beat-number">${lyric.beat_number}</span>
        </div>
        <div class="lyric-content">
          <div class="lyric-main">${lyric.instruction}</div>
          ${this.config.showBodyParts ? `
            <div class="lyric-details">
              ${lyric.torso_action ? `<div class="detail-item"><i class="fas fa-person"></i> ${lyric.torso_action}</div>` : ''}
              ${lyric.right_arm_action ? `<div class="detail-item"><i class="fas fa-hand"></i> ${lyric.right_arm_action}</div>` : ''}
            </div>
          ` : ''}
          ${this.config.showTips && lyric.tip ? `
            <div class="lyric-tip">
              <i class="fas fa-lightbulb"></i> ${lyric.tip}
            </div>
          ` : ''}
        </div>
        <div class="lyric-energy ${lyric.energy_level}"></div>
      </div>
    `).join('')
  }
  
  // Setup video synchronization
  setupVideoSync() {
    this.video.addEventListener('timeupdate', () => {
      this.updateLyrics()
    })
    
    this.video.addEventListener('play', () => {
      this.container?.classList.add('playing')
    })
    
    this.video.addEventListener('pause', () => {
      this.container?.classList.remove('playing')
    })
  }
  
  // Update lyrics based on current video time
  updateLyrics() {
    const currentTime = this.video.currentTime * 1000 // ms
    
    // Find current lyric
    let newBeatIndex = -1
    for (let i = 0; i < this.lyrics.length; i++) {
      if (currentTime >= this.lyrics[i].timestamp_ms) {
        newBeatIndex = i
      } else {
        break
      }
    }
    
    // Beat changed
    if (newBeatIndex !== this.currentBeatIndex) {
      this.currentBeatIndex = newBeatIndex
      this.highlightCurrentBeat()
      this.updatePreview()
      
      if (this.config.style === 'overlay') {
        this.updateOverlay()
      }
    }
  }
  
  // Highlight the current beat (Guitar Hero style)
  highlightCurrentBeat() {
    const track = document.getElementById('lyricsTrack')
    if (!track) return
    
    // Remove previous highlights
    track.querySelectorAll('.lyric-item').forEach(item => {
      item.classList.remove('current', 'past', 'upcoming')
    })
    
    // Add new highlights
    const items = track.querySelectorAll('.lyric-item')
    items.forEach((item, index) => {
      if (index < this.currentBeatIndex) {
        item.classList.add('past')
      } else if (index === this.currentBeatIndex) {
        item.classList.add('current')
      } else if (index <= this.currentBeatIndex + this.config.previewBeats) {
        item.classList.add('upcoming')
      }
    })
    
    // Scroll to current beat (Guitar Hero effect)
    const currentItem = items[this.currentBeatIndex]
    if (currentItem) {
      currentItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }
  
  // Update preview text
  updatePreview() {
    const previewText = document.getElementById('previewText')
    if (!previewText) return
    
    const nextBeat = this.lyrics[this.currentBeatIndex + 1]
    if (nextBeat) {
      previewText.textContent = nextBeat.instruction
    } else {
      previewText.textContent = 'Sequence complete! 🎉'
    }
  }
  
  // Update overlay display
  updateOverlay() {
    const overlayTop = document.querySelector('#lyricsOverlayTop .overlay-instruction')
    const overlayBottom = document.querySelector('#lyricsOverlayBottom .overlay-next')
    
    if (!overlayTop || !overlayBottom) return
    
    const currentLyric = this.lyrics[this.currentBeatIndex]
    const nextLyric = this.lyrics[this.currentBeatIndex + 1]
    
    if (currentLyric) {
      overlayTop.innerHTML = `
        <div class="overlay-beat">Beat ${currentLyric.beat_number}</div>
        <div class="overlay-main">${currentLyric.instruction}</div>
        ${currentLyric.torso_action ? `
          <div class="overlay-detail">👤 ${currentLyric.torso_action}</div>
        ` : ''}
      `
      
      // Fade in animation
      overlayTop.style.opacity = '0'
      setTimeout(() => overlayTop.style.opacity = '1', 50)
    }
    
    if (nextLyric) {
      overlayBottom.innerHTML = `
        <div class="overlay-next-label">Next:</div>
        <div class="overlay-next-text">${nextLyric.instruction}</div>
      `
    }
  }
  
  // Show settings panel
  showSettings() {
    alert(`Move Lyrics Settings:
    
Detail Level: ${this.config.detailLevel}
Style: ${this.config.style}
Show Body Parts: ${this.config.showBodyParts}
Show Tips: ${this.config.showTips}

Settings UI coming soon!`)
  }
  
  // Jump to specific beat
  jumpToBeat(beatNumber) {
    const lyric = this.lyrics.find(l => l.beat_number === beatNumber)
    if (lyric) {
      this.video.currentTime = lyric.timestamp_ms / 1000
    }
  }
  
  // Change detail level
  setDetailLevel(level) {
    this.config.detailLevel = level
    
    switch(level) {
      case 'simple':
        this.config.showBodyParts = false
        this.config.showTips = false
        break
      case 'standard':
        this.config.showBodyParts = true
        this.config.showTips = false
        break
      case 'detailed':
        this.config.showBodyParts = true
        this.config.showTips = true
        break
    }
    
    this.renderLyrics()
  }
  
  // Export lyrics as text
  exportLyrics() {
    const text = this.lyrics.map(l => 
      `Beat ${l.beat_number}: ${l.instruction}\n` +
      (l.torso_action ? `  Torso: ${l.torso_action}\n` : '') +
      (l.right_arm_action ? `  Arms: ${l.right_arm_action}\n` : '') +
      (l.tip ? `  Tip: ${l.tip}\n` : '')
    ).join('\n')
    
    // Create downloadable file
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'move-lyrics.txt'
    a.click()
  }
}

// Initialize Move Lyrics
window.initMoveLyrics = function(videoElement, config) {
  return new MoveLyrics(videoElement, config)
}

// Auto-initialize if video element exists
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('danceVideo')
  if (video && typeof MoveLyrics !== 'undefined') {
    window.moveLyrics = new MoveLyrics(video, {
      bpm: 120,
      style: 'guitar-hero',
      detailLevel: 'standard'
    })
    
    // Load lyrics for video 1
    window.moveLyrics.loadLyrics(1)
  }
})
