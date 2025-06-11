# 📚 Mangwa - Plataforma de Mangás e Manhwas

Uma plataforma moderna e responsiva para leitura de mangás e manhwas, construída com React, Vite e Tailwind CSS.

## ✨ Características

- 🎨 **Design Moderno**: Interface limpa e intuitiva
- 🌓 **Tema Adaptável**: Suporte para temas claro, escuro e sistema
- 📱 **Responsivo**: Otimizado para desktop, tablet e mobile
- ⚡ **Performance**: Construído com Vite para carregamento rápido
- 🎭 **Categorização**: Organização por gêneros e categorias
- ❤️ **Favoritos**: Sistema de favoritos para mangás preferidos
- 🔍 **Busca**: Sistema de busca inteligente
- 📊 **Rankings**: Mangás populares e mais bem avaliados

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework de CSS utilitário
- **Bootstrap Icons** - Biblioteca de ícones SVG
- **PostCSS** - Processamento de CSS
- **ESLint** - Linting de código

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd Mangwa
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:3000`

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter ESLint

## 🎯 Funcionalidades Principais

### 🏠 Página Inicial
- Hero section com mangá em destaque
- Grid de mangás populares
- Últimas atualizações
- Navegação por gêneros

### 🎨 Temas
- **Claro**: Interface clara e limpa
- **Escuro**: Perfeito para leitura noturna
- **Sistema**: Adapta-se automaticamente às preferências do SO

### 📱 Responsividade
- Layout adaptativo para todas as telas
- Menu mobile otimizado
- Cards de mangá responsivos
- Navegação touch-friendly

### 🔍 Busca e Filtros
- Busca por título
- Filtros por gênero
- Ordenação por popularidade e data
- Sistema de favoritos

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.jsx      # Cabeçalho com navegação
│   ├── Hero.jsx        # Seção principal
│   ├── MangaCard.jsx   # Card individual de mangá
│   ├── MangaGrid.jsx   # Grid de mangás
│   └── Footer.jsx      # Rodapé
├── hooks/              # Hooks customizados
│   └── useTheme.js     # Hook para gerenciar temas
├── data/               # Dados mock
│   └── mockData.js     # Dados de exemplo
├── App.jsx             # Componente principal
├── main.jsx           # Entrada da aplicação
└── index.css          # Estilos globais
```

## 🎨 Customização

### Cores do Tema
As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores personalizadas
      }
    }
  }
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados ou estendidos.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Design inspirado nas melhores práticas de UX/UI
- Ícones fornecidos por Bootstrap Icons
- Tipografia otimizada com Inter Font

---

Feito com ❤️ para a comunidade otaku
