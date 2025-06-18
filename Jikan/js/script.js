// Testador da API Jikan - Funções JavaScript

// Efeito Sticky da Navbar
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  // Inicializar ScrollSpy para ativação automática dos links da navbar
  initScrollSpy();
});

// Função ScrollSpy para ativar links da navbar conforme o scroll
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id$="-section"]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
  
  // Função para determinar qual seção está atualmente visível
  function getCurrentSection() {
    let currentSection = null;
    const scrollPosition = window.scrollY + 100; // Offset para ativação antecipada
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) currentSection = section.id;
    });
    
    return currentSection;
  }
  
  // Função para atualizar os links ativos
  function updateActiveLink() {
    const currentSection = getCurrentSection();
    
    // Remove a classe 'active' de todos os links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Adiciona a classe 'active' ao link correspondente à seção atual
    if (currentSection) {
      const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${currentSection}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }
  
  // Adiciona listener de scroll
  window.addEventListener('scroll', updateActiveLink);
  
  // Executa uma vez para definir o estado inicial
  updateActiveLink();
}

// URL base da API
const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// Contadores de estatísticas
let stats = {
  animeCount: 0,
  mangaCount: 0,
  charactersCount: 0,
  totalRequests: 0
};

// Cache para gêneros
let genresCache = {
  anime: null,
  manga: null
};

// Função utilitária para mostrar o spinner de carregamento
function showLoading(elementId) {
  document.getElementById(elementId).classList.remove('d-none');
}

// Função utilitária para esconder o spinner de carregamento
function hideLoading(elementId) {
  document.getElementById(elementId).classList.add('d-none');
}

// Função para atualizar a exibição das estatísticas
function updateStats() {
  document.getElementById('animeCount').textContent = stats.animeCount;
  document.getElementById('mangaCount').textContent = stats.mangaCount;
  document.getElementById('charactersCount').textContent = stats.charactersCount;
  document.getElementById('totalRequests').textContent = stats.totalRequests;
}

// Função genérica de requisição à API
async function makeApiRequest(endpoint) {
  try {
    stats.totalRequests++;
    updateStats();

    const response = await fetch(`${JIKAN_API_BASE}${endpoint}`);

    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Falha na requisição da API:', error);
    throw error;
  }
}

// Função de busca de anime
async function searchAnime() {
  const query = document.getElementById('animeSearch').value.trim();

  if (!query) {
    alert('Por favor, digite o nome de um anime para buscar!');
    return;
  }

  showLoading('animeLoading');

  try {
    const data = await makeApiRequest(`/anime?q=${encodeURIComponent(query)}&limit=12`);
    displayAnimeResults(data.data, 'animeResults');
    stats.animeCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('animeResults', 'Erro ao buscar animes. Tente novamente.');
  } finally {
    hideLoading('animeLoading');
  }
}

// Função para obter top animes
async function getTopAnime() {
  showLoading('animeLoading');

  try {
    const data = await makeApiRequest('/top/anime?limit=12');
    displayAnimeResults(data.data, 'animeResults');
    stats.animeCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('animeResults', 'Erro ao carregar top animes. Tente novamente.');
  } finally {
    hideLoading('animeLoading');
  }
}

// Função de busca de manga
async function searchManga() {
  const query = document.getElementById('mangaSearch').value.trim();

  if (!query) {
    alert('Por favor, digite o nome de um manga para buscar!');
    return;
  }

  showLoading('mangaLoading');

  try {
    const data = await makeApiRequest(`/manga?q=${encodeURIComponent(query)}&limit=12`);
    displayMangaResults(data.data, 'mangaResults');
    stats.mangaCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('mangaResults', 'Erro ao buscar mangás. Tente novamente.');
  } finally {
    hideLoading('mangaLoading');
  }
}

// Função para obter top mangás
async function getTopManga() {
  showLoading('mangaLoading');

  try {
    const data = await makeApiRequest('/top/manga?limit=12');
    displayMangaResults(data.data, 'mangaResults');
    stats.mangaCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('mangaResults', 'Erro ao carregar top mangás. Tente novamente.');
  } finally {
    hideLoading('mangaLoading');
  }
}

// Função para obter anime aleatório
async function getRandomAnime() {
  showLoading('randomLoading');

  try {
    const data = await makeApiRequest('/random/anime');
    displayRandomResult(data.data, 'randomResults', 'anime');
    stats.animeCount += 1;
    updateStats();
  } catch (error) {
    displayError('randomResults', 'Erro ao carregar anime aleatório. Tente novamente.');
  } finally {
    hideLoading('randomLoading');
  }
}

