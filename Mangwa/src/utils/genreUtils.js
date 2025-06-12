// Utilitários para gêneros de mangá
export const genreIconMap = {
  // Gêneros em inglês (da API Jikan)
  'Action': 'bi-lightning-fill',
  'Adventure': 'bi-compass-fill',
  'Cars': 'bi-car-front-fill',
  'Comedy': 'bi-emoji-smile-fill',
  'Dementia': 'bi-brain',
  'Demons': 'bi-fire',
  'Drama': 'bi-mask',
  'Ecchi': 'bi-heart-eyes-fill',
  'Fantasy': 'bi-star-fill',
  'Game': 'bi-controller',
  'Harem': 'bi-people-fill',
  'Historical': 'bi-clock-history',
  'Horror': 'bi-ghost',
  'Josei': 'bi-flower1',
  'Kids': 'bi-emoji-laughing-fill',
  'Magic': 'bi-magic',
  'Martial Arts': 'bi-hand-index-thumb-fill',
  'Mecha': 'bi-robot',
  'Military': 'bi-shield-fill',
  'Music': 'bi-music-note-beamed',
  'Mystery': 'bi-question-circle-fill',
  'Parody': 'bi-emoji-wink-fill',
  'Police': 'bi-shield-check',
  'Psychological': 'bi-brain',
  'Romance': 'bi-heart-fill',
  'Samurai': 'bi-sword',
  'School': 'bi-book-fill',
  'Sci-Fi': 'bi-rocket-takeoff',
  'Seinen': 'bi-person-fill',
  'Shoujo': 'bi-flower2',
  'Shoujo Ai': 'bi-hearts',
  'Shounen': 'bi-lightning',
  'Shounen Ai': 'bi-hearts',
  'Slice of Life': 'bi-cup-fill',
  'Space': 'bi-globe',
  'Sports': 'bi-trophy-fill',
  'Super Power': 'bi-lightning-charge-fill',
  'Supernatural': 'bi-magic',
  'Thriller': 'bi-exclamation-triangle-fill',
  'Vampire': 'bi-moon-stars-fill',
  'Yaoi': 'bi-hearts',
  'Yuri': 'bi-hearts',
  
  // Gêneros traduzidos para português
  'Ação': 'bi-lightning-fill',
  'Aventura': 'bi-compass-fill',
  'Carros': 'bi-car-front-fill',
  'Comédia': 'bi-emoji-smile-fill',
  'Demência': 'bi-brain',
  'Demônios': 'bi-fire',
  'Ecchi': 'bi-heart-eyes-fill',
  'Fantasia': 'bi-star-fill',
  'Jogo': 'bi-controller',
  'Harém': 'bi-people-fill',
  'Histórico': 'bi-clock-history',
  'Terror': 'bi-ghost',
  'Crianças': 'bi-emoji-laughing-fill',
  'Magia': 'bi-magic',
  'Artes Marciais': 'bi-hand-index-thumb-fill',
  'Mecha': 'bi-robot',
  'Militar': 'bi-shield-fill',
  'Música': 'bi-music-note-beamed',
  'Mistério': 'bi-question-circle-fill',
  'Paródia': 'bi-emoji-wink-fill',
  'Polícia': 'bi-shield-check',
  'Psicológico': 'bi-brain',
  'Romance': 'bi-heart-fill',
  'Samurai': 'bi-sword',
  'Escolar': 'bi-book-fill',
  'Ficção Científica': 'bi-rocket-takeoff',
  'Seinen': 'bi-person-fill',
  'Shoujo': 'bi-flower2',
  'Shounen': 'bi-lightning',
  'Slice of Life': 'bi-cup-fill',
  'Espaço': 'bi-globe',
  'Esportes': 'bi-trophy-fill',
  'Super Poder': 'bi-lightning-charge-fill',
  'Sobrenatural': 'bi-magic',
  'Thriller': 'bi-exclamation-triangle-fill',
  'Vampiro': 'bi-moon-stars-fill',
  
  // Ícone padrão
  'default': 'bi-tag-fill'
};

