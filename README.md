# 🐔 El Pollo Loco

Ein 2D-Jump-'n'-Run-Spiel in Vanilla JavaScript, entstanden als Projekt der Developer Akademie.

## Story

In einem kleinen Wüstendorf in Mexiko sind die Hühner verrückt geworden. Angeführt von einem riesigen Monster-Huhn überrennen sie das Dorf. Nur einer stellt sich ihnen entgegen: **Pepe Peligroso**! Mit scharfen Salsa-Flaschen und seiner alten Walze, die Hühner in leckere Keulen verwandelt, zieht er los, um das Dorf zu retten.

## Features

- Hühner und Küken mit zufälliger Geschwindigkeit, besiegbar per Sprung oder Flaschenwurf
- Endboss mit Alarm-, Angriffs-, Treffer- und Todesanimation sowie eigener Lebensanzeige
- **Walze:** Hühner, die hineinlaufen, werden zu Keulen (+10 Leben)
- Münzen sammeln: 5 Münzen ergeben eine Flasche (maximal 5 Flaschen)
- Rückstoß bei Kontakt mit Gegnern
- Idle- und Schlafanimation mit Schnarchen
- Hintergrundmusik, Bossmusik und Soundeffekte, Mute-Einstellung wird gespeichert
- Pause, Neustart und Hauptmenü ohne Neuladen der Seite
- Vollbildmodus
- Mobile Steuerung per Touch-Buttons, Hinweis zum Drehen im Hochformat

## Steuerung

| Taste | Aktion |
|---|---|
| A / ← | Nach links |
| D / → | Nach rechts |
| W / ↑ | Springen |
| Leertaste | Flasche werfen |
| P | Pause |

Auf Smartphone und Tablet erscheinen Touch-Buttons.

## Technik

- HTML5 Canvas
- Vanilla JavaScript (objektorientiert, eine Klasse pro Datei)
- CSS (responsiv, Querformat auf Mobilgeräten)

## Starten

Repository klonen und `index.html` im Browser öffnen, zum Beispiel mit der VS-Code-Erweiterung Live Server.

## Credits

- Spielgrafiken: Developer Akademie
- Hintergrund-, Level-, Walzen- und Keulenbilder: erstellt mit ChatGPT (KI)
- Musik: „Flamenco Spanish Guitar – Fire & Passion“ von Alex Morgan (Pixabay)
- Soundeffekte: Pixabay (u. a. Universfield)
