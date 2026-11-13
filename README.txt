ARCADEHUB - BASIC UNBLOCKED-GAMES-STYLE SITE

FILES
- index.html: page structure
- styles.css: design and responsive layout
- app.js: loads the JSON library, search, category filters, and iframe player
- games.json: game entries; each entry can use `url` (external iframe URL) or `srcdoc` (self-contained HTML)

RUN IT
Browsers often block fetch() from local file:// pages. Start a local server in this folder:
  python -m http.server 8000
Then open:
  http://localhost:8000

ADD A GAME
Add another object to games.json:
{
  "id": "unique-game-id",
  "title": "Game title",
  "category": "Sports",
  "description": "Short description",
  "emoji": "🎮",
  "color": "#39245b",
  "url": "https://your-game-host.example/embed"
}

For self-contained games, use `srcdoc` instead of `url` and put the game's HTML string there.
Only embed games you have permission to use. Some game websites block iframe embedding; in that case use an official embed URL or host the game files yourself.
