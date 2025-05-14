const Login = ({ onLogin }) => {
  // Estados para o formulário
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [error, setError] = React.useState('');
  
  // Função para enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    // Simulação de login - normalmente isso seria uma requisição para um backend
    if (isRegistering) {
      // Simular registro
      console.log('Registrando:', { email, password, rememberMe });
      setError(''); // Limpar erros
      onLogin(true); // Autenticar o usuário após registro bem-sucedido
    } else {
      // Simular login - apenas aceita teste@teste.com / senha123 para demonstração
      if (email === 'teste@teste.com' && password === 'senha123') {
        console.log('Login bem-sucedido:', { email, rememberMe });
        setError(''); // Limpar erros
        onLogin(true); // Autenticar o usuário
      } else {
        setError('Credenciais inválidas. Tente teste@teste.com / senha123');
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{isRegistering ? 'Criar Conta' : 'Login'}</h1>
        <p className="text-gray-600 mt-2">
          {isRegistering 
            ? 'Cadastre-se para participar da competição R-Games' 
            : 'Faça login para acessar sua conta'}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 block text-gray-700">
                Lembrar-me
              </label>
            </div>
            
            {!isRegistering && (
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                Esqueceu a senha?
              </a>
            )}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            {isRegistering ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-center text-gray-600">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'} 
            <button 
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering ? 'Faça login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
        
        {/* Dica para teste */}
        {!isRegistering && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <p><strong>Para teste:</strong> Email: teste@teste.com / Senha: senha123</p>
          </div>
        )}
      </div>
    </div>
  );
};
