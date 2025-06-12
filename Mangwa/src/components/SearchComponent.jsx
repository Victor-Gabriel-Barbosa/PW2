import React, { useState } from 'react';
import { useMangaSearch } from '../hooks/useMangas';
import MangaCard from './MangaCard';
import { LoadingSpinner, EmptyState, ErrorMessage } from './LoadingComponents';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, isSearching, searchError, search, clearSearch } = useMangaSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      search(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    clearSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar mangás..."
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
            />
            <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchTerm.trim()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Buscando...
              </>
            ) : (
              <>
                <i className="bi bi-search"></i>
                Buscar
              </>
            )}
          </button>
          {searchResults.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </form>
      </div>      {/* Search Error */}
      {searchError && (
        <ErrorMessage
          title="Erro na Pesquisa"
          message={searchError}
          onRetry={() => search(searchTerm)}
          retryText="Tentar Novamente"
        />
      )}

      {/* Loading */}
      {isSearching && (
        <LoadingSpinner size="lg" text="Pesquisando mangás..." />
      )}

      {/* Search Results */}
      {!isSearching && searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Resultados da Pesquisa ({searchResults.length})
          </h2>          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {searchResults.map((manga) => (
              <MangaCard key={`search-${manga.id}`} manga={manga} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchTerm && searchResults.length === 0 && !searchError && (
        <EmptyState
          icon="bi-search"
          title="Nenhum resultado encontrado"
          message="Tente usar palavras-chave diferentes ou verifique a ortografia."
        />
      )}
    </div>
  );
};

export default SearchComponent;
