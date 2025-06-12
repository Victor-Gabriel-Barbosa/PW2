// Exemplo de como usar a API Jikan no seu projeto

import React, { useState, useEffect } from 'react';
import { getPopularMangas, searchMangas } from '../services/jikanApi';

const ExemploUsoJikanAPI = () => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar mangás populares ao montar o componente
  useEffect(() => {
    const loadMangas = async () => {
      try {
        setLoading(true);
        const popularMangas = await getPopularMangas(10);
        setMangas(popularMangas);
      } catch (error) {
        console.error('Erro ao carregar mangás:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMangas();
  }, []);

  // Função para pesquisar mangás
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const searchResults = await searchMangas(searchTerm, 20);
      setMangas(searchResults);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exemplo - API Jikan</h1>
      
      {/* Formulário de Pesquisa */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar mangás..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Estado de Carregamento */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Carregando mangás...</p>
        </div>
      )}

      {/* Lista de Mangás */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mangas.map((manga) => (
            <div key={manga.id} className="border rounded-lg p-4 shadow">
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-full h-48 object-cover rounded mb-2"
                onError={(e) => {
                  e.target.src = '/images/default-image.jpg';
                }}
              />
              <h3 className="font-bold text-lg mb-1">{manga.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Avaliação: {manga.rating}/10
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Status: {manga.status}
              </p>
              <div className="flex flex-wrap gap-1">
                {manga.genre.slice(0, 3).map((g, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado Vazio */}
      {!loading && mangas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum mangá encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default ExemploUsoJikanAPI;
