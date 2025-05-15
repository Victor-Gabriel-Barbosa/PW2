// Componente NavBar
function NavBar({ tema, alternarTema }) {
  const [menuAtivo, setMenuAtivo] = React.useState("home");
  
  const navStyle = {
    backgroundColor: tema === 'claro' ? '#2196F3' : '#1a1a2e',
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
  
  const logoStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    margin: '0'
  };
  
  const menuStyle = {
    display: 'flex',
    gap: '15px',
    listStyle: 'none',
    margin: '0',
    padding: '0'
  };
  
  const linkStyle = (active) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
    cursor: 'pointer'
  });

  const scrollToSection = (id, menuItem) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuAtivo(menuItem);
    }
  };
  
  return (
    <nav style={navStyle}>
      <h1 style={logoStyle}>React Demo</h1>
      <ul style={menuStyle}>
        <li>
          <a 
            style={linkStyle(menuAtivo === "home")} 
            onClick={() => scrollToSection("home", "home")}
          >
            Home
          </a>
        </li>
        <li>
          <a 
            style={linkStyle(menuAtivo === "contador")} 
            onClick={() => scrollToSection("contador", "contador")}
          >
            Contador
          </a>
        </li>
        <li>
          <a 
            style={linkStyle(menuAtivo === "formulario")} 
            onClick={() => scrollToSection("formulario", "formulario")}
          >
            Formulário
          </a>
        </li>
        <li>
          <a 
            style={linkStyle(menuAtivo === "cronometro")} 
            onClick={() => scrollToSection("cronometro", "cronometro")}
          >
            Cronômetro
          </a>
        </li>
        <li>
          <a 
            style={linkStyle(menuAtivo === "tarefas")} 
            onClick={() => scrollToSection("tarefas", "tarefas")}
          >
            Tarefas
          </a>
        </li>
        <li>
          <a 
            style={linkStyle(menuAtivo === "tema")} 
            onClick={alternarTema}
          >
            Tema: {tema === 'claro' ? '☀️' : '🌙'}
          </a>
        </li>
      </ul>
    </nav>
  );
}

