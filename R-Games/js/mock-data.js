// Dados de exemplo para demonstração do site "Eu faço você joga!"
// Este arquivo contém jogos mockados para teste da interface

export const mockGames = [
  {
    id: '1',
    title: 'Space Adventure',
    developers: ['João Silva', 'Maria Santos'],
    description: 'Uma emocionante aventura espacial onde você pilota uma nave através de galáxias desconhecidas, enfrentando aliens hostis e coletando recursos valiosos. Com gráficos em pixel art e trilha sonora envolvente, este jogo oferece horas de diversão e desafios únicos.',
    image: 'https://via.placeholder.com/400x300/4169E1/FFFFFF?text=Space+Adventure',
    playUrl: 'https://example.com/space-adventure',
    videoUrl: 'https://example.com/space-adventure-video',
    category: 'Aventura',
    ratings: [5, 4, 5, 4, 5, 3, 4, 5, 4, 5],
    averageRating: 4.4,
    totalVotes: 10,
    createdAt: new Date('2025-05-15'),
    tags: ['espacial', 'aventura', '2d', 'pixel-art'],
    submittedBy: 'demo-user-1',
    submittedByName: 'João Silva',
    submittedByEmail: 'joao@example.com',
    status: 'approved'
  }
];

// Categorias disponíveis
export const categories = [
  'Todos',
  'Ação',
  'Aventura',
  'Puzzle',
  'Corrida',
  'RPG',
  'Plataforma',
  'Estratégia',
  'Educativo'
];

// Tags populares
export const popularTags = [
  'multiplayer',
  'indie',
  'pixel-art',
  '2d',
  'aventura',
  'estrategia',
  'puzzle',
  'arcade',
  'competitivo',
  'casual'
];

// Função para obter jogos por categoria
export function getGamesByCategory(category) {
  if (category === 'Todos') {
    return mockGames;
  }
  return mockGames.filter(game => game.category === category);
}

// Função para buscar jogos
export function searchGames(query) {
  const searchTerm = query.toLowerCase().trim();
  return mockGames.filter(game =>
    game.title.toLowerCase().includes(searchTerm) ||
    game.developers.some(dev => dev.toLowerCase().includes(searchTerm)) ||
    game.description.toLowerCase().includes(searchTerm) ||
    game.category.toLowerCase().includes(searchTerm) ||
    game.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

// Função para obter ranking dos jogos
export function getGamesRanking() {
  return [...mockGames].sort((a, b) => {
    // Primeiro por nota média (decrescente)
    if (b.averageRating !== a.averageRating) {
      return b.averageRating - a.averageRating;
    }
    // Em caso de empate, por número de votos (decrescente)
    return b.totalVotes - a.totalVotes;
  });
}

// Função para obter top 3 jogos
export function getTopGames() {
  return getGamesRanking().slice(0, 3);
}

// Estatísticas gerais
export const stats = {
  totalGames: mockGames.length,
  totalDevelopers: [...new Set(mockGames.flatMap(game => game.developers))].length,
  totalVotes: mockGames.reduce((total, game) => total + game.totalVotes, 0),
  averageRating: (mockGames.reduce((total, game) => total + game.averageRating, 0) / mockGames.length).toFixed(1)
};

// Função para obter jogos de um usuário específico
export function getUserGames(userId) {
  return mockGames.filter(game => game.submittedBy === userId);
}

// Função para obter jogo por ID
export function getGameById(gameId) {
  return mockGames.find(game => game.id === gameId);
}

// Função para adicionar novo jogo
export function addGameToMockData(gameData) {
  const newGame = {
    id: (mockGames.length + 1).toString(),
    ...gameData,
    ratings: [],
    averageRating: 0,
    totalVotes: 0,
    createdAt: new Date(),
    status: 'pending'
  };
  mockGames.push(newGame);
  return newGame;
}

// Função para atualizar jogo existente
export function updateGameInMockData(gameId, updates) {
  const gameIndex = mockGames.findIndex(game => game.id === gameId);
  if (gameIndex !== -1) {
    mockGames[gameIndex] = { ...mockGames[gameIndex], ...updates };
    return mockGames[gameIndex];
  }
  return null;
}

// Função para remover jogo
export function removeGameFromMockData(gameId) {
  const gameIndex = mockGames.findIndex(game => game.id === gameId);
  if (gameIndex !== -1) {
    const removedGame = mockGames.splice(gameIndex, 1)[0];
    return removedGame;
  }
  return null;
}
