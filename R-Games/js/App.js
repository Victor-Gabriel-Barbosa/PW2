const App = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // Função para alternar entre as páginas
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Função para lidar com o login
  const handleLogin = (status) => {
    setIsLoggedIn(status);
    if (status) {
      navigateTo('home');
    }
  };

  // Renderização condicional baseada na página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'games':
        return <GamesList />;
      case 'avaliacao':
        return <Avaliacao />;
      case 'addgame':
        return isLoggedIn ? <AddGame /> : <Login onLogin={handleLogin} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar navigateTo={navigateTo} isLoggedIn={isLoggedIn} onLogout={() => handleLogin(false)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};
