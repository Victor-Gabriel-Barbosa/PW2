// ========================================
// JavaScript para "Eu faço você joga!"
// ========================================

// Importar dados mockados e funções CRUD
import { 
  mockGames, 
  getUserGames, 
  getGameById, 
  addGameToMockData, 
  updateGameInMockData, 
  removeGameFromMockData 
} from './mock-data.js';

// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  where,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
  // Adicione suas configurações do Firebase aqui
  // apiKey: "sua-api-key",
  // authDomain: "seu-projeto.firebaseapp.com",
  // projectId: "seu-projeto-id",
  // storageBucket: "seu-projeto.appspot.com",
  // messagingSenderId: "123456789",
  // appId: "1:123456789:web:abcdef"

  // Configuração temporária para desenvolvimento
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar se Firebase está configurado corretamente
const IS_FIREBASE_ENABLED = firebaseConfig.apiKey !== "demo-key";

// Estado da aplicação
let currentUser = null;
let games = [];
let filteredGames = [];

// Elementos DOM
const loginBtn = document.getElementById('loginBtn');
const userMenu = document.getElementById('userMenu');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const noGamesMessage = document.getElementById('noGamesMessage');
const podium = document.getElementById('podium');
const rankingTableBody = document.getElementById('rankingTableBody');
const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
const successToast = new bootstrap.Toast(document.getElementById('successToast'));
const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

// ========================================
// AUTENTICAÇÃO
// ========================================

// Configurar provedor do Google
const provider = new GoogleAuthProvider();

// Login com Google
loginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    showToast('Bem-vindo! Login realizado com sucesso.', 'success');
  } catch (error) {
    console.error('Erro no login:', error);
    showToast('Erro ao fazer login. Tente novamente.', 'error');
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    showToast('Logout realizado com sucesso.', 'success');
  } catch (error) {
    console.error('Erro no logout:', error);
    showToast('Erro ao fazer logout.', 'error');
  }
});

// Monitorar estado de autenticação
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  
  // Em modo demo, simular usuário logado
  if (!IS_FIREBASE_ENABLED && !currentUser) {
    currentUser = {
      uid: 'current-user',
      displayName: 'Usuário Demo',
      email: 'demo@example.com',
      photoURL: 'images/game-placeholder.jpg'
    };
  }
  
  updateAuthUI();
  loadGames();
});

// Atualizar interface de autenticação
function updateAuthUI() {
  if (currentUser) {
    loginBtn.classList.add('d-none');
    userMenu.classList.remove('d-none');
    userName.textContent = currentUser.displayName || 'Usuário';
    userAvatar.src = currentUser.photoURL || 'images/avatar-placeholder.jpg';
  } else {
    loginBtn.classList.remove('d-none');
    userMenu.classList.add('d-none');
  }
}

// ========================================
// GERENCIAMENTO DE TEMA
// ========================================

// Elementos de tema
const themeButtons = document.querySelectorAll('[data-theme]');
const htmlElement = document.documentElement;

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Listeners para mudança de tema
themeButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const theme = button.dataset.theme;
    setTheme(theme);
    localStorage.setItem('theme', theme);
  });
});

// Aplicar tema
function setTheme(theme) {
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
  } else {
    htmlElement.setAttribute('data-bs-theme', theme);
  }
}

// Escutar mudanças no tema do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'auto') {
    setTheme('auto');
  }
});

// ========================================
// NAVEGAÇÃO SUAVE
// ========================================

// Navegação suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Verifica se o href é válido para navegação (não apenas "#")
    if (href && href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ========================================
// GERENCIAMENTO DE JOGOS
// ========================================

// Carregar jogos do Firestore
async function loadGames() {
  try {
    showLoading(gamesGrid);

    // Em modo demo, usar dados mockados
    if (firebaseConfig.apiKey === "demo-key") {
      games = [...mockGames];
    } else {
      const querySnapshot = await getDocs(collection(db, 'games'));
      games = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    filteredGames = [...games];
    renderGames();
    renderRanking();
  } catch (error) {
    console.error('Erro ao carregar jogos:', error);
    showToast('Erro ao carregar jogos.', 'error');
    hideLoading(gamesGrid);
  }
}

// Renderizar jogos
function renderGames() {
  if (filteredGames.length === 0) {
    gamesGrid.innerHTML = '';
    noGamesMessage.classList.remove('d-none');
    return;
  }

  noGamesMessage.classList.add('d-none');

  const gamesHTML = filteredGames.map(game => createGameCard(game)).join('');
  gamesGrid.innerHTML = gamesHTML;

  // Adicionar listeners para os cards
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.dataset.gameId;
      const game = games.find(g => g.id === gameId);
      if (game) {
        showGameModal(game);
      }
    });
  });
}

