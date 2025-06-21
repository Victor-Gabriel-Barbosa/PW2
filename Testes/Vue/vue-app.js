// Criando a aplicação Vue
const { createApp } = Vue;

// Definindo o componente principal
createApp({
  // Estado (data) do componente
  data() {
    return {
      contador: 0,
      texto: '',
      novaTarefa: '',
      tarefas: [
        { id: 1, texto: 'Aprender Vue', concluida: true },
        { id: 2, texto: 'Criar um projeto', concluida: false }
      ],
      filtro: 'todas',
      segundos: 0,
      cronometroAtivo: false,
      intervalo: null,
      tema: 'claro',
      menuAtivo: 'home'
    };
  },

  // Propriedades computadas
  computed: {
    tarefasFiltradas() {
      if (this.filtro === 'ativas') return this.tarefas.filter(tarefa => !tarefa.concluida);
      if (this.filtro === 'concluidas') return this.tarefas.filter(tarefa => tarefa.concluida);
      return this.tarefas;
    },
    tempoFormatado() {
      const minutos = Math.floor(this.segundos / 60).toString().padStart(2, '0');
      const segundos = (this.segundos % 60).toString().padStart(2, '0');
      return `${minutos}:${segundos}`;
    },
    estiloTema() {
      return {
        backgroundColor: this.tema === 'claro' ? '#ffffff' : '#333333',
        color: this.tema === 'claro' ? '#333333' : '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
      };
    },
    navbarEstilo() {
      return {
        backgroundColor: this.tema === 'claro' ? '#2196F3' : '#1a1a2e',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      };
    }
  },

  // Métodos do componente
  methods: {
    // Função para navegação
    scrollToSection(id, menuItem) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.menuAtivo = menuItem;
      }
    },

    // Funções para o contador
    incrementar() {
      this.contador += 1;
    },
    decrementar() {
      if (this.contador > 0) this.contador -= 1;
    },

    // Funções para manipulação de texto
    limparTexto() {
      this.texto = '';
    },

    // Funções para o cronômetro
    iniciarCronometro() {
      if (!this.cronometroAtivo) {
        this.cronometroAtivo = true;
        this.intervalo = setInterval(() => {
          this.segundos++;
        }, 1000);
      }
    },
    pausarCronometro() {
      this.cronometroAtivo = false;
      clearInterval(this.intervalo);
    },
    resetarCronometro() {
      this.pausarCronometro();
      this.segundos = 0;
    },

    // Funções para a lista de tarefas
    adicionarTarefa() {
      if (this.novaTarefa.trim() !== '') {
        this.tarefas.push({
          id: Date.now(),
          texto: this.novaTarefa,
          concluida: false
        });
        this.novaTarefa = '';
      }
    },
    alternarTarefa(id) {
      const tarefa = this.tarefas.find(t => t.id === id);
      if (tarefa) tarefa.concluida = !tarefa.concluida;
    },
    removerTarefa(id) {
      this.tarefas = this.tarefas.filter(t => t.id !== id);
    },

    // Função para alternar o tema
    alternarTema() {
      this.tema = this.tema === 'claro' ? 'escuro' : 'claro';
    },
    
    // Verificar se o menu está ativo
    isMenuAtivo(menuItem) {
      return this.menuAtivo === menuItem;
    }
  },

  // Hooks de ciclo de vida
  beforeUnmount() {
    // Limpar o intervalo quando o componente for desmontado
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}).mount('#app'); // Montando no elemento com id "app"
