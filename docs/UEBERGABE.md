# Übergabe: Memory App

Repo: CWhymann/MemoryApp (Vite + TypeScript, Vanilla)
Branch: feature/design-fixes (lokal aktuell). main ist unverändert.
Vorlage: Figma-Datei „Memory“. Figma ist für die KI nicht zugänglich, Vorgaben kommen aus Screenshots.
Plan: Umsetzungsplan in Phasen, Richtlinien aus Memory Checkliste.pdf und den Coding-Konventionen (HTML, TypeScript) im Repo.

## Arbeitsregeln

- Ein Schritt pro Antwort: Ziel, PowerShell, komplette Dateien zum Kopieren, Testhinweis, Git-Befehle.
- Vorher das Repo prüfen, nichts doppelt schicken.
- Die KI schreibt nichts über die GitHub-Schnittstelle. Commit und Push macht der Nutzer lokal.
- Kurze Antworten, keine Füllsätze.
- Code ohne Kommentare außer TSDoc (Englisch), kebab-case, Funktionen max. 14 Zeilen, keine Magic Numbers, kein any, explizite Typen, 2 Leerzeichen, Semikolons.

## Stand auf dem Branch

- src/styles/themes.css: Theme-Variablen für code-vibes, gaming, da-projects, foods.
- src/style.css: Theme-Farben am Spielbildschirm, Widescreen-Zentrierung ab 1100 px.
- src/main.ts: BOARD_SIZES, Theme-Attribut auf .game-screen, Winner-/Draw-Logik über showOutcome.
- index.html: Exit-Dialog mit „Are you sure you want to quit the game?“, Winner- und Draw-Panels.
- Settings-Seite nach Screenshots umgebaut, noch nicht gegen Figma abgeglichen. Vorschau-Motive für Gaming, DA Projects und Foods sind nur Farbflächen.

## Offen (in dieser Reihenfolge)
AC
1. public/assets/icons/ ist leer. Es fehlen controller-button.svg, arrow.svg, controller-decoration.svg.
2. Motive für die Vorschau in public/assets/themes/ (je Theme) und Kartenmotive aus Figma.
3. Settings gegen die Screenshots prüfen: Positionen, Icons, Fußleiste mit „Game theme / Player / Board size“, gelber Start-Button.
4. Game-over-Screen mit Endstand: Auslöser ist noch nicht festgelegt.
5. Winner- und Draw-Screen: Pawn und Waage sind Unicode-Zeichen, im Design sind es Icons.
6. Phase 1 aus dem Plan (Module aufteilen, Funktionen auf 14 Zeilen bringen, Hover- und Fokuszustände) ist noch nicht gemacht.

## Bekannte Fehler

- src/assets/ enthält nur Vite-Vorlagendateien (hero.png, typescript.svg, vite.svg), keine Figma-Motive.
- Die KI hat mehrfach Code geschrieben, ohne vorher zu prüfen, welche Dateien im Repo liegen.
