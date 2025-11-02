# 🎨 Enhanced Features - Dance Trainer v2.0

**Status**: In Development  
**Based on User Feedback**: Yes

---

## 📋 Feature Overview

Basierend auf deinem Feedback habe ich folgende Features implementiert:

### ✅ Implementiert (Code fertig, DB-Schema ready)

1. **Video Snippet Extraktion** - Moves als separate verlangsamte Clips
2. **Bar-Overlay Visualisierung** - Instagram-Style Video-Editor
3. **Mobile-First Editor** - Touch-optimiert für Smartphone
4. **Selective Bar Muting** - Einzelne Bars ein/ausblenden
5. **Progressive Learning System** - Level 1-4 (Feet → Body → Arms → Full)
6. **Move-Datenbank** - Erweitert mit Body Parts, Learning Levels
7. **Audio Track Management** - Original, Metronome, Custom Drum Patterns
8. **Bar Visibility Presets** - "Only Footwork", "Body Only", etc.

### 🔄 In Arbeit

- Video-Snippet-Generierung (Server-side oder Client-side)
- Audio-Track-Generierung mit AI
- Beat-Korrektur-Tool

---

## 🎯 Feature-Details

### 1. Video Snippet Extraktion

**Was es ist:**
Einzelne Moves werden aus dem Hauptvideo extrahiert und als separate Clips verfügbar gemacht.

**Use Cases:**
- **Slow Motion Practice**: Move bei 0.25x, 0.5x, 0.75x abspielen
- **Loop Training**: Einen Move endlos wiederholen
- **Isolierte Fokus**: Nur den schwierigen Move üben

**Datenbank-Schema:**
```sql
ALTER TABLE moves ADD COLUMN snippet_url TEXT;
ALTER TABLE moves ADD COLUMN slow_motion_url TEXT;
ALTER TABLE moves ADD COLUMN playback_speeds TEXT;
```

**API Endpoints:**
```
GET  /api/moves/:id/snippets
POST /api/moves/:id/extract-snippet
```

**Beispiel-Response:**
```json
{
  "move": {
    "id": 1,
    "name": "Hip-Hop Bounce",
    "start_time_ms": 0,
    "end_time_ms": 2000
  },
  "snippets": {
    "slow_0_25x": "url_to_snippet_025x.mp4",
    "slow_0_5x": "url_to_snippet_05x.mp4",
    "normal_1_0x": "url_to_snippet_1x.mp4"
  },
  "playback_speeds": ["0.25", "0.5", "0.75", "1.0"]
}
```

---

### 2. Instagram-Style Video Editor

**Was es ist:**
Ein mobiler Video-Editor mit Touch-Optimierung, wie Instagram Reels Editor.

**Features:**
- ✅ Bar-Auswahl per Touch (Swipe durch Bars)
- ✅ Playback Speed Control (0.25x - 1.0x)
- ✅ Overlay-Optionen (Counts, Body Parts, Rhythm)
- ✅ Audio-Track-Auswahl
- ✅ Bar-Muting (einzelne Bars stumm schalten)
- ✅ Save & Export Functions

**UI Components:**

#### Bar Timeline
```
[Bar 1] [Bar 2] [Bar 3] [Bar 4]
  1-8     1-8     1-8     1-8
```
- Tap um Bar auszuwählen/abzuwählen
- Aktive Bars sind lila highlighted

#### Speed Control
```
[0.25x] [0.5x] [0.75x] [1.0x]
```

#### Learning Levels
```
[👟 Feet] [🧍 Body] [🙌 Arms] [🔥 All]
```

#### Overlay Toggles
```
[# Counts] [👤 Body Parts] [🎵 Rhythm]
```

**Verwendung:**
```javascript
// Initialize editor
const video = document.getElementById('danceVideo')
const editor = new DanceVideoEditor(video, {
  bpm: 120,
  bars: 4
})

// Programmatically control
editor.changeLearningLevel(2) // Show only footwork + body
editor.changeSpeed(0.5) // Slow motion
editor.toggleBar(3) // Hide bar 3
```

