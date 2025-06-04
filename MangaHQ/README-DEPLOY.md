# MangaHQ - Biblioteca Digital de Mangás 📚

Uma aplicação web moderna para gerenciar sua coleção de mangás, desenvolvida com React, Firebase e Bootstrap.

## 🚀 Deploy para GitHub Pages

### Pré-requisitos
- Conta no GitHub
- Projeto Firebase configurado
- Git instalado

### Passos para Deploy

#### 1. Preparar o Repositório
```bash
# Clonar ou baixar este projeto
git clone seu-repositorio
cd MangaHQ

# Inicializar git (se necessário)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
```

#### 2. Configurar Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `mangahq-6396a`
3. Vá em **Authentication > Settings > Authorized domains**
4. Adicione seu domínio GitHub Pages: `SEU-USUARIO.github.io`

#### 3. Atualizar Configuração
Edite o arquivo `js/firebase-config-secure.js`:
```javascript
authorizedDomains: [
  'localhost',
  '127.0.0.1',
  'SEU-USUARIO.github.io', // Substitua pelo seu usuário real
  'mangahq-6396a.firebaseapp.com',
  'mangahq-6396a.web.app'
],
```

#### 4. Aplicar Regras de Segurança
1. No Firebase Console, vá em **Firestore Database > Rules**
2. Copie o conteúdo de `firestore.rules` e aplique
3. Publique as regras

#### 5. Deploy Automático
```bash
# Tornar o script executável (Linux/Mac)
chmod +x deploy.sh

# Executar o deploy
./deploy.sh

# Ou manualmente:
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

#### 6. Habilitar GitHub Pages
1. Vá para o repositório no GitHub
2. Settings > Pages
3. Source: Deploy from a branch
4. Branch: main / (root)
5. Save

### 🔒 Segurança

#### Chaves do Firebase
- ✅ As chaves do Firebase no código são **públicas** e seguras
- ✅ A segurança real vem das **regras do Firestore** e **domínios autorizados**
- ✅ Implementamos validação de domínio no frontend
- ✅ Regras de segurança comprehensive no backend

#### Características de Segurança
- 🛡️ Autenticação obrigatória para operações sensíveis
- 🔐 Regras de acesso baseadas em roles (admin/user)
- 🌐 Validação de domínio autorizado
- 📝 Logs de segurança e auditoria
- ⚡ Rate limiting e proteção contra spam

### 🌐 URLs do Projeto

Após o deploy, seu projeto estará disponível em:
- **GitHub Pages**: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO`
- **Firebase Hosting** (se configurado): `https://mangahq-6396a.web.app`

### 🛠️ Desenvolvimento Local

```bash
# Clonar o repositório
git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
cd MangaHQ

# Servir localmente (Python)
python -m http.server 8000

# Ou com Node.js
npx serve .

# Acessar: http://localhost:8000
```

### 📝 Configuração de Ambiente

O projeto detecta automaticamente o ambiente:
- **Desenvolvimento**: `localhost` ou `127.0.0.1`
- **Produção**: Qualquer outro domínio

### 🔧 Troubleshooting

#### Erro de Domínio Não Autorizado
1. Verifique se o domínio está em `authorizedDomains` no `firebase-config-secure.js`
2. Confirme se o domínio está autorizado no Firebase Console
3. Limpe o cache do navegador

#### Erro de Permissão do Firestore
1. Verifique se as regras de segurança estão aplicadas
2. Confirme se o usuário está autenticado
3. Verifique os logs do Firebase Console

#### GitHub Pages não está funcionando
1. Verifique se o GitHub Pages está habilitado nas configurações do repo
2. Confirme se o branch correto está selecionado
3. Aguarde alguns minutos para propagação

### 📊 Monitoramento

Monitore seu projeto através do Firebase Console:
- **Authentication**: Usuários registrados
- **Firestore**: Uso do banco de dados
- **Functions**: Logs de execução
- **Analytics**: Métricas de uso

---

**⚠️ Importante**: Sempre teste em um ambiente de desenvolvimento antes de fazer deploy para produção!
