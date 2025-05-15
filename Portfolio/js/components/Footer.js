const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Logo e info */}
                    <div>
                        <a href="#" className="text-2xl font-bold text-primary-500 flex items-center gap-2 mb-4">
                            <i className="fas fa-code"></i>
                            <span className="font-mono">Dev.Portfolio</span>
                        </a>
                        <p className="text-gray-400 mb-4">
                            Desenvolvendo soluções web modernas e eficientes para transformar suas ideias em realidade.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                    
                    {/* Links úteis */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Links Úteis</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#home" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                                    Sobre
                                </a>
                            </li>
                            <li>
                                <a href="#skills" className="text-gray-400 hover:text-white transition-colors">
                                    Habilidades
                                </a>
                            </li>
                            <li>
                                <a href="#projects" className="text-gray-400 hover:text-white transition-colors">
                                    Projetos
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4">
                            Assine para receber atualizações sobre novos projetos e artigos técnicos.
                        </p>
                        <form className="flex">
                            <input 
                                type="email" 
                                placeholder="seu.email@exemplo.com" 
                                className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none bg-gray-800 border border-gray-700"
                            />
                            <button 
                                type="submit" 
                                className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-lg transition-colors"
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Linha divisória */}
                <div className="h-px bg-gray-800 my-8"></div>
                
                {/* Copyright */}
                <div className="text-center text-gray-500">
                    <p>&copy; {currentYear} Dev.Portfolio. Todos os direitos reservados.</p>
                    <p className="mt-2 text-sm">
                        Feito com <i className="fas fa-heart text-red-500"></i> e <i className="fab fa-react text-blue-400"></i>
                    </p>
                </div>
            </div>
        </footer>
    );
};