// Função para obter manga aleatório
async function getRandomManga() {
  showLoading('randomLoading');

  try {
    const data = await makeApiRequest('/random/manga');
    displayRandomResult(data.data, 'randomResults', 'manga');
    stats.mangaCount += 1;
    updateStats();
  } catch (error) {
    displayError('randomResults', 'Erro ao carregar manga aleatório. Tente novamente.');
  } finally {
    hideLoading('randomLoading');
  }
}

// ========== FUNCIONALIDADES DE PERSONAGENS ==========

// Função de busca de personagens
async function searchCharacters() {
  const query = document.getElementById('characterSearch').value.trim();

  if (!query) {
    alert('Por favor, digite o nome de um personagem para buscar!');
    return;
  }

  showLoading('charactersLoading');

  try {
    const data = await makeApiRequest(`/characters?q=${encodeURIComponent(query)}&limit=12`);
    displayCharacterResults(data.data, 'charactersResults');
    stats.charactersCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('charactersResults', 'Erro ao buscar personagens. Tente novamente.');
  } finally {
    hideLoading('charactersLoading');
  }
}

// Função para obter top personagens
async function getTopCharacters() {
  showLoading('charactersLoading');

  try {
    const data = await makeApiRequest('/top/characters?limit=12');
    displayCharacterResults(data.data, 'charactersResults');
    stats.charactersCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('charactersResults', 'Erro ao carregar top personagens. Tente novamente.');
  } finally {
    hideLoading('charactersLoading');
  }
}

// ========== FUNCIONALIDADES DE TEMPORADAS ==========

// Função para obter animes de uma temporada específica
async function getSeasonAnime() {
  const year = document.getElementById('seasonYear').value;
  const season = document.getElementById('seasonName').value;

  showLoading('seasonsLoading');

  try {
    const data = await makeApiRequest(`/seasons/${year}/${season}?limit=12`);
    displayAnimeResults(data.data, 'seasonsResults');
    stats.animeCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('seasonsResults', 'Erro ao carregar animes da temporada. Tente novamente.');
  } finally {
    hideLoading('seasonsLoading');
  }
}

// Função para obter temporada atual
async function getCurrentSeason() {
  showLoading('seasonsLoading');

  try {
    const data = await makeApiRequest('/seasons/now?limit=12');
    displayAnimeResults(data.data, 'seasonsResults');
    stats.animeCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('seasonsResults', 'Erro ao carregar temporada atual. Tente novamente.');
  } finally {
    hideLoading('seasonsLoading');
  }
}

// Função para obter próxima temporada
async function getUpcomingSeason() {
  showLoading('seasonsLoading');

  try {
    const data = await makeApiRequest('/seasons/upcoming?limit=12');
    displayAnimeResults(data.data, 'seasonsResults');
    stats.animeCount += data.data.length;
    updateStats();
  } catch (error) {
    displayError('seasonsResults', 'Erro ao carregar próxima temporada. Tente novamente.');
  } finally {
    hideLoading('seasonsLoading');
  }
}

// ========== FUNCIONALIDADES DE GÊNEROS ==========

// Função para carregar gêneros de anime
async function loadAnimeGenres() {
  showLoading('genresLoading');

  try {
    if (!genresCache.anime) {
      const data = await makeApiRequest('/genres/anime');
      genresCache.anime = data.data;
    }
    
    populateGenreSelect(genresCache.anime, 'anime');
    displayGenres(genresCache.anime, 'genresResults', 'anime');
  } catch (error) {
    displayError('genresResults', 'Erro ao carregar gêneros de anime. Tente novamente.');
  } finally {
    hideLoading('genresLoading');
  }
}

// Função para carregar gêneros de manga
async function loadMangaGenres() {
  showLoading('genresLoading');

  try {
    if (!genresCache.manga) {
      const data = await makeApiRequest('/genres/manga');
      genresCache.manga = data.data;
    }
    
    populateGenreSelect(genresCache.manga, 'manga');
    displayGenres(genresCache.manga, 'genresResults', 'manga');
  } catch (error) {
    displayError('genresResults', 'Erro ao carregar gêneros de manga. Tente novamente.');
  } finally {
    hideLoading('genresLoading');
  }
}

