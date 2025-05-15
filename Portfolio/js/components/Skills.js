const Skills = () => {
    // Dados de habilidades
    const skills = [
        { 
            category: "Frontend", 
            items: [
                { name: "HTML5", icon: "fa-html5", level: 90, color: "#E34F26" },
                { name: "CSS3", icon: "fa-css3-alt", level: 85, color: "#1572B6" },
                { name: "JavaScript", icon: "fa-js", level: 90, color: "#F7DF1E" },
                { name: "React", icon: "fa-react", level: 85, color: "#61DAFB" },
                { name: "Tailwind CSS", icon: "fa-wind", level: 80, color: "#06B6D4" }
            ] 
        },
        { 
            category: "Backend", 
            items: [
                { name: "Node.js", icon: "fa-node-js", level: 80, color: "#339933" },
                { name: "Express", icon: "fa-server", level: 75, color: "#000000" },
                { name: "MongoDB", icon: "fa-database", level: 70, color: "#47A248" },
                { name: "SQL", icon: "fa-database", level: 75, color: "#4479A1" },
                { name: "Firebase", icon: "fa-fire", level: 70, color: "#FFCA28" }
            ] 
        },
        { 
            category: "Ferramentas", 
            items: [
                { name: "Git", icon: "fa-git-alt", level: 85, color: "#F05032" },
                { name: "VS Code", icon: "fa-code", level: 90, color: "#007ACC" },
                { name: "npm", icon: "fa-npm", level: 80, color: "#CB3837" },
                { name: "Webpack", icon: "fa-box-open", level: 70, color: "#8DD6F9" },
                { name: "Docker", icon: "fa-docker", level: 65, color: "#2496ED" }
            ] 
        }
    ];

    return (
        <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Minhas <span className="text-primary-500">Habilidades</span>
                    </h2>
                    <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Tecnologias e ferramentas que utilizo para criar aplicações web modernas e eficientes.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {skills.map((skillGroup, groupIndex) => (
                        <div 
                            key={groupIndex} 
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                                <i className={`fas ${
                                    skillGroup.category === "Frontend" ? "fa-laptop-code" :
                                    skillGroup.category === "Backend" ? "fa-server" : "fa-tools"
                                } mr-2 text-primary-500`}></i>
                                {skillGroup.category}
                            </h3>
                            
                            <div className="space-y-6">
                                {skillGroup.items.map((skill, skillIndex) => (
                                    <div key={skillIndex}>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <i className={`fab ${skill.icon} text-lg mr-2`} style={{ color: skill.color }}></i>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                                        </div>
                                        
                                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full" 
                                                style={{ 
                                                    width: `${skill.level}%`, 
                                                    backgroundColor: skill.color,
                                                    transition: "width 1s ease-in-out"
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Seção de estatísticas */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <i className="fas fa-code text-3xl text-primary-500 mb-4"></i>
                        <h4 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">50+</h4>
                        <p className="text-gray-600 dark:text-gray-400">Projetos Completos</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <i className="fas fa-clock text-3xl text-primary-500 mb-4"></i>
                        <h4 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">5+</h4>
                        <p className="text-gray-600 dark:text-gray-400">Anos de Experiência</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <i className="fas fa-users text-3xl text-primary-500 mb-4"></i>
                        <h4 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">20+</h4>
                        <p className="text-gray-600 dark:text-gray-400">Clientes Satisfeitos</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                        <i className="fas fa-coffee text-3xl text-primary-500 mb-4"></i>
                        <h4 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">∞</h4>
                        <p className="text-gray-600 dark:text-gray-400">Xícaras de Café</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
