const Projects = () => {
  const [filter, setFilter] = React.useState('all');
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      title: "Reviews e Comunidade de animes",
      category: "web",
      image: "images/Animu.png",
      description: "Site completo de animes com fórum de discussão, sistema de login, recomendações, perfil de usuário e painel de admin.",
      technologies: ["Tailwind CSS", "JQuery", "Firebase/Firestore"],
      demoLink: "https://victor-gabriel-barbosa.github.io/Animu/",
      codeLink: "https://github.com/Victor-Gabriel-Barbosa/Animu",
    },
    {
      id: 2,
      title: "App de Gestão de Tarefas",
      category: "app",
      image: "https://via.placeholder.com/600x400?text=Task+Manager+App",
      description: "Aplicativo mobile para gerenciamento de tarefas e projetos com notificações.",
      technologies: ["React Native", "Firebase", "Redux"],
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 3,
      title: "Dashboard de Analytics",
      category: "web",
      image: "https://via.placeholder.com/600x400?text=Analytics+Dashboard",
      description: "Dashboard interativo para visualização de dados e métricas de marketing.",
      technologies: ["Vue.js", "D3.js", "Express", "PostgreSQL"],
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 4,
      title: "API RESTful",
      category: "backend",
      image: "https://via.placeholder.com/600x400?text=RESTful+API",
      description: "API segura com autenticação JWT, validação e documentação completa.",
      technologies: ["Node.js", "Express", "MongoDB", "Swagger"],
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 5,
      title: "Landing Page",
      category: "web",
      image: "https://via.placeholder.com/600x400?text=Landing+Page",
      description: "Landing page responsiva e otimizada para conversão de leads.",
      technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
      demoLink: "#",
      codeLink: "#",
    },
    {
      id: 6,
      title: "App de Clima",
      category: "app",
      image: "https://via.placeholder.com/600x400?text=Weather+App",
      description: "Aplicativo de previsão do tempo com geolocalização e interface adaptativa.",
      technologies: ["React Native", "Weather API", "Geolocation"],
      demoLink: "#",
      codeLink: "#",
    },
  ]);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Meus <span className="text-primary-500">Projetos</span>
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Alguns dos projetos que desenvolvi ao longo da minha carreira.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-colors ${filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('web')}
            className={`px-6 py-2 rounded-full transition-colors ${filter === 'web'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Web
          </button>
          <button
            onClick={() => setFilter('app')}
            className={`px-6 py-2 rounded-full transition-colors ${filter === 'app'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setFilter('backend')}
            className={`px-6 py-2 rounded-full transition-colors ${filter === 'backend'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Backend
          </button>
        </div>

        {/* Projetos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="project-card bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Imagem do projeto */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <div className="flex gap-2 justify-center">
                      <a
                        href={project.demoLink}
                        className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm hover:bg-primary-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-external-link-alt mr-1"></i> Demo
                      </a>
                      <a
                        href={project.codeLink}
                        className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm hover:bg-black transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-github mr-1"></i> Código
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {project.description}
                </p>

                {/* Tecnologias */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 dark:bg-gray-700 text-primary-500 text-xs px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão "ver mais" */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com"
            className="inline-block px-8 py-3 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg transition-colors font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github mr-2"></i>
            Ver mais no GitHub
          </a>
        </div>
      </div>
    </section>
  );
};
