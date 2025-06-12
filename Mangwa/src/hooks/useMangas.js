import { useState, useEffect, useCallback } from 'react';
import {
  getPopularMangas,
  getTopRatedMangas,
  getLatestMangas,
  getMangaById,
  searchMangas,
  getMangasByGenre,
  getGenres,
  clearCache
} from '../services/jikanApi';

// Hook para gerenciar dados dos mangás
export const useMangas = () => {
  const [popularMangas, setPopularMangas] = useState([]);
  const [topRatedMangas, setTopRatedMangas] = useState([]);
  const [latestMangas, setLatestMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [popular, topRated, latest] = await Promise.all([
        getPopularMangas(12),
        getTopRatedMangas(12),
        getLatestMangas(12)
      ]);

      setPopularMangas(popular);
      setTopRatedMangas(topRated);
      setLatestMangas(latest);
    } catch (err) {
      setError('Erro ao carregar dados dos mangás');
      console.error('Erro ao carregar dados iniciais:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    popularMangas,
    topRatedMangas,
    latestMangas,
    loading,
    error,
    reloadData: loadInitialData
  };
};

// Hook para pesquisa de mangás
export const useMangaSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchMangas(query, 20);
      setSearchResults(results);
    } catch (err) {
      setSearchError('Erro ao pesquisar mangás');
      console.error('Erro na pesquisa:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    search,
    clearSearch
  };
};

// Hook para mangá específico
export const useManga = (mangaId) => {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadManga = async () => {
      if (!mangaId) return;

      setLoading(true);
      setError(null);

      try {
        const mangaData = await getMangaById(mangaId);
        setManga(mangaData);
      } catch (err) {
        setError('Erro ao carregar dados do mangá');
        console.error('Erro ao carregar mangá:', err);
      } finally {
        setLoading(false);
      }
    };

    loadManga();
  }, [mangaId]);

  return { manga, loading, error };
};

// Hook para gêneros
export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true);
      setError(null);

      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (err) {
        setError('Erro ao carregar gêneros');
        console.error('Erro ao carregar gêneros:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { genres, loading, error };
};

// Hook para mangás por gênero
export const useMangasByGenre = (genreId) => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMangasByGenre = useCallback(async (id, limit = 12) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const mangasData = await getMangasByGenre(id, limit);
      setMangas(mangasData);
    } catch (err) {
      setError('Erro ao carregar mangás do gênero');
      console.error('Erro ao carregar mangás por gênero:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (genreId) {
      loadMangasByGenre(genreId);
    }
  }, [genreId, loadMangasByGenre]);

  return {
    mangas,
    loading,
    error,
    loadMore: (limit) => loadMangasByGenre(genreId, limit)
  };
};

// Hook para favoritos (usando localStorage)
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('mangwa_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        setFavorites([]);
      }
    }
  }, []);

  const addToFavorites = useCallback((mangaId) => {
    setFavorites(prev => {
      const newFavorites = [...prev, mangaId];
      localStorage.setItem('mangwa_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((mangaId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== mangaId);
      localStorage.setItem('mangwa_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((mangaId) => {
    return favorites.includes(mangaId);
  }, [favorites]);

  const toggleFavorite = useCallback((mangaId) => {
    if (isFavorite(mangaId)) {
      removeFromFavorites(mangaId);
    } else {
      addToFavorites(mangaId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
  };
};

// Hook para mangás mais bem avaliados (específico para carrossel)
export const useTopRatedMangas = (limit = 12) => {
  const [topRatedMangas, setTopRatedMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTopRatedMangas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const mangas = await getTopRatedMangas(limit);
      setTopRatedMangas(mangas);
    } catch (err) {
      setError('Erro ao carregar mangás mais bem avaliados');
      console.error('Erro ao carregar top rated:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadTopRatedMangas();
  }, [loadTopRatedMangas]);

  return {
    topRatedMangas,
    loading,
    error,
    reload: loadTopRatedMangas
  };
};
