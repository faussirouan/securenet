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
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
        this.overlay.addEventListener('click', () => this.close());
        
        // Navigation - ATTENTION : on ne réinitialise pas les sections ici
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
        
        // Ouvrir la première section par défaut
        const firstActive = document.querySelector('.sidebar-nav li.active a');
        if (firstActive) {
            this.navigateTo(firstActive.dataset.section);
        } else {
            this.navigateTo('dashboard');
        }
    },
    
    toggle() {
        if (this.sidebar) {
            this.sidebar.classList.toggle('open');
            this.overlay.classList.toggle('show');
        }
    },
    
    close() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
            this.overlay.classList.remove('show');
        }
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
        const titleEl = document.getElementById('pageTitle');
        if (titleEl) {
            titleEl.textContent = sectionNames[sectionId] || sectionId;
        }
        
        // Afficher la section
        document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
};

/* ============================================
   2. THÈME (JOUR/NUIT)
   ============================================ */
const ThemeManager = {
    init() {
        this.toggleBtn = document.getElementById('theme-toggle');
        if (!this.toggleBtn) return;

        this.applySavedTheme();
        this.toggleBtn.addEventListener('click', () => this.toggle());
    },

    applyTheme(themeName) {
        const isDark = themeName === 'dark';
        document.documentElement.classList.toggle(CONFIG.darkClass, isDark);
        localStorage.setItem(CONFIG.themeKey, themeName);
        if (this.toggleBtn) {
            this.toggleBtn.textContent = isDark ? '☀️' : '🌙';
        }
    },

    applySavedTheme() {
        const savedTheme = localStorage.getItem(CONFIG.themeKey);
        if (savedTheme) {
            this.applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark ? 'dark' : 'light');
        }
    },

    toggle() {
        const isDark = document.documentElement.classList.contains(CONFIG.darkClass);
        this.applyTheme(isDark ? 'light' : 'dark');
    }
};

/* ============================================
   INITIALISATION - UN SEUL EVENT LISTENER
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    SidebarManager.init();
    ThemeManager.init();
});
// ============================================
// STATISTIQUES AVANCÉES AVEC GRAPHIQUES
// ============================================
let chartStatuts = null;
let chartEvolution = null;
let chartSpecialites = null;

async function chargerStatistiques() {
    try {
        // 1. Nombre total de spécialistes
        const { count: totalSpecialistes, error: err1 } = await supabaseClient
            .from('technicien')
            .select('*', { count: 'exact', head: true });

        // 2. Toutes les demandes pour les stats
        const { data: demandes, error: err2 } = await supabaseClient
            .from('demande_audit')
            .select(`
                id,
                statut,
                date_creation,
                technicien_id,
                technicien:technicien_id (specialite)
            `)
            .order('date_creation', { ascending: true });

        // 3. Clients uniques
        const { data: clients, error: err3 } = await supabaseClient
            .from('demande_audit')
            .select('client_id');

        if (err1 || err2 || err3) {
            console.error('Erreur chargement stats:', err1 || err2 || err3);
            return;
        }

        // ---- TRAITEMENT DES DONNÉES ----

        // Compter les statuts
        const statuts = {
            nouveau: 0,
            assigne: 0,
            traite: 0
        };
        const demandesParMois = {};
        const specialitesCount = {};

        demandes?.forEach(d => {
            // Statuts
            if (statuts[d.statut] !== undefined) statuts[d.statut]++;

            // Évolution mensuelle
            const date = new Date(d.date_creation);
            const moisKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!demandesParMois[moisKey]) demandesParMois[moisKey] = 0;
            demandesParMois[moisKey]++;

            // Spécialités
            const specialite = d.technicien?.specialite || 'Non assigné';
            if (!specialitesCount[specialite]) specialitesCount[specialite] = 0;
            specialitesCount[specialite]++;
        });

        // Clients uniques
        const clientsUniques = new Set(clients?.map(c => c.client_id).filter(id => id));

        // ---- MISE À JOUR DES CARTES ----
        document.getElementById('stats-specialistes').textContent = totalSpecialistes || 0;
        document.getElementById('stats-demandes-total').textContent = demandes?.length || 0;
        document.getElementById('stats-demandes-nouvelles').textContent = statuts.nouveau || 0;
        document.getElementById('stats-demandes-assignees').textContent = statuts.assigne || 0;
        document.getElementById('stats-demandes-traitees').textContent = statuts.traite || 0;
        document.getElementById('stats-clients-uniques').textContent = clientsUniques.size || 0;

        // ---- CRÉER LES GRAPHIQUES ----
        creerGraphiques(statuts, demandesParMois, specialitesCount);

    } catch (error) {
        console.error('Erreur chargement statistiques:', error);
    }
}

function creerGraphiques(statuts, demandesParMois, specialitesCount) {
    // 1. Graphique circulaire - Répartition des statuts
    const ctxStatuts = document.getElementById('chartStatuts');
    if (ctxStatuts) {
        if (chartStatuts) chartStatuts.destroy();
        chartStatuts = new Chart(ctxStatuts, {
            type: 'doughnut',
            data: {
                labels: ['Nouvelles', 'Assignées', 'Traitée'],
                datasets: [{
                    data: [statuts.nouveau || 0, statuts.assigne || 0, statuts.traite || 0],
                    backgroundColor: ['#ffc107', '#0d6efd', '#198754'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // 2. Graphique en barres - Évolution mensuelle
    const ctxEvolution = document.getElementById('chartEvolution');
    if (ctxEvolution) {
        if (chartEvolution) chartEvolution.destroy();
        const mois = Object.keys(demandesParMois).sort();
        const valeurs = mois.map(m => demandesParMois[m]);
        
        chartEvolution = new Chart(ctxEvolution, {
            type: 'bar',
            data: {
                labels: mois,
                datasets: [{
                    label: 'Demandes',
                    data: valeurs,
                    backgroundColor: '#0d6efd',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    // 3. Graphique à barres horizontales - Spécialités
    const ctxSpecialites = document.getElementById('chartSpecialites');
    if (ctxSpecialites) {
        if (chartSpecialites) chartSpecialites.destroy();
        const labels = Object.keys(specialitesCount);
        const data = Object.values(specialitesCount);
        
        chartSpecialites = new Chart(ctxSpecialites, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Demandes par spécialité',
                    data: data,
                    backgroundColor: ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#198754'],
                    borderRadius: 5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }
}

// ============================================
// RÉACTUALISATION AUTOMATIQUE
// ============================================
// Recharger les stats quand on clique sur le menu Statistiques
document.querySelector('.sidebar-nav a[data-section="statistiques"]')?.addEventListener('click', () => {
    setTimeout(chargerStatistiques, 100);
});