// Função para buscar por gênero
async function searchByGenre() {
  const genreId = document.getElementById('genreSelect').value;
  
  if (!genreId) {
    alert('Por favor, selecione um gênero primeiro!');
    return;
  }

  showLoading('genresLoading');

  try {
    // Detecta se é anime ou manga baseado no cache atual
    const isAnime = genresCache.anime && genresCache.anime.some(g => g.mal_id == genreId);
    const endpoint = isAnime ? 'anime' : 'manga';
    
    const data = await makeApiRequest(`/${endpoint}?genres=${genreId}&limit=12`);
    
    if (isAnime) {
      displayAnimeResults(data.data, 'genresResults');
      stats.animeCount += data.data.length;
    } else {
      displayMangaResults(data.data, 'genresResults');
      stats.mangaCount += data.data.length;
    }
    
    updateStats();
  } catch (error) {
    displayError('genresResults', 'Erro ao buscar por gênero. Tente novamente.');
  } finally {
    hideLoading('genresLoading');
  }
}

// ========== FUNCIONALIDADES DE RECOMENDAÇÕES ==========

// Função para obter recomendações de um anime
async function getAnimeRecommendations() {
  const animeId = document.getElementById('animeIdInput').value.trim();

  if (!animeId || animeId < 1) {
    alert('Por favor, digite um ID válido do anime!');
    return;
  }

  showLoading('recommendationsLoading');

  try {
    const data = await makeApiRequest(`/anime/${animeId}/recommendations`);
    displayRecommendations(data.data, 'recommendationsResults');
  } catch (error) {
    displayError('recommendationsResults', 'Erro ao carregar recomendações. Verifique se o ID do anime está correto.');
  } finally {
    hideLoading('recommendationsLoading');
  }
}

// Função para obter recomendações aleatórias
async function getRandomRecommendations() {
  showLoading('recommendationsLoading');

  try {
    const data = await makeApiRequest('/recommendations/anime?limit=10');
    displayRecommendations(data.data, 'recommendationsResults');
  } catch (error) {
    displayError('recommendationsResults', 'Erro ao carregar recomendações aleatórias. Tente novamente.');
  } finally {
    hideLoading('recommendationsLoading');
  }
}

