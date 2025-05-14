const Avaliacao = () => {
  // Dados de amostra para os jogos
  const games = [
    { id: 1, name: "Space Invaders 2025", developer: "Dev Master", image: "https://placehold.co/300x200/2563eb/white?text=Space+Game" },
    { id: 2, name: "Puzzle Quest", developer: "Mind Games", image: "https://placehold.co/300x200/059669/white?text=Puzzle+Game" },
    { id: 3, name: "Racing Evolution", developer: "Speed Studios", image: "https://placehold.co/300x200/dc2626/white?text=Racing+Game" },
    { id: 4, name: "Fantasy RPG", developer: "Magic Devs", image: "https://placehold.co/300x200/7c3aed/white?text=RPG+Game" },
  ];

  // Estado para controlar o jogo selecionado e a avaliação
  const [selectedGame, setSelectedGame] = React.useState(null);
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  // Função para enviar a avaliação
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGame || rating === 0) {
      alert('Por favor, selecione um jogo e uma classificação.');
      return;
    }
    
    // Aqui você enviaria os dados para o backend
    console.log({
      gameId: selectedGame,
      rating,
      comment
    });
    
    // Resetar o formulário e mostrar mensagem de sucesso
    setSubmitted(true);
    setTimeout(() => {
      setSelectedGame(null);
      setRating(0);
      setComment('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Avaliação de Jogos</h1>
      
      {submitted ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Sucesso!</p>
          <p>Sua avaliação foi enviada com sucesso. Obrigado por contribuir!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Avalie um jogo</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Selecione o jogo:</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedGame || ''}
                onChange={(e) => setSelectedGame(e.target.value)}
                required
              >
                <option value="" disabled>Escolha um jogo...</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>{game.name} - {game.developer}</option>
                ))}
              </select>
            </div>
            
            {selectedGame && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Sua classificação:</label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index} className="cursor-pointer">
                          <input 
                            type="radio" 
                            name="rating" 
                            className="hidden" 
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                          />
                          <i 
                            className={`text-2xl fas fa-star ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          ></i>
                        </label>
                      );
                    })}
                    <span className="ml-2 text-gray-600">{rating > 0 ? `${rating} estrelas` : ''}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Comentários (opcional):</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Compartilhe sua experiência com o jogo..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Enviar Avaliação
                </button>
              </>
            )}
          </form>
        </div>
      )}
      
      {/* Lista de jogos para avaliar */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Jogos disponíveis para avaliação</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map(game => (
            <div 
              key={game.id} 
              className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer ${selectedGame == game.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedGame(game.id)}
            >
              <img src={game.image} alt={game.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="font-bold text-lg truncate">{game.name}</h3>
                <p className="text-gray-600 text-sm">{game.developer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
