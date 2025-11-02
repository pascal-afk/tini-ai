# Tini AI - Dance & Joy from Cyprus

## Projektübersicht
- **Name**: Tini AI
- **Beschreibung**: Moderne Website für Nadja - Dance Content Creator aus Zypern
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
- ✅ **Video Showcase** - Eingebettete Dance Reels
  - 16:9 Landscape Videos
  - 9:16 Portrait Videos (Mobile-optimiert)
- ✅ **Responsive Design** - Optimiert für alle Geräte
- ✅ **Social Media Links** - Instagram, TikTok, YouTube
- ✅ **Kontaktformular** - Für Buchungsanfragen
- ✅ **Legal Pages** - Impressum und Datenschutzerklärung
- ✅ **Custom Domain** - tini.ai konfiguriert

### Tech Stack:
- **HTML5** - Semantisches Markup
- **CSS3** - Custom Styling mit Poppins-Font
- **FontAwesome 6.4.0** - Icons
- **Video Hosting** - GenSpark CDN

## 📁 Projektstruktur
```
tini-ai/
├── index.html      # Hauptseite mit Hero, Videos, Kontakt
├── legal.html      # Impressum
├── privacy.html    # Datenschutzerklärung
├── css/
│   └── style.css   # Haupt-Stylesheet
├── CNAME           # Custom Domain Konfiguration
└── README.md       # Diese Datei
```

## 🎯 Funktionale URIs

### Hauptseiten:
- `/` - Homepage mit Hero und Video Showcase
- `/legal.html` - Impressum
- `/privacy.html` - Datenschutzerklärung

### Externe Links:
- Instagram: https://instagram.com/tini.aii
- Video CDN: https://page.gensparksite.com/

### Call-to-Action Sections:
- `#contact` - Kontaktformular für Buchungen
- Follow Button → Instagram Profil
- Book Button → Kontaktbereich

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

## 🔄 Nächste mögliche Entwicklungsschritte
1. **Analytics Integration** - Google Analytics oder Cloudflare Analytics hinzufügen
2. **Mehr Videos** - Weitere Dance Reels einbinden
3. **Blog Section** - Behind-the-Scenes Content
4. **Newsletter** - E-Mail Subscription für Updates
5. **Mehrsprachigkeit** - Englisch/Deutsch/Griechisch
6. **Performance Optimierung** - Video-Lazy-Loading
7. **SEO Verbesserung** - Meta-Tags und strukturierte Daten

## 📊 Datenarchitektur
- **Speicherung**: Statische Dateien (keine Datenbank erforderlich)
- **Videos**: Extern gehostet auf GenSpark CDN
- **Formular**: Client-seitige Validierung (Backend-Integration möglich)

## 👤 Kontakt
- **E-Mail**: pascal@raluecht.com
- **Instagram**: @tini.aii

## 📝 Lizenz & Rechtliches
Siehe `/legal.html` und `/privacy.html` für rechtliche Hinweise und Datenschutzbestimmungen.

---

**Letzte Aktualisierung**: 2025-11-02
**Version**: 1.0.0
**Maintainer**: Pascal (@pascal-afk)
