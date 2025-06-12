import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme, getThemeIcon, getThemeLabel } = useTheme();
  const navigationItems = [
    { name: "Início", href: "#home", icon: "bi-house" },
    { name: "Populares", href: "#popular", icon: "bi-fire" },
    { name: "Gêneros", href: "#genres", icon: "bi-grid" },
    { name: "Favoritos", href: "#favorites", icon: "bi-heart" },
  ];
  const themeOptions = [
    { value: "light", label: "Claro", icon: "bi-sun" },
    { value: "dark", label: "Escuro", icon: "bi-moon" },
    { value: "system", label: "Sistema", icon: "bi-display" },
  ];
  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isThemeDropdownOpen && !event.target.closest(".theme-dropdown")) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

  // Função para obter o ícone do tema atual
  const getCurrentThemeIcon = () => {
    const currentOption = themeOptions.find((option) => option.value === theme);
    return currentOption ? currentOption.icon : "bi-display";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 transition-colors duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg">
              <img
                src="/favicon/favicon.svg"
                alt="Mangwa Logo"
                className="w-6 h-6 text-white"
              />
            </div>
            <h1 className="text-xl font-bold text-gradient">Mangwa</h1>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200">
                {item.name}
              </a>
            ))}
          </nav>{" "}
          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>{" "}
              <input
                type="text"
                placeholder="Buscar mangás e manhwas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {" "}
            {/* Theme Selector */}
            <div className="relative theme-dropdown">
              {" "}
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors duration-200 flex items-center space-x-1"
                title={`Tema: ${getThemeLabel()}`}>
                <i
                  className={`${getCurrentThemeIcon()} text-gray-700 dark:text-gray-300`}></i>
                <i
                  className={`bi bi-chevron-down text-xs text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                    isThemeDropdownOpen ? "rotate-180" : ""
                  }`}></i>
              </button>
              {/* Theme Dropdown */}
              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 z-50">
                  <div className="py-1">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTheme(option.value);
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200 ${
                          theme === option.value
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}>
                        <i
                          className={`${option.icon} ${
                            theme === option.value
                              ? "text-primary-600 dark:text-primary-400"
                              : ""
                          }`}></i>
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {theme === option.value && (
                          <i className="bi bi-check ml-auto text-primary-600 dark:text-primary-400"></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>{" "}
            {/* User Profile */}
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors duration-200">
              <i className="bi bi-person text-gray-700 dark:text-gray-300"></i>
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors duration-200">
              {isMenuOpen ? (
                <i className="bi bi-x text-gray-700 dark:text-gray-300"></i>
              ) : (
                <i className="bi bi-list text-gray-700 dark:text-gray-300"></i>
              )}
            </button>
          </div>
        </div>{" "}
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>{" "}
            <input
              type="text"
              placeholder="Buscar mangás e manhwas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 animate-slide-up">
          {" "}
          <div className="px-4 py-2 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}>
                <i className={`${item.icon} text-lg`}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
