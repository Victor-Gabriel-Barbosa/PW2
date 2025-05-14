const GamesList = () => {
  // Dados de amostra para os jogos
  const games = [
    { id: 1, name: "Space Invaders 2025", developer: "Dev Master", category: "Ação", rating: 4.9, image: "https://placehold.co/300x200/2563eb/white?text=Space+Game", description: "Um jogo de nave espacial com gráficos impressionantes e jogabilidade envolvente." },
    { id: 2, name: "Puzzle Quest", developer: "Mind Games", category: "Puzzle", rating: 4.8, image: "https://placehold.co/300x200/059669/white?text=Puzzle+Game", description: "Desafie sua mente com quebra-cabeças complexos e mecânicas inovadoras." },
    { id: 3, name: "Racing Evolution", developer: "Speed Studios", category: "Corrida", rating: 4.7, image: "https://placehold.co/300x200/dc2626/white?text=Racing+Game", description: "Experimente a adrenalina das corridas em pistas desafiadoras ao redor do mundo." },
    { id: 4, name: "Fantasy RPG", developer: "Magic Devs", category: "RPG", rating: 4.6, image: "https://placehold.co/300x200/7c3aed/white?text=RPG+Game", description: "Um RPG épico com uma história imersiva e um mundo vasto para explorar." },
    { id: 5, name: "Platformer Hero", developer: "Indie Coders", category: "Plataforma", rating: 4.5, image: "https://placehold.co/300x200/f59e0b/white?text=Platform+Game", description: "Um jogo de plataforma desafiador com controles precisos e level design criativo." },
    { id: 6, name: "Strategy Masters", developer: "Brain Squad", category: "Estratégia", rating: 4.4, image: "https://placehold.co/300x200/4f46e5/white?text=Strategy+Game", description: "Teste suas habilidades de estratégia em batalhas táticas complexas." },
    { id: 7, name: "Rhythm Dancer", developer: "Beat Box", category: "Ritmo", rating: 4.3, image: "https://placehold.co/300x200/ec4899/white?text=Rhythm+Game", description: "Siga o ritmo e dance ao som de músicas envolventes neste jogo musical." },
    { id: 8, name: "Zombie Survival", developer: "Horror House", category: "Sobrevivência", rating: 4.2, image: "https://placehold.co/300x200/1e293b/white?text=Survival+Game", description: "Sobreviva em um mundo pós-apocalíptico cheio de perigos e zumbis." },
  ];

  // Estado para filtragem
  const [filteredGames, setFilteredGames] = React.useState(games);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Todas');

  // Categorias únicas extraídas dos jogos
  const categories = ['Todas', ...new Set(games.map(game => game.category))];

  // Função para filtrar jogos
  const filterGames = () => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           game.developer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Efeito para atualizar os jogos filtrados quando os filtros mudarem
  React.useEffect(() => {
    setFilteredGames(filterGames());
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Todos os Jogos</h1>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Buscar:</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome ou desenvolvedor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:w-1/3">
            <label className="block text-gray-700 mb-2">Categoria:</label>
            <select 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de jogos */}
      {filteredGames.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div key={game.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-xl mb-2">{game.name}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {game.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Desenvolvedor: {game.developer}</p>
                <p className="text-gray-700 mb-4">{game.description}</p>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(game.rating) ? "" : "text-gray-300"}`}></i>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{game.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-search text-gray-400 text-5xl mb-4"></i>
          <p className="text-gray-500 text-xl">Nenhum jogo encontrado com os filtros atuais.</p>
        </div>
      )}
    </div>
  );
};
