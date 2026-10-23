# Montagemagerquark

Eine humorvolle, responsive One-Page-Website im industriellen Retro-Look – mit Quarkrezepten, Eiweißparolen und einem digitalen Schichtplaner.

[Website auf Render öffnen](https://montagemagerquark.onrender.com/) · [GitHub-Pages-Version öffnen](https://tkrauseweb.github.io/montagemagerquark/)

[![CI](https://github.com/tkrauseweb/montagemagerquark/actions/workflows/ci.yml/badge.svg)](https://github.com/tkrauseweb/montagemagerquark/actions/workflows/ci.yml)
[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-e5ff00.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-semantisch-E34F26?logo=html5&logoColor=white)](index.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111)](js/main.js)

![Startseite von Montagemagerquark](assets/readme-preview.png)

## Highlights

- responsive Darstellung für Smartphone und Desktop
- animierte Litfaßsäule, Nährwertzähler und Scroll-Effekte
- drei aufklappbare Quarkrezepte
- interaktiver „Quarkomat 84“ mit Schichtempfehlungen
- wechselnder „Quark des Tages“
- barrierearme Navigation mit Sprunglink, Tastatursteuerung und Bewegungsreduktion
- SEO-Metadaten, Social-Media-Vorschau, strukturierte Daten und Sitemap

## Technik

- semantisches HTML5
- modernes CSS ohne Framework
- Vanilla JavaScript
- automatische Bereitstellung über Render und GitHub Pages
- Google Search Console mit eingereichter Sitemap

## Lokal starten

Es ist kein Build-Schritt erforderlich:

```bash
python3 -m http.server 8000
```

Anschließend [http://localhost:8000](http://localhost:8000) öffnen.

## Qualität prüfen

Der lokale Check kontrolliert JavaScript-Syntax, interne Links und Sprungmarken, referenzierte Dateien, SEO-Pflichtangaben, strukturierte Daten, `robots.txt` und Sitemap:

```bash
npm run check
```

GitHub Actions führt dieselbe Prüfung automatisch bei jedem Push und Pull Request aus.

## Projektstruktur

```text
.
├── assets/images/   # Bilder und README-Vorschau
├── css/styles.css   # Layout, Animationen und responsive Styles
├── js/main.js       # Interaktionen und Quarkomat
├── scripts/         # automatischer Website-Check
├── index.html       # Website und SEO-Metadaten
├── robots.txt       # Suchmaschinensteuerung
└── sitemap.xml      # Sitemap für die Indexierung
```

## Hinweis

Die Website ist ein fiktives Gestaltungskonzept. Produkte und Nährwertangaben sind nicht real.

## Lizenz

Der Quellcode steht unter der [MIT-Lizenz](LICENSE).
