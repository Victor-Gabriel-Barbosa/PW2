const Home = () => {
  // Dados de amostra para o ranking dos jogos
  const topGames = [
    { id: 1, name: "Space Invaders 2025", developer: "Dev Master", rating: 4.9, image: "https://placehold.co/200x120/2563eb/white?text=Space+Game" },
    { id: 2, name: "Puzzle Quest", developer: "Mind Games", rating: 4.8, image: "https://placehold.co/200x120/059669/white?text=Puzzle+Game" },
    { id: 3, name: "Racing Evolution", developer: "Speed Studios", rating: 4.7, image: "https://placehold.co/200x120/dc2626/white?text=Racing+Game" },
    { id: 4, name: "Fantasy RPG", developer: "Magic Devs", rating: 4.6, image: "https://placehold.co/200x120/7c3aed/white?text=RPG+Game" },
    { id: 5, name: "Platformer Hero", developer: "Indie Coders", rating: 4.5, image: "https://placehold.co/200x120/f59e0b/white?text=Platform+Game" },
  ];

  return (
    <div className="space-y-10">
      {/* Seção Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-12 px-4 rounded-lg shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">R-Games Competition 2025</h1>
          <p className="text-xl mb-8">A maior competição de jogos independentes do Brasil!</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg">
              Inscreva seu jogo
            </button>
            <button className="bg-transparent hover:bg-blue-600 border-2 border-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg">
              Saiba mais
            </button>
          </div>
        </div>
      </section>

      {/* Informações sobre a competição */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Sobre a Competição</h2>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-trophy"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Prêmios</h3>
            <p className="text-gray-600">Mais de R$ 50.000 em prêmios para os melhores jogos em diversas categorias.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Cronograma</h3>
            <p className="text-gray-600">Inscrições até 15/06/2025. Avaliação e premiação em agosto de 2025.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-users"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Participantes</h3>
            <p className="text-gray-600">Aberto para desenvolvedores independentes e pequenos estúdios brasileiros.</p>
          </div>
        </div>
      </section>

      {/* Ranking dos jogos */}
      <section className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Top Jogos</h2>
          <GamesRanking />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topGames.map(game => (
            <div key={game.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
              <img src={game.image} alt={game.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-2">Desenvolvedor: {game.developer}</p>
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
      </section>
    </div>
  );
};
