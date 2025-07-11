document.addEventListener('DOMContentLoaded', function() {
    // Initialize curtain and animations
    initializeCurtain();
    initializeParticles();
    initializeTypingEffect();
    initializeParallax();
    initializeScrollAnimations();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger?.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            showProjectDetails(projectId);
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        });
        
        // Staggered animation
        setTimeout(() => {
            card.classList.add('animate');
        }, index * 100);
    });

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Staggered animation for child elements
                const children = entry.target.querySelectorAll('.project-card, .skill-category li, .highlight-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.section-title, .category-title, .project-card, .skill-category, .highlight-item, .about-text');
    animatedElements.forEach(el => observer.observe(el));

    // Navbar scroll effect amélioré
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Ripple effect for buttons
    document.querySelectorAll('.cta-button, .contact-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.button-ripple') || document.createElement('div');
            ripple.className = 'button-ripple';
            if (!this.querySelector('.button-ripple')) {
                this.appendChild(ripple);
            }
            
            ripple.style.width = ripple.style.height = '0';
            setTimeout(() => {
                ripple.style.width = ripple.style.height = '300px';
            }, 10);
        });
    });
});

function initializeCurtain() {
    // Auto-hide curtain after animations
    setTimeout(() => {
        const curtain = document.querySelector('.curtain-overlay');
        if (curtain) {
            curtain.style.pointerEvents = 'none';
        }
    }, 4000);
}

function initializeTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    const originalText = title.textContent;
    title.textContent = '';
    let i = 0;

    function type() {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    setTimeout(type, 3500); // Start after hero fade-in animation
}

