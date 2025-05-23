// Declaração de variáveis globais
let notes = [];
let categories = [];
let currentNoteId = null;
let currentFilter = 'all';
let currentSort = 'date-desc';
let searchTerm = '';

// Classes
class Note {
  constructor(id, title, content, timestamp) {
    this.id = id;
    this.title = title || 'Nota sem título';
    this.content = content || '';
    this.timestamp = timestamp || new Date().toISOString();
    this.lastModified = this.timestamp;
    this.pinned = false;
    this.category = '';
  }

  update(title, content) {
    this.title = title || 'Nota sem título';
    this.content = content;
    this.lastModified = new Date().toISOString();
  }

  togglePin() {
    this.pinned = !this.pinned;
    return this.pinned;
  }

  setCategory(category) {
    this.category = category;
  }
}

// Elementos DOM
const elements = {
  sidebar: document.getElementById('sidebar'),
  notesList: document.getElementById('notes-list'),
  pinnedNotesList: document.getElementById('pinned-notes-list'),
  welcomeMessage: document.getElementById('welcome-message'),
  noteEditor: document.getElementById('note-editor'),
  noteTitle: document.getElementById('note-title'),
  noteContent: document.getElementById('note-content'),
  currentNoteTitle: document.getElementById('current-note-title'),
  characterCounter: document.getElementById('character-counter'),
  categoriesMenu: document.getElementById('categories-menu'),
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  deleteNoteBtn: document.getElementById('delete-note-btn'),
  pinNoteBtn: document.getElementById('pin-note-btn'),
  categoryNoteBtn: document.getElementById('category-note-btn'),
  exportNoteBtn: document.getElementById('export-note-btn'),
  addNoteBtn: document.getElementById('add-note-btn'),
  welcomeAddNoteBtn: document.getElementById('welcome-add-note-btn'),
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  sortDropdown: document.getElementById('sortDropdown'),
  manageCategoriesBtn: document.getElementById('manage-categories-btn'),
  categoriesList: document.getElementById('categories-list'),
  addCategoryBtn: document.getElementById('add-category-btn'),
  newCategoryInput: document.getElementById('new-category-input'),
  selectCategoryList: document.getElementById('select-category-list'),
  noteCategoryBadge: document.getElementById('note-category-badge'),
  uncategorizedCount: document.getElementById('uncategorized-count'),
  toast: document.getElementById('notification-toast'),
  toastTitle: document.getElementById('toast-title'),
  toastMessage: document.getElementById('toast-message'),

  // Modais
  categoriesModal: new bootstrap.Modal(document.getElementById('categoriesModal')),
  selectCategoryModal: new bootstrap.Modal(document.getElementById('selectCategoryModal'))
};

// Inicialização do aplicativo
document.addEventListener('DOMContentLoaded', () => {
  // Carregar notas e categorias do localStorage
  loadNotes();
  loadCategories();

  // Carregar preferência de tema
  loadTheme();

  // Configurar event listeners
  setupEventListeners();

  // Renderizar lista de notas e categorias
  renderNotesList();
  renderCategoriesMenu();

  // Iniciar aplicativo: mostrar mensagem de boas-vindas ou a primeira nota
  if (notes.length > 0) {
    showNote(notes[0].id);
  } else {
    showWelcomeMessage();
  }
});

// Funções de gerenciamento de notas
function loadNotes() {
  const savedNotes = localStorage.getItem('nower-notes');
  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }
}

function saveNotes() {
  localStorage.setItem('nower-notes', JSON.stringify(notes));
}

function loadCategories() {
  const savedCategories = localStorage.getItem('nower-categories');
  if (savedCategories) {
    categories = JSON.parse(savedCategories);
  }
}

function saveCategories() {
  localStorage.setItem('nower-categories', JSON.stringify(categories));
}

