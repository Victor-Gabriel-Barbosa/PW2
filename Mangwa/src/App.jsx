import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MangaGrid from './components/MangaGrid';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { 
  mockMangas, 
  getPopularMangas, 
  getLatestMangas, 
  getFavoriteMangas 
} from './data/mockData';

function App() {
  const [loading, setLoading] = useState(true);
  const [popularMangas, setPopularMangas] = useState([]);
  const [latestMangas, setLatestMangas] = useState([]);
  const [favoriteMangas, setFavoriteMangas] = useState([]);
  
  // Initialize theme
  useTheme();

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPopularMangas(getPopularMangas());
      setLatestMangas(getLatestMangas());
      setFavoriteMangas(getFavoriteMangas());
      
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 theme-transition">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Popular Mangas */}
          <MangaGrid
            mangas={popularMangas}
            loading={loading}
            title="🔥 Mangás Populares"
            maxItems={8}
          />
          
          {/* Latest Updates */}
          <MangaGrid
            mangas={latestMangas}
            loading={loading}
            title="📅 Últimas Atualizações"
            maxItems={8}
          />
          
          {/* Favorite Mangas */}
          {favoriteMangas.length > 0 && (
            <MangaGrid
              mangas={favoriteMangas}
              loading={loading}
              title="❤️ Seus Favoritos"
              maxItems={6}
            />
          )}
            {/* Genre Spotlight */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🎭 Explore por Gênero
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Ação', icon: 'bi-lightning-fill' },
                { name: 'Romance', icon: 'bi-heart-fill' },
                { name: 'Fantasia', icon: 'bi-star-fill' },
                { name: 'Comédia', icon: 'bi-emoji-smile-fill' },
                { name: 'Drama', icon: 'bi-mask' },
                { name: 'Horror', icon: 'bi-ghost' }
              ].map((genre) => (
                <button
                  key={genre.name}
                  className="p-4 bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center group"
                >
                  <div className="mb-2">
                    <i className={`${genre.icon} text-2xl text-primary-600 dark:text-primary-400`}></i>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {genre.name}
                  </h3>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