// Criar card de jogo
function createGameCard(game) {
  const stars = createStarRating(game.averageRating || 0, true);

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card game-card h-100" data-game-id="${game.id}">
        <img src="${game.image || 'images/game-placeholder.jpg'}" 
             class="card-img-top" alt="${game.title}">
        <div class="card-img-overlay d-flex align-items-center justify-content-center">
          <button class="btn play-btn">
            <i class="bi bi-play-fill"></i>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title text-truncate">${game.title}</h5>
          <p class="text-muted mb-2">
            <i class="bi bi-person-fill me-1"></i>
            ${game.developers.join(', ')}
          </p>
          <p class="card-text text-truncate-2">${game.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="game-rating">
              ${stars}
              <span class="ms-2 text-muted">(${game.totalVotes || 0})</span>
            </div>
            <small class="text-muted">
              ${game.category || 'Jogo'}
            </small>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Criar avaliação com estrelas
function createStarRating(rating, readonly = false) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';

  // Estrelas cheias
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<i class="bi bi-star-fill star ${readonly ? '' : 'cursor-pointer'}" data-rating="${i + 1}"></i>`;
  }

  // Meia estrela
  if (hasHalfStar) {
    starsHTML += `<i class="bi bi-star-half star ${readonly ? '' : 'cursor-pointer'}" data-rating="${fullStars + 1}"></i>`;
  }

  // Estrelas vazias
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<i class="bi bi-star star empty ${readonly ? '' : 'cursor-pointer'}" data-rating="${fullStars + (hasHalfStar ? 1 : 0) + i + 1}"></i>`;
  }

  return starsHTML;
}