// Exibe resultados de anime
function displayAnimeResults(animes, containerId) {
  const container = document.getElementById(containerId);

  if (!animes || animes.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          Nenhum anime encontrado. Tente outro termo de busca.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = animes.map(anime => `
    <div class="col-lg-6 col-md-4 col-sm-6 mb-4">
      <div class="result-card fade-in-up">
        <div class="p-3">
          <img src="${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}" 
               alt="${anime.title}" 
               class="result-image">
          <div class="mt-3">
            <h5 class="result-title">${anime.title}</h5>
            <p class="result-synopsis">${anime.synopsis || 'Sinopse não disponível.'}</p>
            <div class="result-meta">
              ${anime.score ? `
                <span class="meta-badge score-badge">
                  <i class="fas fa-star me-1"></i>${anime.score}
                </span>
              ` : ''}
              ${anime.status ? `
                <span class="meta-badge status-badge">${anime.status}</span>
              ` : ''}
              ${anime.type ? `
                <span class="meta-badge type-badge">${anime.type}</span>
              ` : ''}
              ${anime.episodes ? `
                <span class="meta-badge">
                  <i class="fas fa-play me-1"></i>${anime.episodes} eps
                </span>
              ` : ''}
              ${anime.year ? `
                <span class="meta-badge">
                  <i class="fas fa-calendar me-1"></i>${anime.year}
                </span>
              ` : ''}
            </div>
            ${anime.url ? `
              <div class="mt-3">
                <a href="${anime.url}" target="_blank" class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-external-link-alt me-1"></i>Ver no MAL
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Exibe resultados de manga
function displayMangaResults(mangas, containerId) {
  const container = document.getElementById(containerId);

  if (!mangas || mangas.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          Nenhum manga encontrado. Tente outro termo de busca.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = mangas.map(manga => `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="result-card fade-in-up">
        <div class="p-3">
          <img src="${manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}" 
               alt="${manga.title}" 
               class="result-image">
          <div class="mt-3">
            <h5 class="result-title">${manga.title}</h5>
            <p class="result-synopsis">${manga.synopsis || 'Sinopse não disponível.'}</p>
            <div class="result-meta">
              ${manga.score ? `
                <span class="meta-badge score-badge">
                  <i class="fas fa-star me-1"></i>${manga.score}
                </span>
              ` : ''}
              ${manga.status ? `
                <span class="meta-badge status-badge">${manga.status}</span>
              ` : ''}
              ${manga.type ? `
                <span class="meta-badge type-badge">${manga.type}</span>
              ` : ''}
              ${manga.chapters ? `
                <span class="meta-badge">
                  <i class="fas fa-book me-1"></i>${manga.chapters} caps
                </span>
              ` : ''}
              ${manga.volumes ? `
                <span class="meta-badge">
                  <i class="fas fa-books me-1"></i>${manga.volumes} vols
                </span>
              ` : ''}
            </div>
            ${manga.url ? `
              <div class="mt-3">
                <a href="${manga.url}" target="_blank" class="btn btn-outline-success btn-sm">
                  <i class="fas fa-external-link-alt me-1"></i>Ver no MAL
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Exibe resultado aleatório
function displayRandomResult(item, containerId, type) {
  const container = document.getElementById(containerId);
  const isAnime = type === 'anime';

  container.innerHTML = `
    <div class="result-card fade-in-up">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}" 
               alt="${item.title}" 
               class="img-fluid rounded-start h-100" 
               style="object-fit: cover; min-height: 300px;">
        </div>
        <div class="col-md-8">
          <div class="card-body p-4">
            <h3 class="card-title mb-3">
              <i class="fas fa-${isAnime ? 'tv' : 'book'} me-2"></i>
              ${item.title}
            </h3>
            <p class="card-text">${item.synopsis || 'Sinopse não disponível.'}</p>
            <div class="result-meta mb-3">
              ${item.score ? `
                <span class="meta-badge score-badge">
                  <i class="fas fa-star me-1"></i>${item.score}
                </span>
              ` : ''}
              ${item.status ? `
                <span class="meta-badge status-badge">${item.status}</span>
              ` : ''}
              ${item.type ? `
                <span class="meta-badge type-badge">${item.type}</span>
              ` : ''}
              ${isAnime && item.episodes ? `
                <span class="meta-badge">
                  <i class="fas fa-play me-1"></i>${item.episodes} episódios
                </span>
              ` : ''}
              ${!isAnime && item.chapters ? `
                <span class="meta-badge">
                  <i class="fas fa-book me-1"></i>${item.chapters} capítulos
                </span>
              ` : ''}
              ${!isAnime && item.volumes ? `
                <span class="meta-badge">
                  <i class="fas fa-books me-1"></i>${item.volumes} volumes
                </span>
              ` : ''}
              ${item.year ? `
                <span class="meta-badge">
                  <i class="fas fa-calendar me-1"></i>${item.year}
                </span>
              ` : ''}
            </div>
            <div class="d-flex gap-2">
              ${item.url ? `
                <a href="${item.url}" target="_blank" class="btn btn-outline-primary">
                  <i class="fas fa-external-link-alt me-1"></i>Ver no MyAnimeList
                </a>
              ` : ''}
              <button class="btn btn-warning" onclick="get${isAnime ? 'Random' : 'Random'}${isAnime ? 'Anime' : 'Manga'}()">
                <i class="fas fa-random me-1"></i>Outro ${isAnime ? 'Anime' : 'Manga'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========== FUNÇÕES DE EXIBIÇÃO PARA NOVOS CONTEÚDOS ==========

// Exibe resultados de personagens
function displayCharacterResults(characters, containerId) {
  const container = document.getElementById(containerId);

  if (!characters || characters.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          Nenhum personagem encontrado. Tente outro termo de busca.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = characters.map(character => `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="result-card fade-in-up">
        <div class="p-3">
          <img src="${character.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}" 
               alt="${character.name}" 
               class="result-image">
          <div class="mt-3">
            <h5 class="result-title">${character.name}</h5>
            ${character.name_kanji ? `
              <p class="text-muted small mb-2">${character.name_kanji}</p>
            ` : ''}
            <p class="result-synopsis">${character.about || 'Informações não disponíveis.'}</p>
            <div class="result-meta">
              ${character.favorites ? `
                <span class="meta-badge">
                  <i class="fas fa-heart me-1"></i>${character.favorites} favoritos
                </span>
              ` : ''}
            </div>
            ${character.url ? `
              <div class="mt-3">
                <a href="${character.url}" target="_blank" class="btn btn-outline-info btn-sm">
                  <i class="fas fa-external-link-alt me-1"></i>Ver no MAL
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Exibe gêneros
function displayGenres(genres, containerId, type) {
  const container = document.getElementById(containerId);
  const isAnime = type === 'anime';

  container.innerHTML = `
    <div class="col-12">
      <h5 class="mb-3">
        <i class="fas fa-${isAnime ? 'tv' : 'book'} me-2"></i>
        Gêneros de ${isAnime ? 'Anime' : 'Manga'}
      </h5>
      <div class="genre-grid">
        ${genres.map(genre => `
          <div class="genre-card" onclick="selectGenre(${genre.mal_id}, '${genre.name}')">
            <div class="genre-content">
              <h6 class="genre-name">${genre.name}</h6>
              <small class="genre-count">${genre.count || 0} títulos</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Exibe recomendações
function displayRecommendations(recommendations, containerId) {
  const container = document.getElementById(containerId);

  if (!recommendations || recommendations.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          Nenhuma recomendação encontrada.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = recommendations.map(rec => {
    const entry = rec.entry || rec;
    const malId = entry.mal_id || entry.id;
    
    return `
      <div class="col-lg-6 col-md-6 mb-4">
        <div class="result-card fade-in-up">
          <div class="row g-0">
            <div class="col-4">
              <img src="${entry.images?.jpg?.image_url || 'https://via.placeholder.com/200x300?text=No+Image'}" 
                   alt="${entry.title}" 
                   class="img-fluid rounded-start h-100" 
                   style="object-fit: cover; min-height: 200px;">
            </div>
            <div class="col-8">
              <div class="card-body p-3">
                <h6 class="card-title">${entry.title}</h6>
                ${rec.votes ? `
                  <div class="mb-2">
                    <span class="meta-badge">
                      <i class="fas fa-thumbs-up me-1"></i>${rec.votes} votos
                    </span>
                  </div>
                ` : ''}
                <div class="d-flex gap-2">
                  ${entry.url ? `
                    <a href="${entry.url}" target="_blank" class="btn btn-outline-primary btn-sm">
                      <i class="fas fa-external-link-alt me-1"></i>Ver
                    </a>
                  ` : ''}
                  ${malId ? `
                    <button class="btn btn-sm btn-outline-secondary" onclick="getAnimeDetails(${malId})">
                      <i class="fas fa-info me-1"></i>Detalhes
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ========== FUNÇÕES AUXILIARES ==========

// Popula o select de gêneros
function populateGenreSelect(genres, type) {
  const select = document.getElementById('genreSelect');
  const isAnime = type === 'anime';
  
  select.innerHTML = `
    <option value="">Selecione um gênero de ${isAnime ? 'anime' : 'manga'}...</option>
    ${genres.map(genre => `
      <option value="${genre.mal_id}">${genre.name} (${genre.count || 0})</option>
    `).join('')}
  `;
}

// Seleciona um gênero
function selectGenre(genreId, genreName) {
  const select = document.getElementById('genreSelect');
  select.value = genreId;
  
  // Feedback visual
  const selectedCard = document.querySelector(`[onclick="selectGenre(${genreId}, '${genreName}')"]`);
  if (selectedCard) {
    // Remove seleção anterior
    document.querySelectorAll('.genre-card').forEach(card => card.classList.remove('selected'));
    // Adiciona seleção atual
    selectedCard.classList.add('selected');
  }
}

// Função para obter detalhes de um anime
async function getAnimeDetails(animeId) {
  try {
    const data = await makeApiRequest(`/anime/${animeId}`);
    displayAnimeModal(data.data);
  } catch (error) {
    alert('Erro ao carregar detalhes do anime.');
  }
}

// Exibe modal com detalhes do anime
function displayAnimeModal(anime) {
  // Criar modal dinamicamente
  const modalHtml = `
    <div class="modal fade" id="animeModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${anime.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <img src="${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}" 
                     alt="${anime.title}" 
                     class="img-fluid rounded">
              </div>
              <div class="col-md-8">
                <p><strong>Sinopse:</strong> ${anime.synopse || 'Não disponível'}</p>
                <p><strong>Episódios:</strong> ${anime.episodes || 'N/A'}</p>
                <p><strong>Status:</strong> ${anime.status || 'N/A'}</p>
                <p><strong>Nota:</strong> ${anime.score || 'N/A'}</p>
                <p><strong>Ano:</strong> ${anime.year || 'N/A'}</p>
                ${anime.genres && anime.genres.length > 0 ? `
                  <p><strong>Gêneros:</strong> ${anime.genres.map(g => g.name).join(', ')}</p>
                ` : ''}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a href="${anime.url}" target="_blank" class="btn btn-primary">Ver no MyAnimeList</a>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove modal anterior se existir
  const existingModal = document.getElementById('animeModal');
  if (existingModal) existingModal.remove();
  
  // Adiciona o novo modal
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Mostra o modal
  const modal = new bootstrap.Modal(document.getElementById('animeModal'));
  modal.show();
  
  // Remove o modal do DOM quando for fechado
  document.getElementById('animeModal').addEventListener('hidden.bs.modal', function () {
    this.remove();
  });
}

// Função para aplicar efeito de hover 3D nos cards
function applyTiltEffect() {
  const cards = document.querySelectorAll('.result-card');
  
  cards.forEach(card => {
    card.classList.add('tilt-enabled');
    
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.15s ease-out';
    });
    
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calcula rotação baseada na posição do mouse
      const rotateX = (mouseY / (rect.height / 2)) * -10; // Máximo 10 graus
      const rotateY = (mouseX / (rect.width / 2)) * 10;   // Máximo 10 graus
      
      // Aplica transformação
      this.style.transform = `
        translateY(-5px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale3d(1.02, 1.02, 1.02)
      `;
      
      // Atualiza posição do brilho
      const glowX = ((mouseX + rect.width / 2) / rect.width) * 100;
      const glowY = ((mouseY + rect.height / 2) / rect.height) * 100;
      
      this.style.setProperty('--glow-x', `${glowX}%`);
      this.style.setProperty('--glow-y', `${glowY}%`);
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transition = 'transform 0.3s ease';
      this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      
      // Reset do brilho
      this.style.removeProperty('--glow-x');
      this.style.removeProperty('--glow-y');
    });
  });
}

// Função para observar mudanças no DOM e aplicar efeitos nos novos cards
function observeCardChanges() {  const resultsContainers = [
    document.getElementById('animeResults'),
    document.getElementById('mangaResults'),
    document.getElementById('randomResults'),
    document.getElementById('charactersResults'),
    document.getElementById('seasonsResults'),
    document.getElementById('genresResults'),
    document.getElementById('recommendationsResults')
  ];
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Aguardar um pouco para que os elementos sejam renderizados
        setTimeout(() => {
          applyTiltEffect();
        }, 100);
      }
    });
  });
  
  resultsContainers.forEach(container => {
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }
  });
}