function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight; // Cover full page height
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Particle system
    const particles = [];
    const particleCount = 150; // More particles
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 0.5;
            this.baseRadius = this.radius;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.baseOpacity = this.opacity;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Effet de rebond amélioré
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
                this.pulse();
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
                this.pulse();
            }

            // Effet de souris amélioré
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    this.radius = this.baseRadius * (1 + (150 - distance) / 50);
                    this.opacity = this.baseOpacity * (1 + (150 - distance) / 100);
                } else {
                    this.radius = this.baseRadius;
                    this.opacity = this.baseOpacity;
                }
            }
        }
        
        pulse() {
            this.radius = this.baseRadius * 2;
            setTimeout(() => this.radius = this.baseRadius, 200);
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`; // Themed color
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop améliorée
    function animate() {
        ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connexions améliorées
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = (1 - distance / 150) * 0.3;
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                    ctx.lineWidth = opacity * 2;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation after curtain
    setTimeout(() => {
        animate();
    }, 1000); // Start earlier for a smoother transition
}

function initializeParallax() {
    const hero = document.querySelector('.hero-content');
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        hero.style.transform = `
            perspective(1000px)
            rotateY(${mouseX * 5}deg)
            rotateX(${-mouseY * 5}deg)
            translateZ(50px)
        `;
    });
}

function showProjectDetails(projectId) {
    const projectDetails = {
        'data-visualization': {
            title: 'Application de Visualisation de Données',
            description: 'Dashboard interactif développé avec React et Chart.js pour la visualisation de données en temps réel, avec une API backend Express pour la gestion et le traitement des données.',
            features: [
                'Interface React moderne et interactive',
                'Graphiques dynamiques avec Chart.js',
                'API REST Express pour les données',
                'Mise à jour en temps réel',
                'Filtres et options de personnalisation',
                'Export des données et graphiques',
                'Design responsive et accessible'
            ],
            technologies: ['React', 'Chart.js', 'Express', 'Node.js', 'D3.js', 'WebSocket', 'CSS3']
        },
        'user-auth-system': {
            title: 'Système de Gestion d\'Utilisateurs avec JWT',
            description: 'Système complet de gestion d\'utilisateurs avec authentification sécurisée JWT, développé avec Node.js, Express et MongoDB pour la gestion des sessions et des permissions.',
            features: [
                'Authentification JWT sécurisée',
                'Inscription et connexion utilisateur',
                'Gestion des rôles et permissions',
                'Hashage des mots de passe (bcrypt)',
                'Middleware de protection des routes',
                'Refresh tokens automatiques',
                'Validation des données d\'entrée'
            ],
            technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt', 'Mongoose', 'Joi']
        },
        'pharmaplus': {
            title: 'PharmaPlus - Progiciel de Gestion de Pharmacie',
            description: 'Application complète de gestion de pharmacie développée avec Spring Boot et JavaFX, incluant la gestion des stocks, commandes, facturation et interface utilisateur moderne.',
            features: [
                'Gestion complète des stocks médicaments',
                'Système de commandes automatisé',
                'Facturation et gestion clientèle',
                'Interface JavaFX moderne et intuitive',
                'Base de données relationnelle MySQL',
                'Rapports et statistiques détaillés',
                'Gestion des dates d\'expiration'
            ],
            technologies: ['Spring Boot', 'JavaFX', 'MySQL', 'JPA/Hibernate', 'Maven', 'Java 11', 'CSS']
        },
        'easypay': {
            title: 'EasyPay - Application de Paiement Sécurisé',
            description: 'Application de paiement sécurisée développée en Java avec Spring Security, incluant le chiffrement des transactions, l\'authentification multi-facteurs et la gestion complète des paiements.',
            features: [
                'Authentification multi-facteurs sécurisée',
                'Chiffrement AES des données sensibles',
                'Gestion des comptes utilisateurs',
                'Historique détaillé des transactions',
                'Interface de paiement intuitive',
                'Validation des cartes bancaires',
                'Système de notifications en temps réel'
            ],
            technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'AES Encryption', 'MySQL', 'REST API']
        },
        'boisart': {
            title: 'Boisart - Site E-commerce d\'Artisanat en Bois',
            description: 'Site de vente en ligne spécialisé dans l\'artisanat en bois, développé avec HTML5, CSS3 et JavaScript vanilla, incluant un système de panier et de gestion des commandes.',
            features: [
                'Catalogue de produits interactif',
                'Système de panier d\'achat dynamique',
                'Gestion des commandes clients',
                'Interface responsive et moderne',
                'Système de recherche et filtres',
                'Galerie d\'images optimisée',
                'Formulaires de contact intégrés'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap', 'jQuery']
        },
        'taskflow': {
            title: 'TaskFlow - Application de Gestion de Tâches Collaborative',
            description: 'Application web Full Stack permettant aux utilisateurs de créer, gérer et partager des listes de tâches en temps réel avec des espaces collaboratifs et un système d\'authentification sécurisé.',
            features: [
                'API REST CRUD pour utilisateurs, tâches, et projets',
                'Authentification JWT avec DRF SimpleJWT',
                'Gestion des espaces collaboratifs avec rôles (admin/membre)',
                'Création et partage de listes de tâches en temps réel',
                'Système de permissions et gestion des rôles',
                'Filtrage et pagination des tâches',
                'Documentation API via Swagger/DRF Docs',
                'Déploiement Dockerisé sur AWS EC2 + RDS PostgreSQL',
                'Pipeline CI/CD automatisé avec GitHub Actions',
                'Interface React moderne et responsive'
            ],
            technologies: ['Django', 'Django REST Framework', 'React', 'PostgreSQL', 'JWT', 'Docker', 'AWS EC2', 'AWS RDS', 'GitHub Actions', 'SimpleJWT']
        },
        'csv-analyzer': {
            title: 'Analyseur de CSV et Visualisation de Données',
            description: 'Application web interactive développée avec Streamlit permettant de téléverser des fichiers CSV et de générer automatiquement des visualisations (histogrammes, nuages de points, heatmaps) pour explorer et analyser les données.',
            features: [
                'Upload de fichiers CSV avec validation',
                'Génération automatique de visualisations',
                'Interface interactive avec Streamlit',
                'Analyse statistique descriptive des données',
                'Histogrammes et graphiques en barres',
                'Nuages de points et matrices de corrélation',
                'Heatmaps pour visualiser les relations',
                'Export des graphiques en haute résolution',
                'Filtrage et nettoyage des données',
                'Détection automatique des types de colonnes'
            ],
            technologies: ['Python', 'Streamlit', 'Pandas', 'Matplotlib', 'Seaborn', 'NumPy', 'Plotly']
        },
        'real-estate': {
            title: 'Prédiction de Prix Immobilier',
            description: 'Modélisation d\'un système de prédiction des prix immobiliers en Île-de-France basé sur plusieurs critères comme la surface, la localisation, et d\'autres caractéristiques du bien.',
            features: [
                'Analyse exploratoire de données immobilières',
                'Feature engineering avancé (surface, localisation, etc.)',
                'Modèles de régression optimisés (Random Forest, XGBoost)',
                'Validation croisée et métriques de performance',
                'Interface de prédiction utilisateur',
                'Visualisation des facteurs influençant les prix',
                'Analyse géographique des prix par zone',
                'Détection d\'outliers et nettoyage des données',
                'Optimisation des hyperparamètres',
                'Rapport de performance détaillé'
            ],
            technologies: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Machine Learning', 'XGBoost', 'Matplotlib', 'Seaborn']
        },
        'churn-prediction': {
            title: 'Churn Prediction - Détection de Clients à Risque',
            description: 'Développement d\'un modèle de classification pour prédire le churn client sur un jeu de données télécom, permettant d\'identifier les clients susceptibles de résilier.',
            features: [
                'Preprocessing des données télécom complexes',
                'Modèles de classification (Random Forest, SVM, Logistic Regression)',
                'Évaluation des performances (AUC-ROC, F1-score)',
                'Analyse des features importantes',
                'Stratégies de rétention basées sur les prédictions',
                'Gestion du déséquilibre des classes',
                'Validation temporelle pour données séquentielles',
                'Dashboard de monitoring des clients à risque',
                'Segmentation client avancée',
                'Recommandations personnalisées'
            ],
            technologies: ['Python', 'scikit-learn', 'Classification', 'Data Analysis', 'Pandas', 'Imbalanced-learn', 'SHAP']
        },
        'image-recognition': {
            title: 'Reconnaissance d\'Image - Détection d\'Escaliers',
            description: 'Conception d\'un programme de reconnaissance d\'escaliers (droit ou tournant) et estimation des matériaux en utilisant des techniques de computer vision et machine learning.',
            features: [
                'Détection automatique d\'escaliers dans les images',
                'Classification droits vs tournants avec CNN',
                'Estimation des matériaux (bois, métal, béton)',
                'Traitement d\'images en temps réel',
                'Interface utilisateur intuitive avec upload d\'images',
                'Préprocessing avancé (filtres, normalisation)',
                'Segmentation d\'images pour isoler les escaliers',
                'Extraction de caractéristiques géométriques',
                'Modèle de deep learning personnalisé',
                'Visualisation des résultats avec bounding boxes'
            ],
            technologies: ['Python', 'OpenCV', 'NumPy', 'Computer Vision', 'TensorFlow', 'Keras', 'PIL', 'scikit-image']
        },
        'quoridor': {
            title: 'Quoridor Game with AI',
            description: 'Implémentation de plusieurs algorithmes d\'IA avec Minimax et élagage alpha-bêta, simulations IA vs IA, et interface utilisateur interactive pour le jeu de société Quoridor.',
            features: [
                'Algorithmes d\'IA avec Minimax et élagage Alpha-Bêta',
                'Interface graphique interactive avec Pygame',
                'Simulations IA vs IA avec statistiques',
                'Différents niveaux de difficulté',
                'Système de scoring et classement',
                'Visualisation des coups possibles',
                'Mode multijoueur local',
                'Sauvegarde et chargement de parties',
                'Analyse des stratégies de jeu',
                'Optimisation des performances de l\'IA'
            ],
            technologies: ['Python', 'Pygame', 'Minimax', 'Alpha-Beta', 'Algorithmes d\'IA', 'Game Theory']
        },
        'labyrinth': {
            title: 'Labyrinth Solver - Résolution de Labyrinthe',
            description: 'Implémentation et comparaison d\'algorithmes A*, Dijkstra et BFS avec gestion dynamique d\'obstacles et propagation de feu.',
            features: [
                'Algorithmes de pathfinding (A*, Dijkstra, BFS)',
                'Gestion dynamique d\'obstacles en temps réel',
                'Simulation de propagation de feu',
                'Visualisation des chemins trouvés',
                'Comparaison des performances des algorithmes',
                'Génération procédurale de labyrinthes',
                'Interface interactive pour modifier le labyrinthe',
                'Métriques de performance (temps, mémoire)',
                'Mode pas-à-pas pour comprendre les algorithmes',
                'Export des résultats et statistiques'
            ],
            technologies: ['Python', 'A*', 'Dijkstra', 'BFS', 'Pathfinding', 'Pygame', 'Data Structures']
        },
        'resource-optimization': {
            title: 'Assignation de Ressources Optimisée',
            description: 'Développement d\'un algorithme d\'affectation de ressources optimisé en fonction de contraintes et priorités multiples.',
            features: [
                'Optimisation sous contraintes multiples',
                'Gestion des priorités et préférences',
                'Algorithmes génétiques pour solutions complexes',
                'Résolution de problèmes d\'allocation',
                'Interface de configuration des contraintes',
                'Visualisation des solutions optimales',
                'Analyse de sensibilité des paramètres',
                'Comparaison de différentes stratégies',
                'Génération de rapports détaillés',
                'Optimisation en temps réel'
            ],
            technologies: ['Python', 'Algorithmes d\'optimisation', 'Linear Programming', 'Genetic Algorithms', 'NumPy', 'SciPy', 'CVXPY']
        },
        'mini-sgbd': {
            title: 'Mini-SGBD Relationnel',
            description: 'Implémentation d\'un mini système de gestion de base de données supportant les requêtes de création, insertion et sélection avec contraintes.',
            features: [
                'Requêtes SQL basiques (CREATE, INSERT, SELECT)',
                'Gestion des contraintes d\'intégrité',
                'Index B-tree pour optimisation des requêtes',
                'Transactions ACID basiques',
                'Interface en ligne de commande',
                'Gestion des types de données (INT, VARCHAR, DATE)',
                'Jointures simples entre tables',
                'Système de verrouillage basique',
                'Sauvegarde et restauration des données',
                'Planificateur de requêtes simple'
            ],
            technologies: ['C', 'SQL', 'Data Structures', 'File Management', 'Database Design', 'B-trees', 'ACID']
        }
    };

    const project = projectDetails[projectId];
    if (project) {
        createProjectModal(project);
    }
}

function createProjectModal(project) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="modal-features">
                <h3>Fonctionnalités:</h3>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-tech">
                <h3>Technologies:</h3>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Add modal styles dynamically
    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(17, 24, 39, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: modalFadeIn 0.3s ease forwards;
        }
        
        .modal-content {
            background: #1f2937;
            color: #f9fafb;
            padding: 2rem;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.8);
            animation: modalSlideIn 0.3s ease forwards;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #9ca3af;
        }
        
        @keyframes modalFadeIn {
            to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
            to { transform: scale(1); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Close modal functionality
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay || e.target.classList.contains('modal-close')) {
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                document.head.removeChild(styleSheet);
            }, 300);
        }
    });
}

function initializeScrollAnimations() {
    // Placeholder for future scroll animation enhancements
}
