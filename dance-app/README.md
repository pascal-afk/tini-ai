# 🎵 Hip-Hop Dance Trainer

**Learn Hip-Hop dance moves with Nadja - Beat-by-beat analysis with 4/4 time signature**

Ein innovativer Dance Trainer, der Tanzvideos analysiert, in einzelne Moves zerlegt und im 4/4-Takt erklärt. Entwickelt für die Tanzerin Nadja (@tini.aii), um Hip-Hop Choreografien zu lehren.

## 🌟 Live Demo

- **Development**: https://3000-iemkear06dg9s9khcgzl8-c81df28e.sandbox.novita.ai
- **GitHub**: https://github.com/pascal-afk/tini-ai (feature/dance-trainer branch)

## ✨ Hauptfeatures

### ✅ Phase 1: MVP - Bereits implementiert

#### 🎬 Video-Analyse Engine
- **D1 Datenbank** für Videos, Moves und Choreografien
- **RESTful API** mit Hono Framework
- **8-Count Breakdown** - Jeder Move ist einem 4/4-Takt zugeordnet
- **Move-Kategorien**: Foundation, Toprock, Footwork, Freeze, Power
- **Difficulty Levels**: Beginner, Intermediate, Advanced

#### 🎯 Interaktiver Video Player
- **Beat Counter** - Live 8-Count Anzeige (1-2-3-4-5-6-7-8)
- **Bar Tracking** - Zeigt aktuellen Bar/Takt an
- **Auto-Highlight** - Aktiver Move wird während der Wiedergabe hervorgehoben
- **Jump-to-Move** - Direkt zu einem bestimmten Move springen
- **BPM-Synchronisation** - Beat Counter synchronisiert mit Video BPM

#### 📊 Move-Breakdown
- **Detaillierte Beschreibungen** für jeden Move
- **Timing-Informationen** - Start/End Count und Zeit in Millisekunden
- **Visuelle Organisation** - Moves gruppiert nach Bars
- **Kategorisierung** - Nach Schwierigkeit und Stil gefiltert

#### 🔥 Choreografie-System
- **Fertige Choreografien** - Vordefinierte Tanzabläufe
- **Move-Kombinationen** - Mehrere Moves zu einer Sequenz verbunden
- **Community-Ready** - Basis für spätere User-Generated-Content

### ⏳ Phase 2: Multi-Source Integration (Geplant)
- 📱 **Instagram Integration** - Automatischer Import von @tini.aii Posts
- 🎥 **YouTube Integration** - Video-Analyse von YouTube-Links
- 🤖 **AI Video Analysis** - Automatische Move-Erkennung mit Computer Vision
- 🎵 **Audio Analysis** - BPM und Beat-Detection aus Audio-Track

### ⏳ Phase 3: Community Dance Builder (Geplant)
- 🎨 **Custom Choreografien** - User können eigene Tanzabläufe erstellen
- 🎬 **AI Video Generation** - KI erstellt Videos aus ausgewählten Moves
- 👥 **Community Features** - Teilen, Liken, Kommentieren
- 🏆 **Leaderboard** - Rankings und Challenges

## 🏗️ Tech Stack

### Backend
- **Hono** - Lightweight Web Framework für Cloudflare Workers
- **Cloudflare D1** - Serverless SQLite Database
- **Cloudflare Pages** - Edge Deployment Platform
- **TypeScript** - Type-safe Development

### Frontend
- **Vanilla JavaScript** - Keine Framework-Dependencies
- **TailwindCSS** - Utility-first CSS via CDN
- **FontAwesome** - Icons
- **Axios** - HTTP Client

### Development
- **Vite** - Build Tool
- **Wrangler** - Cloudflare CLI
- **PM2** - Process Manager für Development

## 📁 Projektstruktur

```
dance-app/
├── src/
│   ├── index.tsx           # Hono Backend mit API Routes
│   └── renderer.tsx        # SSR Renderer (falls benötigt)
├── public/
│   └── static/
│       └── app.js          # Frontend JavaScript
├── migrations/
│   └── 0001_initial_schema.sql  # D1 Database Schema
├── seed.sql                # Test-Daten
├── wrangler.jsonc          # Cloudflare Configuration
├── ecosystem.config.cjs    # PM2 Configuration
├── package.json            # Dependencies & Scripts
└── README.md               # Diese Datei
```

