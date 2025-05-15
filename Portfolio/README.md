# Site de Portfólio

Um site de portfólio moderno desenvolvido com React e Tailwind CSS via CDN, apresentando um design responsivo e suporte a temas claro, escuro e de sistema.

## Características

- **Design Responsivo**: Funciona perfeitamente em dispositivos móveis, tablets e desktops
- **Temas múltiplos**: Suporte para tema claro, escuro e detecção automática baseada nas preferências do sistema
- **Visual Moderno**: Interface limpa e profissional com animações suaves
- **Seções Completas**: 
  - Home/Hero
  - Sobre
  - Habilidades
  - Projetos
  - Contato
  - Rodapé com Newsletter

## Tecnologias Utilizadas

- **React**: Utilizado via CDN para criar uma interface interativa
- **Tailwind CSS**: Framework CSS utilitário para estilização moderna
- **Babel**: Para compilação de JSX diretamente no navegador
- **Font Awesome**: Ícones para melhorar a interface do usuário

## Como Executar

Simplesmente abra o arquivo `index.html` em qualquer navegador moderno. Como o projeto utiliza CDNs para React e Tailwind CSS, não é necessário instalar dependências localmente.

## Estrutura do Projeto

```
Portfolio/
│
├── index.html          # Arquivo HTML principal
├── css/
│   └── style.css       # Estilos específicos
│
├── js/
│   ├── app.js          # Arquivo principal do React
│   └── components/     # Componentes React
│       ├── Header.js
│       ├── ThemeSwitcher.js
│       ├── Hero.js
│       ├── About.js
│       ├── Skills.js
│       ├── Projects.js
│       ├── Contact.js
│       └── Footer.js
│
└── images/             # Pasta para armazenar imagens
```

## Personalização

Para personalizar este portfólio:

1. Substitua os textos e informações de exemplo por suas próprias informações
2. Atualize as seções de habilidades e projetos com seus próprios dados
3. Adicione suas próprias imagens na pasta `images/`
4. Modifique as cores do tema no objeto `tailwind.config` no arquivo `index.html`

## Contribuições

Contribuições são bem-vindas! Se você tiver alguma sugestão ou correção, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT.
