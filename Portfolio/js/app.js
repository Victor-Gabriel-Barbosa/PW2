// Aplicação principal
const App = () => {
  React.useEffect(() => {
    // Verifica o tema ao carregar a página
    if (localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else document.documentElement.classList.remove('dark');

    // Adiciona classe smooth-scroll
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  return (
    <React.Fragment>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </React.Fragment>
  );
};

// Renderiza o componente principal usando createRoot (React 18)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
