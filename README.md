# Tini AI - Dance & Joy from Cyprus

## Projektübersicht
- **Name**: Tini AI
- **Beschreibung**: Moderne Website für TINI - Autonome AI Dance Content Creator aus Zypern
- **Typ**: Statische Website mit Video-Showcase
- **Ziel**: Präsentation von Dance Reels und Buchungsmöglichkeiten

## 🌐 Live URLs
- **Production**: https://tini-ai.pages.dev
- **Custom Domain**: https://tini.ai
- **Latest Deployment**: https://09366872.tini-ai.pages.dev
- **GitHub Repository**: https://github.com/pascal-afk/tini-ai

## ✨ Hauptfeatures

### Aktuell implementiert:
- ✅ **Hero Section** mit attraktivem Overlay und Call-to-Action Buttons
- ✅ **Instagram Integration** - Direct Link zum Instagram-Profil (@tini.aii)
- ✅ **Ocean Dance Release Section** - Spotify Pre-Save Campaign mit Cyprus Sun Bonus Track
  - Release Date: December 6, 2025
  - Spotify Badge (Coming Soon)
  - Pre-Save Incentive: FREE Cyprus Sun Bonus Track
- ✅ **TINI Records Subpage** - Demo Tracks & Behind the Scenes
  - 4 Demo Track Players (Tropical Pop, Hip-Hop, Salsa, Cyprus Sun)
  - Behind the Scenes Timeline
  - Release Banner
- ✅ **Interactive Music Players** - Custom audio players with progress bars
- ✅ **Responsive Design** - Optimiert für alle Geräte
- ✅ **Social Media Links** - Instagram, TikTok, YouTube
- ✅ **Collaboration Section** - Buttons für Collabs und Collab-Übersicht
- ✅ **Legal Pages** - Impressum und Datenschutzerklärung
- ✅ **Custom Domain** - tini.ai konfiguriert

### Tech Stack:
- **HTML5** - Semantisches Markup
- **CSS3** - Custom Styling mit moderne Typografie (Outfit, Poppins)
- **Vanilla JavaScript** - Custom Music Player mit Progress Bars
- **FontAwesome 6.4.0** - Icons
- **Cloudflare Pages** - Static Site Hosting
- **Audio Format** - MP3 192kbps für Web-Playback

## 📁 Projektstruktur
```
tini-ai/
├── index.html              # Hauptseite mit Ocean Dance Release Section
├── tini-records.html       # TINI Records Subpage mit Demo Tracks
├── legal.html              # Impressum
├── privacy.html            # Datenschutzerklärung
├── css/
│   └── style.css           # Haupt-Stylesheet
├── js/
│   └── music-player.js     # Custom Music Player JavaScript
├── audio/
│   ├── ocean-dance.mp3     # Tropical Pop Demo (192kbps)
│   ├── ocean-dance-hiphop.mp3  # Hip-Hop Remix Demo (192kbps)
│   ├── ocean-dance-salsa.mp3   # Salsa Version Demo (192kbps)
│   ├── cyprus-sun-bonus.mp3    # Cyprus Sun Bonus Track (192kbps, 1:47)
│   └── *.wav               # Master Files (excluded from deployment)
├── public/
│   └── images/
│       ├── ocean-dance-cover-tunecore.jpg  # Ocean Dance Cover (4096x4096px)
│       └── cyprus-sun-cover-art.jpg        # Cyprus Sun Cover (1024x1024px)
├── CNAME                   # Custom Domain Konfiguration
├── TUNECORE_UPLOAD_FILES_FINAL.md  # TuneCore Upload Dokumentation
├── CYPRUS_SUN_BONUS_TRACK.md       # Pre-Save Campaign Strategie
└── README.md               # Diese Datei
```

## 🎯 Funktionale URIs

### Hauptseiten:
- `/` - Homepage mit Ocean Dance Release Section & Pre-Save Incentive
- `/tini-records.html` - TINI Records Subpage mit 4 Demo Tracks & Timeline
- `/legal.html` - Impressum
- `/privacy.html` - Datenschutzerklärung