function createNote() {
  const id = 'note-' + Date.now();
  const newNote = new Note(id, '', '');
  notes.unshift(newNote);
  saveNotes();
  renderNotesList();
  showNote(id);
  showToast('Nota criada', 'Nova nota criada com sucesso!');
  return id;
}

function updateCurrentNote() {
  if (!currentNoteId) return;

  const title = elements.noteTitle.value;
  const content = elements.noteContent.value;

  const noteIndex = notes.findIndex(note => note.id === currentNoteId);
  if (noteIndex !== -1) {
    notes[noteIndex].update(title, content);
    saveNotes();
    renderNotesList();
    updateCharacterCount(content);
  }
}

function deleteNote(id) {
  const confirmDelete = confirm('Tem certeza que deseja excluir esta nota?');
  if (!confirmDelete) return;

  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    const deletedNote = notes.splice(noteIndex, 1)[0];
    saveNotes();
    renderNotesList();

    if (notes.length > 0) {
      showNote(notes[0].id);
    } else {
      showWelcomeMessage();
    }

    showToast('Nota excluída', `A nota "${deletedNote.title}" foi excluída.`);
  }
}

function togglePinNote(id) {
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    const isPinned = notes[noteIndex].togglePin();
    saveNotes();
    renderNotesList();
    updatePinButton(isPinned);

    showToast(
      isPinned ? 'Nota fixada' : 'Nota desafixada',
      isPinned ? 'A nota foi fixada no topo.' : 'A nota não está mais fixada.'
    );
  }
}

function updatePinButton(isPinned) {
  if (isPinned) {
    elements.pinNoteBtn.classList.add('pinned-btn');
    elements.pinNoteBtn.title = 'Desafixar nota';
    elements.pinNoteBtn.innerHTML = '<i class="bi bi-pin-fill"></i>';
  } else {
    elements.pinNoteBtn.classList.remove('pinned-btn');
    elements.pinNoteBtn.title = 'Fixar nota';
    elements.pinNoteBtn.innerHTML = '<i class="bi bi-pin"></i>';
  }
}

function setNoteCategory(id, category) {
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    notes[noteIndex].setCategory(category);
    saveNotes();
    renderNotesList();

    // Atualizar badge de categoria na nota
    updateCategoryBadge(category);

    showToast(
      'Categoria atualizada',
      category ? `Nota movida para a categoria "${category}".` : 'Nota removida da categoria.'
    );
  }
}

function updateCategoryBadge(category) {
  if (category) {
    elements.noteCategoryBadge.textContent = category;
    elements.noteCategoryBadge.classList.remove('d-none');
  } else {
    elements.noteCategoryBadge.classList.add('d-none');
  }
}

function addCategory(categoryName) {
  categoryName = categoryName.trim();
  if (!categoryName) return false;

  // Verificar se a categoria já existe
  if (categories.includes(categoryName)) {
    showToast('Erro', 'Esta categoria já existe.');
    return false;
  }

  categories.push(categoryName);
  saveCategories();
  renderCategoriesMenu();
  renderCategoriesList();

  showToast('Categoria adicionada', `A categoria "${categoryName}" foi adicionada.`);
  return true;
}

