const AddGame = () => {
  // Estados para o formulário
  const [formData, setFormData] = React.useState({
    name: '',
    developer: '',
    category: '',
    description: '',
    thumbnailUrl: '',
    gameUrl: ''
  });
  const [submitted, setSubmitted] = React.useState(false);
  
  // Opções de categoria
  const categories = [
    "Ação", "Aventura", "Casual", "Corrida", "Esporte", "Estratégia", 
    "FPS", "Indie", "Luta", "Puzzle", "RPG", "Simulação"
  ];
  
  // Função para atualizar os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Função para enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aqui você enviaria os dados para o backend
    console.log(formData);
    
    // Mostrar mensagem de sucesso
    setSubmitted(true);
    
    // Limpar o formulário após 3 segundos
    setTimeout(() => {
      setFormData({
        name: '',
        developer: '',
        category: '',
        description: '',
        thumbnailUrl: '',
        gameUrl: ''
      });
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Jogo</h1>
      
      {submitted ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
          <p className="font-bold">Sucesso!</p>
          <p>Seu jogo foi submetido com sucesso para avaliação. Nossa equipe irá revisar e adicioná-lo à competição em breve.</p>
        </div>
      ) : null}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">Nome do Jogo *</label>
              <input 
                type="text" 
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do seu jogo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="developer">Desenvolvedor *</label>
              <input 
                type="text" 
                id="developer"
                name="developer"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome ou nome do estúdio"
                value={formData.developer}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="category">Categoria *</label>
              <select 
                id="category"
                name="category"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="thumbnailUrl">URL da Imagem Thumbnail</label>
              <input 
                type="url" 
                id="thumbnailUrl"
                name="thumbnailUrl"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.thumbnailUrl}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">URL para a imagem de capa do seu jogo</p>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 mb-2" htmlFor="description">Descrição do Jogo *</label>
            <textarea 
              id="description"
              name="description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Descreva seu jogo, mecânicas, história, etc."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 mb-2" htmlFor="gameUrl">URL do Jogo *</label>
            <input 
              type="url" 
              id="gameUrl"
              name="gameUrl"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemplo.com/seu-jogo"
              value={formData.gameUrl}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Link para jogar ou baixar o jogo (pode ser itch.io, GitHub, Google Drive, etc.)</p>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">Importante:</h3>
            <ul className="list-disc list-inside text-blue-700 text-sm">
              <li>Seu jogo deve estar completo ou em um estado jogável</li>
              <li>Tenha certeza de que o link funciona e está acessível publicamente</li>
              <li>Forneça instruções claras sobre como jogar</li>
              <li>Todos os jogos serão avaliados pela nossa equipe antes de serem publicados</li>
            </ul>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Submeter Jogo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