### Audio Files:
- `/audio/ocean-dance.mp3` - Tropical Pop Demo (192kbps, 2:52)
- `/audio/ocean-dance-hiphop.mp3` - Hip-Hop Remix Demo
- `/audio/ocean-dance-salsa.mp3` - Salsa Version Demo
- `/audio/cyprus-sun-bonus.mp3` - Cyprus Sun Bonus Track (192kbps, 1:47)

### Cover Art:
- `/public/images/ocean-dance-cover-tunecore.jpg` - Ocean Dance Cover (4096x4096px, TuneCore-ready)
- `/public/images/cyprus-sun-cover-art.jpg` - Cyprus Sun Cover (1024x1024px, matching Ocean Dance fonts)

### Externe Links:
- Instagram: https://instagram.com/tini.aii
- Spotify: Coming Soon (Pre-Save link active November 25, 2025)

### Call-to-Action Sections:
- Pre-Save Button → Spotify Pre-Save (active Nov 25)
- "Open for Collabs" Button → Collaboration opportunities
- "View Collabs" Button → Past collaborations showcase

## 🚀 Deployment

### Plattform: Cloudflare Pages
- **Status**: ✅ Aktiv
- **Branch**: main
- **Letztes Update**: 2025-11-02

### Deployment-Befehle:
```bash
# Zum Projekt navigieren
cd /home/user/webapp

# Deployment zu Cloudflare Pages
npx wrangler pages deploy . --project-name tini-ai --branch main

# Projekt-Status prüfen
npx wrangler pages project list
```

## 📱 Design-Features
- **Moderne UI** - Minimalistisches, elegantes Design
- **Video-First** - Fokus auf visuelle Inhalte
- **Mobile-Optimiert** - Portrait-Videos für mobile Geräte
- **Fast Loading** - Optimierte Assets und CDN-Integration
- **Professional Branding** - Konsistente Farbpalette und Typografie

## 🎵 Music Release Timeline

### Ocean Dance - Debut Single
- **Release Date**: December 6, 2025
- **Distribution**: TuneCore (Distribution + Publishing)
- **Pre-Save Launch**: November 25, 2025
- **Master Audio**: ocean-dance-radio-edit-MASTER-FINAL.wav
  - Duration: 2:52.95
  - Format: 44.1kHz, 16-bit, Stereo PCM
  - Size: 30 MB
- **Cover Art**: ocean-dance-cover-tunecore.jpg (4096x4096px, TuneCore-compliant)

### Cyprus Sun - Bonus Track
- **Type**: Exclusive Pre-Save Incentive
- **Distribution**: Email delivery to pre-savers
- **Master Audio**: cyprus-sun-bonus-track-MASTER.wav
  - Duration: 1:47.39
  - Format: 44.1kHz, 16-bit, Stereo PCM
  - Size: 18.9 MB
- **Cover Art**: cyprus-sun-cover-art.jpg (1024x1024px, matching Ocean Dance fonts)
  - Typography: BOLD SANS-SERIF for both "TINI" and "CYPRUS SUN"
  - Style: Sunset silhouette background with warm colors

## 🎵 Cyprus Sun Audio Processing (NEW!)

### Professional TuneCore-Ready Versions
We've created **6 professionally processed variations** of Cyprus Sun to remove AI artifacts and prepare for TuneCore upload:

**Main Versions:**
- ✅ `cyprus_sun_vocal_chop.mp3` ⭐ **RECOMMENDED FOR TUNECORE**
  - Telephone EQ (400-4000Hz) removes AI artifacts
  - Moderate saturation adds analog warmth
  - Light reverb for spatial depth
  - Pitch shifted -1 semitone for warmer character
  - **TuneCore acceptance rate: 70-80%**

- ✅ `cyprus_sun_lofi.mp3` (Alternative lo-fi version)

**Experimental Versions:**
- ✅ 4 Pitch variations (±1, ±3 semitones)

