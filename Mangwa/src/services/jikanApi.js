// Serviço para integração com a API Jikan
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Cache simples para evitar muitas requisições
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Helper para cache
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Função para fazer requisições com tratamento de erro
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        // Rate limit - aguarda antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Função para normalizar dados do manga
const normalizeMangaData = (jikanManga) => {
  return {
    id: jikanManga.mal_id,
    title: jikanManga.title || jikanManga.title_english || 'Título não disponível',
    cover: jikanManga.images?.jpg?.large_image_url || jikanManga.images?.jpg?.image_url || '/images/default-image.jpg',
    rating: jikanManga.score || 0,
    status: translateStatus(jikanManga.status),
    genre: jikanManga.genres?.map(g => g.name) || [],
    lastUpdate: formatDate(jikanManga.published?.from),
    chapters: jikanManga.chapters || 0,
    isFavorite: false,
    synopsis: jikanManga.synopsis || 'Sinopse não disponível',
    authors: jikanManga.authors?.map(a => a.name) || [],
    year: jikanManga.published?.from ? new Date(jikanManga.published.from).getFullYear() : null,
    type: jikanManga.type || 'Manga',
    volumes: jikanManga.volumes || 0
  };
};

// Traduzir status para português
const translateStatus = (status) => {
  const statusMap = {
    'Finished': 'Completo',
    'Publishing': 'Em andamento',
    'On Hiatus': 'Em hiato',
    'Discontinued': 'Descontinuado',
    'Not yet published': 'Ainda não publicado'
  };
  return statusMap[status] || status;
};

// Formatar data
const formatDate = (dateString) => {
  if (!dateString) return 'Data desconhecida';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return '1 dia';
  if (diffDays < 30) return `${diffDays} dias`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
  return `${Math.floor(diffDays / 365)} anos`;
};

// Buscar mangás populares
export const getPopularMangas = async (limit = 12) => {
  const cacheKey = `popular_${limit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(
      `${JIKAN_BASE_URL}/top/manga?type=manga&filter=bypopularity&limit=${limit}`
    );

    const mangas = response.data.map(normalizeMangaData);
    setCachedData(cacheKey, mangas);
    return mangas;
  } catch (error) {
    console.error('Erro ao buscar mangás populares:', error);
    return [];
  }
};

// Buscar mangás mais bem avaliados
export const getTopRatedMangas = async (limit = 12) => {
  const cacheKey = `top_rated_${limit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(
      `${JIKAN_BASE_URL}/top/manga?type=manga&filter=byscore&limit=${limit}`
    );

    const mangas = response.data.map(normalizeMangaData);
    setCachedData(cacheKey, mangas);
    return mangas;
  } catch (error) {
    console.error('Erro ao buscar mangás mais bem avaliados:', error);
    return [];
  }
};

// Buscar mangás recentes
export const getLatestMangas = async (limit = 12) => {
  const cacheKey = `latest_${limit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(
      `${JIKAN_BASE_URL}/manga?order_by=start_date&sort=desc&limit=${limit}&status=publishing`
    );

    const mangas = response.data.map(normalizeMangaData);
    setCachedData(cacheKey, mangas);
    return mangas;
  } catch (error) {
    console.error('Erro ao buscar mangás recentes:', error);
    return [];
  }
};

// Buscar manga por ID
export const getMangaById = async (id) => {
  const cacheKey = `manga_${id}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(`${JIKAN_BASE_URL}/manga/${id}`);
    const manga = normalizeMangaData(response.data);
    setCachedData(cacheKey, manga);
    return manga;
  } catch (error) {
    console.error(`Erro ao buscar manga ${id}:`, error);
    return null;
  }
};

// Buscar mangás por termo de pesquisa
export const searchMangas = async (query, limit = 12) => {
  if (!query.trim()) return [];

  const cacheKey = `search_${query}_${limit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(
      `${JIKAN_BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`
    );

    const mangas = response.data.map(normalizeMangaData);
    setCachedData(cacheKey, mangas);
    return mangas;
  } catch (error) {
    console.error('Erro ao pesquisar mangás:', error);
    return [];
  }
};

// Buscar mangás por gênero
export const getMangasByGenre = async (genreId, limit = 12) => {
  const cacheKey = `genre_${genreId}_${limit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(
      `${JIKAN_BASE_URL}/manga?genres=${genreId}&limit=${limit}`
    );

    const mangas = response.data.map(normalizeMangaData);
    setCachedData(cacheKey, mangas);
    return mangas;
  } catch (error) {
    console.error(`Erro ao buscar mangás do gênero ${genreId}:`, error);
    return [];
  }
};

// Buscar gêneros disponíveis
export const getGenres = async () => {
  const cacheKey = 'genres';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(`${JIKAN_BASE_URL}/genres/manga`);

    // Mapear e remover duplicatas baseado no nome
    const genresMap = new Map();

    response.data.forEach(genre => {
      const genreName = genre.name;
      // Se já existe um gênero com este nome, manter o que tem maior contagem
      if (genresMap.has(genreName)) {
        const existing = genresMap.get(genreName);
        if (genre.count > existing.count) {
          genresMap.set(genreName, {
            id: genre.mal_id,
            name: genre.name,
            count: genre.count
          });
        }
      } else {
        genresMap.set(genreName, {
          id: genre.mal_id,
          name: genre.name,
          count: genre.count
        });
      }
    });

    // Converter Map de volta para array
    const genres = Array.from(genresMap.values());

    setCachedData(cacheKey, genres);
    return genres;
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
};

// Limpar cache
export const clearCache = () => {
  cache.clear();
};
