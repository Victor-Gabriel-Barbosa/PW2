const ThemeSwitcher = () => {
    const [theme, setTheme] = React.useState(() => {
        if (localStorage.theme === 'dark' || 
            (!('theme' in localStorage) && 
            window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        } else if (localStorage.theme === 'light') {
            return 'light';
        } else {
            return 'system';
        }
    });
    
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        // Atualiza a classe no elemento html
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            // Modo de sistema
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme]);

    // Escuta mudanças na preferência do sistema
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (theme === 'system') {
                if (mediaQuery.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
      // Fecha o dropdown ao clicar fora dele
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Verificar se o clique foi fora do componente de dropdown
            const dropdownElement = document.querySelector('.theme-dropdown');
            if (dropdownElement && !dropdownElement.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);
    
    const toggleDropdown = (e) => {
        e.stopPropagation(); // Impede que o evento de clique se propague
        setIsOpen(!isOpen);
    };
    
    const handleThemeChange = (newTheme, e) => {
        e.stopPropagation();
        setTheme(newTheme);
        setIsOpen(false);
    };
    
    // Obtém o ícone e o texto correspondentes ao tema atual
    const getCurrentThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <i className="fas fa-sun text-yellow-500"></i>;
            case 'dark':
                return <i className="fas fa-moon text-blue-700 dark:text-blue-400"></i>;
            default:
                return <i className="fas fa-desktop text-gray-500 dark:text-gray-400"></i>;
        }
    };
    
    const getCurrentThemeText = () => {
        switch (theme) {
            case 'light':
                return "Tema Claro";
            case 'dark':
                return "Tema Escuro";
            default:
                return "Tema do Sistema";
        }    };

    return (
        <div className="theme-dropdown relative inline-block text-left">
            <button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                title="Mudar tema"
            >
                <span className="flex items-center justify-center w-5 h-5">{getCurrentThemeIcon()}</span>
                <span className="text-sm font-medium hidden sm:inline">{getCurrentThemeText()}</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            
            {/* Dropdown menu */}
            {isOpen && (
                <div className="theme-dropdown-menu absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        <button 
                            onClick={(e) => handleThemeChange('light', e)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-primary-500 bg-gray-100 dark:bg-gray-700 font-medium' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                            <i className="fas fa-sun text-yellow-500"></i>
                            <span>Tema Claro</span>
                            {theme === 'light' && <i className="fas fa-check ml-auto text-primary-500"></i>}
                        </button>
                        
                        <button 
                            onClick={(e) => handleThemeChange('dark', e)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-primary-500 bg-gray-100 dark:bg-gray-700 font-medium' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                            <i className="fas fa-moon text-blue-700 dark:text-blue-400"></i>
                            <span>Tema Escuro</span>
                            {theme === 'dark' && <i className="fas fa-check ml-auto text-primary-500"></i>}
                        </button>
                        
                        <button 
                            onClick={(e) => handleThemeChange('system', e)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${theme === 'system' ? 'text-primary-500 bg-gray-100 dark:bg-gray-700 font-medium' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                            <i className="fas fa-desktop text-gray-500 dark:text-gray-400"></i>
                            <span>Tema do Sistema</span>
                            {theme === 'system' && <i className="fas fa-check ml-auto text-primary-500"></i>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
