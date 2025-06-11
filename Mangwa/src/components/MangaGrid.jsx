import React from "react";
import MangaCard from "./MangaCard";

const MangaGrid = ({
  mangas = [],
  loading = false,
  title = "Mangás em Destaque",
  showAll = false,
  maxItems = 12,
}) => {
  const displayedMangas = showAll ? mangas : mangas.slice(0, maxItems);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="bi bi-arrow-clockwise animate-spin text-2xl text-primary-600 mr-2"></i>
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Carregando mangás...
        </span>
      </div>
    );
  }

  if (mangas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          Nenhum mangá encontrado
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          Tente ajustar os filtros ou buscar por outros termos
        </p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {!showAll && mangas.length > maxItems && (
          <button className="bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm">
            Ver Todos ({mangas.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {displayedMangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>

      {!showAll && mangas.length > maxItems && (
        <div className="text-center mt-8">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Carregar Mais Mangás
          </button>
        </div>
      )}
    </section>
  );
};

export default MangaGrid;