// Inicializa observador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Tecla Enter para busca de anime
  document.getElementById('animeSearch').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchAnime();
  });

  // Tecla Enter para busca de manga
  document.getElementById('mangaSearch').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchManga();
  });

  // Tecla Enter para busca de personagens
  document.getElementById('characterSearch').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchCharacters();
  });

  // Tecla Enter para recomendações
  document.getElementById('animeIdInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') getAnimeRecommendations();
  });

  // Rolagem suave para links de navegação
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Inicializa estatísticas
  updateStats();

  // Mostra mensagem de boas-vindas
  console.log('🚀 Testador da API Jikan carregado com sucesso!');
  console.log('📚 API Jikan v4 - https://jikan.moe/');
  console.log('✨ Funcionalidades: Busca de anime/manga, tops, aleatórios');

  // Aplica efeito nos cards existentes
  applyTiltEffect();
    
  // Observa mudanças para novos cards
  observeCardChanges();

  // Carrega gêneros de anime por padrão
  loadAnimeGenres();
});

// Funcionalidade do Botão Voltar ao Topo
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  // Mostra/oculta botão com base na posição do scroll
  window.addEventListener('scroll', function() {
    backToTopBtn.classList.toggle('show', window.scrollY > 300);
  });
  
  // Funcionalidade de voltar ao topo
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// Auxiliar para limitação de taxa de requisições
let requestQueue = [];
let isProcessingQueue = false;

async function processRequestQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const { resolve, reject, endpoint } = requestQueue.shift();

    try {
      const result = await makeApiRequest(endpoint);
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Limitação de taxa: aguardar 1 segundo entre requisições
    if (requestQueue.length > 0) await new Promise(resolve => setTimeout(resolve, 1000));
  }

  isProcessingQueue = false;
}

// Requisição à API aprimorada com limitação de taxa
function queueApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, endpoint });
    processRequestQueue();
  });
}