## 🎯 API Endpoints

### Videos
```
GET  /api/videos           # Liste aller Videos
GET  /api/videos/:id       # Video mit allen Moves
GET  /api/videos/:id/moves # Moves gruppiert nach Bars
```

### Moves
```
GET  /api/moves/search?category=foundation&difficulty=beginner
```

### Choreografien
```
GET  /api/choreographies       # Liste aller Choreografien
GET  /api/choreographies/:id  # Choreografie mit Moves
```

## 🎵 4/4 Takt & 8-Count System

### Musik-Theorie Basics
- **Time Signature**: 4/4 (4 beats pro bar, quarter note = 1 beat)
- **Hip-Hop Zählung**: 8 Counts pro Bar (1-2-3-4-5-6-7-8)
- **Beat Accents**: Kick auf 1 & 3, Snare auf 2 & 4
- **Syncopation**: "and" zwischen Beats (1-and-2-and-3-and-4)

### Move-Timing Schema
```javascript
{
  "start_count": "1",      // Start bei Count 1
  "end_count": "4",        // Ende bei Count 4
  "bar_number": 1,         // Im ersten Bar
  "start_time_ms": 0,      // Start bei 0ms
  "end_time_ms": 2000      // Ende bei 2000ms (2 Sekunden)
}
```

### Beispiel-Choreografie (4 Bars)

**Bar 1: Foundation**
- Count 1-4: Hip-Hop Bounce
- Count 5-6: Step Touch Right
- Count 7-8: Step Touch Left

**Bar 2: Toprock**
- Count 1-4: Body Wave
- Count 5-8: Arm Roll

**Bar 3: Footwork**
- Count 1-4: Running Man
- Count 5-8: Kick Ball Change

**Bar 4: Freeze**
- Count 1-4: Attitude Pose
- Count 5-8: Hair Flip (Signature Move)

## 🗄️ Datenbank-Schema

### Videos Table
```sql
CREATE TABLE videos (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  bpm INTEGER,              -- Beats per minute
  time_signature TEXT,      -- z.B. "4/4"
  duration_seconds INTEGER,
  analyzed BOOLEAN
);
```

### Moves Table
```sql
CREATE TABLE moves (
  id INTEGER PRIMARY KEY,
  video_id INTEGER,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,            -- foundation, toprock, footwork, freeze
  difficulty TEXT,          -- beginner, intermediate, advanced
  start_time_ms INTEGER,
  end_time_ms INTEGER,
  start_count TEXT,         -- z.B. "1", "5-and"
  end_count TEXT,           -- z.B. "4", "8"
  bar_number INTEGER
);
```

### Choreographies & Junction Table
```sql
CREATE TABLE choreographies (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  total_bars INTEGER
);

CREATE TABLE choreography_moves (
  choreography_id INTEGER,
  move_id INTEGER,
  sequence_order INTEGER,
  bar_position INTEGER
);
```

## 🚀 Development Workflow

### Lokale Entwicklung starten

```bash
# 1. Zum Projekt navigieren
cd /home/user/webapp/dance-app

# 2. Dependencies installieren (falls noch nicht geschehen)
npm install

# 3. Datenbank migrieren
npm run db:migrate:local

# 4. Test-Daten laden
npm run db:seed

# 5. Projekt bauen
npm run build

# 6. Port aufräumen und Server starten
npm run clean-port
pm2 start ecosystem.config.cjs

# 7. Server testen
npm run test
curl http://localhost:3000/api/videos
```

### PM2 Commands

```bash
pm2 list                      # Alle Services anzeigen
pm2 logs dance-trainer --nostream  # Logs anzeigen
pm2 restart dance-trainer     # Service neustarten
pm2 delete dance-trainer      # Service entfernen
```

### Datenbank Management

```bash
# Migrationen anwenden (lokal)
npm run db:migrate:local

# Test-Daten laden
npm run db:seed

# Datenbank zurücksetzen
npm run db:reset

# SQL Query ausführen
npm run db:console:local
# Dann: SELECT * FROM moves;

# Production Migrationen
npm run db:migrate:prod
```