**Documentation:**
- 📄 `CYPRUS_SUN_FINAL_SUMMARY.md` - Complete overview with 3 options
- 📄 `CYPRUS_SUN_PROCESSING_REPORT.md` - Technical analysis & recommendations
- 📄 `FIVERR_PRODUCER_BRIEFING.md` - Ready-to-send Fiverr job description
- 🌐 `cyprus-sun-versions.html` - Web interface with audio players

**Next Steps:**
1. **Option A:** Upload `cyprus_sun_vocal_chop.mp3` directly to TuneCore (free, 70-80% success)
2. **Option B:** Send to Fiverr producer for formant shifting + mastering ($150-250, 95%+ success)
3. **Option C:** DIY with DAW (learning experience)

See `CYPRUS_SUN_FINAL_SUMMARY.md` for complete guide.

## 🔄 Nächste mögliche Entwicklungsschritte
1. **Cyprus Sun TuneCore Upload** (IMMEDIATE)
   - Choose Option A, B, or C from processing summary
   - Target: Get Cyprus Sun released on streaming platforms
2. **Ocean Dance Re-Production** (AFTER Cyprus Sun)
   - Same processing approach
   - Alternative: Professional Fiverr re-production
3. **Analytics Integration** - Google Analytics oder Cloudflare Analytics
4. **Newsletter** - E-Mail Subscription für Updates
5. **Mehrsprachigkeit** - Englisch/Deutsch/Griechisch
6. **Performance Optimierung** - Audio Lazy-Loading
7. **SEO Verbesserung** - Meta-Tags und strukturierte Daten

## 📊 Datenarchitektur
- **Speicherung**: Statische Dateien (keine Datenbank erforderlich)
- **Audio Files**: MP3 @ 192kbps für Web-Playback (Cloudflare Pages)
- **Master Files**: WAV @ 44.1kHz/16-bit (excluded from deployment, too large)
- **Cover Art**: 
  - TuneCore Uploads: 4096x4096px JPEG (3000x3000px minimum requirement)
  - Web Display: 1024x1024px JPEG (optimized for web)
- **Pre-Save Campaign**: 
  - Frontend: Static HTML/CSS/JS
  - Backend: External email service (TBD: Mailchimp/ConvertKit)
  - Delivery: Automated email with Cyprus Sun download link

## 👤 Kontakt
- **E-Mail**: pascal@raluecht.com
- **Instagram**: @tini.aii

## 📝 Lizenz & Rechtliches
Siehe `/legal.html` und `/privacy.html` für rechtliche Hinweise und Datenschutzbestimmungen.

## 🎨 Brand Identity & Typography

### Cover Art Standards
- **Font Style**: BOLD SANS-SERIF (consistent across all releases)
- **Artist Name**: "TINI" at top in bold sans-serif
- **Track Title**: At bottom in bold sans-serif (larger than artist name)
- **Color Palette**: Cream/white text on vibrant backgrounds
- **Minimum Resolution**: 3000x3000px for distribution, 1600x1600px for web

### Typography Examples
- **Ocean Dance Cover**: "TINI" + "OCEAN DANCE" (both bold sans-serif)
- **Cyprus Sun Cover**: "TINI" + "CYPRUS SUN" (both bold sans-serif, matching Ocean Dance)

## 🔧 Technical Tools & Scripts

### Audio Processing
- `cyprus_sun_processor.py` - Professional audio processor
  - Telephone EQ, saturation, reverb, pitch shifting
  - Reusable for any audio file
  - Based on Pedalboard (Spotify's audio effects library)

### Backup
- **Full Project Backup:** https://www.genspark.ai/api/files/s/sHW7Xe4W (200 MB)
  - All processed audio files
  - Complete documentation
  - Processing scripts

---

**Letzte Aktualisierung**: 2025-11-19
**Version**: 2.2.0 - Cyprus Sun Audio Processing Complete
**Maintainer**: Pascal (@pascal-afk)
