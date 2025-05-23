class FlappyBird {  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'

    // Sistema de áudio
    this.audioManager = new AudioManager();

    // Configurações do jogo
    this.gravity = 0.6;
    this.jumpForce = -12;
    this.pipeSpeed = 3;
    this.pipeGap = 200;
    this.pipeWidth = 80;

    // Pássaro
    this.bird = {
      x: 150,
      y: 300,
      width: 40,
      height: 30,
      velocity: 0,
      color: '#ffd93d',
      angle: 0
    };

    // Canos
    this.pipes = [];
    this.pipeTimer = 0;
    this.pipeInterval = 100;    // Pontuação
    this.score = 0;
    this.highScore = localStorage.getItem('flappyHighScore') || 0;

    // Sistema de Power-ups
    this.powerUps = [];
    this.powerUpTimer = 0;
    this.powerUpInterval = 300; // Aparecem a cada ~5 segundos
    this.activePowerUps = {
      shield: { active: false, duration: 0 },
      slowMotion: { active: false, duration: 0 },
      doublePoints: { active: false, duration: 0 }
    };    // Elementos DOM
    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('highScore');
    this.gameOverScreen = document.getElementById('gameOver');
    this.startScreen = document.getElementById('startScreen');
    this.pauseScreen = document.getElementById('pauseScreen');
    this.finalScoreElement = document.getElementById('finalScore');
    this.finalHighScoreElement = document.getElementById('finalHighScore');
    this.pauseButton = document.getElementById('pauseButton');
    this.musicToggleBtn = document.getElementById('musicToggle');
    this.soundToggleBtn = document.getElementById('soundToggle');

    // Partículas para efeitos
    this.particles = [];

    this.init();
  }

  init() {
    this.updateScore();
    this.setupEventListeners();
    this.setupAudioControls();
    this.gameLoop();
  }

  setupAudioControls() {
    // Controles de música
    this.musicToggleBtn.addEventListener('click', () => {
      const isEnabled = this.audioManager.toggleMusic();
      this.musicToggleBtn.textContent = isEnabled ? '🎵' : '🔇';
      this.musicToggleBtn.classList.toggle('muted', !isEnabled);
    });

    // Controles de som
    this.soundToggleBtn.addEventListener('click', () => {
      const isEnabled = this.audioManager.toggleSound();
      this.soundToggleBtn.textContent = isEnabled ? '🔊' : '🔇';
      this.soundToggleBtn.classList.toggle('muted', !isEnabled);
    });
  }

  // Controles do jogo
  setupEventListeners() {      document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.handleInput();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        if (this.gameState === 'playing' || this.gameState === 'paused') {
          this.togglePause();
        }
      }
    });

    // Usar mousedown em vez de click para resposta mais rápida
    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.handleInput();
    });

    // Touch para dispositivos móveis
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleInput();
    });    // Botões
    document.getElementById('startButton').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('restartButton').addEventListener('click', () => {
      this.restartGame();
    });

    // Botões de pause
    this.pauseButton.addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('resumeButton').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('restartFromPauseButton').addEventListener('click', () => {
      this.restartGame();
    });

    document.getElementById('backToMenuButton').addEventListener('click', () => {
      this.backToMenu();
    });
  }
  handleInput() {
    if (this.gameState === 'start') {
      this.startGame();
    } else if (this.gameState === 'playing') {
      this.jump();
    } else if (this.gameState === 'gameOver') {
      this.restartGame();
    }
    // Não fazer nada se estiver pausado
  }  startGame() {
    this.gameState = 'playing';
    this.startScreen.style.display = 'none';
    this.pauseScreen.style.display = 'none';
    this.pauseButton.style.display = 'block';
    this.bird.y = 300;
    this.bird.velocity = 0;
    this.pipes = [];
    this.powerUps = [];
    this.score = 0;
    this.pipeTimer = 0;
    this.powerUpTimer = 0;

    // Reset power-ups
    Object.keys(this.activePowerUps).forEach(key => {
      this.activePowerUps[key] = { active: false, duration: 0 };
    });

    this.updateScore();

    // Iniciar música de fundo
    this.audioManager.resumeContext().then(() => {
      this.audioManager.startBackgroundMusic();
    });
  }  restartGame() {
    this.gameState = 'playing';
    this.gameOverScreen.style.display = 'none';
    this.pauseScreen.style.display = 'none';
    this.pauseButton.style.display = 'block';
    this.bird.y = 300;
    this.bird.velocity = 0;
    this.pipes = [];
    this.powerUps = [];
    this.score = 0;
    this.pipeTimer = 0;
    this.powerUpTimer = 0;
    this.particles = [];

    // Reset power-ups
    Object.keys(this.activePowerUps).forEach(key => {
      this.activePowerUps[key] = { active: false, duration: 0 };
    });

    this.updateScore();

    // Reiniciar música de fundo
    this.audioManager.startBackgroundMusic();
  }
  jump() {
    this.bird.velocity = this.jumpForce;
    this.bird.angle = -0.3;

    // Som de pulo
    this.audioManager.playJumpSound();

    // Adicionar partículas de salto
    this.addJumpParticles();
  }

  addJumpParticles() {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: this.bird.x,
        y: this.bird.y + this.bird.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 1,
        life: 30,
        color: `hsl(${Math.random() * 60 + 180}, 70%, 70%)`
      });
    }
  }

  addCrashParticles() {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: this.bird.x + this.bird.width / 2,
        y: this.bird.y + this.bird.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 60,
        color: `hsl(${Math.random() * 30}, 70%, 60%)`
      });
    }
  }
  update() {
    if (this.gameState !== 'playing') return;

    // Aplicar efeito de câmera lenta se ativo
    const timeMultiplier = this.activePowerUps.slowMotion.active ? 0.5 : 1;

    // Atualizar pássaro
    this.bird.velocity += this.gravity * timeMultiplier;
    this.bird.y += this.bird.velocity * timeMultiplier;

    // Rotação do pássaro baseada na velocidade
    this.bird.angle = Math.max(-0.5, Math.min(0.5, this.bird.velocity * 0.05));

    // Verificar colisão com o chão ou teto
    if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
      this.gameOver();
      return;
    }

    // Gerar canos
    this.pipeTimer++;
    if (this.pipeTimer > this.pipeInterval) {
      this.createPipe();
      this.pipeTimer = 0;
    }

    // Atualizar canos
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= this.pipeSpeed * timeMultiplier;

      // Remover canos que saíram da tela
      if (pipe.x + this.pipeWidth < 0) {
        this.pipes.splice(i, 1);
        continue;
      }      // Verificar pontuação
      if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
        pipe.scored = true;
        const points = this.activePowerUps.doublePoints.active ? 2 : 1;
        this.score += points;
        this.updateScore();

        // Som de pontuação
        this.audioManager.playScoreSound();
      }

      // Verificar colisão (se não tiver escudo ativo)
      if (!this.activePowerUps.shield.active && this.checkCollision(pipe)) {
        this.gameOver();
        return;
      }
    }    // Atualizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // gravidade nas partículas
      particle.life--;

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Gerar power-ups
    this.powerUpTimer++;
    if (this.powerUpTimer > this.powerUpInterval) {
      this.createPowerUp();
      this.powerUpTimer = 0;
    }

    // Atualizar power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      powerUp.x -= this.pipeSpeed;

      // Remover power-ups que saíram da tela
      if (powerUp.x + powerUp.size < 0) {
        this.powerUps.splice(i, 1);
        continue;
      }

      // Verificar colisão com power-up
      if (this.checkPowerUpCollision(powerUp)) {
        this.collectPowerUp(powerUp);
        this.powerUps.splice(i, 1);
      }
    }

    // Atualizar duração dos power-ups ativos
    Object.keys(this.activePowerUps).forEach(key => {
      if (this.activePowerUps[key].active) {
        this.activePowerUps[key].duration--;
        if (this.activePowerUps[key].duration <= 0) {
          this.activePowerUps[key].active = false;
        }
      }
    });
  }

  createPipe() {
    const minHeight = 100;
    const maxHeight = this.canvas.height - this.pipeGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    this.pipes.push({
      x: this.canvas.width,
      topHeight: topHeight,
      bottomY: topHeight + this.pipeGap,
      scored: false
    });
  }

  createPowerUp() {
    const types = ['shield', 'slowMotion', 'doublePoints'];
    const type = types[Math.floor(Math.random() * types.length)];

    // Posição aleatória na vertical, evitando as bordas
    const y = Math.random() * (this.canvas.height - 200) + 100;

    const powerUpConfig = {
      shield: { color: '#00BFFF', emoji: '🛡️', name: 'Escudo' },
      slowMotion: { color: '#9932CC', emoji: '⏰', name: 'Câmera Lenta' },
      doublePoints: { color: '#FFD700', emoji: '⭐', name: 'Pontos Duplos' }
    };

    this.powerUps.push({
      type: type,
      x: this.canvas.width,
      y: y,
      size: 30,
      color: powerUpConfig[type].color,
      emoji: powerUpConfig[type].emoji,
      name: powerUpConfig[type].name,
      rotation: 0,
      pulseTime: 0
    });
  }

  checkCollision(pipe) {
    // Verificar colisão com cano superior
    if (this.bird.x < pipe.x + this.pipeWidth &&
      this.bird.x + this.bird.width > pipe.x &&
      this.bird.y < pipe.topHeight) {
      return true;
    }

    // Verificar colisão com cano inferior
    if (this.bird.x < pipe.x + this.pipeWidth &&
      this.bird.x + this.bird.width > pipe.x &&
      this.bird.y + this.bird.height > pipe.bottomY) {
      return true;
    }

    return false;
  }
  checkPowerUpCollision(powerUp) {
    return this.bird.x < powerUp.x + powerUp.size &&
      this.bird.x + this.bird.width > powerUp.x &&
      this.bird.y < powerUp.y + powerUp.size &&
      this.bird.y + this.bird.height > powerUp.y;
  }

  collectPowerUp(powerUp) {
    // Som de coleta de power-up
    this.audioManager.playPowerUpSound();

    // Ativar o power-up
    this.activePowerUps[powerUp.type].active = true;

    switch (powerUp.type) {
      case 'shield':
        this.activePowerUps.shield.duration = 300; // 5 segundos
        this.audioManager.playShieldSound();
        break;
      case 'slowMotion':
        this.activePowerUps.slowMotion.duration = 240; // 4 segundos
        this.audioManager.playSlowMotionSound();
        break;
      case 'doublePoints':
        this.activePowerUps.doublePoints.duration = 360; // 6 segundos
        break;
    }

    // Adicionar partículas de coleta
    this.addPowerUpParticles(powerUp);
  }

  addPowerUpParticles(powerUp) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: powerUp.x + powerUp.size / 2,
        y: powerUp.y + powerUp.size / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 40,
        color: powerUp.color
      });
    }
  }
  gameOver() {
    this.gameState = 'gameOver';
    this.pauseButton.style.display = 'none';
    this.addCrashParticles();

    // Parar música de fundo e tocar som de game over
    this.audioManager.stopBackgroundMusic();
    this.audioManager.playGameOverSound();

    // Atualizar recorde
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('flappyHighScore', this.highScore);
    }

    // Mostrar tela de game over
    this.finalScoreElement.textContent = this.score;
    this.finalHighScoreElement.textContent = this.highScore;
    this.gameOverScreen.style.display = 'block';
    this.updateScore();
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
    this.highScoreElement.textContent = this.highScore;
  }  draw() {
    // Limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenhar fundo (nuvens simples)
    this.drawClouds();

    // Desenhar canos
    this.pipes.forEach(pipe => this.drawPipe(pipe));

    // Desenhar power-ups
    this.powerUps.forEach(powerUp => this.drawPowerUp(powerUp));

    // Desenhar pássaro (com efeito de escudo se ativo)
    this.drawBird();

    // Desenhar partículas
    this.drawParticles();

    // Desenhar chão
    this.drawGround();

    // Desenhar indicadores de power-ups ativos
    this.drawPowerUpIndicators();

    // Overlay de pause
    if (this.gameState === 'paused') {
      this.drawPauseOverlay();
    }
  }

  drawClouds() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    // Nuvens estáticas para simplicidade
    const clouds = [
      { x: 100, y: 100, size: 60 },
      { x: 300, y: 80, size: 80 },
      { x: 500, y: 120, size: 70 },
      { x: 650, y: 90, size: 90 }
    ];

    clouds.forEach(cloud => {
      this.ctx.beginPath();
      this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      this.ctx.arc(cloud.x + cloud.size * 0.7, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
      this.ctx.arc(cloud.x - cloud.size * 0.7, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  drawBird() {
    this.ctx.save();
    this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
    this.ctx.rotate(this.bird.angle);

    // Efeito de escudo se ativo
    if (this.activePowerUps.shield.active) {
      const shieldRadius = 35;
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, shieldRadius);
      gradient.addColorStop(0, 'rgba(0, 191, 255, 0.1)');
      gradient.addColorStop(0.8, 'rgba(0, 191, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 191, 255, 0.6)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#00BFFF';
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = '#00BFFF';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shieldRadius - 1, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }

    // Corpo do pássaro
    this.ctx.fillStyle = this.bird.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, this.bird.width / 2, this.bird.height / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Asa
    this.ctx.fillStyle = '#ffb347';
    this.ctx.beginPath();
    this.ctx.ellipse(-5, 0, 15, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Olho
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(8, -8, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(10, -6, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Bico
    this.ctx.fillStyle = '#ff8c00';
    this.ctx.beginPath();
    this.ctx.moveTo(15, -2);
    this.ctx.lineTo(25, 0);
    this.ctx.lineTo(15, 2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  drawPipe(pipe) {
    const gradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + this.pipeWidth, 0);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(0.5, '#45a049');
    gradient.addColorStop(1, '#3d8b40');

    this.ctx.fillStyle = gradient;

    // Cano superior
    this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);

    // Cano inferior
    this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);

    // Bordas dos canos
    this.ctx.fillStyle = '#2d5a2d';
    this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, this.pipeWidth + 10, 30);
    this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 30);
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.life / 60;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
  }

  drawGround() {
    const groundHeight = 50;
    const gradient = this.ctx.createLinearGradient(0, this.canvas.height - groundHeight, 0, this.canvas.height);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(1, '#654321');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, this.canvas.height - groundHeight, this.canvas.width, groundHeight);

    // Grama
    this.ctx.fillStyle = '#228B22';
    this.ctx.fillRect(0, this.canvas.height - groundHeight, this.canvas.width, 10);
  }

  drawPowerUp(powerUp) {
    this.ctx.save();

    // Animação de rotação e pulso
    powerUp.rotation += 0.05;
    powerUp.pulseTime += 0.1;
    const pulse = 1 + Math.sin(powerUp.pulseTime) * 0.2;

    // Posição do power-up
    const centerX = powerUp.x + powerUp.size / 2;
    const centerY = powerUp.y + powerUp.size / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(powerUp.rotation);
    this.ctx.scale(pulse, pulse);

    // Fundo circular brilhante
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.size / 2);
    gradient.addColorStop(0, powerUp.color + 'AA');
    gradient.addColorStop(0.7, powerUp.color + '44');
    gradient.addColorStop(1, powerUp.color + '00');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, powerUp.size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Borda brilhante
    this.ctx.strokeStyle = powerUp.color;
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = powerUp.color;
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, powerUp.size / 2 - 2, 0, Math.PI * 2);
    this.ctx.stroke();

    // Emoji do power-up
    this.ctx.shadowBlur = 0;
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(powerUp.emoji, 0, 0);

    this.ctx.restore();
  }

  drawPowerUpIndicators() {
    let indicatorY = 120;
    const indicatorX = 20;

    Object.keys(this.activePowerUps).forEach(type => {
      const powerUp = this.activePowerUps[type];
      if (powerUp.active) {
        const duration = powerUp.duration;
        const maxDuration = type === 'shield' ? 300 : type === 'slowMotion' ? 240 : 360;
        const progress = duration / maxDuration;

        // Configuração dos power-ups
        const config = {
          shield: { emoji: '🛡️', color: '#00BFFF', name: 'Escudo' },
          slowMotion: { emoji: '⏰', color: '#9932CC', name: 'Lento' },
          doublePoints: { emoji: '⭐', color: '#FFD700', name: '2x Pontos' }
        };

        // Fundo do indicador
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(indicatorX, indicatorY, 120, 30);

        // Barra de progresso
        this.ctx.fillStyle = config[type].color;
        this.ctx.fillRect(indicatorX + 2, indicatorY + 20, (120 - 4) * progress, 8);

        // Ícone e texto
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(config[type].emoji + ' ' + config[type].name, indicatorX + 5, indicatorY + 15);

        indicatorY += 40;
      }
    });
  }

  // Métodos do sistema de pause
  togglePause() {
    if (this.gameState === 'playing') {
      this.pauseGame();
    } else if (this.gameState === 'paused') {
      this.resumeGame();
    }
  }

  pauseGame() {
    this.gameState = 'paused';
    this.pauseScreen.style.display = 'block';
    this.pauseButton.textContent = '▶️';
    this.audioManager.pauseBackgroundMusic();
  }

  resumeGame() {
    this.gameState = 'playing';
    this.pauseScreen.style.display = 'none';
    this.pauseButton.textContent = '⏸️';
    this.audioManager.resumeBackgroundMusic();
  }

  backToMenu() {
    this.gameState = 'start';
    this.pauseScreen.style.display = 'none';
    this.startScreen.style.display = 'block';
    this.pauseButton.style.display = 'none';
    this.pauseButton.textContent = '⏸️';
    
    // Parar música de fundo
    this.audioManager.stopBackgroundMusic();
    
    // Reset do jogo
    this.bird.y = 300;
    this.bird.velocity = 0;
    this.pipes = [];
    this.powerUps = [];
    this.particles = [];
    this.score = 0;
    this.pipeTimer = 0;
    this.powerUpTimer = 0;

    // Reset power-ups
    Object.keys(this.activePowerUps).forEach(key => {
      this.activePowerUps[key] = { active: false, duration: 0 };
    });

    this.updateScore();
  }

  drawPauseOverlay() {
    // Overlay escuro semitransparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Texto de pause no centro
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.shadowColor = 'black';
    this.ctx.shadowBlur = 10;
    this.ctx.fillText('⏸️ PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.restore();
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Inicializar o jogo quando a página carregar
window.addEventListener('load', () => {
  new FlappyBird();
});
