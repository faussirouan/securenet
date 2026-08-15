/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    themeKey: 'theme',
    languageKey: 'language',
    darkClass: 'dark-mode'
};

/* ============================================
   1. SIDEBAR
   ============================================ */
const SidebarManager = {
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleBtn = document.getElementById('toggleSidebar');
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        document.body.appendChild(this.overlay);
        
        // Toggle sidebar
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.overlay.addEventListener('click', () => this.close());
        
        // Navigation
        document.querySelectorAll('.sidebar-nav a[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateTo(section);
                
                // Fermer sur mobile
                if (window.innerWidth <= 768) {
                    this.close();
                }
            });
        });
    },
    
    toggle() {
        this.sidebar.classList.toggle('open');
        this.overlay.classList.toggle('show');
    },
    
    close() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('show');
    },
    
    navigateTo(sectionId) {
        // Mettre à jour le menu
        document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.closest('li').classList.add('active');
        }
        
        // Mettre à jour le titre
        const sectionNames = {
            dashboard: 'Tableau de bord',
            specialistes: 'Spécialistes',
            demandes: 'Demandes',
            clients: 'Clients',
            statistiques: 'Statistiques',
            parametres: 'Paramètres'
        };
        document.getElementById('pageTitle').textContent = sectionNames[sectionId] || sectionId;
        
        // Afficher la section
        document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
};