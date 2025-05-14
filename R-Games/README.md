# R-Games - Competição de Jogos

Um site para uma competição de jogos independentes, desenvolvido com React e Tailwind CSS via CDN.

## Funcionalidades

- **Página Inicial**: Informações sobre a competição e ranking dos melhores jogos
- **Lista de Jogos**: Visualização e filtragem de todos os jogos participantes
- **Avaliação de Jogos**: Interface para avaliar os jogos participantes
- **Cadastro de Jogos**: Formulário para adicionar seu jogo à competição (requer login)
- **Sistema de Login**: Autenticação de usuários para participar da competição

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces (via CDN)
- **Tailwind CSS**: Framework CSS para design responsivo (via CDN)
- **Font Awesome**: Ícones utilizados na interface

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
