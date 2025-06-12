import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Conteúdo",
      links: [
        { name: "Mangás Populares", href: "#popular" },
        { name: "Últimos Lançamentos", href: "#latest" },
        { name: "Gêneros", href: "#genres" },
        { name: "Rankings", href: "#rankings" },
      ],
    },
    {
      title: "Comunidade",
      links: [
        { name: "Fórum", href: "#forum" },
        { name: "Discord", href: "#discord" },
        { name: "Reviews", href: "#reviews" },
        { name: "Recomendações", href: "#recommendations" },
      ],
    },
    {
      title: "Suporte",
      links: [
        { name: "Central de Ajuda", href: "#help" },
        { name: "Contato", href: "#contact" },
        { name: "Reportar Problema", href: "#report" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Política de Privacidade", href: "#privacy" },
        { name: "Termos de Uso", href: "#terms" },
        { name: "Direitos Autorais", href: "#copyright" },
        { name: "DMCA", href: "#dmca" },
      ],
    },
  ];
  const socialLinks = [
    { name: "Twitter", icon: "bi-twitter", href: "#twitter" },
    { name: "Instagram", icon: "bi-instagram", href: "#instagram" },
    { name: "Github", icon: "bi-github", href: "#github" },
    { name: "Email", icon: "bi-envelope", href: "mailto:contato@mangwa.com" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 transition-colors duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}{" "}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg">
                  <img
                    src="/favicon/favicon.svg"
                    alt="Mangwa Logo"
                    className="w-6 h-6 text-white"
                  />
                </div>
                <h3 className="text-xl font-bold text-gradient">Mangwa</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                A melhor plataforma para ler mangás e manhwas online. Descubra
                milhares de títulos e acompanhe suas séries favoritas.
              </p>{" "}
              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 bg-gray-200 dark:bg-dark-800 hover:bg-gray-300 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
                    title={social.name}>
                    <i
                      className={`${social.icon} text-gray-700 dark:text-gray-300`}></i>
                  </a>
                ))}
              </div>
            </div>
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200 dark:border-dark-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} Mangwa. Todos os direitos reservados.</span>
            </div>{" "}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Feito com</span>
              <i className="bi bi-heart-fill text-red-500"></i>
              <span>para a comunidade otaku</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
