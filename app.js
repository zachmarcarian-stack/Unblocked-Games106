const grid = document.querySelector("#game-grid");
const searchInput = document.querySelector("#search");
const filtersEl = document.querySelector("#filters");
const countEl = document.querySelector("#game-count");
const emptyEl = document.querySelector("#empty-state");
const backdrop = document.querySelector("#player-backdrop");
const frameWrap = document.querySelector("#frame-wrap");
const playerTitle = document.querySelector("#player-title");
let games = [];
let activeCategory = "All";

document.querySelector("#year").textContent = new Date().getFullYear();

async function loadGames() {
  try {
    const response = await fetch("./games.json");
    if (!response.ok) throw new Error("Could not load games.json");
    games = await response.json();
    buildFilters();
    renderGames();
  } catch (error) {
    countEl.textContent = "Library unavailable";
    emptyEl.hidden = false;
    emptyEl.textContent = "Couldn't load games.json. Run this site with a local web server (not by opening the HTML file directly).";
    console.error(error);
  }
}

function buildFilters() {
  const categories = ["All", ...new Set(games.map(game => game.category || "Other"))];
  filtersEl.innerHTML = "";
  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = `filter${category === activeCategory ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      buildFilters();
      renderGames();
    });
    filtersEl.append(button);
  });
}

function renderGames() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = games.filter(game => {
    const matchesCategory = activeCategory === "All" || (game.category || "Other") === activeCategory;
    const haystack = `${game.title} ${game.description || ""} ${game.category || ""}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });

  countEl.textContent = `${filtered.length} game${filtered.length === 1 ? "" : "s"}`;
  emptyEl.hidden = filtered.length !== 0;
  grid.innerHTML = "";

  filtered.forEach(game => {
    const card = document.createElement("article");
    card.className = "game-card";
    const cover = document.createElement("div");
    cover.className = "game-cover";
    cover.style.setProperty("--cover", game.color || "#29264f");
    cover.textContent = game.emoji || "🎮";

    const info = document.createElement("div");
    info.className = "game-info";
    const title = document.createElement("h3");
    title.textContent = game.title;
    const description = document.createElement("p");
    description.textContent = game.description || "Jump in and play.";
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    const tag = document.createElement("span");
    tag.className = "category-tag";
    tag.textContent = game.category || "Other";
    const play = document.createElement("button");
    play.className = "play-button";
    play.textContent = "Play now →";
    play.addEventListener("click", () => openGame(game));
    bottom.append(tag, play);
    info.append(title, description, bottom);
    card.append(cover, info);
    grid.append(card);
  });
}

function openGame(game) {
  playerTitle.textContent = game.title;
  frameWrap.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.title = `${game.title} game`;
  iframe.loading = "eager";
  iframe.allow = "fullscreen; gamepad";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  // Use srcdoc for self-contained games, otherwise load the supplied URL.
  if (game.srcdoc) {
    iframe.srcdoc = game.srcdoc;
  } else if (game.url) {
    iframe.src = game.url;
  } else {
    frameWrap.textContent = "This game has no iframe URL configured.";
  }

  if (game.allowFullscreen !== false) iframe.allowFullscreen = true;
  frameWrap.append(iframe);
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#close-player").focus();
}

function closeGame() {
  backdrop.hidden = true;
  frameWrap.innerHTML = "";
  document.body.style.overflow = "";
}

document.querySelector("#close-player").addEventListener("click", closeGame);
document.querySelector("#fullscreen").addEventListener("click", () => {
  const iframe = frameWrap.querySelector("iframe");
  if (iframe?.requestFullscreen) iframe.requestFullscreen();
});
backdrop.addEventListener("click", event => {
  if (event.target === backdrop) closeGame();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !backdrop.hidden) closeGame();
});
searchInput.addEventListener("input", renderGames);

loadGames();
