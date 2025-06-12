import React from "react";
import { useFavorites } from "../hooks/useMangas";
import { translateGenre, getGenreColors } from "../utils/genreUtils";

const MangaCard = ({ manga, showDetails = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!manga) return null;

  const {
    id,
    title,
    cover,
    rating = 0,
    status = "Em andamento",
    genre = [],
    lastUpdate = "Hoje",
    chapters = 0,
    synopsis,
    authors = [],
    year,
    type,
    volumes = 0,
  } = manga;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completo":
        return "bg-green-500";
      case "Em andamento":
        return "bg-blue-500";
      case "Pausado":
        return "bg-yellow-500";
      case "Cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 transition-transform duration-200">
      <div className="relative">
        {" "}
        {/* Cover Image */}
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 rounded-t-xl overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/images/default-image.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="bi bi-book text-4xl text-gray-400 dark:text-gray-500"></i>
            </div>
          )}
        </div>
        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <i className="bi bi-star-fill mr-1"></i>
            {rating.toFixed(1)}
          </div>
        )}
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isFavorite(id)
              ? "bg-red-500 text-white"
              : "bg-black/20 text-white hover:bg-red-500"
          }`}>
          <i
            className={`bi ${
              isFavorite(id) ? "bi-heart-fill" : "bi-heart"
            }`}></i>
        </button>
        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span
            className={`${getStatusColor(
              status
            )} text-white text-xs font-medium px-2 py-1 rounded-full`}>
            {status}
          </span>
        </div>
      </div>{" "}
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        {/* Genres */}
        {genre && genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {genre.slice(0, 3).map((g, index) => {
              const translatedGenre = translateGenre(g);
              const genreColors = getGenreColors(g);

              return (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full ${genreColors}`}
                  title={translatedGenre}>
                  {translatedGenre}
                </span>
              );
            })}
            {genre.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{genre.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          {chapters > 0 && (
            <span className="flex items-center">
              <i className="bi bi-book mr-1"></i>
              {chapters} cap.
            </span>
          )}

          {lastUpdate && (
            <span className="flex items-center">
              <i className="bi bi-clock mr-1"></i>
              {lastUpdate}
            </span>
          )}
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="mt-4 space-y-2">
            {synopsis && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Sinopse:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {synopsis}
                </p>
              </div>
            )}

            {authors && authors.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Autor(es):
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {authors.join(", ")}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              {year && (
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Ano:
                  </span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {year}
                  </span>
                </div>
              )}

              {type && (
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Tipo:
                  </span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {type}
                  </span>
                </div>
              )}

              {volumes > 0 && (
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Volumes:
                  </span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {volumes}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaCard;