## 🌐 Deployment

### Cloudflare Pages Deployment

```bash
# 1. Projekt bauen
npm run build

# 2. Production Deployment
npm run deploy:prod

# 3. Migrationen auf Production anwenden
npm run db:migrate:prod
```

### Deployment URLs
- **Project Name**: dance-trainer
- **Production**: https://dance-trainer.pages.dev
- **Custom Domain**: (noch nicht konfiguriert)

## 📊 Aktueller Status

### ✅ Fertig implementiert
- D1 Datenbank mit vollständigem Schema
- RESTful API mit allen CRUD-Operationen
- Interaktiver Video Player mit Beat Counter
- Move-Breakdown nach 8-Count System
- Choreografie-Verwaltung
- Responsive UI mit TailwindCSS

### 🔧 Noch zu entwickeln (Phase 2)
- Instagram API Integration
- YouTube API Integration
- AI-basierte Video-Analyse
- Automatische Beat-Detection
- Move-Thumbnail-Generierung

### 🎨 Noch zu entwickeln (Phase 3)
- Custom Choreografie Builder
- AI Video-Generierung aus Moves
- Community Features (Sharing, Likes)
- User Authentication
- Leaderboards & Challenges

## 🎓 Verwendete Konzepte

### Hip-Hop Dance Kategorien
- **Foundation**: Basic Grooves, Bounce, Stepping
- **Toprock**: Standing movements, waves, rocks
- **Footwork**: Fast foot patterns, running man, kicks
- **Freeze**: Poses, stops, attitude moves
- **Power**: Advanced moves (für spätere Features)

### Beat-Analyse Logik
```javascript
// BPM zu Millisekunden
const msPerBeat = (60 / bpm) * 1000;

// Aktueller Beat berechnen
const totalBeats = Math.floor(currentTimeMs / msPerBeat);
const currentBeat = (totalBeats % 8) + 1;  // 1-8
const currentBar = Math.floor(totalBeats / 8) + 1;
```

## 👤 Für Nadja (@tini.aii)

### Wie du den Trainer verwendest:
1. **Video auswählen** - Klicke auf ein Video in der Galerie
2. **Video ansehen** - Der Beat Counter zeigt dir die 8 Counts
3. **Moves lernen** - Lies die Beschreibungen für jeden Move
4. **Zum Move springen** - Klicke "Play" bei einem Move
5. **Choreografie lernen** - Wähle eine fertige Choreografie

### Neue Videos hinzufügen:
Aktuell über SQL - In Phase 2 wird es ein Upload-Interface geben:
```sql
INSERT INTO videos (title, video_url, bpm, duration_seconds) 
VALUES ('Neues Video', 'https://...', 120, 30);
```

## 📱 Social Media

- **Instagram**: [@tini.aii](https://instagram.com/tini.aii)
- **TikTok**: [@tini.aii](https://tiktok.com/@tini.aii)
- **Website**: https://tini.ai

## 📝 Nächste Entwicklungsschritte

### Sofort möglich:
1. ✅ Mehr Videos aus dem tini.ai Portfolio hinzufügen
2. ✅ Weitere Moves für existierende Videos definieren
3. ✅ Neue Choreografien erstellen
4. ✅ Deployment zu Cloudflare Pages

### Kurzfristig (Phase 2):
1. Instagram API Integration für automatischen Video-Import
2. YouTube-Support
3. AI Video-Analyse mit Computer Vision (Pose Detection)
4. Automatische BPM-Detection aus Audio

### Langfristig (Phase 3):
1. Community Dance Builder
2. AI Video-Generierung
3. User Authentication & Profiles
4. Social Features & Challenges

## 🤝 Entwickler

**Pascal (@pascal-afk)**
- GitHub: https://github.com/pascal-afk
- E-Mail: pascal@raluecht.com

## 📄 Lizenz

Entwickelt für Nadja - Tini AI Dance Project

---

**Letzte Aktualisierung**: 2025-11-02  
**Version**: 1.0.0 - MVP Phase 1 Complete  
**Status**: ✅ Production Ready
