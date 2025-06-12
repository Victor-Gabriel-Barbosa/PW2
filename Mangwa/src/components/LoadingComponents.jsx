import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Carregando...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mb-4`}></div>
      <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}>
        {text}
      </p>
    </div>
  );
};

const MangaCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Cover Skeleton */}
      <div className="aspect-[3/4] bg-gray-200 dark:bg-dark-700"></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-3"></div>
        <div className="flex gap-1 mb-2">
          <div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-12"></div>
          <div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-16"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-16"></div>
          <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

const MangaGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <MangaCardSkeleton key={index} />
      ))}
    </div>
  );
};

const ErrorMessage = ({ 
  title = "Ops! Algo deu errado", 
  message = "Ocorreu um erro inesperado. Tente novamente.", 
  onRetry,
  retryText = "Tentar Novamente"
}) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <i className="bi bi-exclamation-triangle text-6xl text-red-500"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <i className="bi bi-arrow-clockwise"></i>
          {retryText}
        </button>
      )}
    </div>
  );
};

const EmptyState = ({ 
  icon = "bi-inbox", 
  title = "Nada encontrado", 
  message = "Não há itens para exibir no momento.",
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <i className={`${icon} text-6xl text-gray-400 dark:text-gray-600`}></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export {
  LoadingSpinner,
  MangaCardSkeleton,
  MangaGridSkeleton,
  ErrorMessage,
  EmptyState
};
