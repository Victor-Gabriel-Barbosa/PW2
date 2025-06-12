import React from 'react';
import { useGenres } from '../hooks/useMangas';

const DebugComponent = () => {
  const { genres, loading, error } = useGenres();

  if (loading) return <div>Carregando debug...</div>;
  if (error) return <div>Erro no debug: {error}</div>;

  // Análise de duplicatas
  const genreIds = genres.map(g => g.id);
  const genreNames = genres.map(g => g.name);
  const uniqueIds = [...new Set(genreIds)];
  const uniqueNames = [...new Set(genreNames)];

  const duplicateIds = genreIds.filter((id, index) => genreIds.indexOf(id) !== index);
  const duplicateNames = genreNames.filter((name, index) => genreNames.indexOf(name) !== index);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug - Análise de Gêneros</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Total de gêneros:</strong> {genres.length}</p>
        <p><strong>IDs únicos:</strong> {uniqueIds.length}</p>
        <p><strong>Nomes únicos:</strong> {uniqueNames.length}</p>
        
        {duplicateIds.length > 0 && (
          <div className="text-red-600">
            <p><strong>IDs duplicados:</strong> {duplicateIds.join(', ')}</p>
          </div>
        )}
        
        {duplicateNames.length > 0 && (
          <div className="text-red-600">
            <p><strong>Nomes duplicados:</strong> {duplicateNames.join(', ')}</p>
          </div>
        )}

        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">Ver todos os gêneros</summary>
          <div className="mt-2 max-h-40 overflow-y-auto">
            {genres.map((genre, index) => (
              <div key={`debug-${genre.id}-${index}`} className="text-xs">
                {index + 1}. ID: {genre.id}, Nome: {genre.name}, Count: {genre.count}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default DebugComponent;
