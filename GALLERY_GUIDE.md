# TINI Gallery - Wie du neue Bilder hinzufügst

## Quick Guide: Neue Bilder zur Gallery hinzufügen

### Option 1: Instagram Link teilen
1. **Sende mir einfach den Instagram Post Link** (z.B. `https://instagram.com/p/ABC123...`)
2. Ich füge das Bild automatisch zur Gallery hinzu

### Option 2: Bild direkt hochladen
1. **Lade das Bild hier im Chat hoch**
2. Ich füge es zur Gallery hinzu

### So sieht der Code aus (für dich zur Info):

```html
<!-- TINI x [Creator Name] -->
<a href="https://instagram.com/[creator_handle]" target="_blank" class="grid-item">
    <img src="[image_url]" alt="TINI x [Creator Name]">
    <div class="grid-overlay">
        <div class="grid-tags">
            <span>@tini.aii</span>
            <span>×</span>
            <span>@[creator_handle]</span>
        </div>
    </div>
</a>
```

## Aktueller Gallery Status

### Derzeit in der Gallery:
1. **TINI × Luna Avery** (@lunaaveryai) - 1 Bild
2. **TINI × Amy Chen** (@real_amychen) - 4 Bilder
3. **TINI × Daria** (@darmars_ai) - 1 Bild

**Total: 6 Bilder**

## Gallery Design Details

### Desktop (Große Screens)
- **Layout**: 3 Spalten nebeneinander
- **Gap**: Kein Abstand (borderless)
- **Hover Effect**: Zoom + Creator Tags einblenden

### Tablet (768px - 1200px)
- **Layout**: 3 Spalten
- **Anpassung**: Kleinere Schrift für Tags

### Mobile (unter 768px)
- **Layout**: 3 Spalten (kompakte Ansicht)
- **Unter 480px**: 2 Spalten

### Hover-Effekt
- Bild zoomt auf 110%
- Overlay zeigt Creator Namen (@handles)
- Klick führt zum Instagram Profil des Creators

## Nächste Schritte

### Wenn du ein neues Bild hinzufügen möchtest:
1. Sag mir einfach: "Add this image to gallery: [Instagram Link oder Upload]"
2. Ich füge es automatisch an die richtige Stelle ein
3. Deployment passiert automatisch zu Cloudflare

### Wenn du ein Bild entfernen möchtest:
1. Sag mir: "Remove [Creator Name] from gallery"
2. Ich lösche das Bild

### Wenn du die Reihenfolge ändern möchtest:
1. Sag mir: "Move [Creator Name] image to position X"
2. Ich sortiere die Gallery neu

## Live URLs

- **Sandbox Preview**: https://3000-iemkear06dg9s9khcgzl8-c81df28e.sandbox.novita.ai/collabs.html
- **Production**: https://tini-ai.pages.dev/collabs.html
- **Latest Deploy**: https://07c927f6.tini-ai.pages.dev/collabs.html

---

**Das war's!** 🎉 Die neue Gallery ist jetzt live und super einfach zu bedienen. Du kannst jederzeit neue Bilder hinzufügen oder bestehende entfernen - sag mir einfach Bescheid!
