// INÍCIO - LÓGICA DE TEMAS (parte que pode ficar fora do DOMContentLoaded)
const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');
const rootElement = document.documentElement; // Referência ao <html> tag

// Função para aplicar o tema desejado (definição da função)
function applyUserThemePreference(themeChoice) {
  let effectiveTheme = themeChoice;
  if (themeChoice === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  rootElement.setAttribute('data-theme', effectiveTheme); // Aplica o tema 'light' ou 'dark' ao <html>
  localStorage.setItem('themeSelection', themeChoice); // Salva a ESCOLHA do usuário ('light', 'dark', ou 'system')

  // Atualiza a classe 'active' nos botões
  themeToggleButtons.forEach(btn => {
    if (btn.dataset.themeToggle === themeChoice) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Listener para mudanças na preferência de esquema de cores do sistema (definição do listener)
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', (e) => {
  // Se o tema "sistema" estiver selecionado, atualiza o tema visual
  if (localStorage.getItem('themeSelection') === 'system') {
    applyUserThemePreference('system');
  }
});
// FIM - LÓGICA DE TEMAS (parte que pode ficar fora)


// Espera o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
  // INICIALIZAÇÃO DO TEMA (aplicação e listeners dos botões de tema)
  const initialTheme = localStorage.getItem('themeSelection') || 'system'; // Pega o tema salvo ou usa 'system' como padrão
  applyUserThemePreference(initialTheme);

  // Adiciona listeners de clique aos botões de tema (AGORA DENTRO DO DOMContentLoaded)
  themeToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const chosenTheme = button.dataset.themeToggle;
      applyUserThemePreference(chosenTheme);
    });
  });

  // SELETORES DE ELEMENTOS DO DOM
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const animeListDiv = document.getElementById('animeList');

  // SELETORES DE ELEMENTOS DO MODAL
  const animeModal = document.getElementById('animeModal');
  const modalCloseButton = animeModal.querySelector('.modal-close-button');
  const modalAnimeDetailsDiv = document.getElementById('modalAnimeDetails');

  const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

  // FUNÇÕES DE CONTROLE DO MODAL (Definidas aqui para ter acesso aos seletores)
  function openModal() {
    animeModal.style.display = 'block';
    document.body.classList.add('modal-open'); // Impede scroll do body
  }

  function closeModal() {
    animeModal.style.display = 'none';
    document.body.classList.remove('modal-open'); // Restaura scroll do body
    modalAnimeDetailsDiv.innerHTML = ''; // Limpa o conteúdo do modal ao fechar
  }

  // ADICIONA EVENTOS PARA FECHAR O MODAL (Definidos aqui)
  modalCloseButton.addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    // Fecha o modal se o clique for no overlay (fora do modal-content)
    if (event.target === animeModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    // Fecha o modal se a tecla Escape for pressionada
    if (event.key === 'Escape' && animeModal.style.display === 'block') {
      closeModal();
    }
  });

  // FUNÇÃO PARA EXIBIR OS DETALHES DO ANIME NO MODAL
  function displayAnimeDetailsInModal(anime) { // Renomeada para clareza e evitar conflito
    modalAnimeDetailsDiv.innerHTML = ''; // Limpa a mensagem "Carregando..." ou detalhes anteriores

    // Título
    const title = document.createElement('h3');
    title.textContent = anime.title_japanese ? `${anime.title} / ${anime.title_japanese}` : anime.title;
    modalAnimeDetailsDiv.appendChild(title);

    // Imagem de capa
    if (anime.images?.jpg?.large_image_url) {
      const coverImage = document.createElement('img');
      coverImage.src = anime.images.jpg.large_image_url;
      coverImage.alt = `Capa de ${anime.title}`;
      coverImage.classList.add('cover-image');
      modalAnimeDetailsDiv.appendChild(coverImage);
    }

    // Sinopse
    if (anime.synopsis) {
      const synopsis = document.createElement('p');
      let cleanSynopsis = anime.synopsis.replace(/\[Written by MAL Rewrite\]/gi, '').trim();
      synopsis.innerHTML = `<strong>Sinopse:</strong><br>${cleanSynopsis.replace(/\n/g, '<br>')}`;
      modalAnimeDetailsDiv.appendChild(synopsis);
    } else {
      const noSynopsis = document.createElement('p');
      noSynopsis.textContent = 'Sinopse não disponível.';
      modalAnimeDetailsDiv.appendChild(noSynopsis);
    }

    // Container para outros parágrafos para limpar o float da imagem
    const detailsTextContainer = document.createElement('div');
    detailsTextContainer.style.clear = 'both'; // Limpa o float da imagem
    modalAnimeDetailsDiv.appendChild(detailsTextContainer);

    // Gêneros
    if (anime.genres && anime.genres.length > 0) {
      const genres = document.createElement('p');
      genres.innerHTML = `<strong>Gêneros:</strong> ${anime.genres.map(g => g.name).join(', ')}`;
      detailsTextContainer.appendChild(genres);
    }

    // Informações adicionais (Tipo, Episódios, Status, Duração, Pontuação)
    let infoText = '';
    if (anime.type) infoText += `<strong>Tipo:</strong> ${anime.type}<br>`;
    if (anime.episodes) infoText += `<strong>Episódios:</strong> ${anime.episodes}<br>`;
    if (anime.status) infoText += `<strong>Status:</strong> ${anime.status}<br>`;
    if (anime.duration) infoText += `<strong>Duração:</strong> ${anime.duration}<br>`;
    if (anime.score) infoText += `<strong>Pontuação:</strong> ${anime.score} (por ${anime.scored_by} usuários)<br>`;

    const infoParagraph = document.createElement('p');
    infoParagraph.innerHTML = infoText;
    detailsTextContainer.appendChild(infoParagraph);

    // Produtores e Estúdios
    if (anime.producers && anime.producers.length > 0) {
      const producers = document.createElement('p');
      producers.innerHTML = `<strong>Produtores:</strong> ${anime.producers.map(p => p.name).join(', ')}`;
      detailsTextContainer.appendChild(producers);
    }
    if (anime.studios && anime.studios.length > 0) {
      const studios = document.createElement('p');
      studios.innerHTML = `<strong>Estúdios:</strong> ${anime.studios.map(s => s.name).join(', ')}`;
      detailsTextContainer.appendChild(studios);
    }

    // Trailer (se disponível)
    if (anime.trailer?.youtube_id) {
      const trailerContainer = document.createElement('div');
      trailerContainer.classList.add('trailer-container');
      // Corrigindo o link do iframe do YouTube para usar template literals corretamente
      trailerContainer.innerHTML = `
                <h4>Trailer</h4>
                <iframe 
                    src="https://www.youtube.com/embed/${anime.trailer.youtube_id}" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
      detailsTextContainer.appendChild(trailerContainer);
    }
  }

  // FUNÇÃO PARA BUSCAR DETALHES DE UM ANIME ESPECÍFICO E EXIBIR NO MODAL
  async function fetchAnimeDetailsAndDisplayInModal(animeId) { // Renomeada para clareza
    modalAnimeDetailsDiv.innerHTML = '<p>Carregando detalhes...</p>';
    openModal(); // Abre o modal ANTES de carregar, mostrando "Carregando..."

    try {
      const response = await fetch(`${JIKAN_API_BASE_URL}/anime/${animeId}/full`);
      if (!response.ok) {
        modalAnimeDetailsDiv.innerHTML = `<p>Erro na API ao buscar detalhes (${response.status} ${response.statusText}). Tente fechar e abrir novamente.</p>`;
        return;
      }
      const data = await response.json();
      if (data && data.data) {
        displayAnimeDetailsInModal(data.data); // Chama a função correta para o modal
      } else {
        modalAnimeDetailsDiv.innerHTML = '<p>Não foram encontrados detalhes para este anime.</p>';
      }
    } catch (error) {
      console.error('Falha ao buscar detalhes do anime:', error);
      modalAnimeDetailsDiv.innerHTML = `<p>Erro ao carregar detalhes: ${error.message}. Tente fechar e abrir novamente.</p>`;
    }
  }

  // FUNÇÃO PARA BUSCAR ANIMES (LISTA)
  async function searchAnimes(query) {
    animeListDiv.innerHTML = '<p>Buscando...</p>';
    try {
      const response = await fetch(`${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(query)}&sfw&limit=15`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      const data = await response.json();
      displayAnimeResults(data.data);
    } catch (error) {
      console.error('Falha ao buscar animes:', error);
      animeListDiv.innerHTML = `<p>Erro ao buscar animes: ${error.message}. Tente novamente.</p>`;
    }
  }

  // FUNÇÃO PARA EXIBIR OS RESULTADOS DA BUSCA DE ANIMES (LISTA)
  function displayAnimeResults(animes) {
    animeListDiv.innerHTML = '';

    if (!animes || animes.length === 0) {
      animeListDiv.innerHTML = '<p>Nenhum anime encontrado com esse nome.</p>';
      return;
    }

    animes.forEach(anime => {
      const animeItem = document.createElement('div');
      animeItem.classList.add('anime-item');

      const title = document.createElement('h3');
      title.textContent = anime.title_japanese ? `${anime.title} (${anime.title_japanese})` : anime.title;

      const image = document.createElement('img');
      image.src = anime.images?.jpg?.image_url || 'placeholder.png';
      image.alt = anime.title;

      animeItem.appendChild(image);
      animeItem.appendChild(title);

      animeItem.addEventListener('click', () => {
        fetchAnimeDetailsAndDisplayInModal(anime.mal_id); // Chama a função correta para o modal
      });

      animeListDiv.appendChild(animeItem);
    });
  }

  // EVENT LISTENERS PRINCIPAIS DA PÁGINA (Busca)
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchAnimes(query);
    } else {
      animeListDiv.innerHTML = '<p>Por favor, digite um nome para buscar.</p>';
    }
  });

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        searchAnimes(query);
      } else {
        animeListDiv.innerHTML = '<p>Por favor, digite um nome para buscar.</p>';
      }
    }
  });
});