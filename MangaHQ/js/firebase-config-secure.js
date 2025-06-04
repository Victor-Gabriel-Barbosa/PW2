// Configuração segura do Firebase para produção
// As chaves aqui são públicas e seguras quando configuradas corretamente

const firebaseConfig = {
  // ⚠️ ESTAS CHAVES SÃO PÚBLICAS - A SEGURANÇA VEM DAS RULES E DOMÍNIOS AUTORIZADOS
  apiKey: "AIzaSyCpjYTtEPgH-Cw1rAcjeKQYi7V9I2PguYo",
  authDomain: "mangahq-6396a.firebaseapp.com", 
  projectId: "mangahq-6396a",
  storageBucket: "mangahq-6396a.firebasestorage.app",
  messagingSenderId: "247396393095",
  appId: "1:247396393095:web:6d8620fe2d7cafebec9822",
  measurementId: "G-JHR49EF3TY"
};

// Configurações de segurança
const securityConfig = {  // Domínios autorizados (configure no Firebase Console)
  authorizedDomains: [
    'localhost',
    '127.0.0.1',
    'usuario.github.io', // Substitua 'usuario' pelo seu nome de usuário real do GitHub
    'mangahq-6396a.firebaseapp.com',
    'mangahq-6396a.web.app',
    // Adicione outros domínios conforme necessário
  ],
  
  // Configurações de produção
  production: {
    enablePersistence: true,
    enableAnalytics: true,
    maxRetries: 3,
    timeout: 10000
  },
  
  // Configurações de desenvolvimento  
  development: {
    enablePersistence: false,
    enableAnalytics: false,
    maxRetries: 1,
    timeout: 5000
  }
};

// Detectar ambiente
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

const currentConfig = isProduction ? securityConfig.production : securityConfig.development;

// Exportar configurações
window.firebaseConfig = firebaseConfig;
window.securityConfig = currentConfig;
window.isProduction = isProduction;

// Log de segurança (apenas em desenvolvimento)
if (!isProduction) {
  console.log('🔧 Modo desenvolvimento - Firebase configurado');
  console.log('📋 Configuração:', firebaseConfig);
} else {
  console.log('🔒 Modo produção - Verificando domínios autorizados...');
  
  // Verificar se o domínio atual está autorizado
  const currentDomain = window.location.hostname;
  const isAuthorized = securityConfig.authorizedDomains.some(domain => 
    currentDomain.includes(domain) || domain === currentDomain
  );
  
  if (!isAuthorized) {
    console.warn('⚠️ Domínio não autorizado:', currentDomain);
    console.warn('📝 Configure este domínio no Firebase Console > Authentication > Settings > Authorized domains');
  } else {
    console.log('✅ Domínio autorizado:', currentDomain);
  }
}
