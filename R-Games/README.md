# 🎮 Eu faço você joga!

Uma plataforma moderna e responsiva para competições de desenvolvimento de jogos entre alunos do curso de Sistemas de Informação da UFU - Monte Carmelo.

## 🌟 Características

- **Design Moderno e Responsivo**: Interface limpa e elegante que funciona perfeitamente em desktop, tablet e mobile
- **Autenticação com Google**: Sistema seguro de login usando Firebase Authentication
- **Galeria de Jogos**: Visualização em grid com cards atrativos
- **Sistema de Votação**: Avaliação com estrelas (1-5) restrita a usuários logados
- **Ranking Dinâmico**: Pódio e tabela de classificação em tempo real
- **Busca e Filtros**: Encontre jogos por nome, desenvolvedor ou categoria
- **Temas Múltiplos**: Claro, escuro e automático (baseado no sistema)
- **Navegação Suave**: Experiência fluida entre seções

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Estilos avançados com animações e variáveis CSS
- **JavaScript ES6+**: Funcionalidades modernas e módulos
- **Bootstrap 5**: Framework responsivo e componentes
- **Bootstrap Icons**: Biblioteca de ícones consistente

### Backend (BaaS)
- **Firebase Authentication**: Login seguro com Google
- **Cloud Firestore**: Banco de dados NoSQL em tempo real
- **Firebase Hosting**: Hospedagem rápida e confiável

## Como Executar

1. Abra o arquivo `index.html` em um navegador web moderno
2. Para teste de login, utilize:
   - Email: teste@teste.com
   - Senha: senha123

## Estrutura do Projeto

```
R-Games/
│
├── index.html          # Página principal HTML
├── css/                # Estilos adicionais (se necessário)
└── js/
    ├── components/     # Componentes React reutilizáveis
    │   ├── NavBar.js   # Barra de navegação
    │   └── Footer.js   # Rodapé
    │
    ├── pages/          # Páginas do aplicativo
    │   ├── Home.js               # Página inicial
    │   ├── GamesList.js          # Lista de jogos
    │   ├── GamesRanking.js       # Ranking dos jogos
    │   ├── Avaliacao.js          # Avaliação de jogos
    │   ├── AddGame.js            # Adicionar novo jogo
    │   └── Login.js              # Página de login
    │
    ├── App.js          # Componente principal
    └── index.js        # Ponto de entrada
```

## Próximos Passos

- Integração com backend para armazenamento real dos dados
- Sistema de comentários nos jogos
- Perfis de usuário
- Estatísticas detalhadas das avaliações

---

Desenvolvido como projeto de exemplo para a disciplina PW2.
