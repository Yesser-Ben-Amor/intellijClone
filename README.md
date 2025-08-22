# IntelliJ Clone - Vanilla JavaScript IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

Ein moderner, vollständiger Code-Editor inspiriert von IntelliJ IDEA, komplett mit Vanilla JavaScript entwickelt. Keine Frameworks, keine Dependencies - nur pure Web-Technologien!

## 🚀 Live Demo

**[➡️ Jetzt ausprobieren!](https://yesser-ben-amor.github.io/intellijClone/)**

> Die Live-Demo läuft direkt in deinem Browser - keine Installation nötig!

## 📸 Screenshots

> *Screenshots werden bald hinzugefügt*

## 🎯 Über das Projekt

Dieses Projekt ist eine Hommage an IntelliJ IDEA und zeigt, was mit modernem Vanilla JavaScript möglich ist. Es bietet eine vollständige IDE-Erfahrung direkt im Browser mit lokaler Speicherung und professionellen Features.

## 🚀 Features

### ✅ Implementiert
- **🗂️ Projekt-Management** - Erstelle und verwalte Projekte
- **📋 Projekt-Templates** - JavaScript, HTML/CSS, React, Node.js
- **💾 Auto-Save** - Automatisches Speichern der Änderungen
- **🗃️ Lokale Speicherung** - Projekte werden im Browser gespeichert
- **📁 Datei Explorer** - Seitenleiste mit Projektdateien
- **📑 Multi-Tab Editor** - Mehrere Dateien gleichzeitig öffnen
- **⌨️ Code Editor** mit Zeilennummerierung
- **🎛️ Menüleiste** mit Dropdown-Menüs
- **📊 Status-Leiste** mit Cursor-Position und Datei-Info
- **⚡ Tastenkürzel** für häufige Aktionen
- **🔍 Suchen & Ersetzen** Funktionalität
- **↩️ Undo/Redo** System
- **📤 Datei Import/Export**
- **🎨 Dunkles IntelliJ-Theme**
- **📱 Responsive Design**

### 🔄 Geplant für zukünftige Versionen
- Erweiterte Syntax-Hervorhebung
- Code-Vervollständigung
- Debugging-Tools
- Git-Integration
- Plugin-System
- Mehrere Themes

## 🎯 Tastenkürzel

| Kürzel | Aktion |
|--------|--------|
| `Ctrl+Shift+N` | **Neues Projekt** |
| `Ctrl+N` | Neue Datei |
| `Ctrl+O` | Datei öffnen |
| `Ctrl+S` | Datei speichern |
| `Ctrl+W` | Tab schließen |
| `Ctrl+F` | Suchen |
| `Ctrl+H` | Ersetzen |
| `Ctrl+Z` | Rückgängig |
| `Ctrl+Y` | Wiederholen |
| `Tab` | Einrücken |
| `Shift+Tab` | Ausrücken |
| `Esc` | Suche schließen |

## 🛠️ Installation & Verwendung

1. **Klone oder lade das Projekt herunter**
2. **Öffne `index.html` in deinem Browser**
3. **Erstelle dein erstes Projekt:**
   - Klicke auf "Neues Projekt erstellen"
   - Wähle einen Projektnamen und -typ
   - Beginne mit dem Programmieren!

### 🚀 Erste Schritte

1. **Neues Projekt erstellen** (`Ctrl+Shift+N`)
   - Wähle aus verschiedenen Templates: JavaScript, HTML/CSS, React, Node.js
   - Gib einen aussagekräftigen Namen ein
   - Optional: Füge eine Beschreibung hinzu

2. **Dateien verwalten**
   - Neue Datei: `Ctrl+N` oder "+" Button
   - Zwischen Dateien wechseln: Klicke auf Tabs
   - Dateien speichern: `Ctrl+S`

3. **Projekte wechseln**
   - Über das Menü "Datei" → "Projekt öffnen"
   - Alle Projekte werden automatisch gespeichert

### Lokaler Server (empfohlen)
Für die beste Erfahrung verwende einen lokalen Server:

```bash
# Mit Python 3
python -m http.server 8000

# Mit Node.js (http-server)
npx http-server

# Mit PHP
php -S localhost:8000
```

## 📁 Projektstruktur

```
intellijClone/
├── index.html          # Haupt-HTML-Datei
├── styles.css          # IntelliJ-inspirierte Styles
├── script.js           # Haupt-JavaScript-Logik
├── project-manager.js  # Projekt-Management-System
└── README.md          # Diese Datei
```

## 🎨 Design-Prinzipien

- **IntelliJ IDEA inspiriert** - Dunkles Theme, moderne UI
- **Vanilla JavaScript** - Keine externen Abhängigkeiten
- **Responsive** - Funktioniert auf Desktop und Tablet
- **Performant** - Optimiert für große Dateien
- **Erweiterbar** - Modulare Architektur

## 🔧 Technische Details

### Architektur
- **Klassen-basiert** - Moderne ES6+ JavaScript-Syntax
- **Event-driven** - Reaktive Benutzeroberfläche
- **Memory-efficient** - Intelligente Datei-Verwaltung

### Browser-Kompatibilität
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Mitwirken

Beiträge sind willkommen! Hier sind einige Bereiche, wo du helfen kannst:

1. **Syntax-Highlighting** - Erweiterte Sprachunterstützung
2. **Themes** - Zusätzliche Farbschemata
3. **Features** - Neue Editor-Funktionen
4. **Bug-Fixes** - Fehlerberichte und -korrekturen
5. **Dokumentation** - Verbesserungen der Docs

### Entwicklung

```bash
# Projekt klonen
git clone https://github.com/Yesser-Ben-Amor/intellijClone.git

# In Projektverzeichnis wechseln
cd intellijClone

# Lokalen Server starten
python -m http.server 8000

# Browser öffnen
open http://localhost:8000
```

### Pull Requests

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Changelog

### Version 2.0.0 (Aktuell)
- ✅ **Projekt-Management-System**
- ✅ **Projekt-Templates** (JavaScript, HTML/CSS, React, Node.js)
- ✅ **Auto-Save & Lokale Speicherung**
- ✅ **Verbesserte Benutzeroberfläche**
- ✅ **Willkommens-Bildschirm**

### Version 1.0.0
- ✅ Grundlegende Editor-Funktionalität
- ✅ Datei-Management
- ✅ Suchen & Ersetzen
- ✅ Tastenkürzel
- ✅ IntelliJ-Theme

## 📄 Lizenz

MIT License - Siehe LICENSE-Datei für Details.

## 🙏 Danksagungen

- Inspiriert von **JetBrains IntelliJ IDEA**
- **JetBrains Mono** Font für authentisches Feeling
- Community-Feedback und Beiträge

## 📞 Kontakt

- **GitHub**: [@Yesser-Ben-Amor](https://github.com/Yesser-Ben-Amor)
- **Issues**: [GitHub Issues](https://github.com/Yesser-Ben-Amor/intellijClone/issues)
- **Pull Requests**: [GitHub Pull Requests](https://github.com/Yesser-Ben-Amor/intellijClone/pulls)

## 🌟 Support

Wenn dir dieses Projekt gefällt, gib ihm gerne einen ⭐ auf GitHub!

---

**Viel Spaß beim Programmieren! 🚀**

Für Fragen oder Vorschläge, erstelle gerne ein Issue oder Pull Request.
