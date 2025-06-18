const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');
const rootElement = document.documentElement; 

function applyUserThemePreference(themeChoice) {
  let effectiveTheme = themeChoice;
  if (themeChoice === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  rootElement.setAttribute('data-theme', effectiveTheme); 
  localStorage.setItem('themeSelection', themeChoice); 

  themeToggleButtons.forEach(btn => {
    if (btn.dataset.themeToggle === themeChoice) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', (e) => {
  if (localStorage.getItem('themeSelection') === 'system') applyUserThemePreference('system');
});


document.addEventListener('DOMContentLoaded', () => {
  const initialTheme = localStorage.getItem('themeSelection') || 'system'; 
  applyUserThemePreference(initialTheme);

  themeToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const chosenTheme = button.dataset.themeToggle;
      applyUserThemePreference(chosenTheme);
    });
  });

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const animeListDiv = document.getElementById('animeList');

  const animeModal = document.getElementById('animeModal');
  const modalCloseButton = animeModal.querySelector('.modal-close-button');
  const modalAnimeDetailsDiv = document.getElementById('modalAnimeDetails');

  const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

  function openModal() {
    animeModal.style.display = 'block';
    document.body.classList.add('modal-open'); 
  }

  function closeModal() {
    animeModal.style.display = 'none';
    document.body.classList.remove('modal-open'); 
    modalAnimeDetailsDiv.innerHTML = ''; 
  }

  modalCloseButton.addEventListener('click', closeModal);

  window.addEventListener('click', (event) => {
    if (event.target === animeModal) closeModal();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && animeModal.style.display === 'block') closeModal();
  });

  function displayAnimeDetailsInModal(anime) { 
    modalAnimeDetailsDiv.innerHTML = ''; 

    const title = document.createElement('h3');
    title.textContent = anime.title_japanese ? `${anime.title} / ${anime.title_japanese}` : anime.title;
    modalAnimeDetailsDiv.appendChild(title);

    if (anime.images?.jpg?.large_image_url) {
      const coverImage = document.createElement('img');
      coverImage.src = anime.images.jpg.large_image_url;
      coverImage.alt = `Capa de ${anime.title}`;
      coverImage.classList.add('cover-image');
      modalAnimeDetailsDiv.appendChild(coverImage);
    }

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

    const detailsTextContainer = document.createElement('div');
    detailsTextContainer.style.clear = 'both'; 
    modalAnimeDetailsDiv.appendChild(detailsTextContainer);

    if (anime.genres && anime.genres.length > 0) {
      const genres = document.createElement('p');
      genres.innerHTML = `<strong>Gêneros:</strong> ${anime.genres.map(g => g.name).join(', ')}`;
      detailsTextContainer.appendChild(genres);
    }

    let infoText = '';
    if (anime.type) infoText += `<strong>Tipo:</strong> ${anime.type}<br>`;
    if (anime.episodes) infoText += `<strong>Episódios:</strong> ${anime.episodes}<br>`;
    if (anime.status) infoText += `<strong>Status:</strong> ${anime.status}<br>`;
    if (anime.duration) infoText += `<strong>Duração:</strong> ${anime.duration}<br>`;
    if (anime.score) infoText += `<strong>Pontuação:</strong> ${anime.score} (por ${anime.scored_by} usuários)<br>`;

    const infoParagraph = document.createElement('p');
    infoParagraph.innerHTML = infoText;
    detailsTextContainer.appendChild(infoParagraph);

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

    if (anime.trailer?.youtube_id) {
      const trailerContainer = document.createElement('div');
      trailerContainer.classList.add('trailer-container');
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

  async function fetchAnimeDetailsAndDisplayInModal(animeId) { 
    modalAnimeDetailsDiv.innerHTML = '<p>Carregando detalhes...</p>';
    openModal(); 

    try {
      const response = await fetch(`${JIKAN_API_BASE_URL}/anime/${animeId}/full`);
      if (!response.ok) {
        modalAnimeDetailsDiv.innerHTML = `<p>Erro na API ao buscar detalhes (${response.status} ${response.statusText}). Tente fechar e abrir novamente.</p>`;
        return;
      }
      const data = await response.json();
      if (data && data.data) {
        displayAnimeDetailsInModal(data.data);
      } else {
        modalAnimeDetailsDiv.innerHTML = '<p>Não foram encontrados detalhes para este anime.</p>';
      }
    } catch (error) {
      console.error('Falha ao buscar detalhes do anime:', error);
      modalAnimeDetailsDiv.innerHTML = `<p>Erro ao carregar detalhes: ${error.message}. Tente fechar e abrir novamente.</p>`;
    }
  }

  async function searchAnimes(query) {
    animeListDiv.innerHTML = '<p>Buscando...</p>';
    try {
      const response = await fetch(`${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(query)}&sfw&limit=15`);
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const data = await response.json();
      displayAnimeResults(data.data);
    } catch (error) {
      console.error('Falha ao buscar animes:', error);
      animeListDiv.innerHTML = `<p>Erro ao buscar animes: ${error.message}. Tente novamente.</p>`;
    }
  }

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
        fetchAnimeDetailsAndDisplayInModal(anime.mal_id);
      });

      animeListDiv.appendChild(animeItem);
    });
  }

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) searchAnimes(query);
    else animeListDiv.innerHTML = '<p>Por favor, digite um nome para buscar.</p>';
  });

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) searchAnimes(query);
      else animeListDiv.innerHTML = '<p>Por favor, digite um nome para buscar.</p>';
    }
  });
});