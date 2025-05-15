// Constantes para o jogo PacMan

// Tamanho do mapa
const TILE_SIZE = 16; // Tamanho de cada célula do mapa em pixels
const MAP_WIDTH = 28; // Largura do mapa em células
const MAP_HEIGHT = 31; // Altura do mapa em células

// Cores
const WALL_COLOR = "#2121DE"; // Azul escuro para as paredes
const DOT_COLOR = "#FFFF00";  // Amarelo para os pontos
const POWER_PELLET_COLOR = "#FFFF00"; // Amarelo para os power pellets
const EMPTY_COLOR = "#000000"; // Preto para os espaços vazios

// Direções
const DIRECTION = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    NONE: { x: 0, y: 0 }
};

// Valores de pontuação
const DOT_POINTS = 10;
const POWER_PELLET_POINTS = 50;
const GHOST_POINTS = 200;

// Estados do jogo
const GAME_STATE = {
    READY: "ready",
    PLAYING: "playing",
    PAUSED: "paused",
    GAME_OVER: "gameOver",
    WIN: "win"
};

// Velocidade de movimento (em pixels por frame)
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const GHOST_FRIGHTENED_SPEED = 0.75;

// Duração do modo assustado dos fantasmas (ms)
const FRIGHTENED_DURATION = 8000;

// Códigos para o mapa
const MAP_CODES = {
    EMPTY: 0,
    WALL: 1,
    DOT: 2,
    POWER_PELLET: 3,
    PACMAN_START: 4,
    GHOST_HOUSE: 5
};