// Componente funcional App
function App() {
  // Estados para as diversas funcionalidades
  const [contador, setContador] = React.useState(0);
  const [texto, setTexto] = React.useState('');
  const [tarefas, setTarefas] = React.useState([
    { id: 1, texto: 'Aprender React', concluida: true },
    { id: 2, texto: 'Criar um projeto', concluida: false }
  ]);
  const [novaTarefa, setNovaTarefa] = React.useState('');
  const [filtro, setFiltro] = React.useState('todas');
  const [segundos, setSegundos] = React.useState(0);
  const [cronometroAtivo, setCronometroAtivo] = React.useState(false);
  const [tema, setTema] = React.useState('claro');

  // Efeito para o cronômetro
  React.useEffect(() => {
    let intervalo = null;
    if (cronometroAtivo) {
      intervalo = setInterval(() => {
        setSegundos(segundos => segundos + 1);
      }, 1000);
    } else clearInterval(intervalo);
    return () => clearInterval(intervalo);
  }, [cronometroAtivo]);

  // Funções para controle do cronômetro
  const iniciarCronometro = () => setCronometroAtivo(true);
  const pausarCronometro = () => setCronometroAtivo(false);
  const resetarCronometro = () => {
    setCronometroAtivo(false);
    setSegundos(0);
  };

  // Função para incrementar o contador
  const incrementar = () => setContador(contador + 1);

  // Função para decrementar o contador
  const decrementar = () => setContador(prevContador => Math.max(0, prevContador - 1));

  // Funções para manipular texto
  const handleChange = (e) => setTexto(e.target.value);
  const limparTexto = () => setTexto('');

  // Funções para a lista de tarefas
  const handleNovaTarefaChange = (e) => setNovaTarefa(e.target.value);

  const adicionarTarefa = () => {
    if (novaTarefa.trim() !== '') {
      const novaTarefaObj = {
        id: Date.now(),
        texto: novaTarefa,
        concluida: false
      };
      setTarefas([...tarefas, novaTarefaObj]);
      setNovaTarefa('');
    }
  };

  const alternarTarefa = (id) => {
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    ));
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
  };

  // Filtrar tarefas
  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro === 'ativas') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true; // 'todas'
  });

  // Alternar tema
  const alternarTema = () => {
    setTema(tema === 'claro' ? 'escuro' : 'claro');
  };

  // Estilo condicional com base no tema
  const estiloTema = {
    backgroundColor: tema === 'claro' ? '#ffffff' : '#333333',
    color: tema === 'claro' ? '#333333' : '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  // Renderização do componente
  return (
    <div style={estiloTema}>
      <NavBar tema={tema} alternarTema={alternarTema} />
      
      <div id="home" style={{ marginBottom: '30px' }}>
        <h1>Teste do React via CDN</h1>
        <p>Bem-vindo ao React! Esta página está funcionando com React carregado via CDN.</p>
      </div>

      <div 
        id="contador" 
        style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <h2>Contador: {contador}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={incrementar}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Incrementar
          </button>
          <button
            onClick={decrementar}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Decrementar
          </button>
        </div>
      </div>

      <div 
        id="formulario" 
        style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <h2>Input de texto:</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={texto}
            onChange={handleChange}
            style={{
              padding: '8px',
              width: '100%',
              maxWidth: '300px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <button
            onClick={limparTexto}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Limpar
          </button>
        </div>
        <p>Texto digitado: {texto}</p>
      </div>

      <div 
        id="cronometro" 
        style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <h2>Cronômetro</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {Math.floor(segundos / 60).toString().padStart(2, '0')}:
          {(segundos % 60).toString().padStart(2, '0')}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={iniciarCronometro}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={cronometroAtivo}
          >
            Iniciar
          </button>
          <button
            onClick={pausarCronometro}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={!cronometroAtivo}
          >
            Pausar
          </button>
          <button
            onClick={resetarCronometro}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Resetar
          </button>
        </div>
      </div>

      <div 
        id="tarefas" 
        style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <h2>Lista de Tarefas</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={novaTarefa}
            onChange={handleNovaTarefaChange}
            placeholder="Adicionar nova tarefa"
            style={{
              padding: '8px',
              width: '100%',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            onKeyPress={(e) => {
              if(e.key === 'Enter') adicionarTarefa();
            }}
          />
          <button
            onClick={adicionarTarefa}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Adicionar
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <span style={{ marginRight: '10px' }}>Filtrar:</span>
          <button
            onClick={() => setFiltro('todas')}
            style={{
              padding: '5px 10px',
              backgroundColor: filtro === 'todas' ? '#2196F3' : '#e0e0e0',
              color: filtro === 'todas' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('ativas')}
            style={{
              padding: '5px 10px',
              backgroundColor: filtro === 'ativas' ? '#2196F3' : '#e0e0e0',
              color: filtro === 'ativas' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            Ativas
          </button>
          <button
            onClick={() => setFiltro('concluidas')}
            style={{
              padding: '5px 10px',
              backgroundColor: filtro === 'concluidas' ? '#2196F3' : '#e0e0e0',
              color: filtro === 'concluidas' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Concluídas
          </button>
        </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tarefasFiltradas.map(tarefa => (
            <li key={tarefa.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              marginBottom: '5px',
              backgroundColor: tarefa.concluida ? '#e8f5e9' : '#fff',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <input
                type="checkbox"
                checked={tarefa.concluida}
                onChange={() => alternarTarefa(tarefa.id)}
                style={{ marginRight: '10px' }}
              />
              <span style={{
                textDecoration: tarefa.concluida ? 'line-through' : 'none',
                color: tarefa.concluida ? '#888' : 'inherit',
                flexGrow: 1
              }}>
                {tarefa.texto}
              </span>
              <button
                onClick={() => removerTarefa(tarefa.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
        <p>Total: {tarefasFiltradas.length} tarefas</p>
      </div>
    </div>
  );
}

// Renderizando o componente App no elemento com id "root"
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);