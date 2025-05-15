// Classe para o PacMan
class Pacman {
    constructor(x, y) {
        this.x = x * TILE_SIZE + TILE_SIZE / 2;
        this.y = y * TILE_SIZE + TILE_SIZE / 2;
        this.radius = TILE_SIZE / 2 - 2;
        this.speed = PACMAN_SPEED;
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
        this.angle = 0;
        this.mouthOpen = 0.2;
        this.mouthDir = 0.02;
        this.lives = 3;
    }

    // Atualiza a posição e animação do PacMan
    update() {
        // Animação da boca
        this.mouthOpen += this.mouthDir;
        if (this.mouthOpen > 0.5 || this.mouthOpen < 0.2) {
            this.mouthDir *= -1;
        }

        // Calcular próxima posição
        const nextX = this.x + this.direction.x * this.speed;
        const nextY = this.y + this.direction.y * this.speed;
        
        // Conversão de pixel para grade
        const currentTileX = Math.floor(this.x / TILE_SIZE);
        const currentTileY = Math.floor(this.y / TILE_SIZE);
        const nextTileX = Math.floor(nextX / TILE_SIZE);
        const nextTileY = Math.floor(nextY / TILE_SIZE);

        // Verificar se pode mudar de direção
        if (this.nextDirection !== DIRECTION.NONE) {
            const nextDirX = this.x + this.nextDirection.x * this.speed;
            const nextDirY = this.y + this.nextDirection.y * this.speed;
            const nextDirTileX = Math.floor(nextDirX / TILE_SIZE);
            const nextDirTileY = Math.floor(nextDirY / TILE_SIZE);

            // Centralização para virar nas esquinas
            const centerX = currentTileX * TILE_SIZE + TILE_SIZE / 2;
            const centerY = currentTileY * TILE_SIZE + TILE_SIZE / 2;
            const xAligned = Math.abs(this.x - centerX) < 1;
            const yAligned = Math.abs(this.y - centerY) < 1;

            // Verifica se pode mudar para a próxima direção
            if ((this.nextDirection.x !== 0 && yAligned) || 
                (this.nextDirection.y !== 0 && xAligned)) {
                if (isValidMove(nextDirTileX, nextDirTileY)) {
                    this.direction = this.nextDirection;
                    this.nextDirection = DIRECTION.NONE;
                    
                    // Centraliza o pacman no eixo oposto ao da direção
                    if (this.direction.x !== 0) {
                        this.y = centerY;
                    } else if (this.direction.y !== 0) {
                        this.x = centerX;
                    }
                }
            }
        }

        // Movimento na direção atual
        if (isValidMove(nextTileX, nextTileY)) {
            this.x = nextX;
            this.y = nextY;
            
            // Atravessar túnel (lado esquerdo para direito)
            if (this.x < 0) {
                this.x = MAP_WIDTH * TILE_SIZE;
            }
            // Atravessar túnel (lado direito para esquerdo)
            if (this.x > MAP_WIDTH * TILE_SIZE) {
                this.x = 0;
            }
        } else {
            // Se bater em uma parede, centraliza na célula atual
            if (this.direction.x !== 0) {
                this.x = currentTileX * TILE_SIZE + TILE_SIZE / 2;
            }
            if (this.direction.y !== 0) {
                this.y = currentTileY * TILE_SIZE + TILE_SIZE / 2;
            }
            this.direction = DIRECTION.NONE;
        }

        // Definir ângulo de acordo com a direção
        if (this.direction === DIRECTION.RIGHT) {
            this.angle = 0;
        } else if (this.direction === DIRECTION.DOWN) {
            this.angle = Math.PI / 2;
        } else if (this.direction === DIRECTION.LEFT) {
            this.angle = Math.PI;
        } else if (this.direction === DIRECTION.UP) {
            this.angle = Math.PI * 3 / 2;
        }

        return { 
            tileX: Math.floor(this.x / TILE_SIZE), 
            tileY: Math.floor(this.y / TILE_SIZE) 
        };
    }

    // Desenha o PacMan no canvas
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Desenha o corpo do PacMan (círculo com "boca")
        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.mouthOpen * Math.PI, (2 - this.mouthOpen) * Math.PI, false);
        ctx.lineTo(0, 0);
        ctx.fill();
        
        ctx.restore();
    }

    // Define a próxima direção
    setDirection(newDirection) {
        if (this.direction === DIRECTION.NONE) {
            this.direction = newDirection;
        } else {
            this.nextDirection = newDirection;
        }
    }

    // Obtém a posição atual em coordenadas de grade
    getTilePosition() {
        return {
            x: Math.floor(this.x / TILE_SIZE),
            y: Math.floor(this.y / TILE_SIZE)
        };
    }

    // Reseta o PacMan para a posição inicial
    reset(x, y) {
        this.x = x * TILE_SIZE + TILE_SIZE / 2;
        this.y = y * TILE_SIZE + TILE_SIZE / 2;
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
    }

    // Reduz uma vida
    loseLife() {
        this.lives--;
        return this.lives;
    }
}
