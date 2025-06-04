# 🔥 Configuração do Firebase para MangaHQ

## Pré-requisitos
1. Conta do Google
2. Acesso ao [Firebase Console](https://console.firebase.google.com/)

## 📋 Passo a Passo

### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Digite o nome: **MangaHQ**
4. Aceite os termos e continue
5. Desabilite o Google Analytics (opcional para este projeto)
6. Clique em "Criar projeto"

### 2. Configurar Authentication
1. No painel lateral, clique em **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, habilite:
   - **Email/Password** - Clique em "Ativar" e salve
   - **Google** - Clique em "Ativar", selecione um email de suporte e salve

### 3. Configurar Firestore Database
1. No painel lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Iniciar no modo de teste** (para desenvolvimento)
4. Selecione uma localização próxima (ex: southamerica-east1)
5. Clique em **Concluído**

### 4. Obter Configurações do Projeto
1. No painel principal, clique no ícone de **configurações** (engrenagem)
2. Selecione **Configurações do projeto**
3. Role para baixo até **Seus aplicativos**
4. Clique no ícone **</>** (Web)
5. Digite o nome do app: **MangaHQ Web**
6. **NÃO** marque "Firebase Hosting"
7. Clique em **Registrar app**
8. **COPIE** as configurações mostradas

### 5. Atualizar o Código
Substitua as configurações no arquivo `index.html` na linha que contém `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 6. Configurar Domínios Autorizados
1. Em **Authentication** > **Settings** > **Authorized domains**
2. Adicione `localhost` se não estiver presente
3. Para produção, adicione seu domínio

## 🔒 Regras de Segurança (Opcional)

### Firestore Rules (Básicas)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para todos, escrita apenas para usuários autenticados
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✅ Testar a Configuração
1. Abra o arquivo `index.html` no navegador
2. Clique em **Login**
3. Teste o login com:
   - Email/Password (crie uma conta primeiro)
   - Google (usando sua conta Google)

## 🚨 Importante
- **NUNCA** commite as chaves do Firebase em repositórios públicos
- Para produção, configure regras de segurança adequadas
- Use variáveis de ambiente em projetos reais

## 📞 Suporte
Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Confirme se os domínios estão autorizados
3. Verifique se os métodos de login estão habilitados
4. Consulte a [documentação oficial](https://firebase.google.com/docs/auth)

---
Feito com ❤️ para MangaHQ
