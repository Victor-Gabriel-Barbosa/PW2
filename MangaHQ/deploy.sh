#!/bin/bash

# Script de Deploy para GitHub Pages - MangaHQ
# Execute com: bash deploy.sh

echo "🚀 Iniciando deployment do MangaHQ para GitHub Pages..."

# Verificar se o git está configurado
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale o Git primeiro."
    exit 1
fi

# Verificar se estamos em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Este não é um repositório Git. Execute 'git init' primeiro."
    exit 1
fi

# Verificar se existem mudanças não commitadas
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Existem mudanças não commitadas. Fazendo commit..."
    git add .
    read -p "📝 Digite a mensagem do commit: " commit_message
    git commit -m "$commit_message"
fi

# Fazer push para o repositório
echo "📤 Enviando para o repositório..."
git push origin main

echo "✅ Deploy concluído!"
echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo "1. Vá para o Firebase Console: https://console.firebase.google.com/"
echo "2. Selecione seu projeto: mangahq-6396a"
echo "3. Vá em Authentication > Settings > Authorized domains"
echo "4. Adicione seu domínio GitHub Pages: SEU-USUARIO.github.io"
echo "5. Vá em Firestore Database > Rules"
echo "6. Aplique as regras do arquivo firestore.rules"
echo ""
echo "🌐 Seu site estará disponível em:"
echo "   https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO"
echo ""
echo "⚠️  LEMBRE-SE: Substitua 'usuario' em firebase-config-secure.js pelo seu nome de usuário real do GitHub!"