// Mostrar modal do jogo
function showGameModal(game) {
  const modalTitle = document.getElementById('gameModalTitle');
  const modalBody = document.getElementById('gameModalBody');

  modalTitle.textContent = game.title;

  const votingSection = currentUser ? `
      <div class="voting-section">
        <h6 class="text-center mb-3">Avalie este jogo</h6>
        <div class="star-rating" data-game-id="${game.id}">
          ${createStarRating(getUserRating(game.id) || 0)}
        </div>
        <div class="text-center">
          <button class="btn btn-primary" onclick="submitRating('${game.id}')">
            Confirmar Avaliação
          </button>
        </div>
    </div>
  ` : `
    <div class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      Faça login para avaliar este jogo.
    </div>
  `;

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img src="${game.image || 'images/game-placeholder.jpg'}" 
             class="img-fluid rounded mb-3" alt="${game.title}">
        
        <div class="d-grid gap-2">
          <a href="${game.playUrl || '#'}" class="btn btn-primary btn-lg" target="_blank">
            <i class="bi bi-play-circle me-2"></i>
            Jogar Agora
          </a>
          ${game.videoUrl ? `
            <a href="${game.videoUrl}" class="btn btn-outline-primary" target="_blank">
              <i class="bi bi-camera-video me-2"></i>
              Ver Gameplay
            </a>
          ` : ''}
        </div>
      </div>
      <div class="col-md-6">
        <h6>Sobre o Jogo</h6>
        <p>${game.description}</p>
        
        <h6>Desenvolvedor(es)</h6>
        <p><i class="bi bi-person-fill me-2"></i>${game.developers.join(', ')}</p>
        
        <h6>Categoria</h6>
        <p><i class="bi bi-tag me-2"></i>${game.category || 'Jogo'}</p>
        
        <h6>Avaliação</h6>
        <div class="d-flex align-items-center mb-3">
          ${createStarRating(game.averageRating || 0, true)}
          <span class="ms-2">
            ${(game.averageRating || 0).toFixed(1)} 
            (${game.totalVotes || 0} voto${(game.totalVotes || 0) !== 1 ? 's' : ''})
          </span>
        </div>
        
        ${votingSection}
      </div>
    </div>
  `;

  // Adicionar listeners para as estrelas de avaliação
  if (currentUser) {
    const stars = modalBody.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        updateStarDisplay(star.parentElement, rating);
      });
    });
  }

  gameModal.show();
}

// Atualizar display das estrelas
function updateStarDisplay(container, rating) {
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.className = 'bi bi-star-fill star cursor-pointer active';
    } else {
      star.className = 'bi bi-star star empty cursor-pointer';
    }
  });
}

// Obter avaliação do usuário para um jogo
function getUserRating(gameId) {
  if (!currentUser) return 0;

  // Em modo demo, usar localStorage
  const userRatings = JSON.parse(localStorage.getItem(`ratings_${currentUser.uid}`) || '{}');
  return userRatings[gameId] || 0;
}

// Submeter avaliação
async function submitRating(gameId) {
  if (!currentUser) {
    showToast('Faça login para avaliar jogos.', 'error');
    return;
  }

  const starRating = document.querySelector(`.star-rating[data-game-id="${gameId}"]`);
  const activeStars = starRating.querySelectorAll('.star.active');
  const rating = activeStars.length;

  if (rating === 0) {
    showToast('Selecione uma avaliação.', 'error');
    return;
  }

  try {
    // Em modo demo, salvar no localStorage
    if (firebaseConfig.apiKey === "demo-key") {
      const userRatings = JSON.parse(localStorage.getItem(`ratings_${currentUser.uid}`) || '{}');
      const oldRating = userRatings[gameId];
      userRatings[gameId] = rating;
      localStorage.setItem(`ratings_${currentUser.uid}`, JSON.stringify(userRatings));

      // Atualizar jogo local
      const game = games.find(g => g.id === gameId);
      if (game) {
        if (oldRating) {
          // Substituir avaliação existente
          const index = game.ratings.indexOf(oldRating);
          if (index > -1) {
            game.ratings[index] = rating;
          }
        } else {
          // Nova avaliação
          game.ratings.push(rating);
          game.totalVotes = game.ratings.length;
        }

        // Recalcular média
        game.averageRating = game.ratings.reduce((a, b) => a + b, 0) / game.ratings.length;
      }
    } else {
      // Código real do Firestore
      const gameRef = doc(db, 'games', gameId);
      const userRatingRef = doc(db, 'user_ratings', `${currentUser.uid}_${gameId}`);

      // Verificar se usuário já avaliou
      const existingRating = await getDoc(userRatingRef);

      if (existingRating.exists()) {
        // Atualizar avaliação existente
        await updateDoc(userRatingRef, { rating, updatedAt: new Date() });
        await updateDoc(gameRef, {
          [`ratings.${currentUser.uid}`]: rating
        });
      } else {
        // Nova avaliação
        await addDoc(collection(db, 'user_ratings'), {
          userId: currentUser.uid,
          gameId,
          rating,
          createdAt: new Date()
        });

        await updateDoc(gameRef, {
          [`ratings.${currentUser.uid}`]: rating,
          totalVotes: arrayUnion(currentUser.uid)
        });
      }
    }

    showToast('Avaliação registrada com sucesso!', 'success');
    gameModal.hide();
    loadGames(); // Recarregar para atualizar as avaliações

  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    showToast('Erro ao salvar avaliação.', 'error');
  }
}

// Tornar função global
window.submitRating = submitRating;

// ========================================
// BUSCA E FILTROS
// ========================================

// Busca de jogos
searchInput.addEventListener('input', filterGames);
sortSelect.addEventListener('change', filterGames);

function filterGames() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const sortBy = sortSelect.value;

  // Filtrar por termo de busca
  filteredGames = games.filter(game => {
    return game.title.toLowerCase().includes(searchTerm) ||
      game.developers.some(dev => dev.toLowerCase().includes(searchTerm)) ||
      (game.description && game.description.toLowerCase().includes(searchTerm)) ||
      (game.category && game.category.toLowerCase().includes(searchTerm));
  });

  // Ordenar resultados
  switch (sortBy) {
    case 'date-desc':
      filteredGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'rating-desc':
      filteredGames.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      break;
    case 'rating-asc':
      filteredGames.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
      break;
    case 'name-asc':
      filteredGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      filteredGames.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  renderGames();
}

// ========================================
// RANKING
// ========================================

function renderRanking() {
  // Ordenar jogos por avaliação
  const rankedGames = [...games].sort((a, b) => {
    const avgA = a.averageRating || 0;
    const avgB = b.averageRating || 0;
    if (avgB !== avgA) return avgB - avgA;
    return (b.totalVotes || 0) - (a.totalVotes || 0);
  });

  renderPodium(rankedGames.slice(0, 3));
  renderRankingTable(rankedGames);
}

function renderPodium(topGames) {
  if (topGames.length === 0) {
    podium.innerHTML = '<p class="text-center text-muted">Nenhum jogo avaliado ainda.</p>';
    return;
  }

  const podiumHTML = topGames.map((game, index) => {
    const position = index + 1;
    const positionClass = position === 1 ? 'first' : position === 2 ? 'second' : 'third';
    const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉';

    return `
        <div class="col-md-4">
          <div class="podium-place ${positionClass}" data-game-id="${game.id}">
            <div class="position-badge">${medal}</div>
            <img src="${game.image || 'images/game-placeholder.jpg'}" 
                 class="img-fluid rounded mb-3" alt="${game.title}" 
                 style="max-height: 120px; object-fit: cover;">
            <h5 class="mb-2">${game.title}</h5>
            <p class="text-muted mb-2">${game.developers.join(', ')}</p>
            <div class="game-rating justify-content-center">
              ${createStarRating(game.averageRating || 0, true)}
            </div>
            <p class="mt-2 mb-0">
              <strong>${(game.averageRating || 0).toFixed(1)}</strong>
              <small class="text-muted">(${game.totalVotes || 0} votos)</small>
            </p>
        </div>
      </div>
    `;
  }).join('');

  podium.innerHTML = podiumHTML;

  // Adicionar listeners para o pódio
  document.querySelectorAll('.podium-place').forEach(place => {
    place.addEventListener('click', () => {
      const gameId = place.dataset.gameId;
      const game = games.find(g => g.id === gameId);
      if (game) {
        showGameModal(game);
      }
    });
  });
}

function renderRankingTable(rankedGames) {
  if (rankedGames.length === 0) {
    rankingTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum jogo encontrado.</td></tr>';
    return;
  }

  const tableHTML = rankedGames.map((game, index) => {
    const position = index + 1;
    const badgeClass = position <= 3 ? `position-${position}` : 'position-other';

    return `
      <tr class="cursor-pointer" data-game-id="${game.id}">
        <td>
          <span class="position-badge-small ${badgeClass}">${position}</span>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${game.image || 'images/game-placeholder.jpg'}" 
                 alt="${game.title}" class="rounded me-3" 
                 style="width: 50px; height: 50px; object-fit: cover;">
            <div>
              <h6 class="mb-0">${game.title}</h6>
              <small class="text-muted">${game.category || 'Jogo'}</small>
            </div>
          </div>
        </td>
        <td>${game.developers.join(', ')}</td>
        <td>
          <div class="d-flex align-items-center">
            ${createStarRating(game.averageRating || 0, true)}
            <span class="ms-2">${(game.averageRating || 0).toFixed(1)}</span>
          </div>
        </td>
        <td>${game.totalVotes || 0}</td>
      </tr>
    `;
  }).join('');

  rankingTableBody.innerHTML = tableHTML;

  // Adicionar listeners para as linhas da tabela
  document.querySelectorAll('#rankingTableBody tr[data-game-id]').forEach(row => {
    row.addEventListener('click', () => {
      const gameId = row.dataset.gameId;
      const game = games.find(g => g.id === gameId);
      if (game) {
        showGameModal(game);
      }
    });
  });
}

// ========================================
// UTILITÁRIOS
// ========================================

// Mostrar toast
function showToast(message, type = 'success') {
  const toast = type === 'success' ? successToast : errorToast;
  const toastBody = document.getElementById(`${type}ToastBody`);

  toastBody.textContent = message;
  toast.show();
}

// Mostrar loading
function showLoading(container) {
  container.innerHTML = `
    <div class="col-12">
      <div class="loading">
        <div class="spinner"></div>
        <span class="ms-3">Carregando...</span>
      </div>
    </div>
  `;
}

// Esconder loading
function hideLoading(container) {
  const loading = container.querySelector('.loading');
  if (loading) {
    loading.remove();
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Em modo demo, simular usuário logado automaticamente
  if (!IS_FIREBASE_ENABLED) {
    setTimeout(() => {
      currentUser = {
        uid: 'current-user',
        displayName: 'Usuário Demo',
        email: 'demo@example.com',
        photoURL: 'images/game-placeholder.jpg'
      };
      updateAuthUI();
      loadGames();
    }, 500);
  }

  // Adicionar classe de fade-in às seções conforme scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
      }
    });
  }, observerOptions);

  // Observar seções
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Inicializar tooltips do Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  console.log('🎮 "Eu faço você joga!" inicializado com sucesso!');
});

// ========================================
// GERENCIAMENTO DE JOGOS (CRUD)
// ========================================

// Elementos do formulário de adicionar jogo
const addGameBtn = document.getElementById('addGameBtn');
const myGamesBtn = document.getElementById('myGamesBtn');
const addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
const myGamesModal = new bootstrap.Modal(document.getElementById('myGamesModal'));
const editGameModal = new bootstrap.Modal(document.getElementById('editGameModal'));
const addGameForm = document.getElementById('addGameForm');
const editGameForm = document.getElementById('editGameForm');

// Event listeners para os botões do menu
if (addGameBtn) {
  addGameBtn.addEventListener('click', () => {
    if (!currentUser) {
      showToast('Você precisa estar logado para inscrever um jogo.', 'error');
      return;
    }
    addGameModal.show();
  });
}

if (myGamesBtn) {
  myGamesBtn.addEventListener('click', () => {
    if (!currentUser) {
      showToast('Você precisa estar logado para ver seus jogos.', 'error');
      return;
    }
    loadMyGames();
    myGamesModal.show();
  });
}

// Submissão do formulário de adicionar jogo
if (addGameForm) {
  addGameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showToast('Você precisa estar logado para inscrever um jogo.', 'error');
      return;
    }

    const formData = new FormData(addGameForm);
    const gameData = {
      title: formData.get('name'),
      developers: [formData.get('developer')],
      description: formData.get('description'),
      image: formData.get('image') || 'images/game-placeholder.jpg',
      playUrl: formData.get('gameUrl'),
      videoUrl: '',
      category: formData.get('category'),
      ratings: [],
      averageRating: 0,
      totalVotes: 0,
      createdAt: new Date(),
      tags: [],
      submittedBy: currentUser.uid,
      submittedByName: currentUser.displayName || 'Usuário',
      submittedByEmail: currentUser.email,
      status: 'pending' // pending, approved, rejected
    };    try {
      // Em modo desenvolvimento, adiciona ao mock data local
      if (!IS_FIREBASE_ENABLED) {
        const newGame = addGameToMockData(gameData);
        
        showToast('Jogo inscrito com sucesso! Aguarde a aprovação da moderação.', 'success');
        addGameForm.reset();
        addGameModal.hide();
        loadGames();
      } else {
        // Adicionar ao Firestore quando configurado
        const docRef = await addDoc(collection(db, 'games'), gameData);
        showToast('Jogo inscrito com sucesso! Aguarde a aprovação da moderação.', 'success');
        addGameForm.reset();
        addGameModal.hide();
        loadGames();
      }
    } catch (error) {
      console.error('Erro ao inscrever jogo:', error);
      showToast('Erro ao inscrever jogo. Tente novamente.', 'error');
    }
  });
}

// Submissão do formulário de editar jogo
if (editGameForm) {
  editGameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showToast('Você precisa estar logado para editar um jogo.', 'error');
      return;
    }

    const formData = new FormData(editGameForm);
    const gameId = formData.get('id');
    
    const updatedData = {
      title: formData.get('name'),
      developers: [formData.get('developer')],
      description: formData.get('description'),
      image: formData.get('image') || 'images/game-placeholder.jpg',
      playUrl: formData.get('gameUrl'),
      category: formData.get('category'),
    };    try {
      // Em modo desenvolvimento, atualiza no mock data local
      if (!IS_FIREBASE_ENABLED) {
        const game = getGameById(gameId);
        if (game) {
          // Verifica se o usuário pode editar este jogo
          if (game.submittedBy !== currentUser.uid) {
            showToast('Você só pode editar seus próprios jogos.', 'error');
            return;
          }
          
          updateGameInMockData(gameId, updatedData);
          showToast('Jogo atualizado com sucesso!', 'success');
          editGameForm.reset();
          editGameModal.hide();
          loadGames();
          loadMyGames();
        }
      } else {
        // Atualizar no Firestore quando configurado
        await updateDoc(doc(db, 'games', gameId), updatedData);
        showToast('Jogo atualizado com sucesso!', 'success');
        editGameForm.reset();
        editGameModal.hide();
        loadGames();
        loadMyGames();
      }
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
      showToast('Erro ao atualizar jogo. Tente novamente.', 'error');
    }
  });
}

// Carregar jogos do usuário
function loadMyGames() {
  if (!currentUser) return;

  const myGamesContent = document.getElementById('myGamesContent');
  if (!myGamesContent) return;

  // Filtrar jogos do usuário atual
  const userGames = getUserGames(currentUser.uid);

  if (userGames.length === 0) {
    myGamesContent.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-controller text-muted" style="font-size: 4rem;"></i>
        <h4 class="text-muted mt-3">Nenhum jogo inscrito</h4>
        <p class="text-muted">Você ainda não inscreveu nenhum jogo na competição.</p>
        <button class="btn btn-primary" onclick="document.getElementById('addGameBtn').click(); myGamesModal.hide();">
          <i class="bi bi-plus-circle me-2"></i>Inscrever Primeiro Jogo
        </button>
      </div>
    `;
    return;
  }

  myGamesContent.innerHTML = `
    <div class="row g-3">
      ${userGames.map(game => `
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="row g-0">
              <div class="col-4">
                <img src="${game.image}" class="img-fluid rounded-start h-100" style="object-fit: cover;" alt="${game.title}">
              </div>
              <div class="col-8">
                <div class="card-body">
                  <h6 class="card-title">${game.title}</h6>
                  <p class="card-text small text-muted">${game.description.substring(0, 100)}...</p>
                  <div class="d-flex align-items-center mb-2">
                    <span class="badge bg-primary me-2">${game.category}</span>
                    <span class="badge ${getStatusBadgeClass(game.status)}">${getStatusText(game.status)}</span>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm" onclick="editGame('${game.id}')">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteGame('${game.id}')">
                      <i class="bi bi-trash"></i>
                    </button>
                    <a href="${game.playUrl}" target="_blank" class="btn btn-outline-success btn-sm">
                      <i class="bi bi-play"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Editar jogo
