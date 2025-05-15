const Header = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState('home');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Detecta o scroll para mudar o estilo do cabeçalho
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Detecta a seção ativa com base no scroll
            const sections = ['home', 'about', 'skills', 'projects', 'contact'];
            let currentSection = 'home';

            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSection = section;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId);
            setIsMenuOpen(false);
        }
    };

    return (
        <header 
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md' 
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold text-primary-500 flex items-center gap-2">
                    <i className="fas fa-code"></i>
                    <span className="font-mono">Dev.Portfolio</span>
                </a>

                {/* Menu para desktop */}
                <nav className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-6 items-center">
                        <li>
                            <a 
                                href="#home" 
                                onClick={(e) => {e.preventDefault(); scrollToSection('home')}}
                                className={`nav-link transition-colors hover:text-primary-500 ${activeSection === 'home' ? 'active' : ''}`}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#about" 
                                onClick={(e) => {e.preventDefault(); scrollToSection('about')}}
                                className={`nav-link transition-colors hover:text-primary-500 ${activeSection === 'about' ? 'active' : ''}`}
                            >
                                Sobre
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#skills" 
                                onClick={(e) => {e.preventDefault(); scrollToSection('skills')}}
                                className={`nav-link transition-colors hover:text-primary-500 ${activeSection === 'skills' ? 'active' : ''}`}
                            >
                                Habilidades
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#projects" 
                                onClick={(e) => {e.preventDefault(); scrollToSection('projects')}}
                                className={`nav-link transition-colors hover:text-primary-500 ${activeSection === 'projects' ? 'active' : ''}`}
                            >
                                Projetos
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#contact" 
                                onClick={(e) => {e.preventDefault(); scrollToSection('contact')}}
                                className={`nav-link transition-colors hover:text-primary-500 ${activeSection === 'contact' ? 'active' : ''}`}
                            >
                                Contato
                            </a>
                        </li>
                    </ul>
                    <ThemeSwitcher />
                </nav>

                {/* Menu para mobile */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeSwitcher />
                    <button 
                        onClick={toggleMenu} 
                        className="text-2xl focus:outline-none"
                        aria-label="Menu"
                    >
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>

            {/* Menu mobile dropdown */}
            <div 
                className={`md:hidden bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden ${
                    isMenuOpen ? 'max-h-80' : 'max-h-0'
                }`}
            >
                <ul className="px-4 py-2">
                    <li className="py-2 border-b border-gray-100 dark:border-gray-700">
                        <a 
                            href="#home" 
                            onClick={(e) => {e.preventDefault(); scrollToSection('home')}}
                            className={`block ${activeSection === 'home' ? 'text-primary-500' : ''}`}
                        >
                            Home
                        </a>
                    </li>
                    <li className="py-2 border-b border-gray-100 dark:border-gray-700">
                        <a 
                            href="#about" 
                            onClick={(e) => {e.preventDefault(); scrollToSection('about')}}
                            className={`block ${activeSection === 'about' ? 'text-primary-500' : ''}`}
                        >
                            Sobre
                        </a>
                    </li>
                    <li className="py-2 border-b border-gray-100 dark:border-gray-700">
                        <a 
                            href="#skills" 
                            onClick={(e) => {e.preventDefault(); scrollToSection('skills')}}
                            className={`block ${activeSection === 'skills' ? 'text-primary-500' : ''}`}
                        >
                            Habilidades
                        </a>
                    </li>
                    <li className="py-2 border-b border-gray-100 dark:border-gray-700">
                        <a 
                            href="#projects" 
                            onClick={(e) => {e.preventDefault(); scrollToSection('projects')}}
                            className={`block ${activeSection === 'projects' ? 'text-primary-500' : ''}`}
                        >
                            Projetos
                        </a>
                    </li>
                    <li className="py-2">
                        <a 
                            href="#contact" 
                            onClick={(e) => {e.preventDefault(); scrollToSection('contact')}}
                            className={`block ${activeSection === 'contact' ? 'text-primary-500' : ''}`}
                        >
                            Contato
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
};
