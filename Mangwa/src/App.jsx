import React, { useState } from "react";
import Header from "./components/Header";
import TopMangaCarousel from "./components/TopMangaCarousel";
import MangaGrid from "./components/MangaGrid";
import SearchComponent from "./components/SearchComponent";
import GenreExplorer from "./components/GenreExplorer";
import Footer from "./components/Footer";
import { useTheme } from "./hooks/useTheme";
import { useMangas } from "./hooks/useMangas";

function App() {
  const [showSearch, setShowSearch] = useState(false);

  // Initialize theme
  useTheme();

  // Load manga data from Jikan API
  const {
    popularMangas,
    topRatedMangas,
    latestMangas,
    loading,
    error,
    reloadData,
  } = useMangas();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <Header onSearchToggle={setShowSearch} />

      <main>
        {/* Search Results */}
        {showSearch ? (
          <div className="py-8">
            <SearchComponent />
          </div>        ) : (
          <>
            {/* Top Manga Carousel */}
            <TopMangaCarousel />
            
            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* Popular Mangas */}
              <MangaGrid
                mangas={popularMangas}
                loading={loading}
                title="🔥 Mangás Populares"
                maxItems={8}
              />
              {/* Top Rated Mangas */}
              <MangaGrid
                mangas={topRatedMangas}
                loading={loading}
                title="⭐ Mais Bem Avaliados"
                maxItems={8}
              />
              {/* Latest Updates */}
              <MangaGrid
                mangas={latestMangas}
                loading={loading}
                title="📅 Últimas Atualizações"
                maxItems={8}
              />
              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <i className="bi bi-exclamation-triangle-fill text-red-500 mr-2"></i>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                    <button
                      onClick={reloadData}
                      className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              )}{" "}
              {/* Genre Spotlight - Now with real API data */}
              <GenreExplorer />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