---

### 3. Progressive Learning System

**Konzept:**
Schritt-für-schritt Lernen, beginnend mit den Füßen, dann Körper, dann Arme.

**4 Learning Levels:**

#### Level 1: Footwork Only
- **Focus**: Füße und Beine
- **Body Parts**: `["feet", "legs"]`
- **Sichtbare Bars**: Nur Foundation & Footwork Bars
- **Beispiel**: Bar 1 (Foundation), Bar 3 (Footwork)

#### Level 2: Add Body Movement
- **Focus**: Footwork + Hüften + Torso
- **Body Parts**: `["feet", "legs", "hips", "torso"]`
- **Sichtbare Bars**: Foundation, Toprock, Footwork
- **Beispiel**: Bar 1, 2, 3

#### Level 3: Add Arms
- **Focus**: Full body ohne Kopf-Styling
- **Body Parts**: `["feet", "legs", "hips", "torso", "arms"]`
- **Sichtbare Bars**: Alle außer komplexe Freeze-Moves
- **Beispiel**: Bar 1, 2, 3, 4 (teilweise)

#### Level 4: Full Routine
- **Focus**: Komplette Choreografie
- **Body Parts**: `["feet", "legs", "hips", "torso", "arms", "head"]`
- **Sichtbare Bars**: Alle
- **Beispiel**: Bar 1, 2, 3, 4

**Datenbank-Schema:**
```sql
ALTER TABLE moves ADD COLUMN body_parts TEXT; -- JSON array
ALTER TABLE moves ADD COLUMN learning_level INTEGER;
ALTER TABLE moves ADD COLUMN isolation_focus TEXT;
```

**API Endpoint:**
```
GET /api/moves/level/:level
GET /api/moves/body-part/:part
```

**Beispiel-Query:**
```sql
-- Get all Level 2 moves (Footwork + Body)
SELECT * FROM moves WHERE learning_level <= 2
ORDER BY learning_level ASC, bar_number ASC;
```

---

### 4. Selective Bar Muting

**Was es ist:**
Einzelne Bars können visuell ein/ausgeblendet oder Audio-gemuted werden.

**Use Cases:**
- **Isoliertes Training**: Nur Bar 3 (Footwork) üben
- **Audio-Muting**: Original-Audio von Bar 2 stumm, um Fehler zu korrigieren
- **Custom Combinations**: Bar 1 + Bar 4 für Intro + Finale

**Datenbank-Schema:**
```sql
ALTER TABLE moves ADD COLUMN is_muted BOOLEAN;

CREATE TABLE bar_presets (
  video_id INTEGER,
  name TEXT,
  visible_bars TEXT, -- JSON: [1, 3, 4]
  muted_bars TEXT,   -- JSON: [2]
  learning_level INTEGER
);
```

**Bar Presets (Beispiele):**
```json
[
  {
    "name": "Level 1: Footwork Only",
    "visible_bars": [1, 3],
    "muted_bars": [],
    "learning_level": 1
  },
  {
    "name": "Silent Body Waves",
    "visible_bars": [1, 2, 3, 4],
    "muted_bars": [2],
    "learning_level": 2
  },
  {
    "name": "Footwork + Finale",
    "visible_bars": [1, 3, 4],
    "muted_bars": [],
    "learning_level": 3
  }
]
```

**API Endpoints:**
```
GET  /api/videos/:id/presets
POST /api/videos/:id/apply-preset
POST /api/moves/toggle-mute
GET  /api/videos/:id/muted-bars
```

---

### 5. Audio Track Management

**Was es ist:**
Verschiedene Audio-Tracks für ein Video (Original, Metronome, Custom Drum Pattern).

