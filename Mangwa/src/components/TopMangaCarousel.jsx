import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useTopRatedMangas } from '../hooks/useMangas';
import { LoadingSpinner, EmptyState } from './LoadingComponents';
import { useFavorites } from '../hooks/useMangas';

// Importar estilos do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Importar estilos customizados
import './TopMangaCarousel.css';

const TopMangaCarousel = () => {
  const { topRatedMangas, loading, error } = useTopRatedMangas(8);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedManga, setSelectedManga] = useState(null);

  // Configurações do Swiper
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
    spaceBetween: 30,
    slidesPerView: 1,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    navigation: true,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
    on: {
      slideChange: (swiper) => {
        if (topRatedMangas && topRatedMangas[swiper.activeIndex]) {
          setSelectedManga(topRatedMangas[swiper.activeIndex]);
        }
      },
    },
  };

  const handleFavoriteClick = (e, mangaId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(mangaId);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="bi bi-star-fill text-yellow-400"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="bi bi-star-half text-yellow-400"></i>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="bi bi-star text-gray-300"></i>
      );
    }

    return stars;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'Sinopse não disponível';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              🏆 Top Mangás Ranking
            </h2>
            <p className="text-xl text-primary-200">
              Os mangás mais bem avaliados do momento
            </p>
          </div>
          <LoadingSpinner text="Carregando top mangás..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              🏆 Top Mangás Ranking
            </h2>
          </div>
          <EmptyState
            icon="bi-exclamation-triangle"
            title="Erro ao carregar ranking"
            message="Não foi possível carregar os mangás mais bem avaliados."
          />
        </div>
      </section>
    );
  }

  if (!topRatedMangas || topRatedMangas.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon="bi-trophy"
            title="Nenhum mangá encontrado"
            message="Não há mangás disponíveis no ranking no momento."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🏆 Top Mangás Ranking
          </h2>
          <p className="text-xl text-primary-200">
            Os mangás mais bem avaliados do momento
          </p>
        </div>

        {/* Carrossel */}
        <div className="relative">
          <Swiper {...swiperConfig} className="top-manga-swiper">
            {topRatedMangas.map((manga, index) => (              <SwiperSlide key={`top-manga-${manga.id}`}>
                <div className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 top-manga-card">
                  {/* Badge de Ranking */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-yellow-400 text-gray-900 font-bold text-lg px-3 py-1 rounded-full shadow-lg ranking-badge">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Botão de Favorito */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, manga.id)}
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <i className={`text-xl ${
                      isFavorite(manga.id) ? 'bi bi-heart-fill' : 'bi bi-heart'
                    }`}></i>
                  </button>

                  {/* Imagem do Mangá */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={manga.cover}
                      alt={manga.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    {/* Título */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {manga.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {getRatingStars(manga.rating)}
                      </div>
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {manga.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Gêneros */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {manga.genre.slice(0, 3).map((genre, idx) => (
                        <span
                          key={`${manga.id}-genre-${idx}`}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                      {manga.genre.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{manga.genre.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Status e Capítulos */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        manga.status === 'Completo'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {manga.status}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {manga.chapters} capítulos
                      </span>
                    </div>

                    {/* Sinopse */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {truncateText(manga.synopsis)}
                    </p>

                    {/* Botão de Ação */}
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <i className="bi bi-play-fill mr-2"></i>
                      Começar a Ler
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Informações do Mangá Selecionado */}
        {selectedManga && (
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{selectedManga.title}</h3>
              <p className="text-primary-200 max-w-3xl mx-auto">
                {truncateText(selectedManga.synopsis, 200)}
              </p>
            </div>
          </div>        )}
      </div>
    </section>
  );
};

export default TopMangaCarousel;
