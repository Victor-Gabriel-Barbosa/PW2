// Aplicação Vue para o Muscia

const { createApp } = Vue;

// Constantes para a API do Deezer
const DEEZER_API_PROXY = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com';

createApp({
  data() {
    return {
      currentPage: 'home',
      searchQuery: '',
      selectedPlaylist: null,
      currentSong: null,
      isPlaying: false,
      audioPlayer: null,
      loading: false,
      error: null,
      
      // Dados da API do Deezer
      topTracks: [],
      trendingPlaylists: [],
      
      // Dados simulados para a aplicação (serão substituídos por dados da API)
      playlists: [
        { id: 1, name: 'Músicas Curtidas', cover: 'https://i.scdn.co/image/ab67706f00000003e8e28219724c2423afa4d320' },
        { id: 2, name: 'Descobertas da Semana', cover: 'https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ==' },
        { id: 3, name: 'Meu Mix #1', cover: 'https://seed-mix-image.spotifycdn.com/v6/img/artist/0du5cEVh5yTK9QJze8zA0C/pt-BR/default' },
        { id: 4, name: 'Rock Clássico', cover: 'https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c37ddc' },
        { id: 5, name: 'Pop Brasil', cover: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_br_default.jpg' }
      ],

      recentAlbums: [
        { id: 1, name: 'After Hours', artist: 'The Weeknd', cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
        { id: 2, name: 'Future Nostalgia', artist: 'Dua Lipa', cover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946' },
        { id: 3, name: 'SOUR', artist: 'Olivia Rodrigo', cover: 'https://i.scdn.co/image/ab67616d0000b2738e1a23e42f68260b7b8c0166' },
        { id: 4, name: 'Planet Her', artist: 'Doja Cat', cover: 'https://i.scdn.co/image/ab67616d0000b273a8b7a394ab7ac216a8e38e75' },
        { id: 5, name: 'Chromatica', artist: 'Lady Gaga', cover: 'https://i.scdn.co/image/ab67616d0000b273a798b07aa17c754292a4d5e5' },
        { id: 6, name: 'Fine Line', artist: 'Harry Styles', cover: 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f' }
      ],

      recommendedPlaylists: [
        { id: 1, name: 'Daily Mix 1', description: 'Lana Del Rey, Billie Eilish e mais', cover: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb8ae7f2aaa9817a704a87ea36/1/pt-BR/default' },
        { id: 2, name: 'Radar de Novidades', description: 'Descubra novos lançamentos', cover: 'https://newjams-images.scdn.co/v3/release-radar/ab6761610000e5eb5c10d8f74457f8df1d68eace/pt-BR/default' },
        { id: 3, name: 'Mix Anos 2000', description: 'Os maiores hits dos anos 2000', cover: 'https://seed-mix-image.spotifycdn.com/v6/img/decades/2000/contextual/large/default' },
        { id: 4, name: 'Mix Relaxante', description: 'Para relaxar e descontrair', cover: 'https://seed-mix-image.spotifycdn.com/v6/img/chill/21,3/pt-BR/large' },
        { id: 5, name: 'Mix Pop', description: 'Os maiores hits do momento', cover: 'https://seed-mix-image.spotifycdn.com/v6/img/pop/21,6/pt-BR/large' },
        { id: 6, name: 'Mix Treino', description: 'Energia para seu treino', cover: 'https://seed-mix-image.spotifycdn.com/v6/img/workout/21,1/pt-BR/large' }
      ],

      genres: [
        { id: 1, name: 'Pop', color: '#8D67AB', image: 'https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c37ddc' },
        { id: 2, name: 'Rock', color: '#E61E32', image: 'https://i.scdn.co/image/ab67706f00000003fe6d8d1019d5b302213e3730' },
        { id: 3, name: 'Hip Hop', color: '#BA5D07', image: 'https://i.scdn.co/image/ab67706f000000035f4b625f7dfcb4733381af5b' },
        { id: 4, name: 'Eletrônica', color: '#1E3264', image: 'https://i.scdn.co/image/ab67706f00000003e614b7b8efa71900fd8ef767' },
        { id: 5, name: 'R&B', color: '#DC148C', image: 'https://i.scdn.co/image/ab67706f00000003ca5a7517156021292e5663a6' },
        { id: 6, name: 'Indie', color: '#608108', image: 'https://i.scdn.co/image/ab67706f000000033dc0b872e03a9b14f6e598b1' },
        { id: 7, name: 'Sertanejo', color: '#E1118C', image: 'https://i.scdn.co/image/ab67706f00000003e4e01822c3b33e6272273960' },
        { id: 8, name: 'MPB', color: '#8C1932', image: 'https://i.scdn.co/image/ab67706f00000003a7613d346501b316b0cf27c0' },
        { id: 9, name: 'Funk', color: '#509BF5', image: 'https://i.scdn.co/image/ab67706f0000000385d247b7bce02da69c8156df' },
        { id: 10, name: 'Jazz', color: '#777777', image: 'https://i.scdn.co/image/ab67706f00000003e622a2498e8e5bf67ee1e4fd' }
      ],

      libraryItems: [
        { id: 1, name: 'Músicas Curtidas', type: 'playlist', creator: 'Você', image: 'https://i.scdn.co/image/ab67706f00000003e8e28219724c2423afa4d320' },
        { id: 2, name: 'The Weeknd', type: 'artist', creator: '', image: 'https://i.scdn.co/image/ab6761610000e5eb7a487027eb0c10af725d5410' },
        { id: 3, name: 'Future Nostalgia', type: 'album', creator: 'Dua Lipa', image: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946' },
        { id: 4, name: 'Pop Mix', type: 'playlist', creator: 'Spotify', image: 'https://seed-mix-image.spotifycdn.com/v6/img/pop/21,6/pt-BR/large' },
        { id: 5, name: 'Billie Eilish', type: 'artist', creator: '', image: 'https://i.scdn.co/image/ab6761610000e5ebc5ceb05f152103b2b70d3b07' },
        { id: 6, name: 'Top Brasil', type: 'playlist', creator: 'Spotify', image: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_br_default.jpg' }
      ],

      songs: [
        {
          id: 1,
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          duration: '3:20',
          albumCover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
        },
        {
          id: 2,
          title: 'Levitating',
          artist: 'Dua Lipa ft. DaBaby',
          album: 'Future Nostalgia',
          duration: '3:23',
          albumCover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946'
        },
        {
          id: 3,
          title: 'good 4 u',
          artist: 'Olivia Rodrigo',
          album: 'SOUR',
          duration: '2:58',
          albumCover: 'https://i.scdn.co/image/ab67616d0000b2738e1a23e42f68260b7b8c0166'
        },
        {
          id: 4,
          title: 'Kiss Me More',
          artist: 'Doja Cat ft. SZA',
          album: 'Planet Her',
          duration: '3:28',
          albumCover: 'https://i.scdn.co/image/ab67616d0000b273a8b7a394ab7ac216a8e38e75'
        },
        {
          id: 5,
          title: 'Rain On Me',
          artist: 'Lady Gaga, Ariana Grande',
          album: 'Chromatica',
          duration: '3:02',
          albumCover: 'https://i.scdn.co/image/ab67616d0000b273a798b07aa17c754292a4d5e5'
        }
      ]
    }
  },  methods: {
    navigateTo(page) {
      this.currentPage = page;
    },    selectPlaylist(playlist) {
      this.selectedPlaylist = playlist;
      
      // Simulando músicas para a playlist selecionada
      this.loading = true;
      
      // Aguardando um pouco para simular carregamento da rede
      setTimeout(() => {
        // Gerando músicas aleatórias da nossa base de músicas simuladas
        const allSongs = [...this.songs];
        const randomTracks = [];
        
        // Determinar quantas músicas queremos mostrar (entre 5 e 12)
        const trackCount = Math.floor(Math.random() * 8) + 5;
        
        // Lista de prévias de áudio
        const audioSamples = [
          'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi chill
          'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92a21.mp3', // Pop dance
          'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508a01.mp3', // Modern electronic
          'https://cdn.pixabay.com/download/audio/2021/04/06/audio_c8ed9dbebc.mp3', // Piano melody
          'https://cdn.pixabay.com/download/audio/2022/10/25/audio_90582d2877.mp3'  // Epic cinematic
        ];
        
        // Garantir que temos músicas suficientes
        for (let i = 0; i < trackCount; i++) {
          if (allSongs.length > 0) {
            // Pegar um índice aleatório
            const randomIndex = Math.floor(Math.random() * allSongs.length);
            // Adicionar a música à lista e criar um novo ID para evitar duplicatas
            const song = { 
              ...allSongs[randomIndex], 
              id: allSongs[randomIndex].id + i * 1000,
              preview: audioSamples[i % audioSamples.length] // Adicionar prévia de áudio
            };
            randomTracks.push(song);
          }
        }
        
        // Atualizar a lista de músicas com as faixas da playlist
        this.songs = randomTracks;
        this.loading = false;
      }, 800);
    },    // Método para tocar uma música usando o objeto Audio
    playSong(song) {
      this.currentSong = song;
      
      // Pausar a música atual, se estiver tocando
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        // Remover listeners antigos para evitar memory leaks
        this.audioPlayer.removeEventListener('timeupdate', this.updateProgress);
        this.audioPlayer.removeEventListener('ended', this.onSongEnded);
      }
      
      // Criar novo player e definir a fonte da música
      if (song.preview) {
        this.audioPlayer = new Audio(song.preview);
        
        // Adicionar listener para atualizar o progresso
        this.audioPlayer.addEventListener('timeupdate', this.updateProgress);
        
        // Adicionar listener para quando a música terminar
        this.audioPlayer.addEventListener('ended', this.onSongEnded);
        
        this.audioPlayer.play();
        this.isPlaying = true;
      } else {
        console.warn('Prévia da música não disponível');
        this.isPlaying = false;
      }
    },
    
    // Método para atualizar o progresso da música
    updateProgress() {
      if (!this.audioPlayer) return;
      
      const currentTime = this.audioPlayer.currentTime;
      const duration = this.audioPlayer.duration;
      
      // Atualizar a posição da barra de progresso
      if (duration > 0) {
        // Calcular a porcentagem de progresso
        const progressPercent = (currentTime / duration) * 100;
        
        // Atualizar a largura da barra de progresso diretamente no DOM
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
          progressBar.style.width = `${progressPercent}%`;
        }
        
        // Atualizar o tempo de reprodução atual
        const currentTimeElement = document.querySelector('.current-time');
        if (currentTimeElement) {
          currentTimeElement.textContent = this.formatDuration(currentTime);
        }
      }
    },
    
    // Método para definir a posição da música pelo clique na barra de progresso
    setProgress(e) {
      if (!this.audioPlayer) return;
      
      const progressContainer = document.querySelector('.progress-container');
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = this.audioPlayer.duration;
      
      // Calcular a nova posição na música
      const newPosition = (clickX / width) * duration;
      
      // Definir a nova posição
      this.audioPlayer.currentTime = newPosition;
    },
    
    // Método para inicializar os controles do player
    initializePlayerControls() {
      // Adicionar listener para clicar na barra de progresso
      const progressContainer = document.querySelector('.progress-container');
      if (progressContainer) {
        progressContainer.addEventListener('click', this.setProgress.bind(this));
      }
    },
    
    // Método para lidar com o fim da música
    onSongEnded() {
      this.isPlaying = false;
      
      // Aqui você pode implementar lógica para tocar a próxima música
      this.playNextSong();
    },

    togglePlay() {
      if (!this.audioPlayer) return;
      
      if (this.isPlaying) {
        this.audioPlayer.pause();
      } else {
        this.audioPlayer.play();
      }
      
      this.isPlaying = !this.isPlaying;
    },

    formatDuration(seconds) {
      if (!seconds) return '0:00';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },    // Método para tocar a próxima música na lista
    playNextSong() {
      if (!this.songs.length) return;
      
      // Encontrar o índice da música atual
      const currentIndex = this.songs.findIndex(song => song.id === this.currentSong?.id);
      
      // Se a música atual não for encontrada ou for a última, voltar para a primeira
      if (currentIndex === -1 || currentIndex >= this.songs.length - 1) {
        this.playSong(this.songs[0]);
      } else {
        // Caso contrário, tocar a próxima música
        this.playSong(this.songs[currentIndex + 1]);
      }
    },
    
    // Método para tocar a música anterior na lista
    playPreviousSong() {
      if (!this.songs.length) return;
      
      // Encontrar o índice da música atual
      const currentIndex = this.songs.findIndex(song => song.id === this.currentSong?.id);
      
      // Se a música atual não for encontrada ou for a primeira, ir para a última
      if (currentIndex <= 0) {
        this.playSong(this.songs[this.songs.length - 1]);
      } else {
        // Caso contrário, tocar a música anterior
        this.playSong(this.songs[currentIndex - 1]);
      }
    },
    // Método para buscar músicas da API do Deezer
    async searchMusic() {
      try {
        this.loading = true;
        this.error = null;
        console.log(`Buscando por: ${this.searchQuery}`);
        
        if (!this.searchQuery.trim()) return;
        
        // Simulando uma busca usando os dados locais
        const query = this.searchQuery.toLowerCase().trim();
        
        // Aguardando um pouco para simular carregamento da rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Lista de prévias de áudio
        const audioSamples = [
          'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi chill
          'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92a21.mp3', // Pop dance
          'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508a01.mp3', // Modern electronic
          'https://cdn.pixabay.com/download/audio/2021/04/06/audio_c8ed9dbebc.mp3', // Piano melody
          'https://cdn.pixabay.com/download/audio/2022/10/25/audio_90582d2877.mp3'  // Epic cinematic
        ];
        
        // Filtrando músicas baseado na consulta
        const filteredSongs = this.songs.filter(song => 
          song.title.toLowerCase().includes(query) || 
          song.artist.toLowerCase().includes(query) || 
          song.album.toLowerCase().includes(query)
        );
        
        // Garantir que cada música tenha uma prévia
        filteredSongs.forEach((song, index) => {
          if (!song.preview) {
            song.preview = audioSamples[index % audioSamples.length];
          }
        });
        
        // Atualizando a lista de músicas com o resultado da busca
        this.songs = filteredSongs;
        
      } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        this.error = 'Não foi possível carregar as músicas. Tente novamente mais tarde.';
      } finally {
        this.loading = false;
      }
    },
    
    // Métodos para carregar dados do Deezer
    async fetchTopTracks() {
      try {
        this.loading = true;
        const response = await fetch(`${DEEZER_API_PROXY}/chart/0/tracks?limit=12`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar top tracks: ${response.status}`);
        }
        
        const data = await response.json();
        
        this.topTracks = data.data.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist.name,
          album: track.album.title,
          duration: track.duration,
          albumCover: track.album.cover_medium || track.album.cover,
          preview: track.preview
        }));
        
        // Atualizar as músicas recentes com os dados da API
        this.recentAlbums = data.data.slice(0, 6).map(track => ({
          id: track.id,
          name: track.album.title,
          artist: track.artist.name,
          cover: track.album.cover_medium || track.album.cover
        }));
        
        // Atualizar a música atual
        if (this.topTracks.length > 0 && !this.currentSong) {
          this.currentSong = this.topTracks[0];
        }
        
      } catch (error) {
        console.error('Erro ao buscar top tracks:', error);
        this.error = 'Não foi possível carregar as músicas populares. Tente novamente mais tarde.';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchTrendingPlaylists() {
      try {
        const response = await fetch(`${DEEZER_API_PROXY}/chart/0/playlists?limit=6`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar playlists: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Atualizar playlists recomendadas com dados da API
        this.trendingPlaylists = data.data.map(playlist => ({
          id: playlist.id,
          deezer_id: playlist.id,
          name: playlist.title,
          description: `${playlist.user.name} • ${playlist.nb_tracks} faixas`,
          cover: playlist.picture_medium || playlist.picture
        }));
        
        // Atualizar playlists recomendadas
        this.recommendedPlaylists = this.trendingPlaylists;
        
      } catch (error) {
        console.error('Erro ao buscar playlists:', error);
      }
    },
    
    async fetchPlaylistTracks(playlistId) {
      try {
        this.loading = true;
        const response = await fetch(`${DEEZER_API_PROXY}/playlist/${playlistId}/tracks?limit=20`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar faixas da playlist: ${response.status}`);
        }
        
        const data = await response.json();
        
        this.songs = data.data.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist.name,
          album: track.album.title,
          duration: track.duration,
          albumCover: track.album.cover_medium || track.album.cover,
          preview: track.preview
        }));
        
      } catch (error) {
        console.error('Erro ao buscar faixas da playlist:', error);
        this.error = 'Não foi possível carregar as músicas da playlist. Tente novamente mais tarde.';
      } finally {
        this.loading = false;
      }
    },
      async fetchGenres() {
      try {
        const response = await fetch(`${DEEZER_API_PROXY}/genre`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar gêneros: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cores para os gêneros
        const colors = [
          '#8D67AB', '#E61E32', '#BA5D07', '#1E3264', 
          '#DC148C', '#608108', '#E1118C', '#8C1932', 
          '#509BF5', '#777777'
        ];
        
        // Atualizar gêneros com dados da API
        this.genres = data.data.slice(0, 10).map((genre, index) => ({
          id: genre.id,
          name: genre.name,
          color: colors[index % colors.length],
          image: genre.picture_medium || genre.picture
        }));
        
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    },
    
    // Método para usar dados simulados quando a API não está disponível
    useMockData() {
      // Simulando o carregamento para melhor experiência do usuário
      this.loading = true;
      
      // Espera um curto período para simular o carregamento de dados
      setTimeout(() => {
        // Adicionando prévia de áudio simulada para cada música
        const audioSamples = [
          'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi chill
          'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92a21.mp3', // Pop dance
          'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508a01.mp3', // Modern electronic
          'https://cdn.pixabay.com/download/audio/2021/04/06/audio_c8ed9dbebc.mp3', // Piano melody
          'https://cdn.pixabay.com/download/audio/2022/10/25/audio_90582d2877.mp3'  // Epic cinematic
        ];
        
        // Atribuir um arquivo de áudio para cada música
        this.songs.forEach((song, index) => {
          // Usar o índice para selecionar um áudio da lista, repeindo-os se necessário
          song.preview = audioSamples[index % audioSamples.length];
          // Converter a string de duração para segundos para o player
          if (typeof song.duration === 'string') {
            const [minutes, seconds] = song.duration.split(':').map(Number);
            song.duration = minutes * 60 + seconds;
          }
        });
        
        // Atualizando as top tracks com os dados simulados das músicas
        this.topTracks = [...this.songs];
        
        // Usando as playlists recomendadas simuladas como playlists em alta
        this.trendingPlaylists = [...this.recommendedPlaylists];
        
        // Se não tivermos uma música atual, definimos a primeira da lista
        if (!this.currentSong && this.topTracks.length > 0) {
          this.currentSong = this.topTracks[0];
        }
        
        // Desativando o indicador de carregamento
        this.loading = false;
      }, 800);
    }
  },  mounted() {
    // Usar dados simulados em vez de fazer requisições à API do Deezer
    // Como estamos tendo problemas de CORS, vamos usar os dados mockados que já existem
    this.useMockData();
    
    // Adicionando evento para a tecla de espaço controlar o play/pause
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        this.togglePlay();
      }
    });
    
    // Inicializar os controles do player após a montagem do componente
    this.$nextTick(() => {
      this.initializePlayerControls();
    });
    
    console.log('Aplicação Muscia inicializada com dados simulados (mock)!');
  }
}).mount('#app');
