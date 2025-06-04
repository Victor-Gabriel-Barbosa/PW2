# PowerShell Script para Deploy Seguro do MangaHQ
# Execute com: powershell -ExecutionPolicy Bypass -File deploy-secure.ps1

Write-Host "🚀 Iniciando deploy seguro do MangaHQ..." -ForegroundColor Green

# Verificar se o Git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não encontrado. Instale o Git primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se estamos em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Este não é um repositório Git. Execute 'git init' primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Validando configuração de segurança..." -ForegroundColor Yellow

# Verificar arquivos essenciais
$requiredFiles = @(
    "js/firebase-config-secure.js",
    "firestore.rules",
    "index.html",
    ".gitignore"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ Arquivo obrigatório não encontrado: $file" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ $file encontrado" -ForegroundColor Green
}

# Verificar se a configuração segura está sendo usada
$indexContent = Get-Content "index.html" -Raw
if ($indexContent -match "firebase-config-secure\.js") {
    Write-Host "✅ Configuração segura detectada no index.html" -ForegroundColor Green
} else {
    Write-Host "⚠️  Aviso: Configuração segura não detectada no index.html" -ForegroundColor Yellow
}

# Verificar validação de domínio
if ($indexContent -match "isAuthorizedDomain") {
    Write-Host "✅ Validação de domínio implementada" -ForegroundColor Green
} else {
    Write-Host "⚠️  Aviso: Validação de domínio não encontrada" -ForegroundColor Yellow
}

# Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Mudanças detectadas. Fazendo commit..." -ForegroundColor Yellow
    git add .
    
    $commitMessage = Read-Host "Digite a mensagem do commit"
    if (-not $commitMessage) {
        $commitMessage = "Security update and deployment preparation"
    }
    
    git commit -m $commitMessage
    Write-Host "✅ Commit realizado" -ForegroundColor Green
}

# Push para o repositório
Write-Host "📤 Enviando para o repositório..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Push realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no push. Verifique suas credenciais e conexão." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 PRÓXIMOS PASSOS OBRIGATÓRIOS:" -ForegroundColor Cyan
Write-Host "1. 🌐 Acesse: https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. 🎯 Selecione: mangahq-6396a" -ForegroundColor White
Write-Host "3. 🔐 Authentication > Settings > Authorized domains" -ForegroundColor White
Write-Host "4. ➕ Adicione: SEU-USUARIO.github.io" -ForegroundColor White
Write-Host "5. 📄 Firestore Database > Rules" -ForegroundColor White
Write-Host "6. 📋 Copie o conteúdo de firestore.rules e publique" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Seu site estará disponível em:" -ForegroundColor Cyan
Write-Host "   https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  LEMBRETE IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   Substitua 'usuario' em firebase-config-secure.js" -ForegroundColor White
Write-Host "   pelo seu nome de usuário real do GitHub!" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para monitorar:" -ForegroundColor Cyan
Write-Host "   - GitHub Actions: Status do deploy" -ForegroundColor White
Write-Host "   - Firebase Console: Logs e métricas" -ForegroundColor White
Write-Host "   - Browser Console: Logs de segurança" -ForegroundColor White

# Opção para abrir URLs automaticamente
$openUrls = Read-Host "`n🔗 Deseja abrir o Firebase Console automaticamente? (s/n)"
if ($openUrls -eq "s" -or $openUrls -eq "S") {
    Start-Process "https://console.firebase.google.com/project/mangahq-6396a"
    Write-Host "🌐 Firebase Console aberto no navegador" -ForegroundColor Green
}

Write-Host "`n✅ Script concluído!" -ForegroundColor Green