function editGame(gameId) {
  const game = getGameById(gameId);
  if (!game) return;

  // Verifica se o usuário pode editar este jogo
  if (!currentUser || game.submittedBy !== currentUser.uid) {
    showToast('Você só pode editar seus próprios jogos.', 'error');
    return;
  }

  // Preencher o formulário de edição
  document.getElementById('editGameId').value = game.id;
  document.getElementById('editGameName').value = game.title;
  document.getElementById('editGameDeveloper').value = game.developers[0] || '';
  document.getElementById('editGameCategory').value = game.category;
  document.getElementById('editGameUrl').value = game.playUrl;
  document.getElementById('editGameDescription').value = game.description;
  document.getElementById('editGameImage').value = game.image !== 'images/game-placeholder.jpg' ? game.image : '';

  myGamesModal.hide();
  editGameModal.show();
}

// Excluir jogo
function deleteGame(gameId) {
  const game = getGameById(gameId);
  if (!game) return;

  // Verifica se o usuário pode excluir este jogo
  if (!currentUser || game.submittedBy !== currentUser.uid) {
    showToast('Você só pode excluir seus próprios jogos.', 'error');
    return;
  }

  if (confirm(`Tem certeza que deseja excluir o jogo "${game.title}"? Esta ação não pode ser desfeita.`)) {
    try {
      // Em modo desenvolvimento, remove do mock data local
      if (!IS_FIREBASE_ENABLED) {
        const removedGame = removeGameFromMockData(gameId);
        if (removedGame) {
          showToast('Jogo excluído com sucesso!', 'success');
          loadGames();
          loadMyGames();
        }
      } else {
        // Remover do Firestore quando configurado
        // await deleteDoc(doc(db, 'games', gameId));
      }
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
      showToast('Erro ao excluir jogo. Tente novamente.', 'error');
    }
  }
}

// Funções auxiliares para status
function getStatusBadgeClass(status) {
  switch (status) {
    case 'approved': return 'bg-success';
    case 'rejected': return 'bg-danger';
    case 'pending': return 'bg-warning';
    default: return 'bg-secondary';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'approved': return 'Aprovado';
    case 'rejected': return 'Rejeitado';
    case 'pending': return 'Pendente';
    default: return 'Desconhecido';
  }
}

// Tornar funções globais para onclick
window.editGame = editGame;
window.deleteGame = deleteGame;