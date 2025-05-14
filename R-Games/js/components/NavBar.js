const NavBar = ({ navigateTo, isLoggedIn, onLogout }) => {
  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-gamepad text-2xl"></i>
            <span className="text-2xl font-bold cursor-pointer" onClick={() => navigateTo('home')}>R-Games</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <a className="hover:text-blue-300 transition duration-300 cursor-pointer" onClick={() => navigateTo('home')}>Página Inicial</a>
            <a className="hover:text-blue-300 transition duration-300 cursor-pointer" onClick={() => navigateTo('games')}>Jogos</a>
            <a className="hover:text-blue-300 transition duration-300 cursor-pointer" onClick={() => navigateTo('avaliacao')}>Avaliação</a>
            {isLoggedIn && 
              <a className="hover:text-blue-300 transition duration-300 cursor-pointer" onClick={() => navigateTo('addgame')}>Adicionar Jogo</a>
            }
          </div>
          
          <div>
            {isLoggedIn ? (
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={onLogout}
              >
                Logout
              </button>
            ) : (
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={() => navigateTo('login')}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
