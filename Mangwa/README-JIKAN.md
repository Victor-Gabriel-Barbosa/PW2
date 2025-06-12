# Mangwa - Integração com API Jikan

Este documento explica como a integração com a API Jikan foi implementada no projeto Mangwa.

## 📚 Sobre a API Jikan

A [Jikan API](https://jikan.moe/) é uma API REST não oficial do MyAnimeList que fornece dados sobre animes e mangás. É gratuita e não requer autenticação, mas possui limitações de rate limiting.

## 🚀 Implementação

### Serviços (src/services/jikanApi.js)

O arquivo `jikanApi.js` contém todas as funções para interagir com a API Jikan:

- **getPopularMangas()** - Busca mangás populares
- **getTopRatedMangas()** - Busca mangás mais bem avaliados (corrigido para usar `byscore`)
- **getLatestMangas()** - Busca mangás recentes
- **searchMangas()** - Pesquisa mangás por termo
- **getMangaById()** - Busca um mangá específico por ID
- **getMangasByGenre()** - Busca mangás por gênero
- **getGenres()** - Lista todos os gêneros disponíveis com contagens

### Hooks Personalizados (src/hooks/useMangas.js)

Os hooks facilitam o uso dos dados da API nos componentes:

- **useMangas()** - Carrega dados iniciais (populares, top rated, recentes)
- **useMangaSearch()** - Gerencia pesquisa de mangás
- **useManga()** - Carrega dados de um mangá específico
- **useGenres()** - Carrega lista de gêneros com dados da API Jikan
- **useMangasByGenre()** - Carrega mangás por gênero específico
- **useFavorites()** - Gerencia favoritos (localStorage)

### Utilitários de Gêneros (src/utils/genreUtils.js)

Sistema completo para gerenciamento de gêneros:

- **genreIconMap** - Mapeamento de gêneros para ícones Bootstrap
- **genreTranslations** - Tradução de gêneros do inglês para português
- **getGenreIcon()** - Obtém ícone apropriado para um gênero
- **translateGenre()** - Traduz gêneros automaticamente
- **getGenreColors()** - Obtém cores temáticas para cada gênero
- **getPopularGenres()** - Filtra e ordena gêneros por popularidade
- **formatGenreCount()** - Formata números grandes (ex: 1.5k)

### Funcionalidades Implementadas

#### ✅ Cache Inteligente
- Cache de 5 minutos para evitar requisições desnecessárias
- Melhora performance e respeita rate limits

#### ✅ Tratamento de Erros
- Retry automático em caso de falha
- Tratamento específico para rate limiting (HTTP 429)
- Mensagens de erro amigáveis ao usuário

#### ✅ Normalização de Dados
- Conversão dos dados da API para formato padronizado
- Tradução de status para português
- Formatação de datas relativas (hoje, 1 dia, etc.)

#### ✅ Componentes de Carregamento
- Skeletons durante carregamento
- Estados de erro com botão de retry
- Estados vazios informativos

## 🎯 Funcionalidades Principais

### 1. Página Inicial

- Mangás populares
- Mangás mais bem avaliados
- Últimas atualizações
- Exploração por gêneros com dados reais da API

### 2. Sistema de Busca

- Pesquisa em tempo real
- Resultados paginados
- Filtros por categoria

### 3. Sistema de Favoritos

- Adicionar/remover favoritos
- Persistência local (localStorage)
- Sincronização entre componentes

### 4. Detalhes do Mangá

- Informações completas
- Sinopse, autores, ano
- Avaliações e estatísticas

### 5. Exploração por Gêneros ✨ NOVO

- Gêneros reais obtidos da API Jikan
- Ícones temáticos para cada gênero
- Tradução automática inglês → português
- Cores personalizadas por categoria
- Contadores de mangás por gênero
- Interface interativa para exploração

## 🔧 Configuração e Uso

### Instalação
```bash
npm install
npm run dev
```

### Estrutura dos Dados

Cada mangá retornado pela API é normalizado para o seguinte formato:

```javascript
{
  id: 1,                    // ID único do MyAnimeList
  title: "One Piece",       // Título
  cover: "image_url",       // URL da capa
  rating: 9.5,              // Nota (0-10)
  status: "Em andamento",   // Status traduzido
  genre: ["Ação", "Aventura"], // Array de gêneros
  lastUpdate: "hoje",       // Data relativa de atualização
  chapters: 1090,           // Número de capítulos
  synopsis: "...",          // Sinopse
  authors: ["Eiichiro Oda"], // Array de autores
  year: 1997,               // Ano de publicação
  type: "Manga",            // Tipo (Manga, Manhwa, etc.)
  volumes: 100              // Número de volumes
}
```

## 📱 Componentes Principais

### MangaCard
Exibe informações do mangá em formato de card com:
- Capa do mangá
- Título e avaliação
- Gêneros e status
- Botão de favorito
- Informações adicionais opcionais

### SearchComponent
Interface de pesquisa com:
- Campo de busca
- Resultados em grid
- Estados de carregamento e erro
- Limpeza de resultados

### MangaGrid
Grid responsivo para exibir listas de mangás com:
- Skeleton loading
- Estados vazios
- Título da seção
- Controle de quantidade

## ⚠️ Limitações e Considerações

### Rate Limiting
- A API Jikan tem limitações de requests por minuto
- Implementado retry automático com backoff
- Cache para reduzir número de requisições

### Dados Disponíveis
- Nem todos os mangás têm todas as informações
- Algumas capas podem não carregar
- Fallback para imagem padrão implementado

### Performance
- Carregamento assíncrono
- Lazy loading pode ser implementado futuramente
- Otimização de imagens recomendada

## 🔄 Próximas Melhorias

- [ ] Implementar lazy loading para imagens
- [ ] Adicionar sistema de categorias dinâmicas
- [ ] Implementar paginação infinita
- [ ] Adicionar filtros avançados
- [ ] Sistema de recomendações
- [ ] PWA com cache offline
- [ ] Sincronização com conta MyAnimeList

## 📄 Licença

Este projeto é para fins educacionais e usa a API Jikan que é gratuita e open source.
