// Arquivo principal que controla o jogo Pacman

// Elementos HTML
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const playAgainButton = document.getElementById('playAgain');

// Controles mobile
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');

// Estado do jogo
let gameState = GAME_STATE.READY;
let score = 0;
let totalDots;
let pacman;
let ghosts = [];
let lastFrameTime = 0;
let levelStartTime = 0;
let gameTime = 0;
let gameLoop;

// Inicialização
function init() {
    // Contagem de pontos no mapa
    totalDots = countDots();
    
    // Posição inicial do PacMan
    const pacmanStartPos = findPacmanStartPosition();
    pacman = new Pacman(pacmanStartPos.x, pacmanStartPos.y);
    
    // Criar fantasmas
    ghosts = createGhosts();
    
    // Reset de variáveis
    score = 0;
    updateScore(0);
    updateLives(pacman.lives);
    
    // Eventos de teclado
    document.addEventListener('keydown', handleKeyDown);
    
    // Eventos de toque
    setupMobileControls();
    
    // Botões de controle
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    playAgainButton.addEventListener('click', restartGame);
    
    // Desenhar tela inicial
    drawInitialScreen();
}

// Iniciar o jogo
function startGame() {
    if (gameState !== GAME_STATE.PLAYING) {
        gameState = GAME_STATE.PLAYING;
        startButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
        
        // Iniciar loop do jogo
        lastFrameTime = performance.now();
        levelStartTime = lastFrameTime;
        if (gameLoop) cancelAnimationFrame(gameLoop);
        gameLoop = requestAnimationFrame(update);
    }
}

// Reiniciar o jogo
function restartGame() {
    // Esconder tela de game over
    gameOverElement.style.display = 'none';
    
    // Resetar mapa (recriar pontos)
    window.location.reload();
}

// Atualizar o jogo (loop principal)
function update(currentTime) {
    // Cálculo de delta time
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar mapa
    drawMap(ctx);
    
    if (gameState === GAME_STATE.PLAYING) {
        // Atualizar PacMan
        const pacmanTile = pacman.update();
        
        // Verificar coleta de pontos
        checkDotCollection(pacmanTile.tileX, pacmanTile.tileY);
        
        // Atualizar fantasmas
        for (const ghost of ghosts) {
            ghost.update(pacman, deltaTime);
            
            // Verificar colisão
            if (ghost.checkCollision(pacman)) {
                handleGhostCollision(ghost);
            }
        }
        
        // Verificar vitória
        checkWinCondition();
    }
    
    // Desenhar personagens
    pacman.draw(ctx);
    ghosts.forEach(ghost => ghost.draw(ctx));
    
    // Continuar o loop
    if (gameState !== GAME_STATE.GAME_OVER) {
        gameLoop = requestAnimationFrame(update);
    }
}

// Verificar coleta de pontos
function checkDotCollection(tileX, tileY) {
    if (!isPositionInBounds(tileX, tileY)) return;
    
    const result = collectDot(tileX, tileY);
    
    if (result.points > 0) {
        updateScore(result.points);
        
        // Se coletou power pellet, ativa modo de fuga dos fantasmas
        if (result.isPowerPellet) {
            activateFrightenedMode();
        }
    }
}

// Ativar modo assustado para os fantasmas
function activateFrightenedMode() {
    for (const ghost of ghosts) {
        ghost.startFrightened();
    }
}

// Verificar condição de vitória (coletou todos os pontos)
function checkWinCondition() {
    let remainingDots = 0;
    
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (gameMap[y][x] === MAP_CODES.DOT || gameMap[y][x] === MAP_CODES.POWER_PELLET) {
                remainingDots++;
            }
        }
    }
    
    if (remainingDots === 0) {
        // Vitória!
        gameState = GAME_STATE.WIN;
        endGame("Você venceu!");
    }
}

// Lidar com colisão com fantasma
function handleGhostCollision(ghost) {
    if (ghost.state === "frightened") {
        // Comer o fantasma
        ghost.reset();
        updateScore(GHOST_POINTS);
    } else {
        // Perder uma vida
        const remaining = pacman.loseLife();
        updateLives(remaining);
        
        if (remaining > 0) {
            resetLevel();
        } else {
            gameState = GAME_STATE.GAME_OVER;
            endGame("Fim de Jogo");
        }
    }
}

// Resetar nível após perder uma vida
function resetLevel() {
    // Pausar brevemente
    gameState = GAME_STATE.PAUSED;
    
    setTimeout(() => {
        // Resetar posições
        const pacmanStartPos = findPacmanStartPosition();
        pacman.reset(pacmanStartPos.x, pacmanStartPos.y);
        
        for (const ghost of ghosts) {
            ghost.reset();
        }
        
        // Continuar jogo
        gameState = GAME_STATE.PLAYING;
    }, 1000);
}

// Finalizar jogo
function endGame(message) {
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'flex';
    
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
}

// Atualizar pontuação
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Atualizar vidas
function updateLives(lives) {
    livesElement.textContent = lives;
}

// Tratamento de teclas
function handleKeyDown(event) {
    if (gameState !== GAME_STATE.PLAYING) return;
    
    switch (event.key) {
        case "ArrowUp":
            pacman.setDirection(DIRECTION.UP);
            event.preventDefault();
            break;
        case "ArrowDown":
            pacman.setDirection(DIRECTION.DOWN);
            event.preventDefault();
            break;
        case "ArrowLeft":
            pacman.setDirection(DIRECTION.LEFT);
            event.preventDefault();
            break;
        case "ArrowRight":
            pacman.setDirection(DIRECTION.RIGHT);
            event.preventDefault();
            break;
    }
}

// Configurar controles para dispositivos móveis
function setupMobileControls() {
    upButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.UP);
    });
    
    downButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.DOWN);
    });
    
    leftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.LEFT);
    });
    
    rightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.RIGHT);
    });
    
    // Também adicionar para cliques no PC para testar
    upButton.addEventListener('click', () => {
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.UP);
    });
    
    downButton.addEventListener('click', () => {
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.DOWN);
    });
    
    leftButton.addEventListener('click', () => {
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.LEFT);
    });
    
    rightButton.addEventListener('click', () => {
        if (gameState === GAME_STATE.PLAYING) pacman.setDirection(DIRECTION.RIGHT);
    });
}

// Desenhar tela inicial
function drawInitialScreen() {
    // Desenhar mapa
    drawMap(ctx);
    
    // Desenhar PacMan e fantasmas em posições iniciais
    pacman.draw(ctx);
    ghosts.forEach(ghost => ghost.draw(ctx));
    
    // Texto inicial
    ctx.fillStyle = "#FFFF00";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Clique em 'Iniciar Jogo' para começar", canvas.width / 2, canvas.height / 2);
}

// Iniciar quando a página carregar
window.addEventListener('load', init);
