# 🔒 Guia de Segurança - Firebase para GitHub Pages

## 1. Configurar Domínios Autorizados no Firebase

### Passo 1: Acessar o Console do Firebase
1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto `mangahq-6396a`

### Passo 2: Configurar Authentication
1. No menu lateral, clique em **Authentication**
2. Vá para a aba **Settings** (Configurações)
3. Role até **Authorized domains** (Domínios autorizados)

### Passo 3: Adicionar Domínios do GitHub Pages
Adicione estes domínios:
```
localhost (já deve estar)
seu-usuario.github.io
```

Se você usar um domínio personalizado, adicione também:
```
seu-dominio-personalizado.com
```

### Passo 4: Configurar Firestore Security Rules
No Firestore Database > Rules, configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de mangás
    match /mangas/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.email == 'admin@mangahq.com';
    }
    
    // Dados de usuário só para o próprio usuário
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Outras coleções requerem autenticação
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 2. Usar Variáveis de Ambiente (Opção Alternativa)

### Para desenvolvimento local:
Crie `.env` (não commitado):
```
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-auth-domain
# ... outras variáveis
```

### Para GitHub Pages:
Use GitHub Secrets nos Actions.

## 3. Monitoramento e Alertas

### Configurar Alertas de Uso
1. No Firebase Console, vá em **Usage and billing**
2. Configure alertas para uso excessivo
3. Defina quotas diárias/mensais

### Monitorar Requests
1. Vá em **Analytics** 
2. Monitore requests suspeitos
3. Configure notificações

## 4. Alternativas Seguras

### Opção A: Netlify (Recomendado)
- Suporte nativo a variáveis de ambiente
- Build automático do GitHub
- HTTPS gratuito

### Opção B: Vercel
- Similar ao Netlify
- Excelente para React
- Integração GitHub

### Opção C: Firebase Hosting
- Integração nativa
- Variáveis de ambiente seguras
- CDN global

## 5. Checklist de Segurança

- [ ] Domínios autorizados configurados
- [ ] Security Rules do Firestore configuradas
- [ ] Alertas de billing configurados
- [ ] Monitoramento ativo
- [ ] Backup das configurações
- [ ] Teste com domínio temporário primeiro

## 6. Configuração Rápida para GitHub Pages

Se decidir continuar com GitHub Pages, siga estes passos:

1. **Configure os domínios autorizados** (essencial!)
2. **Teste primeiro** em um repositório privado
3. **Monitore o uso** nas primeiras 24h
4. **Configure quotas baixas** inicialmente

## ⚠️ IMPORTANTE

**NUNCA** faça commit de:
- Chaves privadas (.json)
- Tokens de admin
- Senhas
- Service account keys

**SEMPRE** use:
- Domínios autorizados
- Security Rules restritivas
- Monitoramento ativo
- Quotas de segurança
