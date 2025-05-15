const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sobre <span className="text-primary-500">Mim</span>
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Conheça um pouco mais sobre minha trajetória e paixão por desenvolvimento web.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Imagem ou ilustração */}
          <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-xl">
                {/* Efeito de code rain no fundo */}
                <div className="absolute inset-0 opacity-10 overflow-hidden code-rain-bg">
                  <pre className="text-xs text-primary-500">
                    {`function developer() {
                        const skills = ['JavaScript', 'React', 'Node.js'];
                        const passion = 'Building amazing web experiences';
                        
                        return {
                          code: () => console.log('Coding...'),
                          learn: () => skills.push(newTech),
                          create: () => buildAwesomeStuff()
                        }
                      }

                      const me = developer();
                      me.code();`
                    }
                  </pre>
                </div>

                {/* Ícone placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="images/perfil.jpg" alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>

              {/* Badge decorativa */}
              <div className="absolute -bottom-4 -right-4 bg-primary-500 text-white rounded-full px-4 py-2 shadow-lg">
                <i className="fas fa-laptop-code mr-2"></i>
                Web Developer
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Desenvolvedor Web & Entusiasta de Tecnologia
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sou um desenvolvedor web apaixonado por criar experiências digitais intuitivas e modernas.
              Com experiência em desenvolvimento front-end e back-end, busco sempre as melhores tecnologias
              e práticas para entregar soluções de alta qualidade.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Minha jornada na programação começou há alguns anos, e desde então venho
              aprimorando minhas habilidades e conhecimentos para criar aplicações web
              que combinam design atraente com funcionalidade sólida.
            </p>

            {/* Informações pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <i className="fas fa-envelope text-primary-500 mr-3"></i>
                <span className="text-gray-700 dark:text-gray-300">email@exemplo.com</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-primary-500 mr-3"></i>
                <span className="text-gray-700 dark:text-gray-300">São Paulo, Brasil</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-graduation-cap text-primary-500 mr-3"></i>
                <span className="text-gray-700 dark:text-gray-300">Ciência da Computação</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-briefcase text-primary-500 mr-3"></i>
                <span className="text-gray-700 dark:text-gray-300">Freelancer Disponível</span>
              </div>
            </div>

            {/* Botões de redes sociais */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-black transition-colors">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
