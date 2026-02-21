// Game state
let games = [];
let searchQuery = '';
let selectedGame = null;

// DOM Elements
const gamesGrid = document.getElementById('games-grid');
const searchInput = document.getElementById('search-input');
const gridView = document.getElementById('grid-view');
const playerView = document.getElementById('player-view');
const emptyState = document.getElementById('empty-state');
const backBtn = document.getElementById('back-btn');
const logo = document.getElementById('logo');
const playFeaturedBtn = document.getElementById('play-featured');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Player Elements
const playerTitle = document.getElementById('player-title');
const playerDesc = document.getElementById('player-desc');
const gameIframe = document.getElementById('game-iframe');
const externalLink = document.getElementById('external-link');

// Initialize
async function init() {
    try {
        const response = await fetch('src/games.json');
        games = await response.json();
        renderGames();
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// Render games grid
function renderGames() {
    const filtered = games.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    gamesGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(game => {
            const card = document.createElement('div');
            card.className = 'group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-1';
            card.innerHTML = `
                <div class="aspect-video relative overflow-hidden">
                    <img
                        src="${game.thumbnail}"
                        alt="${game.title}"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerpolicy="no-referrer"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                            <i data-lucide="play" class="w-6 h-6 text-white fill-current ml-1"></i>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-bold mb-1 group-hover:text-indigo-400 transition-colors">
                        ${game.title}
                    </h3>
                    <p class="text-zinc-500 text-sm line-clamp-2">
                        ${game.description}
                    </p>
                </div>
            `;
            card.onclick = () => selectGame(game);
            gamesGrid.appendChild(card);
        });
        lucide.createIcons();
    }
}

// Select and play a game
function selectGame(game) {
    selectedGame = game;
    playerTitle.textContent = game.title;
    playerDesc.innerHTML = `<i data-lucide="info" class="w-3 h-3"></i> ${game.description}`;
    gameIframe.src = game.url;
    externalLink.href = game.url;
    
    gridView.classList.add('hidden');
    playerView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lucide.createIcons();
}

// Go back to grid
function goBack() {
    selectedGame = null;
    gameIframe.src = '';
    playerView.classList.add('hidden');
    gridView.classList.remove('hidden');
}

// Event Listeners
searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderGames();
};

backBtn.onclick = goBack;
logo.onclick = goBack;

playFeaturedBtn.onclick = () => {
    if (games.length > 0) selectGame(games[0]);
};

fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

// Start the app
init();
