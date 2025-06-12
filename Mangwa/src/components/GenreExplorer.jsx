import React, { useState } from 'react';
import { useGenres, useMangasByGenre } from '../hooks/useMangas';
import { LoadingSpinner, EmptyState } from './LoadingComponents';
import { getGenreIcon, translateGenre, getPopularGenres, formatGenreCount } from '../utils/genreUtils';
import MangaCard from './MangaCard';

const GenreSelector = ({ onGenreSelect, selectedGenre }) => {
  const { genres, loading, error } = useGenres();

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🎭 Explore por Gênero
        </h2>
        <LoadingSpinner text="Carregando gêneros..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🎭 Explore por Gênero
        </h2>
        <EmptyState
          icon="bi-exclamation-triangle"
          title="Erro ao carregar gêneros"
          message="Não foi possível carregar os gêneros. Tente novamente mais tarde."
        />
      </section>
    );  }  // Usar utilitário para obter gêneros populares únicos
  const popularGenres = getPopularGenres(genres, 50, 12);
  
  // Debug: informações sobre processamento
  if (process.env.NODE_ENV === 'development') {
    console.log('GenreSelector - Processamento:', {
      total: genres.length,
      filtered: popularGenres.length,
      genres: popularGenres.map(g => ({ id: g.id, name: g.name, count: g.count }))
    });
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎭 Explore por Gênero
        </h2>
        {selectedGenre && (
          <button
            onClick={() => onGenreSelect(null)}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            ← Voltar aos gêneros
          </button>
        )}
      </div>      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {popularGenres.map((genre) => {
          const translatedName = translateGenre(genre.name);
          const icon = getGenreIcon(genre.name);
          const isSelected = selectedGenre?.id === genre.id;
          // Criar chave única usando apenas o ID do gênero (que é único)
          const uniqueKey = `genre-${genre.id}`;
          
          return (
            <button
              key={uniqueKey}
              onClick={() => onGenreSelect(genre)}
              className={`p-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center group ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <div className="mb-2">
                <i className={`${icon} text-2xl ${
                  isSelected
                    ? 'text-white'
                    : 'text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300'
                } transition-colors`}></i>
              </div>
              <h3 className={`font-medium transition-colors text-sm ${
                isSelected
                  ? 'text-white'
                  : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
              }`}>
                {translatedName}
              </h3>
              <p className={`text-xs mt-1 ${
                isSelected
                  ? 'text-white/80'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatGenreCount(genre.count)} mangás
              </p>
            </button>
          );
        })}
      </div>

      {genres.length > popularGenres.length && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {popularGenres.length} dos {genres.length} gêneros disponíveis
          </p>
        </div>
      )}
    </section>
  );
};

const GenreMangaGrid = ({ genre }) => {
  const { mangas, loading, error, loadMore } = useMangasByGenre(genre?.id);
  const [showMore, setShowMore] = useState(false);

  if (!genre) return null;

  const handleLoadMore = () => {
    setShowMore(true);
    loadMore(24); // Carregar 24 mangás
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📚 Mangás de {genre.name}
        </h2>
        <span className="text-gray-500 dark:text-gray-400">
          {mangas.length} mangás encontrados
        </span>
      </div>

      {loading && (
        <LoadingSpinner text={`Carregando mangás de ${genre.name}...`} />
      )}

      {error && (
        <EmptyState
          icon="bi-exclamation-triangle"
          title="Erro ao carregar mangás"
          message={error}
        />
      )}

      {!loading && !error && mangas.length === 0 && (
        <EmptyState
          icon="bi-book"
          title="Nenhum mangá encontrado"
          message={`Não há mangás disponíveis para o gênero ${genre.name} no momento.`}
        />
      )}      {!loading && mangas.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {mangas.map((manga) => (
              <MangaCard key={`manga-${manga.id}`} manga={manga} />
            ))}
          </div>

          {!showMore && mangas.length >= 12 && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <i className="bi bi-arrow-down"></i>
                Carregar Mais Mangás
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

const GenreExplorer = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  return (
    <div>
      <GenreSelector
        onGenreSelect={setSelectedGenre}
        selectedGenre={selectedGenre}
      />
      
      {selectedGenre && (
        <GenreMangaGrid genre={selectedGenre} />
      )}
    </div>
  );
};

export default GenreExplorer;
