const Contact = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulação de envio do formulário
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            
            // Limpar formulário
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            
            // Resetar estado após 5 segundos
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        }, 1500);
    };

    return (
        <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Entre em <span className="text-primary-500">Contato</span>
                    </h2>
                    <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Tem algum projeto em mente? Preencha o formulário abaixo e entrarei em contato com você em breve.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Informações de contato */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Informações de Contato
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center mr-4">
                                    <i className="fas fa-envelope text-xl text-primary-500"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                        Email
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <a href="mailto:contato@exemplo.com" className="hover:text-primary-500 transition-colors">
                                            contato@exemplo.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center mr-4">
                                    <i className="fas fa-phone-alt text-xl text-primary-500"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                        Telefone
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <a href="tel:+5511999999999" className="hover:text-primary-500 transition-colors">
                                            +55 (11) 99999-9999
                                        </a>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center mr-4">
                                    <i className="fas fa-map-marker-alt text-xl text-primary-500"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                        Localização
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        São Paulo, SP - Brasil
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Redes sociais */}
                        <div className="mt-12">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                Conecte-se comigo
                            </h4>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-black transition-colors">
                                    <i className="fab fa-github"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* Formulário de contato */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Envie uma mensagem
                        </h3>
                        
                        {submitted ? (
                            <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
                                <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
                                <p className="text-green-600 dark:text-green-400">
                                    Mensagem enviada com sucesso! Retornarei em breve.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Nome completo</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                            placeholder="Seu nome"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                            placeholder="seu.email@exemplo.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">Assunto</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                        placeholder="Assunto da mensagem"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Mensagem</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white resize-none"
                                        placeholder="Digite sua mensagem aqui..."
                                        required
                                    ></textarea>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-all ${
                                        isSubmitting 
                                            ? 'bg-primary-400 cursor-not-allowed' 
                                            : 'bg-primary-500 hover:bg-primary-600 hover:shadow-xl'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane mr-2"></i>
                                            Enviar Mensagem
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
