// Testador da API Jikan
class JikanAPI {
  constructor() {
    this.urlBase = 'https://api.jikan.moe/v4';
    this.inicializar();
  }

  inicializar() {
    this.vincularEventos();
    this.mostrarMensagemBoasVindas();
  }

  vincularEventos() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const loadTopAnimeBtn = document.getElementById('loadTopAnime');

    searchBtn.addEventListener('click', () => this.buscarAnime());
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.buscarAnime();
    });
    loadTopAnimeBtn.addEventListener('click', () => this.carregarTopAnimes());
  }

  mostrarMensagemBoasVindas() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
      <div class="col-12">
        <div class="card text-center">
          <div class="card-body py-5">
            <h4 class="card-title">Bem-vindo ao Jikan API Tester!</h4>
            <p class="card-text text-muted">
              Use o campo de busca acima para procurar animes ou clique em "Carregar Top Animes" 
              para ver os animes mais populares.
            </p>
            <div class="mt-3">
              <i class="bi bi-search" style="font-size: 3rem; color: #007bff;"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async buscarAnime() {
    const searchInput = document.getElementById('searchInput');
    const consulta = searchInput.value.trim();

    if (!consulta) {
      alert('Por favor, digite o nome de um anime para buscar.');
      return;
    }

    this.mostrarCarregando(true);

    try {
      const resposta = await fetch(`${this.urlBase}/anime?q=${encodeURIComponent(consulta)}&limit=12`);

      if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);

      const dados = await resposta.json();
      this.exibirResultados(dados.data, `Resultados para: "${consulta}"`);
    } catch (erro) {
      console.error('Erro ao buscar anime:', erro);
      alert('Erro ao buscar anime. Tente novamente.');
    } finally {
      this.mostrarCarregando(false);
    }
  }

  async carregarTopAnimes() {
    this.mostrarCarregando(true);

    try {
      const resposta = await fetch(`${this.urlBase}/top/anime?limit=12`);

      if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);

      const dados = await resposta.json();
      this.exibirResultadosTopAnimes(dados.data);
    } catch (erro) {
      console.error('Erro ao carregar top animes:', erro);
      alert('Erro ao carregar top animes. Tente novamente.');
    } finally {
      this.mostrarCarregando(false);
    }
  }

  exibirResultados(animes, titulo) {
    const containerResultados = document.getElementById('results');

    if (!animes || animes.length === 0) {
      containerResultados.innerHTML = `
        <div class="col-12">
          <div class="card text-center">
            <div class="card-body py-4">
              <h5 class="card-title">Nenhum resultado encontrado</h5>
              <p class="card-text text-muted">Tente usar termos diferentes para sua busca.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="col-12 mb-3">
        <h4>${titulo}</h4>
        <hr>
      </div>
    `;

    animes.forEach(anime => html += this.criarCardAnime(anime));

    containerResultados.innerHTML = html;

    // Adiciona animação de fade-in aos cards
    setTimeout(() => document.querySelectorAll('.anime-card').forEach(card => card.classList.add('fade-in-up')), 100);
  }

  exibirResultadosTopAnimes(animes) {
    const containerTopAnimes = document.getElementById('topAnimeResults');

    if (!animes || animes.length === 0) {
      containerTopAnimes.innerHTML = `
        <div class="col-12">
          <div class="text-center py-4">
            <p class="text-muted">Nenhum resultado encontrado.</p>
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    animes.forEach(anime => html += this.criarCardAnime(anime));

    containerTopAnimes.innerHTML = html;

    // Adiciona animação de fade-in aos cards
    setTimeout(() => document.querySelectorAll('.anime-card').forEach(card => card.classList.add('fade-in-up')), 100);
  }

  criarCardAnime(anime) {
    const pontuacao = anime.score ? anime.score.toFixed(1) : 'N/A';
    const ano = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'N/A';
    const sinopse = anime.synopsis || 'Sinopse não disponível.';
    const urlImagem = anime.images?.jpg?.image_url || anime.images?.webp?.image_url || 'https://via.placeholder.com/300x400?text=No+Image';

    return `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card anime-card h-100 shadow-sm" onclick="window.open('${anime.url}', '_blank')">
          <img src="${urlImagem}" class="anime-image card-img-top" alt="${anime.title}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <h6 class="anime-title fw-semibold">${anime.title}</h6>
            <p class="anime-synopsis flex-grow-1 text-muted small">${sinopse}</p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-primary rounded-pill">⭐ ${pontuacao}</span>
                <small class="text-muted">${ano}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Episódios: ${anime.episodes || 'N/A'}</small>
                <small class="text-muted">${anime.type || 'N/A'}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mostrarCarregando(mostrar) {
    const elementoCarregando = document.getElementById('loading');
    elementoCarregando.classList.toggle('d-none', !mostrar);
  }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new JikanAPI();
});