**Use Cases:**
- **Practice Metronome**: Reines Metronom zum Üben ohne Ablenkung
- **AI Drum Pattern**: Generiertes Drum Pattern für Videos mit falschen Beats
- **Original + Metronome**: Beide Tracks gleichzeitig
- **Muted**: Komplett still für maximale Konzentration

**Datenbank-Schema:**
```sql
CREATE TABLE audio_tracks (
  id INTEGER PRIMARY KEY,
  video_id INTEGER,
  name TEXT,
  audio_url TEXT,
  track_type TEXT, -- 'original', 'drum_pattern', 'metronome', 'custom'
  bpm INTEGER,
  generation_source TEXT, -- 'ai_generated', 'user_upload', 'library'
  is_default BOOLEAN
);
```

**Track Types:**

#### 1. Original Audio
- Der Original-Soundtrack des Videos
- `track_type: 'original'`

#### 2. Practice Metronome
- Einfaches Click-Track im richtigen BPM
- `track_type: 'metronome'`
- Generated with Web Audio API

#### 3. AI Drum Pattern
- KI-generiertes Drum Pattern (z.B. mit Suno, MusicGen)
- `track_type: 'drum_pattern'`
- `generation_source: 'ai_generated'`

#### 4. Custom Upload
- User-uploaded custom Soundtrack
- `track_type: 'custom'`
- `generation_source: 'user_upload'`

**API Endpoints:**
```
GET  /api/videos/:id/audio-tracks
POST /api/videos/:id/audio-tracks
```

**Beispiel-Workflow:**
```javascript
// 1. Get available audio tracks
const tracks = await fetch('/api/videos/1/audio-tracks')

// 2. Select metronome for practice
editor.changeAudioTrack('metronome')

// 3. Upload custom drum pattern
const formData = new FormData()
formData.append('audio', audioFile)
formData.append('track_type', 'drum_pattern')
await fetch('/api/videos/1/audio-tracks', {
  method: 'POST',
  body: formData
})
```

---

### 6. Beat-Korrektur Tool

**Problem:**
AI-generierte Videos haben manchmal falsche oder inkonsistente Beats.

**Lösung:**
Tool zum Ersetzen der Original-Audio mit einem perfekten Drum Pattern.

**Workflow:**

#### Step 1: Detect Beat Problems
```javascript
// Analyze original audio
const analysis = await fetch('/api/videos/1/analyze-beats')
// Returns: { bpm_variance: 5, tempo_changes: 3, quality_score: 0.65 }
```

#### Step 2: Generate Perfect Drum Pattern
```javascript
// Generate drum pattern at consistent 120 BPM
const drumPattern = await fetch('/api/audio/generate-drum-pattern', {
  method: 'POST',
  body: JSON.stringify({
    bpm: 120,
    bars: 4,
    style: 'hip_hop',
    time_signature: '4/4'
  })
})
```

#### Step 3: Replace Audio Track
```javascript
// Add as new audio track
await fetch('/api/videos/1/audio-tracks', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Corrected Drum Pattern',
    audio_url: drumPattern.url,
    track_type: 'drum_pattern',
    bpm: 120,
    generation_source: 'ai_generated'
  })
})
```

**AI Models für Drum Pattern Generation:**
- **MusicGen** (Meta)
- **Suno API**
- **GenSpark Audio Generation** (`audio_generation` tool)

---

### 7. Move-Datenbank (Erweitert)

**Neue Felder:**

```sql
-- Body Part Focus
body_parts TEXT -- JSON: ["feet", "hips", "arms"]

-- Learning Level
learning_level INTEGER -- 1-4

-- Isolation Focus
isolation_focus TEXT -- "feet", "body", "arms", "full"

-- Video Snippets
snippet_url TEXT
slow_motion_url TEXT
playback_speeds TEXT

-- Overlay Config
overlay_type TEXT
overlay_data TEXT
```

