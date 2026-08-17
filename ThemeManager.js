/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    themeKey: 'theme',
    darkClass: 'dark-mode'
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
        this.toggleBtn.textContent = isDark ? '☀️' : '🌙';
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
   INITIALISATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});