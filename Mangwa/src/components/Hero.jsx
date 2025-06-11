import React from "react";

const Hero = () => {
  const featuredManga = {
    title: "One Piece",
    description:
      "Acompanhe a jornada épica de Monkey D. Luffy e sua tripulação em busca do tesouro definitivo, o One Piece. Uma aventura cheia de amizade, batalhas épicas e descobertas incríveis pelos mares do Grand Line.",
    cover: "/images/one-piece-hero.jpg",
    rating: 9.5,
    chapters: 1090,
    status: "Em andamento",
    genres: ["Aventura", "Ação", "Comédia", "Drama"],
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-xl mx-4 my-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30"></div>
        {featuredManga.cover && (
          <img
            src={featuredManga.cover}
            alt={featuredManga.title}
            className="w-full h-full object-cover opacity-20"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-white space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {featuredManga.status}
                  </span>{" "}
                  <div className="flex items-center space-x-1">
                    <i className="bi bi-star-fill text-yellow-400"></i>
                    <span className="font-medium">{featuredManga.rating}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {featuredManga.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {featuredManga.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-lg leading-relaxed text-gray-100 max-w-2xl">
                {featuredManga.description}
              </p>{" "}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <i className="bi bi-book"></i>
                  <span>{featuredManga.chapters} capítulos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="bi bi-clock"></i>
                  <span>Atualizado hoje</span>
                </div>
              </div>{" "}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                  <i className="bi bi-play-fill"></i>
                  <span>Começar a Ler</span>
                </button>

                <button className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                  <i className="bi bi-book"></i>
                  <span>Ver Detalhes</span>
                </button>
              </div>
            </div>

            {/* Featured Cover */}
            <div className="hidden lg:block">
              <div className="relative max-w-sm mx-auto">
                <div className="aspect-[3/4] bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  {featuredManga.cover ? (
                    <img
                      src={featuredManga.cover}
                      alt={featuredManga.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="bi bi-book text-6xl text-white/50"></i>
                    </div>
                  )}
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-3 rounded-full shadow-lg animate-pulse">
                  <i className="bi bi-star-fill text-lg"></i>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white text-black px-4 py-2 rounded-full shadow-lg font-semibold">
                  #{1} Trending
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
