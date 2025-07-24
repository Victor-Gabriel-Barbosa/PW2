class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        name: 'Claro',
        icon: 'bi-sun-fill',
        value: 'light'
      },
      dark: {
        name: 'Escuro',
        icon: 'bi-moon-stars-fill',
        value: 'dark'
      },
      auto: {
        name: 'Automático',
        icon: 'bi-circle-half',
        value: 'auto'
      }
    };

    this.currentTheme = this.getStoredTheme() || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.setupEventListeners();
    this.updateThemeIcon();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  setTheme(theme) {
    const html = document.documentElement;

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    } else html.setAttribute('data-bs-theme', theme);

    this.currentTheme = theme;
    this.setStoredTheme(theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    const themeButton = document.getElementById('themeToggle');

    if (themeIcon && themeButton) {
      const theme = this.themes[this.currentTheme];
      themeIcon.className = `bi ${theme.icon}`;
      themeButton.title = `Tema: ${theme.name}`;
    }
  }

  cycleTheme() {
    const themeKeys = Object.keys(this.themes);
    const currentIndex = themeKeys.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const nextTheme = themeKeys[nextIndex];

    this.setTheme(nextTheme);
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', () => this.cycleTheme());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'auto') this.setTheme('auto');
    });
  }

  showToast(message, type = 'info') {
    const toastHtml = `
      <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-palette me-2"></i>${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.style.zIndex = '1055';
      document.body.appendChild(toastContainer);
    }

    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHtml;
    toastContainer.appendChild(toastElement.firstElementChild);

    const toast = new bootstrap.Toast(toastContainer.lastElementChild);
    toast.show();

    toastContainer.lastElementChild.addEventListener('hidden.bs.toast', function () {
      this.remove();
    });
  }
}

class ProjectAnalytics {
  constructor() {
    this.projects = this.getProjectsData();
    this.init();
  }

  getProjectsData() {
    return {
      games: ['FlapBirds', 'Games', 'R-Games'],
      webApps: ['MangaHQ', 'Mangwa', 'Jikan', 'Animu+', 'Muscia', 'Portfolio'],
      learning: ['Atividades/a1', 'Atividades/a3', 'FC1'],
      development: ['JikanBeta', 'victorjs', 'Nower'],
      total: 0
    };
  }

  init() {
    this.updateProjectCount();
    this.trackProjectViews();
    this.setupProjectInteractions();
  }

  updateProjectCount() {
    const totalProjects = Object.values(this.projects).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);

    this.projects.total = totalProjects;

    const projectCountElement = document.getElementById('projectCount');
    if (projectCountElement) projectCountElement.textContent = `${totalProjects}+`;
  }

  trackProjectViews() {
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const projectName = e.currentTarget.querySelector('.card-title').textContent;
        this.logProjectView(projectName);
        this.addClickEffect(e.currentTarget);
      });
    });
  }

  logProjectView(projectName) {
    const views = JSON.parse(localStorage.getItem('projectViews') || '{}');
    views[projectName] = (views[projectName] || 0) + 1;
    localStorage.setItem('projectViews', JSON.stringify(views));

    console.log(`Projeto visualizado: ${projectName} (${views[projectName]} vezes)`);
  }

  addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => element.style.transform = '', 150);
  }

  setupProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      const cardElement = card.querySelector('.card');

      card.addEventListener('mouseenter', () => cardElement.style.transform = 'translateY(-8px) rotateY(5deg)');

      card.addEventListener('mouseleave', () => cardElement.style.transform = 'translateY(0) rotateY(0)');
    });
  }

  getPopularProjects() {
    const views = JSON.parse(localStorage.getItem('projectViews') || '{}');
    return Object.entries(views)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }
}

class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
    this.setupScrollToTop();
    this.addParallaxEffect();
  }

  observeElements() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-in');
      });
    }, observerOptions);

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
  }

  setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollButton.className = 'btn btn-primary position-fixed rounded-circle scroll-to-top';;

    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollButton.style.opacity = '1';
        scrollButton.style.pointerEvents = 'auto';
      } else {
        scrollButton.style.opacity = '0';
        scrollButton.style.pointerEvents = 'none';
      }
    });

    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  addParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      if (heroSection) heroSection.style.transform = `translateY(${rate}px)`;
    });
  }
}

class ProjectSearch {
  constructor() {
    this.projects = document.querySelectorAll('.project-card');
    this.init();
  }

  init() {
    this.createSearchBar();
  }

  createSearchBar() {
    const container = document.querySelector('.container');
    const searchHtml = `
      <div class="row mb-4">
        <div class="col-lg-8 mx-auto">
          <div class="card">
            <div class="card-body">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input type="text" class="form-control" id="projectSearch" placeholder="Buscar projetos...">
                <select class="form-select" id="projectFilter" style="max-width: 200px;">
                  <option value="">Todos os tipos</option>
                  <option value="game">Jogos</option>
                  <option value="web-app">Web Apps</option>
                  <option value="learning">Aprendizado</option>
                  <option value="dev">Desenvolvimento</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const firstSection = container.querySelector('section');
    firstSection.insertAdjacentHTML('beforebegin', searchHtml);

    this.setupSearchEvents();
  }

  setupSearchEvents() {
    const searchInput = document.getElementById('projectSearch');
    const filterSelect = document.getElementById('projectFilter');

    searchInput.addEventListener('input', () => this.filterProjects());
    filterSelect.addEventListener('change', () => this.filterProjects());
  }

  filterProjects() {
    const searchTerm = document.getElementById('projectSearch').value.toLowerCase();
    const filterType = document.getElementById('projectFilter').value;

    let visibleCount = 0;

    this.projects.forEach(project => {
      const title = project.querySelector('.card-title').textContent.toLowerCase();
      const description = project.querySelector('.card-text').textContent.toLowerCase();
      const badge = project.querySelector('.badge').textContent.toLowerCase();

      const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
      const matchesFilter = !filterType || this.getProjectType(badge) === filterType;

      if (matchesSearch && matchesFilter) {
        project.style.display = 'block';
        visibleCount++;
      } else project.style.display = 'none';
    });

    this.showSearchResults(visibleCount);
  }

  getProjectType(badge) {
    const typeMap = {
      'game': 'game',
      'collection': 'game',
      'retro': 'game',
      'web app': 'web-app',
      'spa': 'web-app',
      'anime': 'web-app',
      'media': 'web-app',
      'music': 'web-app',
      'portfolio': 'web-app',
      'learning': 'learning',
      'project': 'learning',
      'dev': 'dev',
      'framework': 'dev',
      'prototype': 'dev'
    };

    return typeMap[badge] || '';
  }

  showSearchResults(count) {
    let resultElement = document.getElementById('search-results');

    if (!resultElement) {
      resultElement = document.createElement('div');
      resultElement.id = 'search-results';
      resultElement.className = 'alert alert-info text-center mb-4';
      document.getElementById('projectSearch').parentElement.parentElement.parentElement.insertAdjacentElement('afterend', resultElement);
    }

    if (count === this.projects.length) resultElement.style.display = 'none';
    else {
      resultElement.style.display = 'block';
      resultElement.innerHTML = `
        <i class="bi bi-info-circle me-2"></i>
        Mostrando ${count} de ${this.projects.length} projetos
      `;
    }
  }
}

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.measureLoadTime();
    this.optimizeImages();
    this.setupLazyLoading();
  }

  measureLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Hub carregado em ${Math.round(loadTime)}ms`);

      if (performance.getEntriesByType) {
        const navEntries = performance.getEntriesByType('navigation')[0];
        if (navEntries) {
          console.log('Performance metrics:', {
            domContentLoaded: Math.round(navEntries.domContentLoadedEventEnd - navEntries.domContentLoadedEventStart),
            pageLoad: Math.round(navEntries.loadEventEnd - navEntries.loadEventStart)
          });
        }
      }
    });
  }

  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            cardObserver.unobserve(entry.target);
          }
        });
      });

      const cards = document.querySelectorAll('.project-card');
      cards.forEach(card => cardObserver.observe(card));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();

  new ProjectAnalytics();

  new ScrollAnimations();

  new ProjectSearch();

  new PerformanceMonitor();

  addCustomAnimations();

  console.log('🚀 Hub PW2 inicializado com sucesso!');
});

function addCustomAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .project-card {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease-out;
    }
    
    .project-card.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .scroll-to-top:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .project-icon {
      transition: all 0.3s ease;
    }
    
    .card:hover .project-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .theme-toggle {
      transition: all 0.3s ease;
    }
    
    .theme-toggle:hover {
      transform: scale(1.1);
      background: rgba(255,255,255,0.2);
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 't') {
    e.preventDefault();
    document.getElementById('themeToggle').click();
  }

  if (e.altKey && e.key === 's') {
    e.preventDefault();
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) searchInput.focus();
  }

  if (e.key === 'Escape') {
    const searchInput = document.getElementById('projectSearch');
    if (searchInput && searchInput === document.activeElement) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    ProjectAnalytics,
    ScrollAnimations,
    ProjectSearch,
    PerformanceMonitor
  };
}