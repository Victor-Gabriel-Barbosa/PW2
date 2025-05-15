const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center pt-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center">
                {/* Texto de apresentação */}
                <div className="md:w-1/2 mt-10 md:mt-0 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-violet-500 text-transparent bg-clip-text">
                        Desenvolvedor Full Stack
                    </h1>
                    <p className="text-lg sm:text-xl mb-8 text-gray-700 dark:text-gray-300">
                        Criando aplicações web modernas e interativas com as melhores tecnologias do mercado.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-primary-500 font-medium">
                            <i className="fab fa-react mr-2"></i>React
                        </span>
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-primary-500 font-medium">
                            <i className="fab fa-node-js mr-2"></i>Node.js
                        </span>
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-primary-500 font-medium">
                            <i className="fab fa-js mr-2"></i>JavaScript
                        </span>
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-primary-500 font-medium">
                            <i className="fab fa-html5 mr-2"></i>HTML5
                        </span>
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-primary-500 font-medium">
                            <i className="fab fa-css3-alt mr-2"></i>CSS3
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <a 
                            href="#contact" 
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-lg transition-all hover:shadow-xl focus:ring focus:ring-primary-200 dark:focus:ring-primary-900"
                        >
                            Contato
                            <i className="fas fa-arrow-right ml-2"></i>
                        </a>
                        <a 
                            href="#projects" 
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-md transition-all"
                        >
                            Ver Projetos
                            <i className="fas fa-chevron-down ml-2"></i>
                        </a>
                    </div>
                </div>
                
                {/* Ilustração/Avatar */}
                <div className="md:w-1/2 flex justify-center animate-fade-in">
                    <div className="w-64 h-64 md:w-96 md:h-96 relative">
                        {/* Círculos decorativos */}
                        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-primary-500/30 to-primary-300/30 animate-pulse"></div>
                        <div className="absolute w-4/5 h-4/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-violet-500/20 to-blue-300/20 animate-pulse" style={{animationDelay: '1s'}}></div>
                        
                        {/* Avatar placeholder - você pode substituir isso por sua própria imagem */}
                        <div className="absolute w-3/4 h-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                            {/* Ícone de código como placeholder */}
                            <div className="w-full h-full flex items-center justify-center">
                                <i className="fas fa-code text-7xl text-primary-500"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <i className="fas fa-chevron-down text-primary-500 text-2xl"></i>
            </div>
        </section>
    );
};