export const genreTranslations = {
  // Inglês para Português
  'Action': 'Ação',
  'Adventure': 'Aventura',
  'Cars': 'Carros',
  'Comedy': 'Comédia',
  'Dementia': 'Demência',
  'Demons': 'Demônios',
  'Drama': 'Drama',
  'Ecchi': 'Ecchi',
  'Fantasy': 'Fantasia',
  'Game': 'Jogo',
  'Harem': 'Harém',
  'Historical': 'Histórico',
  'Horror': 'Terror',
  'Josei': 'Josei',
  'Kids': 'Crianças',
  'Magic': 'Magia',
  'Martial Arts': 'Artes Marciais',
  'Mecha': 'Mecha',
  'Military': 'Militar',
  'Music': 'Música',
  'Mystery': 'Mistério',
  'Parody': 'Paródia',
  'Police': 'Polícia',
  'Psychological': 'Psicológico',
  'Romance': 'Romance',
  'Samurai': 'Samurai',
  'School': 'Escolar',
  'Sci-Fi': 'Ficção Científica',
  'Seinen': 'Seinen',
  'Shoujo': 'Shoujo',
  'Shoujo Ai': 'Shoujo Ai',
  'Shounen': 'Shounen',
  'Shounen Ai': 'Shounen Ai',
  'Slice of Life': 'Slice of Life',
  'Space': 'Espaço',
  'Sports': 'Esportes',
  'Super Power': 'Super Poder',
  'Supernatural': 'Sobrenatural',
  'Thriller': 'Thriller',
  'Vampire': 'Vampiro',
  'Yaoi': 'Yaoi',
  'Yuri': 'Yuri'
};

/**
 * Obtém o ícone apropriado para um gênero
 * @param {string} genreName - Nome do gênero
 * @returns {string} - Classe do ícone Bootstrap
 */
export const getGenreIcon = (genreName) => {
  if (!genreName) return genreIconMap.default;
  return genreIconMap[genreName] || genreIconMap.default;
};

/**
 * Traduz um gênero do inglês para português
 * @param {string} genreName - Nome do gênero em inglês
 * @returns {string} - Nome do gênero em português
 */
export const translateGenre = (genreName) => {
  if (!genreName) return genreName;
  return genreTranslations[genreName] || genreName;
};

/**
 * Obtém as cores para um gênero específico
 * @param {string} genreName - Nome do gênero
 * @returns {object} - Objeto com classes de cores
 */
export const getGenreColors = (genreName) => {
  const colorMap = {
    'Action': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'Ação': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'Romance': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    'Comedy': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    'Comédia': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    'Drama': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    'Fantasy': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    'Fantasia': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    'Horror': 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    'Terror': 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    'Shounen': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'Shoujo': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    'Seinen': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'Sports': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'Esportes': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'default': 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
  };
  
  return colorMap[genreName] || colorMap.default;
};

/**
 * Filtra gêneros populares baseado na contagem
 * @param {Array} genres - Array de gêneros
 * @param {number} minCount - Contagem mínima
 * @param {number} limit - Limite de gêneros
 * @returns {Array} - Array de gêneros filtrados e únicos
 */
export const getPopularGenres = (genres, minCount = 50, limit = 12) => {
  if (!Array.isArray(genres)) return [];
  
  // Criar Map para garantir unicidade por ID
  const uniqueGenresMap = new Map();
  
  genres.forEach(genre => {
    if (genre && genre.id && genre.count >= minCount) {
      const key = genre.id.toString();
      // Se já existe, manter o que tem maior contagem
      if (uniqueGenresMap.has(key)) {
        const existing = uniqueGenresMap.get(key);
        if (genre.count > existing.count) {
          uniqueGenresMap.set(key, genre);
        }
      } else {
        uniqueGenresMap.set(key, genre);
      }
    }
  });
  
  // Converter Map para array, ordenar por contagem e limitar
  return Array.from(uniqueGenresMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Formata a contagem de mangás por gênero
 * @param {number} count - Número de mangás
 * @returns {string} - Contagem formatada
 */
export const formatGenreCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};