function removeCategory(categoryName) {
  const confirmDelete = confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`);
  if (!confirmDelete) return;

  const categoryIndex = categories.indexOf(categoryName);
  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1);
    saveCategories();

    // Remover a categoria de todas as notas que a utilizavam
    notes.forEach(note => {
      if (note.category === categoryName) {
        note.category = '';
      }
    });
    saveNotes();

    renderCategoriesMenu();
    renderCategoriesList();
    renderNotesList();

    if (currentNoteId) {
      const currentNote = notes.find(note => note.id === currentNoteId);
      if (currentNote) {
        updateCategoryBadge(currentNote.category);
      }
    }

    showToast('Categoria removida', `A categoria "${categoryName}" foi excluída.`);
  }
}

function exportNote(id, format = 'txt') {
  const note = notes.find(note => note.id === id);
  if (!note) return;

  let content = '';
  let fileName = '';
  let mimeType = '';

  // Formatar conteúdo com base no formato escolhido
  switch (format) {
    case 'txt':
      content = `${note.title}\n\n${note.content}`;
      fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      mimeType = 'text/plain';
      break;
    case 'md':
      content = `# ${note.title}\n\n${note.content}`;
      fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      mimeType = 'text/markdown';
      break;
    case 'html':
      content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${note.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #0d6efd; }
    </style>
</head>
<body>
    <h1>${note.title}</h1>
    <div>${marked.parse(note.content)}</div>
    <footer>
        <p><small>Exportado do Nower em ${new Date().toLocaleDateString()}</small></p>
    </footer>
</body>
</html>`;
      fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      mimeType = 'text/html';
      break;
  }

  // Criar o arquivo para download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  // Criar link para download e clicar nele
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  // Limpar o URL criado
  setTimeout(() => URL.revokeObjectURL(url), 100);

  showToast('Nota exportada', `A nota foi exportada como ${format.toUpperCase()}.`);
}

// Funções de filtragem e ordenação
function filterNotes() {
  let filteredNotes = [...notes];

  // Aplicar filtro de busca
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredNotes = filteredNotes.filter(note =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    );
  }

  // Aplicar filtro de categoria
  if (currentFilter !== 'all') {
    filteredNotes = filteredNotes.filter(note => note.category === currentFilter);
  }

  // Separar notas fixadas
  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  // Aplicar ordenação nas não-fixadas
  switch (currentSort) {
    case 'date-desc':
      unpinnedNotes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      break;
    case 'date-asc':
      unpinnedNotes.sort((a, b) => new Date(a.lastModified) - new Date(b.lastModified));
      break;
    case 'alpha-asc':
      unpinnedNotes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'alpha-desc':
      unpinnedNotes.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return {
    pinnedNotes,
    unpinnedNotes
  };
}

// Funções de UI
function renderNotesList() {
  elements.notesList.innerHTML = '';
  elements.pinnedNotesList.innerHTML = '';

  const { pinnedNotes, unpinnedNotes } = filterNotes();
  const allFilteredNotes = [...pinnedNotes, ...unpinnedNotes];

  // Exibir notas fixadas
  if (pinnedNotes.length > 0) {
    pinnedNotes.forEach(note => {
      const noteElement = createNoteListItem(note, true);
      elements.pinnedNotesList.appendChild(noteElement);
    });
  } else {
    elements.pinnedNotesList.innerHTML = `
            <div class="text-center text-muted py-2">
                <small>Sem notas fixadas</small>
            </div>
        `;
  }

  // Verificar se há notas não fixadas para mostrar
  if (unpinnedNotes.length === 0) {
    let message = 'Sem notas';

    if (searchTerm) {
      message = 'Nenhuma nota corresponde à sua busca.';
    } else if (currentFilter !== 'all') {
      message = 'Nenhuma nota nesta categoria.';
    }

    elements.notesList.innerHTML = `
            <div class="text-center text-muted p-3">
                <i class="bi bi-journal-text fs-1"></i>
                <p>${message}</p>
            </div>
        `;
    return;
  }

  // Exibir notas não fixadas
  unpinnedNotes.forEach(note => {
    const noteElement = createNoteListItem(note, false);
    elements.notesList.appendChild(noteElement);
  });

  // Mostrar contagem de notas sem categoria
  const uncategorizedCount = notes.filter(note => !note.category).length;
  elements.uncategorizedCount.textContent = uncategorizedCount;
}

function createNoteListItem(note, isPinned) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note-item');
  if (isPinned) {
    noteElement.classList.add('pinned-note-item');
  }
  if (note.id === currentNoteId) {
    noteElement.classList.add('active');
  }

  // Formatar data
  const date = new Date(note.lastModified);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Criar resumo do conteúdo
  const contentPreview = note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '');

  // Criar elemento HTML
  noteElement.innerHTML = `
        <h5 title="${note.title}">${note.title}</h5>
        <p title="${note.content}">${contentPreview || 'Sem conteúdo'}</p>
        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">${formattedDate}</small>
            ${note.category ? `<span class="category-tag">${note.category}</span>` : ''}
        </div>
    `;

  noteElement.addEventListener('click', () => showNote(note.id));
  return noteElement;
}

function renderCategoriesMenu() {
  // Limpar itens existentes (exceto os fixos)
  const staticItems = Array.from(elements.categoriesMenu.querySelectorAll('hr, li:first-child, li:last-child'));
  elements.categoriesMenu.innerHTML = '';

  // Readicionar itens fixos
  staticItems.forEach(item => elements.categoriesMenu.appendChild(item));

  // Adicionar categorias
  if (categories.length > 0) {
    categories.forEach(category => {
      const li = document.createElement('li');
      const count = notes.filter(note => note.category === category).length;

      li.innerHTML = `
                <a class="dropdown-item d-flex justify-content-between align-items-center" href="#" data-category="${category}">
                    ${category}
                    <span class="badge bg-secondary rounded-pill">${count}</span>
                </a>
            `;

      // Inserir antes do último elemento (gerenciar categorias)
      elements.categoriesMenu.insertBefore(li, elements.categoriesMenu.lastElementChild.previousElementSibling);

      // Adicionar event listener
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        currentFilter = category;
        updateCategoryFilter(category);
        renderNotesList();
      });
    });
  } else {
    // Inserir mensagem quando não houver categorias
    const li = document.createElement('li');
    li.innerHTML = `
            <span class="dropdown-item text-muted">Nenhuma categoria</span>
        `;
    elements.categoriesMenu.insertBefore(li, elements.categoriesMenu.lastElementChild.previousElementSibling);
  }

  // Adicionar listener para o item "Todas"
  elements.categoriesMenu.querySelector('a[data-category="all"]').addEventListener('click', (e) => {
    e.preventDefault();
    currentFilter = 'all';
    updateCategoryFilter('all');
    renderNotesList();
  });
}

function updateCategoryFilter(category) {
  // Atualizar visual do dropdown de categorias
  const allItems = elements.categoriesMenu.querySelectorAll('.dropdown-item');
  allItems.forEach(item => {
    if (item.dataset.category === category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Atualizar texto do botão de categorias
  const categoryButton = document.getElementById('categoriesDropdown');
  if (category === 'all') {
    categoryButton.innerHTML = '<i class="bi bi-tag"></i> Categorias';
  } else {
    categoryButton.innerHTML = `<i class="bi bi-tag-fill"></i> ${category}`;
  }
}

function renderCategoriesList() {
  elements.categoriesList.innerHTML = '';
  elements.selectCategoryList.innerHTML = `
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-category="">
            Sem categoria
            <span class="badge bg-secondary rounded-pill" id="uncategorized-count">${notes.filter(note => !note.category).length}</span>
        </li>
    `;

  // Adicionar evento para o item "Sem categoria"
  elements.selectCategoryList.querySelector('li[data-category=""]').addEventListener('click', () => {
    if (currentNoteId) {
      setNoteCategory(currentNoteId, '');
      elements.selectCategoryModal.hide();
    }
  });

  // Listar todas as categorias
  categories.forEach(category => {
    // Para o modal de gerenciamento de categorias
    const li1 = document.createElement('li');
    li1.className = 'list-group-item d-flex justify-content-between align-items-center';
    li1.innerHTML = `
            ${category}
            <span class="badge bg-danger rounded-pill delete-category" data-category="${category}">
                <i class="bi bi-x"></i>
            </span>
        `;
    elements.categoriesList.appendChild(li1);

    // Para o modal de seleção de categoria
    const li2 = document.createElement('li');
    li2.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
    li2.setAttribute('data-category', category);
    const count = notes.filter(note => note.category === category).length;
    li2.innerHTML = `
            ${category}
            <span class="badge bg-secondary rounded-pill">${count}</span>
        `;
    elements.selectCategoryList.appendChild(li2);

    // Adicionar evento para selecionar categoria
    li2.addEventListener('click', () => {
      if (currentNoteId) {
        setNoteCategory(currentNoteId, category);
        elements.selectCategoryModal.hide();
      }
    });
  });

  // Adicionar eventos para exclusão de categorias
  document.querySelectorAll('.delete-category').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = e.target.closest('.delete-category').dataset.category;
      removeCategory(category);
    });
  });
}

function showNote(id) {
  // Salvar nota atual antes de trocar
  if (currentNoteId) {
    updateCurrentNote();
  }

  const note = notes.find(note => note.id === id);
  if (!note) return;

  currentNoteId = id;
  elements.noteTitle.value = note.title;
  elements.noteContent.value = note.content;
  elements.currentNoteTitle.textContent = note.title || 'Nota sem título';

  elements.welcomeMessage.classList.add('d-none');
  elements.noteEditor.classList.remove('d-none');
  elements.deleteNoteBtn.classList.remove('d-none');
  elements.pinNoteBtn.classList.remove('d-none');
  elements.categoryNoteBtn.classList.remove('d-none');
  elements.exportNoteBtn.classList.remove('d-none');

  // Atualizar estado do botão de fixar
  updatePinButton(note.pinned);

  // Atualizar badge de categoria
  updateCategoryBadge(note.category);

  // Atualizar contador de caracteres
  updateCharacterCount(note.content);

  renderNotesList();
  elements.noteTitle.focus();
}

function updateCharacterCount(content) {
  const count = content.length;
  const formattedCount = new Intl.NumberFormat('pt-BR').format(count);
  elements.characterCounter.textContent = `${formattedCount} caractere${count !== 1 ? 's' : ''}`;
}

function showWelcomeMessage() {
  currentNoteId = null;
  elements.welcomeMessage.classList.remove('d-none');
  elements.noteEditor.classList.add('d-none');
  elements.deleteNoteBtn.classList.add('d-none');
  elements.pinNoteBtn.classList.add('d-none');
  elements.categoryNoteBtn.classList.add('d-none');
  elements.exportNoteBtn.classList.add('d-none');
  elements.currentNoteTitle.textContent = 'Bem-vindo ao Nower';

  renderNotesList();
}

function showToast(title, message) {
  elements.toastTitle.textContent = title;
  elements.toastMessage.textContent = message;

  const toast = new bootstrap.Toast(elements.toast);
  toast.show();
}

// Gerenciamento de temas
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('nower-theme', newTheme);

  updateThemeIcon(newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('nower-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Usar preferência do sistema
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', defaultTheme);
    updateThemeIcon(defaultTheme);
  }
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    elements.themeIcon.classList.remove('bi-moon-fill');
    elements.themeIcon.classList.add('bi-sun-fill');
  } else {
    elements.themeIcon.classList.remove('bi-sun-fill');
    elements.themeIcon.classList.add('bi-moon-fill');
  }
}

// Event Listeners
function setupEventListeners() {
  // Botão de adicionar nota
  elements.addNoteBtn.addEventListener('click', createNote);
  elements.welcomeAddNoteBtn.addEventListener('click', createNote);

  // Botão de excluir nota
  elements.deleteNoteBtn.addEventListener('click', () => {
    if (currentNoteId) {
      deleteNote(currentNoteId);
    }
  });

  // Botão de fixar/desafixar nota
  elements.pinNoteBtn.addEventListener('click', () => {
    if (currentNoteId) {
      togglePinNote(currentNoteId);
    }
  });

  // Botão de categoria da nota
  elements.categoryNoteBtn.addEventListener('click', () => {
    if (currentNoteId) {
      renderCategoriesList();
      elements.selectCategoryModal.show();
    }
  });

  // Botão de exportar nota
  elements.exportNoteBtn.addEventListener('click', () => {
    if (currentNoteId) {
      // Criar menu suspenso para selecionar formato
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'dropdown-menu show position-absolute';
      dropdownMenu.style.top = '100%';
      dropdownMenu.style.right = '0';
      dropdownMenu.innerHTML = `
                <h6 class="dropdown-header">Exportar como</h6>
                <a class="dropdown-item export-format" href="#" data-format="txt">Texto (.txt)</a>
                <a class="dropdown-item export-format" href="#" data-format="md">Markdown (.md)</a>
                <a class="dropdown-item export-format" href="#" data-format="html">HTML (.html)</a>
            `;

      // Posicionar e adicionar ao DOM
      const buttonRect = elements.exportNoteBtn.getBoundingClientRect();
      dropdownMenu.style.top = buttonRect.bottom + 'px';
      dropdownMenu.style.right = (window.innerWidth - buttonRect.right) + 'px';
      document.body.appendChild(dropdownMenu);

      // Adicionar event listeners
      dropdownMenu.querySelectorAll('.export-format').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const format = e.target.dataset.format;
          exportNote(currentNoteId, format);
          document.body.removeChild(dropdownMenu);
        });
      });

      // Fechar o dropdown quando clicar fora dele
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdownMenu.contains(e.target) && e.target !== elements.exportNoteBtn) {
          document.body.removeChild(dropdownMenu);
          document.removeEventListener('click', closeDropdown);
        }
      });
    }
  });

  // Alternar tema
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Auto-salvar ao digitar
  elements.noteTitle.addEventListener('input', () => {
    if (currentNoteId) {
      elements.currentNoteTitle.textContent = elements.noteTitle.value || 'Nota sem título';
      updateCurrentNote();
    }
  });

  elements.noteContent.addEventListener('input', () => {
    if (currentNoteId) {
      updateCurrentNote();
      updateCharacterCount(elements.noteContent.value);
    }
  });

  // Busca
  elements.searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderNotesList();
  });

  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchTerm = '';
    renderNotesList();
  });

  // Gerenciamento de categorias
  elements.manageCategoriesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderCategoriesList();
    elements.categoriesModal.show();
  });

  elements.addCategoryBtn.addEventListener('click', () => {
    const categoryName = elements.newCategoryInput.value.trim();
    if (addCategory(categoryName)) {
      elements.newCategoryInput.value = '';
    }
  });

  elements.newCategoryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const categoryName = elements.newCategoryInput.value.trim();
      if (addCategory(categoryName)) {
        elements.newCategoryInput.value = '';
      }
    }
  });

  // Ordenação
  document.querySelectorAll('[data-sort]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sort = e.target.dataset.sort;
      currentSort = sort;

      // Atualizar estado ativo no dropdown
      document.querySelectorAll('[data-sort]').forEach(i => i.classList.remove('active'));
      e.target.classList.add('active');

      // Atualizar ícone de ordenação
      const sortIcon = elements.sortDropdown.querySelector('i');
      switch (sort) {
        case 'date-desc':
          sortIcon.className = 'bi bi-sort-down';
          break;
        case 'date-asc':
          sortIcon.className = 'bi bi-sort-up';
          break;
        case 'alpha-asc':
          sortIcon.className = 'bi bi-sort-alpha-down';
          break;
        case 'alpha-desc':
          sortIcon.className = 'bi bi-sort-alpha-up';
          break;
      }

      renderNotesList();
    });
  });

  // Responsividade para mobile: fechar sidebar após clicar
  if (window.innerWidth < 768) {
    const noteItems = document.querySelectorAll('.note-item');
    noteItems.forEach(item => {
      item.addEventListener('click', () => {
        const bsCollapse = new bootstrap.Collapse(elements.sidebar);
        bsCollapse.hide();
      });
    });
  }
}