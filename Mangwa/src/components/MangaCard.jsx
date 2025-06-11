import React from "react";

const MangaCard = ({ manga }) => {
  const {
    id,
    title,
    cover,
    rating = 0,
    status = "Em andamento",
    genre = [],
    lastUpdate = "Hoje",
    chapters = 0,
    isFavorite = false,
  } = manga;

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
        {/* Cover Image */}
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 rounded-t-xl overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="bi bi-book text-4xl text-gray-400 dark:text-gray-500"></i>
            </div>
          )}
        </div>
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`${getStatusColor(
              status
            )} text-white text-xs font-medium px-2 py-1 rounded-full`}>
            {status}
          </span>
        </div>{" "}
        {/* Favorite Button */}
        <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200">
          <i
            className={`bi ${
              isFavorite ? "bi-heart-fill text-red-500" : "bi-heart text-white"
            }`}></i>
        </button>
        {/* Rating */}
        {rating > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 rounded-full px-2 py-1 flex items-center space-x-1">
            <i className="bi bi-star-fill text-yellow-400"></i>
            <span className="text-white text-xs font-medium">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-2 line-clamp-2">
          {title}
        </h3>
        {/* Genre Tags */}
        {genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {genre.slice(0, 2).map((g, index) => (
              <span
                key={index}
                className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                {g}
              </span>
            ))}
            {genre.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{genre.length - 2}
              </span>
            )}
          </div>
        )}{" "}
        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          {chapters > 0 && (
            <div className="flex items-center space-x-1">
              <i className="bi bi-book"></i>
              <span>{chapters} capítulos</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <i className="bi bi-calendar"></i>
            <span>Atualizado {lastUpdate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
