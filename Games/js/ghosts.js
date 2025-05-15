// Classe para os fantasmas do jogo
class Ghost {
    constructor(x, y, color, name, targetingStrategy, releaseDelay = 0) {
        this.x = x * TILE_SIZE + TILE_SIZE / 2;
        this.y = y * TILE_SIZE + TILE_SIZE / 2;
        this.tileX = x;
        this.tileY = y;
        this.startX = x;
        this.startY = y;
        this.radius = TILE_SIZE / 2 - 2;
        this.speed = GHOST_SPEED;
        this.color = color;
        this.name = name;
        this.direction = DIRECTION.UP;
        this.nextDirection = DIRECTION.NONE;
        this.state = "scatter"; // scatter, chase, frightened, house
        this.frightenedTime = 0;
        this.targetingStrategy = targetingStrategy;
        this.eyesOffsetX = 3;
        this.eyesOffsetY = -3;
        this.blinkCount = 0;
        this.exitingHouse = false;
        this.releaseDelay = releaseDelay;
        this.releaseTime = 0;
        this.inHouse = true;
        
        // Verificar se o fantasma começa em uma casa
        if (gameMap[y][x] === MAP_CODES.GHOST_HOUSE) {
            this.state = "house";
        }
    }    // Atualiza o fantasma
    update(pacman, elapsedTime, gameTime) {
        // Verificar se deve sair da casa
        if (this.state === "house") {
            if (gameTime >= this.releaseDelay) {
                this.exitHouse();
            } else {
                // Movimento dentro da casa (flutuar para cima e para baixo)
                this.y += Math.sin(gameTime / 250) * 0.5;
                return;
            }
        }
        
        // Gerenciar saída da casa
        if (this.exitingHouse) {
            this.handleHouseExit();
            return;
        }
        
        // Verificar se o fantasma está assustado
        if (this.state === "frightened" && this.frightenedTime > 0) {
            this.frightenedTime -= elapsedTime;
            
            // Restaurar para o estado anterior quando o modo assustado terminar
            if (this.frightenedTime <= 0) {
                this.state = "chase";
                this.speed = GHOST_SPEED;
                this.blinkCount = 0;
            } else if (this.frightenedTime < 2000) {
                // Piscar quando estiver perto de acabar o tempo
                this.blinkCount++;
            }
        }

        // Escolher a próxima direção
        this.chooseNextDirection(pacman);

        // Mover
        const nextX = this.x + this.direction.x * this.speed;
        const nextY = this.y + this.direction.y * this.speed;
        
        const currentTileX = Math.floor(this.x / TILE_SIZE);
        const currentTileY = Math.floor(this.y / TILE_SIZE);
        
        this.tileX = currentTileX;
        this.tileY = currentTileY;
        
        // Verificar se pode se mover
        if (this.canMove(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
            
            // Atravessar túnel
            if (this.x < 0) {
                this.x = MAP_WIDTH * TILE_SIZE;
            }
            if (this.x > MAP_WIDTH * TILE_SIZE) {
                this.x = 0;
            }
        } else {
            // Se não puder se mover, centraliza na célula atual e escolhe uma nova direção
            if (this.direction.x !== 0) {
                this.x = currentTileX * TILE_SIZE + TILE_SIZE / 2;
            }
            if (this.direction.y !== 0) {
                this.y = currentTileY * TILE_SIZE + TILE_SIZE / 2;
            }
            
            this.chooseRandomDirection();
        }
    }
    
    // Gerencia a saída da casa dos fantasmas
    handleHouseExit() {
        // Encontrar a posição da saída da casa (célula acima da casa)
        const doorX = this.startX;
        const doorY = this.startY - 1;
        
        // Mova para cima para sair da casa
        this.direction = DIRECTION.UP;
        this.y -= GHOST_HOUSE_EXIT_SPEED;
        
        // Verificar se já saiu da casa
        if (Math.floor(this.y / TILE_SIZE) <= doorY) {
            this.y = doorY * TILE_SIZE + TILE_SIZE / 2;
            this.exitingHouse = false;
            this.inHouse = false;
            this.state = "scatter";
            this.direction = DIRECTION.LEFT; // Começa indo para a esquerda depois de sair
        }
    }
    
    // Inicia o processo de saída da casa
    exitHouse() {
        if (this.state === "house") {
            this.state = "exiting";
            this.exitingHouse = true;
        }
    }

    // Desenha o fantasma
    draw(ctx) {
        ctx.save();
        
        // Corpo do fantasma
        if (this.state === "frightened") {
            // Fantasma assustado (azul)
            if (this.frightenedTime < 2000 && this.blinkCount % 10 < 5) {
                ctx.fillStyle = "#FFFFFF"; // Branco piscante no final
            } else {
                ctx.fillStyle = "#3737FF"; // Azul
            }
        } else {
            ctx.fillStyle = this.color;
        }
        
        // Desenha o corpo principal (semicírculo + base ondulada)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
        
        // Base ondulada
        const baseY = this.y + this.radius;
        ctx.lineTo(this.x + this.radius, baseY);
        
        const waveWidth = this.radius / 3;
        
        // Ondulação da base (3 "pernas")
        for (let i = 0; i < 3; i++) {
            const waveX = this.x + this.radius - (i + 1) * waveWidth;
            ctx.lineTo(waveX, baseY - this.radius / 3);
            ctx.lineTo(waveX - waveWidth / 2, baseY);
        }
        
        ctx.lineTo(this.x - this.radius, baseY);
        ctx.closePath();
        ctx.fill();
        
        // Olhos
        if (this.state !== "frightened") {
            this.drawEyes(ctx);
        } else {
            // Desenha olhos de fantasma assustado
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(this.x - 5, this.y - 2, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x + 5, this.y - 2, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Boca
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x - 6, this.y + 6);
            ctx.lineTo(this.x - 4, this.y + 3);
            ctx.lineTo(this.x - 2, this.y + 6);
            ctx.lineTo(this.x, this.y + 3);
            ctx.lineTo(this.x + 2, this.y + 6);
            ctx.lineTo(this.x + 4, this.y + 3);
            ctx.lineTo(this.x + 6, this.y + 6);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    // Desenha os olhos do fantasma
    drawEyes(ctx) {
        // Base branca dos olhos
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x + 4, this.y - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas (olhando na direção do movimento)
        ctx.fillStyle = "#000000";
        
        const pupilOffsetX = this.direction.x * 2;
        const pupilOffsetY = this.direction.y * 2;
        
        ctx.beginPath();
        ctx.arc(this.x - 4 + pupilOffsetX, this.y - 3 + pupilOffsetY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x + 4 + pupilOffsetX, this.y - 3 + pupilOffsetY, 2, 0, Math.PI * 2);
        ctx.fill();
    }    // Verifica se o fantasma pode se mover para uma determinada posição
    canMove(x, y) {
        const tileX = Math.floor(x / TILE_SIZE);
        const tileY = Math.floor(y / TILE_SIZE);
        
        // Se estiver saindo da casa dos fantasmas, permite passar pela porta
        if (this.exitingHouse || this.state === "house") {
            return true;
        }
        
        // Verificar limites do mapa
        if (!isPositionInBounds(tileX, tileY)) {
            // Permitir sair pelo túnel
            if ((tileY >= 0 && tileY < MAP_HEIGHT) && (tileX < 0 || tileX >= MAP_WIDTH)) {
                return true;
            }
            return false;
        }
        
        // Não permitir retornar para a casa dos fantasmas depois de sair
        if (!this.inHouse && gameMap[tileY][tileX] === MAP_CODES.GHOST_HOUSE) {
            return false;
        }
        
        return isValidMove(tileX, tileY);
    }

    // Escolhe a próxima direção com base na estratégia de perseguição
    chooseNextDirection(pacman) {
        // Se estiver no centro de um azulejo, pode mudar de direção
        const centerX = Math.floor(this.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        const centerY = Math.floor(this.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        
        if (Math.abs(this.x - centerX) < 1 && Math.abs(this.y - centerY) < 1) {
            const target = this.getTargetTile(pacman);
            const possibleDirections = this.getPossibleDirections();
            
            // Se estiver assustado, movimento aleatório
            if (this.state === "frightened") {
                if (possibleDirections.length > 0) {
                    const randomIndex = Math.floor(Math.random() * possibleDirections.length);
                    this.direction = possibleDirections[randomIndex];
                }
                return;
            }
            
            // Não é permitido inverter a direção, exceto quando assustado
            possibleDirections.forEach((dir, index) => {
                if (dir.x === -this.direction.x && dir.y === -this.direction.y) {
                    possibleDirections.splice(index, 1);
                }
            });
            
            // Se não houver outras opções, inverte a direção
            if (possibleDirections.length === 0) {
                this.direction = {
                    x: -this.direction.x,
                    y: -this.direction.y
                };
                return;
            }
            
            // Escolher a direção que aproxima do alvo
            let bestDirection = null;
            let shortestDistance = Infinity;
            
            possibleDirections.forEach(dir => {
                const newX = Math.floor(this.x / TILE_SIZE) + dir.x;
                const newY = Math.floor(this.y / TILE_SIZE) + dir.y;
                
                const distance = Math.sqrt(
                    Math.pow(newX - target.x, 2) + 
                    Math.pow(newY - target.y, 2)
                );
                
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestDirection = dir;
                }
            });
            
            if (bestDirection) {
                this.direction = bestDirection;
            }
        }
    }

    // Obtém as direções possíveis (não bloqueadas por paredes)
    getPossibleDirections() {
        const directions = [
            DIRECTION.UP,
            DIRECTION.DOWN,
            DIRECTION.LEFT,
            DIRECTION.RIGHT
        ];
        
        const currentTileX = Math.floor(this.x / TILE_SIZE);
        const currentTileY = Math.floor(this.y / TILE_SIZE);
        
        return directions.filter(dir => {
            const newX = currentTileX + dir.x;
            const newY = currentTileY + dir.y;
            return isValidMove(newX, newY);
        });
    }

    // Escolher direção aleatória
    chooseRandomDirection() {
        const possibleDirections = this.getPossibleDirections();
        
        if (possibleDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleDirections.length);
            this.direction = possibleDirections[randomIndex];
        }
    }    // Obtém o azulejo alvo com base na estratégia de perseguição
    getTargetTile(pacman) {
        const pacmanTile = pacman.getTilePosition();
        
        // Para garantir que os fantasmas persigam o pacman na parte inferior do mapa
        // vamos ajustar a estratégia quando o pacman estiver na metade inferior
        const isLowerHalf = pacmanTile.y > MAP_HEIGHT / 2;
        
        // Se estiver no estado "scatter", cada fantasma tem um canto alvo
        if (this.state === "scatter" && !isLowerHalf) {
            switch (this.name) {
                case "Blinky": return { x: MAP_WIDTH - 2, y: 0 }; // canto superior direito
                case "Pinky": return { x: 0, y: 0 }; // canto superior esquerdo
                case "Inky": return { x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 }; // canto inferior direito
                case "Clyde": return { x: 0, y: MAP_HEIGHT - 2 }; // canto inferior esquerdo
                default: return { x: 0, y: 0 };
            }
        }
        
        switch (this.targetingStrategy) {
            case "direct": // Perseguição direta (Blinky)
                return { x: pacmanTile.x, y: pacmanTile.y };
            
            case "ahead": // Posição à frente do Pacman (Pinky)
                // Ajuste para garantir que o Pinky atinja corretamente o alvo
                let targetX = pacmanTile.x;
                let targetY = pacmanTile.y;
                
                // Se o pacman estiver se movendo, prevê 4 azulejos à frente
                if (pacman.direction !== DIRECTION.NONE) {
                    targetX = pacmanTile.x + pacman.direction.x * 4;
                    targetY = pacmanTile.y + pacman.direction.y * 4;
                }
                
                return { x: targetX, y: targetY };
            
            case "flanking": // Flanquear (Inky)
                // Tentar encontrar o Blinky no array de fantasmas para calcular a posição
                let blinkyPos = { x: 0, y: 0 };
                
                // Se não encontrar Blinky, usa posição padrão
                if (!blinkyPos) {
                    blinkyPos = { x: MAP_WIDTH - 1, y: 0 };
                }
                
                const aheadX = pacmanTile.x + pacman.direction.x * 2;
                const aheadY = pacmanTile.y + pacman.direction.y * 2;
                
                return {
                    x: aheadX + (aheadX - blinkyPos.x),
                    y: aheadY + (aheadY - blinkyPos.y)
                };
            
            case "random": // Movimento mais aleatório (Clyde)
                // Se estiver longe do Pacman, persegue, se estiver perto, foge
                const distance = Math.sqrt(
                    Math.pow(this.tileX - pacmanTile.x, 2) + 
                    Math.pow(this.tileY - pacmanTile.y, 2)
                );
                
                if (distance > 8) {
                    return { x: pacmanTile.x, y: pacmanTile.y };
                } else {
                    // Foge para um canto (longe do pacman)
                    const cornerX = pacmanTile.x < MAP_WIDTH / 2 ? MAP_WIDTH - 2 : 1;
                    const cornerY = pacmanTile.y < MAP_HEIGHT / 2 ? MAP_HEIGHT - 2 : 1;
                    return { x: cornerX, y: cornerY };
                }
            
            default:
                return { x: pacmanTile.x, y: pacmanTile.y };
        }
    }

    // Iniciar modo assustado
    startFrightened() {
        this.state = "frightened";
        this.frightenedTime = FRIGHTENED_DURATION;
        this.speed = GHOST_FRIGHTENED_SPEED;
        
        // Inverter direção
        this.direction = {
            x: -this.direction.x,
            y: -this.direction.y
        };
        
        // Se estiver em direção neutra, escolhe uma aleatória
        if (this.direction.x === 0 && this.direction.y === 0) {
            this.chooseRandomDirection();
        }
    }

    // Verifica colisão com o Pacman
    checkCollision(pacman) {
        const distance = Math.sqrt(
            Math.pow(this.x - pacman.x, 2) + 
            Math.pow(this.y - pacman.y, 2)
        );
        
        return distance < this.radius + pacman.radius;
    }

    // Resetar o fantasma para sua posição inicial
    reset() {
        this.x = this.startX * TILE_SIZE + TILE_SIZE / 2;
        this.y = this.startY * TILE_SIZE + TILE_SIZE / 2;
        this.direction = DIRECTION.UP;
        this.state = "scatter";
        this.frightenedTime = 0;
        this.exitingHouse = false;
    }
}

// Cria os fantasmas para o jogo
function createGhosts() {
    // Encontra posições na casa dos fantasmas
    const housePositions = findGhostHousePositions();
    
    // Se não houver posições suficientes, usar posições padrão
    const defaultPositions = [
        { x: 13, y: 13 },
        { x: 14, y: 13 },
        { x: 13, y: 14 },
        { x: 14, y: 14 }
    ];
    
    const positions = housePositions.length >= 4 ? housePositions : defaultPositions;
    
    // Criar os quatro fantasmas clássicos com cores e estratégias diferentes
    return [
        new Ghost(positions[0].x, positions[0].y, "#FF0000", "Blinky", "direct"),    // Vermelho (perseguição direta)
        new Ghost(positions[1].x, positions[1].y, "#FFC0CB", "Pinky", "ahead"),      // Rosa (posição à frente)
        new Ghost(positions[2].x, positions[2].y, "#00FFFF", "Inky", "flanking"),    // Ciano (flanquear)
        new Ghost(positions[3].x, positions[3].y, "#FFA500", "Clyde", "random")      // Laranja (aleatório)
    ];
}
