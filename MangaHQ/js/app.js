const { useState, useEffect } = React;

// Hook personalizado para autenticação
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.firebaseAuth && window.onAuthStateChanged) {
      const unsubscribe = window.onAuthStateChanged(window.firebaseAuth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (window.firebaseAuth && window.signInWithPopup && window.googleProvider) {
        const result = await window.signInWithPopup(window.firebaseAuth, window.googleProvider);
        return result.user;
      }
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      if (window.firebaseAuth && window.signInWithEmailAndPassword) {
        const result = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
        return result.user;
      }
    } catch (error) {
      console.error('Erro no login com email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      if (window.firebaseAuth && window.createUserWithEmailAndPassword) {
        const result = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        return result.user;
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (window.firebaseAuth && window.signOut) {
        await window.signOut(window.firebaseAuth);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
};

// Componente Modal de Login
const LoginModal = ({ show, onHide, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }

      onHide();
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      onHide();
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/invalid-email':
        return 'Email inválido';
      default:
        return 'Erro na autenticação. Tente novamente.';
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onHide}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2"></i>
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Carregando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope me-2"></i>
                    {isLogin ? 'Entrar' : 'Criar Conta'}
                  </>
                )}
              </button>
            </form>

            <div className="text-center mb-3">
              <span className="text-muted">ou</span>
            </div>

            <button
              type="button"
              className="btn btn-danger w-100 mb-3"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <i className="bi bi-google me-2"></i>
              Continuar com Google
            </button>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente UserMenu
const UserMenu = ({ user, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Verificar se o usuário é admin (pode ser baseado no email ou custom claims)
  const isAdmin = user?.email === 'admin@mangahq.com' || user?.customClaims?.admin === true;

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleMenuClick = (action) => {
    setShowDropdown(false);

    switch (action) {
      case 'profile':
        // Implementar navegação para perfil
        console.log('Ir para perfil');
        break;
      case 'favorites':
        // Implementar navegação para favoritos
        console.log('Ir para favoritos');
        break;
      case 'history':
        // Implementar navegação para histórico
        console.log('Ir para histórico');
        break;
      case 'settings':
        // Implementar navegação para configurações
        console.log('Ir para configurações');
        break;
      case 'admin':
        setShowAdminPanel(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-outline-primary dropdown-toggle"
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Avatar"
              className="rounded-circle me-2"
              style={{ width: '24px', height: '24px' }}
            />
          ) : (
            <i className="bi bi-person-circle me-2"></i>
          )}
          {user.displayName || user.email}
          {isAdmin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
        </button>

        {showDropdown && (
          <ul className="dropdown-menu show">
            <li><h6 className="dropdown-header">Minha Conta</h6></li>
            <li>
              <button className="dropdown-item" onClick={() => handleMenuClick('profile')}>
                <i className="bi bi-person me-2"></i>Perfil
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleMenuClick('favorites')}>
                <i className="bi bi-bookmark me-2"></i>Favoritos
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleMenuClick('history')}>
                <i className="bi bi-clock-history me-2"></i>Histórico
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={() => handleMenuClick('settings')}>
                <i className="bi bi-gear me-2"></i>Configurações
              </button>
            </li>
            {isAdmin && (
              <>
                <li><hr className="dropdown-divider" /></li>
                <li><h6 className="dropdown-header text-warning">Administração</h6></li>
                <li>
                  <button className="dropdown-item text-warning" onClick={() => handleMenuClick('admin')}>
                    <i className="bi bi-shield-check me-2"></i>Painel Admin
                  </button>
                </li>
              </>
            )}
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={onSignOut}>
                <i className="bi bi-box-arrow-right me-2"></i>Sair
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Painel Administrativo */}
      {showAdminPanel && isAdmin && (
        <AdminPanel
          show={showAdminPanel}
          onHide={() => setShowAdminPanel(false)}
          user={user}
        />
      )}
    </>
  );
};

// Dados mock para demonstração (serão substituídos pelos dados do Firestore)
const categoriesData = [
  { id: 1, name: 'Ação', image: 'images/categoria-acao.jpg', count: 150 },
  { id: 2, name: 'Romance', image: 'images/categoria-romance.jpg', count: 95 },
  { id: 3, name: 'Fantasia', image: 'images/categoria-fantasia.jpg', count: 120 },
  { id: 4, name: 'Drama', image: 'images/categoria-drama.jpg', count: 85 },
  { id: 5, name: 'Shounen', image: 'images/categoria-shounen.jpg', count: 200 },
  { id: 6, name: 'Mecha', image: 'images/categoria-mecha.jpg', count: 65 }
];

// Hook personalizado para mangás
const useMangas = () => {
  const [mangas, setMangas] = useState([]);
  const [featuredMangas, setFeaturedMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMangas();
  }, []);

  const loadMangas = async () => {
    try {
      setLoading(true);
      setError(null);

      if (window.mangaService) {
        const [allMangas, featured] = await Promise.all([
          window.mangaService.getAllMangas(),
          window.mangaService.getFeaturedMangas()
        ]);

        setMangas(allMangas);
        setFeaturedMangas(featured);
      }
    } catch (error) {
      console.error('Erro ao carregar mangás:', error);
      setError(error.message);
      // Fallback para dados mock se o Firebase falhar
      setFeaturedMangas([
        {
          id: 'mock1',
          title: 'Aventuras Lunares',
          image: 'images/paisagem-lunar.jpg',
          rating: 4.8,
          chapters: 45,
          status: 'Em andamento',
          description: 'Uma épica jornada pela lua com personagens incríveis.',
          category: 'Fantasia'
        },
        {
          id: 'mock2',
          title: 'Guerra Solar',
          image: 'images/paisagem-sol.jpg',
          rating: 4.6,
          chapters: 32,
          status: 'Concluído',
          description: 'Batalhas intensas sob o sol escaldante.',
          category: 'Ação'
        },
        {
          id: 'mock3',
          title: 'Vida Urbana',
          image: 'images/paisagem-urbana.jpg',
          rating: 4.7,
          chapters: 28,
          status: 'Em andamento',
          description: 'Romance e drama na vida cotidiana da cidade.',
          category: 'Romance'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addManga = async (mangaData) => {
    try {
      if (window.mangaService) {
        const id = await window.mangaService.addManga(mangaData);
        await loadMangas(); // Recarregar lista
        return id;
      }
    } catch (error) {
      console.error('Erro ao adicionar mangá:', error);
      throw error;
    }
  };

  const updateManga = async (id, mangaData) => {
    try {
      if (window.mangaService) {
        await window.mangaService.updateManga(id, mangaData);
        await loadMangas(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao atualizar mangá:', error);
      throw error;
    }
  };

  const deleteManga = async (id) => {
    try {
      if (window.mangaService) {
        await window.mangaService.deleteManga(id);
        await loadMangas(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao deletar mangá:', error);
      throw error;
    }
  };

  const searchMangas = async (searchTerm) => {
    try {
      if (window.mangaService) {
        return await window.mangaService.searchMangas(searchTerm);
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar mangás:', error);
      throw error;
    }
  };

  return {
    mangas,
    featuredMangas,
    loading,
    error,
    addManga,
    updateManga,
    deleteManga,
    searchMangas,
    reloadMangas: loadMangas
  };
};

// Componente Header
const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, signOut } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Pesquisando por:', searchTerm);
    // Aqui você implementaria a lógica de busca
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            <i className="bi bi-book"></i> MangaHQ
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home">
                  <i className="bi bi-house"></i> Início
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#categories">
                  <i className="bi bi-grid"></i> Categorias
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#featured">
                  <i className="bi bi-star"></i> Destaques
                </a>
              </li>
              {user && (
                <li className="nav-item">
                  <a className="nav-link" href="#library">
                    <i className="bi bi-bookmark"></i> Biblioteca
                  </a>
                </li>
              )}
            </ul>

            <div className="d-flex">
              {user ? (
                <UserMenu user={user} onSignOut={handleSignOut} />
              ) : (
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => setShowLoginModal(true)}
                >
                  <i className="bi bi-person"></i> Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLogin={() => setShowLoginModal(false)}
      />
    </>
  );
};

// Componente Hero
const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1>Bem-vindo ao MangaHQ</h1>
          <p>Sua biblioteca digital completa com os melhores mangás</p>

          <div className="search-container mb-4">
            <form className="d-flex">
              <div className="search-container w-100">
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Pesquisar mangás..."
                  aria-label="Search"
                />
                <button className="search-btn" type="submit">
                  <i className="bi bi-search text-white"></i>
                </button>
              </div>
            </form>
          </div>

          <button className="btn btn-hero btn-lg">
            <i className="bi bi-play-circle"></i> Começar a Ler
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente Categories
const Categories = () => {
  return (
    <section id="categories" className="categories-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-dark">Explore por Categoria</h2>
          <p className="lead text-muted">Encontre seus gêneros favoritos</p>
        </div>

        <div className="row">
          {categoriesData.map(category => (
            <div key={category.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card category-card h-100">
                <img src={category.image} className="card-img-top" alt={category.name} />
                <div className="card-body">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text text-muted">
                    <i className="bi bi-book"></i> {category.count} mangás disponíveis
                  </p>
                  <button className="btn btn-primary">
                    <i className="bi bi-arrow-right"></i> Explorar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente FeaturedMangas
const FeaturedMangas = () => {
  const { featuredMangas, loading } = useMangas();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <section id="featured" className="featured-section">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="featured-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-dark">Mangás em Destaque</h2>
          <p className="lead text-muted">Os mais populares da semana</p>
        </div>

        <div className="row">
          {featuredMangas.map(manga => (
            <div key={manga.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card manga-card h-100">
                <img src={manga.image} className="card-img-top" alt={manga.title} />
                <div className="card-body">
                  <h5 className="card-title">{manga.title}</h5>
                  <div className="rating mb-2">
                    {renderStars(manga.rating)}
                    <span className="ms-2">{manga.rating}</span>
                  </div>
                  <p className="card-text">{manga.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-book"></i> {manga.chapters} capítulos
                    </small>
                    <span className={`badge ${manga.status === 'Concluído' ? 'bg-success' : 'bg-primary'}`}>
                      {manga.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-primary me-2">
                      <i className="bi bi-play"></i> Ler
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5><i className="bi bi-book"></i> MangaHQ</h5>
            <p>Sua plataforma completa para leitura de mangás online. Milhares de títulos em alta qualidade.</p>
            <div className="social-icons">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-discord"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5>Navegação</h5>
            <ul className="list-unstyled">
              <li><a href="#home">Início</a></li>
              <li><a href="#categories">Categorias</a></li>
              <li><a href="#featured">Destaques</a></li>
              <li><a href="#library">Biblioteca</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5>Gêneros</h5>
            <ul className="list-unstyled">
              <li><a href="#">Ação</a></li>
              <li><a href="#">Romance</a></li>
              <li><a href="#">Fantasia</a></li>
              <li><a href="#">Drama</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5>Suporte</h5>
            <ul className="list-unstyled">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Reportar Bug</a></li>
              <li><a href="#">Política</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5>App Mobile</h5>
            <p>Baixe nosso app</p>
            <button className="btn btn-outline-light btn-sm mb-2">
              <i className="bi bi-google-play"></i> Play Store
            </button>
            <button className="btn btn-outline-light btn-sm">
              <i className="bi bi-apple"></i> App Store
            </button>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2025 MangaHQ. Todos os direitos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">
              <a href="#" className="me-3">Termos de Uso</a>
              <a href="#" className="me-3">Privacidade</a>
              <a href="#">Cookies</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente Principal da App
const App = () => {
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Simula carregamento inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || authLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Hero />
      <Categories />
      <FeaturedMangas />
      <Footer />

      {/* Mensagem de boas-vindas para usuário logado */}
      {user && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1060 }}
        >
          <div className="toast show" role="alert">
            <div className="toast-header">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <strong className="me-auto">Bem-vindo!</strong>
              <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div className="toast-body">
              Olá, {user.displayName || user.email}! Você está conectado.
            </div>
          </div>                </div>
      )}
    </div>
  );
};

// Componente Modal para Adicionar/Editar Mangá
const MangaFormModal = ({ show, onHide, manga, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    image: '',
    rating: 0,
    chapters: 0,
    status: 'Em andamento',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (manga) {
      setFormData({
        title: manga.title || '',
        description: manga.description || '',
        author: manga.author || '',
        category: manga.category || '',
        image: manga.image || '',
        rating: manga.rating || 0,
        chapters: manga.chapters || 0,
        status: manga.status || 'Em andamento',
        featured: manga.featured || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        author: '',
        category: '',
        image: '',
        rating: 0,
        chapters: 0,
        status: 'Em andamento',
        featured: false
      });
    }
  }, [manga]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validações básicas
      if (!formData.title.trim() || !formData.description.trim() || !formData.author.trim()) {
        throw new Error('Título, descrição e autor são obrigatórios');
      }

      await onSave(formData);
      onHide();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onHide}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-book me-2"></i>
              {manga ? 'Editar Mangá' : 'Adicionar Novo Mangá'}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">Autor *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descrição *</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">Categoria</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="Ação">Ação</option>
                      <option value="Romance">Romance</option>
                      <option value="Fantasia">Fantasia</option>
                      <option value="Drama">Drama</option>
                      <option value="Shounen">Shounen</option>
                      <option value="Mecha">Mecha</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Pausado">Pausado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Avaliação (0-5)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="rating"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="chapters" className="form-label">Capítulos</label>
                    <input
                      type="number"
                      className="form-control"
                      id="chapters"
                      name="chapters"
                      min="0"
                      value={formData.chapters}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="featured">
                        Destaque
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">URL da Imagem</label>
                <input
                  type="url"
                  className="form-control"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check me-2"></i>
                      {manga ? 'Atualizar' : 'Adicionar'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Administração de Mangás
const MangaAdmin = ({ show, onHide }) => {
  const { mangas, loading, addManga, updateManga, deleteManga, reloadMangas } = useMangas();
  const [showForm, setShowForm] = useState(false);
  const [editingManga, setEditingManga] = useState(null);

  const handleAddManga = () => {
    setEditingManga(null);
    setShowForm(true);
  };

  const handleEditManga = (manga) => {
    setEditingManga(manga);
    setShowForm(true);
  };

  const handleSaveManga = async (mangaData) => {
    try {
      if (editingManga) {
        await updateManga(editingManga.id, mangaData);
      } else {
        await addManga(mangaData);
      }
      setShowForm(false);
      setEditingManga(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteManga = async (manga) => {
    if (window.confirm(`Tem certeza que deseja deletar "${manga.title}"?`)) {
      try {
        await deleteManga(manga.id);
      } catch (error) {
        alert('Erro ao deletar mangá: ' + error.message);
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onHide}>
        <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-gear me-2"></i>
                Administrar Mangás
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Total de mangás: {mangas.length}</h6>
                <button className="btn btn-primary" onClick={handleAddManga}>
                  <i className="bi bi-plus me-2"></i>
                  Adicionar Mangá
                </button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Avaliação</th>
                        <th>Capítulos</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mangas.map(manga => (
                        <tr key={manga.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {manga.image && (
                                <img
                                  src={manga.image}
                                  alt={manga.title}
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                {manga.title}
                                {manga.featured && (
                                  <span className="badge bg-warning ms-2">Destaque</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{manga.author || 'N/A'}</td>
                          <td>{manga.category || 'N/A'}</td>
                          <td>
                            <span className={`badge ${manga.status === 'Concluído' ? 'bg-success' : 'bg-primary'}`}>
                              {manga.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-star-fill text-warning me-1"></i>
                              {manga.rating || 0}
                            </div>
                          </td>
                          <td>{manga.chapters || 0}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditManga(manga)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteManga(manga)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {mangas.length === 0 && (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-1 text-muted"></i>
                      <h5 className="text-muted mt-2">Nenhum mangá encontrado</h5>
                      <p className="text-muted">Clique em "Adicionar Mangá" para começar.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MangaFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        manga={editingManga}
        onSave={handleSaveManga}
      />
    </>
  );
};

// Componente AdminPanel - Painel de Administração Completo
const AdminPanel = ({ show, onHide, user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalMangas: 0,
    totalUsers: 0,
    totalViews: 0,
    featuredMangas: 0
  });
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Carregar estatísticas do dashboard
  useEffect(() => {
    if (show) {
      loadDashboardStats();
      loadUsers();
    }
  }, [show]);

  const loadDashboardStats = async () => {
    setLoadingStats(true);
    try {
      // Simular carregamento de estatísticas (substituir por Firebase)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalMangas: 127,
        totalUsers: 1543,
        totalViews: 48291,
        featuredMangas: 15
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      // Simular carregamento de usuários (substituir por Firebase)
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          role: 'user',
          status: 'active',
          joinDate: '2024-01-15',
          lastLogin: '2024-12-30'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          role: 'user',
          status: 'active',
          joinDate: '2024-02-10',
          lastLogin: '2024-12-29'
        },
        {
          id: '3',
          name: 'Admin User',
          email: 'admin@mangahq.com',
          role: 'admin',
          status: 'active',
          joinDate: '2023-12-01',
          lastLogin: '2024-12-30'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      // Implementar mudança de status do usuário
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      console.log(`Status do usuário ${userId} alterado para: ${newStatus}`);
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      // Implementar mudança de papel do usuário
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
      console.log(`Papel do usuário ${userId} alterado para: ${newRole}`);
    } catch (error) {
      console.error('Erro ao alterar papel do usuário:', error);
    }
  };

  const renderOverviewTab = () => (
    <div>
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{loadingStats ? '...' : stats.totalMangas}</h4>
                  <span>Total de Mangás</span>
                </div>
                <i className="bi bi-book display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{loadingStats ? '...' : stats.totalUsers}</h4>
                  <span>Usuários Registrados</span>
                </div>
                <i className="bi bi-people display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{loadingStats ? '...' : stats.totalViews.toLocaleString()}</h4>
                  <span>Total de Visualizações</span>
                </div>
                <i className="bi bi-eye display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{loadingStats ? '...' : stats.featuredMangas}</h4>
                  <span>Mangás em Destaque</span>
                </div>
                <i className="bi bi-star display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-graph-up me-2"></i>Atividade Recente</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Novo mangá adicionado</h6>
                    <p className="mb-1">"Attack on Titan" foi adicionado à biblioteca</p>
                    <small>Há 2 horas</small>
                  </div>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Usuário registrado</h6>
                    <p className="mb-1">maria@email.com se registrou na plataforma</p>
                    <small>Há 4 horas</small>
                  </div>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Avaliação recebida</h6>
                    <p className="mb-1">"One Piece" recebeu uma avaliação 5 estrelas</p>
                    <small>Há 6 horas</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-trophy me-2"></i>Mangás Mais Populares</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>One Piece</strong>
                    <small className="text-muted d-block">15.3k visualizações</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">1º</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Naruto</strong>
                    <small className="text-muted d-block">12.8k visualizações</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">2º</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Attack on Titan</strong>
                    <small className="text-muted d-block">11.2k visualizações</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">3º</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Gerenciamento de Usuários</h5>
        <div>
          <button className="btn btn-primary me-2">
            <i className="bi bi-person-plus me-2"></i>Adicionar Usuário
          </button>
          <button className="btn btn-outline-secondary">
            <i className="bi bi-download me-2"></i>Exportar
          </button>
        </div>
      </div>

      {loadingUsers ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Papel</th>
                <th>Status</th>
                <th>Data de Registro</th>
                <th>Último Login</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.role}
                      onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderador</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.status}
                      onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                    >
                      <option value="active">Ativo</option>
                      <option value="suspended">Suspenso</option>
                      <option value="banned">Banido</option>
                    </select>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString('pt-BR')}</td>
                  <td>{new Date(user.lastLogin).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" title="Visualizar">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-outline-secondary" title="Editar">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-outline-danger" title="Deletar">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSystemTab = () => (
    <div>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-gear me-2"></i>Configurações do Sistema</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nome da Plataforma</label>
                  <input type="text" className="form-control" defaultValue="MangaHQ" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email de Contato</label>
                  <input type="email" className="form-control" defaultValue="contato@mangahq.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Máximo de Mangás por Usuário</label>
                  <input type="number" className="form-control" defaultValue="50" />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                    <label className="form-check-label">Permitir novos registros</label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                    <label className="form-check-label">Modo de manutenção</label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check me-2"></i>Salvar Configurações
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-shield-check me-2"></i>Segurança</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <button className="btn btn-outline-warning w-100 mb-2">
                  <i className="bi bi-arrow-clockwise me-2"></i>Limpar Cache do Sistema
                </button>
                <button className="btn btn-outline-info w-100 mb-2">
                  <i className="bi bi-download me-2"></i>Backup do Banco de Dados
                </button>
                <button className="btn btn-outline-success w-100 mb-2">
                  <i className="bi bi-upload me-2"></i>Restaurar Backup
                </button>
                <button className="btn btn-outline-danger w-100">
                  <i className="bi bi-exclamation-triangle me-2"></i>Logs de Sistema
                </button>
              </div>

              <div className="mt-4">
                <h6>Status do Sistema</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Firebase</span>
                  <span className="badge bg-success">Online</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Autenticação</span>
                  <span className="badge bg-success">Ativo</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>CDN</span>
                  <span className="badge bg-success">Operacional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!show) return null; return (
    <>
      <div className="modal fade show admin-panel" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onHide}>
        <div className="modal-dialog modal-fullscreen modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">
                <i className="bi bi-shield-check me-2"></i>
                Painel de Administração - MangaHQ
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
            </div>
            <div className="modal-body p-0">
              <div className="container-fluid">
                <div className="row">
                  {/* Sidebar de Navegação */}
                  <div className="col-md-3 bg-light py-3">
                    <div className="nav flex-column nav-pills">
                      <button
                        className={`nav-link text-start ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                      >
                        <i className="bi bi-speedometer2 me-2"></i>Dashboard
                      </button>
                      <button
                        className={`nav-link text-start ${activeTab === 'mangas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mangas')}
                      >
                        <i className="bi bi-book me-2"></i>Mangás
                      </button>
                      <button
                        className={`nav-link text-start ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                      >
                        <i className="bi bi-people me-2"></i>Usuários
                      </button>
                      <button
                        className={`nav-link text-start ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                      >
                        <i className="bi bi-tags me-2"></i>Categorias
                      </button>
                      <button
                        className={`nav-link text-start ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                      >
                        <i className="bi bi-graph-up me-2"></i>Relatórios
                      </button>
                      <button
                        className={`nav-link text-start ${activeTab === 'system' ? 'active' : ''}`}
                        onClick={() => setActiveTab('system')}
                      >
                        <i className="bi bi-gear me-2"></i>Sistema
                      </button>
                    </div>

                    <hr />

                    <div className="mt-3">
                      <h6 className="text-muted">Admin logado:</h6>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-warning rounded-circle d-flex align-items-center justify-content-center text-dark me-2">
                          <i className="bi bi-shield-check"></i>
                        </div>
                        <div>
                          <small className="fw-bold">{user?.displayName || user?.email}</small>
                          <small className="text-muted d-block">Administrador</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="col-md-9 py-3">                                        {activeTab === 'overview' && renderOverviewTab()}                                        {activeTab === 'mangas' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Gerenciamento de Mangás</h5>
                        <button className="btn btn-primary" onClick={() => console.log('Adicionar mangá')}>
                          <i className="bi bi-plus me-2"></i>Adicionar Mangá
                        </button>
                      </div>

                      <div className="card">
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Título</th>
                                  <th>Autor</th>
                                  <th>Categoria</th>
                                  <th>Status</th>
                                  <th>Avaliação</th>
                                  <th>Capítulos</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">
                                        One Piece
                                        <span className="badge bg-warning ms-2">Destaque</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>Eiichiro Oda</td>
                                  <td>Shounen</td>
                                  <td><span className="badge bg-primary">Em andamento</span></td>
                                  <td><i className="bi bi-star-fill text-warning me-1"></i>4.9</td>
                                  <td>1000+</td>
                                  <td>
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-outline-primary"><i className="bi bi-pencil"></i></button>
                                      <button className="btn btn-outline-danger"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">Attack on Titan</div>
                                    </div>
                                  </td>
                                  <td>Hajime Isayama</td>
                                  <td>Ação</td>
                                  <td><span className="badge bg-success">Concluído</span></td>
                                  <td><i className="bi bi-star-fill text-warning me-1"></i>4.8</td>
                                  <td>139</td>
                                  <td>
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-outline-primary"><i className="bi bi-pencil"></i></button>
                                      <button className="btn btn-outline-danger"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">Death Note</div>
                                    </div>
                                  </td>
                                  <td>Tsugumi Ohba</td>
                                  <td>Suspense</td>
                                  <td><span className="badge bg-success">Concluído</span></td>
                                  <td><i className="bi bi-star-fill text-warning me-1"></i>4.7</td>
                                  <td>108</td>
                                  <td>
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-outline-primary"><i className="bi bi-pencil"></i></button>
                                      <button className="btn btn-outline-danger"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                    {activeTab === 'users' && renderUsersTab()}
                    {activeTab === 'categories' && (
                      <div className="text-center py-5">
                        <i className="bi bi-tags display-1 text-muted"></i>
                        <h5 className="text-muted mt-3">Gerenciamento de Categorias</h5>
                        <p className="text-muted">Em desenvolvimento...</p>
                      </div>
                    )}
                    {activeTab === 'reports' && (
                      <div className="text-center py-5">
                        <i className="bi bi-graph-up display-1 text-muted"></i>
                        <h5 className="text-muted mt-3">Relatórios e Analytics</h5>
                        <p className="text-muted">Em desenvolvimento...</p>
                      </div>
                    )}
                    {activeTab === 'system' && renderSystemTab()}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <div className="d-flex justify-content-between w-100 align-items-center">
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  Último acesso: {new Date().toLocaleString('pt-BR')}
                </small>
                <div>
                  <button type="button" className="btn btn-outline-secondary me-2">
                    <i className="bi bi-question-circle me-2"></i>Ajuda
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onHide}>
                    <i className="bi bi-x-lg me-2"></i>Fechar Painel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Renderizar a aplicação usando React 18 API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);