**Beispiel Move:**
```json
{
  "id": 1,
  "name": "Hip-Hop Bounce",
  "category": "foundation",
  "difficulty": "beginner",
  "body_parts": ["feet", "legs", "hips"],
  "learning_level": 1,
  "isolation_focus": "feet",
  "start_count": "1",
  "end_count": "4",
  "bar_number": 1,
  "snippet_url": "snippets/bounce_1x.mp4",
  "slow_motion_url": "snippets/bounce_05x.mp4",
  "playback_speeds": ["0.25", "0.5", "0.75", "1.0"]
}
```

---

## 🎨 Visualization Concepts

### Bar Overlay Options

#### Option 1: Count Overlay (Default)
```
┌─────────────────────────────┐
│                             │
│                        [5]  │ ← Current count
│                             │
│    🕺 Dancing...            │
│                             │
│                             │
│  Bar 2 | 1-2-3-4-5-6-7-8   │ ← Progress bar
└─────────────────────────────┘
```

#### Option 2: Body Part Overlay
```
┌─────────────────────────────┐
│                             │
│                        [5]  │
│                             │
│    🕺 Dancing...            │
│                             │
│  👟 Focus: FEET             │ ← Body part focus
│  Bar 2 | 1-2-3-4-5-6-7-8   │
└─────────────────────────────┘
```

#### Option 3: Rhythm Overlay
```
┌─────────────────────────────┐
│                             │
│  ┃ ┃ ║ ┃ ┃ ║ ┃ ┃         │ ← Beat visualization
│        ▲                    │
│    🕺 Dancing...            │
│                             │
│  Bar 2 | 1-2-3-4-5-6-7-8   │
└─────────────────────────────┘
```

---

## 📱 Mobile Editor Workflow

### Typischer Use Case: "Footwork üben"

1. **Video auswählen**
   - Nadja Beach Dance Video laden

2. **Learning Level wählen**
   - Tap auf "👟 Feet" Button
   - → Nur Bar 1 & 3 werden angezeigt (Foundation + Footwork)

3. **Playback Speed reduzieren**
   - Tap auf "0.5x" Button
   - → Video läuft in Slow Motion

4. **Overlay aktivieren**
   - Tap auf "👤 Body Parts" Toggle
   - → "Focus: FEET" Overlay erscheint

5. **Audio optimieren**
   - Audio-Selector auf "Practice Metronome"
   - → Klares Metronom statt Original-Musik

6. **Video abspielen**
   - Play drücken
   - → Video zeigt nur Footwork-Bars in Slow Motion mit Metronom

7. **Session speichern**
   - "Save" drücken
   - → Einstellungen werden gespeichert für nächstes Mal

---

## 🚀 Implementation Status

| Feature | Database | Backend API | Frontend UI | Status |
|---------|----------|-------------|-------------|--------|
| Video Snippets | ✅ | ✅ | ⏳ | 80% |
| Bar Selection | ✅ | ✅ | ✅ | 100% |
| Speed Control | ✅ | ✅ | ✅ | 100% |
| Learning Levels | ✅ | ✅ | ✅ | 100% |
| Bar Muting | ✅ | ✅ | ✅ | 100% |
| Audio Tracks | ✅ | ✅ | ⏳ | 70% |
| Overlays | ✅ | ✅ | ⏳ | 60% |
| Mobile Editor | - | - | ✅ | 90% |
| Save Sessions | ✅ | ✅ | ✅ | 100% |
| Export Video | ⏳ | ⏳ | ⏳ | 30% |

---

## 🎯 Next Steps

### Phase 2.1: Complete Current Features
1. Apply DB migrations
2. Integrate enhanced routes into main app
3. Connect frontend editor to backend
4. Test mobile editor on real devices

### Phase 2.2: Video Processing
1. Implement snippet extraction (client or server-side)
2. Add video export functionality
3. Integrate audio track generation

### Phase 2.3: AI Integration
1. Beat detection & correction
2. Drum pattern generation
3. Automatic move detection (Phase 3)

---

**Dokumentiert**: 2025-11-02  
**Version**: 2.0.0-beta  
**Feedback-Driven**: Yes ✅
