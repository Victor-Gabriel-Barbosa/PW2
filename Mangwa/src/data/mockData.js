// Mock data para desenvolvimento e testes
export const mockMangas = [
  {
    id: 1,
    title: "One Piece",
    cover: "/images/default-image.jpg",
    rating: 9.5,
    status: "Em andamento",
    genre: ["Aventura", "Ação", "Comédia"],
    lastUpdate: "hoje",
    chapters: 1090,
    isFavorite: true
  },
  {
    id: 2,
    title: "Naruto",
    cover: "/images/default-image.jpg",
    rating: 9.2,
    status: "Completo",
    genre: ["Ação", "Aventura", "Drama"],
    lastUpdate: "1 dia",
    chapters: 700,
    isFavorite: false
  },
  {
    id: 3,
    title: "Attack on Titan",
    cover: "/images/default-image.jpg",
    rating: 9.7,
    status: "Completo",
    genre: ["Ação", "Drama", "Horror"],
    lastUpdate: "2 dias",
    chapters: 139,
    isFavorite: true
  },
  {
    id: 4,
    title: "Dragon Ball",
    cover: "/images/default-image.jpg",
    rating: 9.0,
    status: "Completo",
    genre: ["Ação", "Aventura", "Comédia"],
    lastUpdate: "3 dias",
    chapters: 519,
    isFavorite: false
  },
  {
    id: 5,
    title: "My Hero Academia",
    cover: "/images/default-image.jpg",
    rating: 8.8,
    status: "Em andamento",
    genre: ["Ação", "Escolar", "Super-heróis"],
    lastUpdate: "hoje",
    chapters: 400,
    isFavorite: true
  },
  {
    id: 6,
    title: "Demon Slayer",
    cover: "/images/default-image.jpg",
    rating: 9.1,
    status: "Completo",
    genre: ["Ação", "Sobrenatural", "Drama"],
    lastUpdate: "1 dia",
    chapters: 205,
    isFavorite: false
  },
  {
    id: 7,
    title: "Solo Leveling",
    cover: "/images/default-image.jpg",
    rating: 9.6,
    status: "Completo",
    genre: ["Ação", "Fantasia", "Aventura"],
    lastUpdate: "2 dias",
    chapters: 179,
    isFavorite: true
  },
  {
    id: 8,
    title: "Tower of God",
    cover: "/images/default-image.jpg",
    rating: 8.9,
    status: "Em andamento",
    genre: ["Aventura", "Fantasia", "Drama"],
    lastUpdate: "hoje",
    chapters: 580,
    isFavorite: false
  },
  {
    id: 9,
    title: "The God of High School",
    cover: "/images/default-image.jpg",
    rating: 8.7,
    status: "Completo",
    genre: ["Ação", "Artes Marciais", "Escolar"],
    lastUpdate: "1 dia",
    chapters: 569,
    isFavorite: false
  },
  {
    id: 10,
    title: "Noblesse",
    cover: "/images/default-image.jpg",
    rating: 8.8,
    status: "Completo",
    genre: ["Ação", "Sobrenatural", "Escolar"],
    lastUpdate: "3 dias",
    chapters: 544,
    isFavorite: true
  },
  {
    id: 11,
    title: "Jujutsu Kaisen",
    cover: "/images/default-image.jpg",
    rating: 9.3,
    status: "Em andamento",
    genre: ["Ação", "Sobrenatural", "Escolar"],
    lastUpdate: "hoje",
    chapters: 240,
    isFavorite: true
  },
  {
    id: 12,
    title: "Chainsaw Man",
    cover: "/images/default-image.jpg",
    rating: 9.0,
    status: "Em andamento",
    genre: ["Ação", "Horror", "Sobrenatural"],
    lastUpdate: "2 dias",
    chapters: 150,
    isFavorite: false
  },
  {
    id: 13,
    title: "One Punch Man",
    cover: "/images/default-image.jpg",
    rating: 9.4,
    status: "Em andamento",
    genre: ["Ação", "Comédia", "Super-heróis"],
    lastUpdate: "1 dia",
    chapters: 180,
    isFavorite: true
  },
  {
    id: 14,
    title: "Death Note",
    cover: "/images/default-image.jpg",
    rating: 9.8,
    status: "Completo",
    genre: ["Thriller", "Sobrenatural", "Drama"],
    lastUpdate: "5 dias",
    chapters: 108,
    isFavorite: true
  },
  {
    id: 15,
    title: "Fullmetal Alchemist",
    cover: "/images/default-image.jpg",
    rating: 9.9,
    status: "Completo",
    genre: ["Aventura", "Drama", "Fantasia"],
    lastUpdate: "1 semana",
    chapters: 108,
    isFavorite: true
  },
  {
    id: 16,
    title: "Hunter x Hunter",
    cover: "/images/default-image.jpg",
    rating: 9.6,
    status: "Pausado",
    genre: ["Aventura", "Ação", "Fantasia"],
    lastUpdate: "2 meses",
    chapters: 390,
    isFavorite: true
  }
];

export const genres = [
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Fantasia",
  "Horror",
  "Romance",
  "Escolar",
  "Slice of Life",
  "Sobrenatural",
  "Thriller",
  "Mecha",
  "Esportes",
  "Histórico",
  "Militar",
  "Psicológico",
  "Sci-Fi",
  "Shounen",
  "Shoujo",
  "Seinen",
  "Josei"
];

export const getPopularMangas = () => {
  return mockMangas
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);
};

export const getLatestMangas = () => {
  const priorities = { "hoje": 3, "1 dia": 2, "2 dias": 1 };
  return mockMangas
    .sort((a, b) => {
      const aPriority = priorities[a.lastUpdate] || 0;
      const bPriority = priorities[b.lastUpdate] || 0;
      return bPriority - aPriority;
    })
    .slice(0, 12);
};

export const getFavoriteMangas = () => {
  return mockMangas.filter(manga => manga.isFavorite);
};

export const getMangasByGenre = (genre) => {
  return mockMangas.filter(manga =>
    manga.genre.includes(genre)
  );
};

export const searchMangas = (query) => {
  if (!query.trim()) return mockMangas;

  const lowercaseQuery = query.toLowerCase();
  return mockMangas.filter(manga =>
    manga.title.toLowerCase().includes(lowercaseQuery) ||
    manga.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
};
