/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    themeKey: 'theme',
    languageKey: 'language',
    darkClass: 'dark-mode'
};
// ============================================
// EFFET FLUI QUI MONTE AU SURVOL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Animation au chargement ---
    
    // Sélectionne les cartes
    const stepCards = document.querySelectorAll('.step-card');
    const roleCards = document.querySelectorAll('.role-card');
    const heroSection = document.querySelector('.hero-section');
    
    // Affiche la hero section
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('visible');
        }, 200);
    }
    
    // Affiche les cartes étape une par une
    stepCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 400 + (index * 200)); // délai progressif
    });
    
    // Affiche les cartes rôle une par une
    roleCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 600 + (index * 250));
    });
    
    // --- 2. Gestion du mode sombre pour l'effet ---
    
    // Quand on change de thème, on ajuste les ombres
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        const observer = new MutationObserver(() => {
            const isDark = document.body.classList.contains('dark-mode');
            const cards = document.querySelectorAll('.step-card, .role-card');
            
            cards.forEach(card => {
                if (isDark) {
                    card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
                } else {
                    card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
/* ============================================
   1. GESTION DU THÈME (JOUR/NUIT)
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
        
        this.toggleBtn.textContent = isDark ? '☀️' : '🌙';
        this.toggleBtn.setAttribute('aria-label', isDark ? 'Passer en mode clair' : 'Passer en mode sombre');
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
   2. GESTION DES LANGUES
   ============================================ */
const LanguageManager = {
    init() {
        this.selector = document.getElementById('language-selector');
        if (!this.selector) return;
        
        this.loadSavedLanguage();
        this.selector.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    },
    
    getDefaultLanguage() {
        const saved = localStorage.getItem(CONFIG.languageKey);
        if (saved) return saved;
        
        const browserLang = navigator.language.split('-')[0];
        return ['fr', 'en'].includes(browserLang) ? browserLang : 'fr';
    },
    
    loadSavedLanguage() {
        const lang = this.getDefaultLanguage();
        this.selector.value = lang;
        this.fetchTranslations(lang);
    },
    
    changeLanguage(lang) {
        this.selector.value = lang;
        this.fetchTranslations(lang);
        localStorage.setItem(CONFIG.languageKey, lang);
        document.documentElement.lang = lang;
    },
    
    fetchTranslations(lang) {
        fetch(`lang/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Fichier ${lang}.json introuvable`);
                }
                return response.json();
            })
            .then(translations => {
                this.applyTranslations(translations);
                console.log(`✅ Traduction chargée : ${lang}`);
            })
            .catch(error => {
                console.error('❌ Erreur de chargement des traductions:', error);
            });
    },
    
    applyTranslations(translations) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key] !== undefined && translations[key] !== null) {
                element.textContent = translations[key];
            }
        });
    }
};

/* ============================================
   3. GESTION DU LIEN TECHNICIEN (REDIRECTION)
   ============================================ */
const TechManager = {
    init() {
        const techLink = document.getElementById('btnTech');
        if (techLink) {
            techLink.addEventListener('click', (e) => {
                // Le lien pointe déjà vers connexionadmin.html
                // Pas besoin d'action supplémentaire
                console.log('🔐 Redirection vers la page admin');
            });
        }
    }
};

/* ============================================
   4. INITIALISATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SecureNet - Initialisation...');
    ThemeManager.init();
    LanguageManager.init();
    TechManager.init();
});

// Écouter les changements de thème du système
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(CONFIG.themeKey)) {
        ThemeManager.applyTheme(e.matches ? 'dark' : 'light');
    }
});