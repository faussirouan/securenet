// ============================================
// THEME MANAGER - VERSION CORRIGÉE
// ============================================
(function() {
    'use strict';
    
    const themeKey = 'theme';
    const darkClass = 'dark-mode';
    
    function applyTheme(themeName) {
        const isDark = themeName === 'dark';
        document.documentElement.classList.toggle(darkClass, isDark);
        localStorage.setItem(themeKey, themeName);
        
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = isDark ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', isDark ? 'Passer en mode clair' : 'Passer en mode sombre');
        }
    }
    
    function initTheme() {
        // Appliquer le thème sauvegardé ou le thème système
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
        
        // Ajouter l'écouteur d'événement sur le bouton
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            // Supprimer les anciens écouteurs pour éviter les doublons
            const newBtn = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const isDark = document.documentElement.classList.contains(darkClass);
                applyTheme(isDark ? 'light' : 'dark');
                console.log('🌓 Thème changé :', isDark ? 'light' : 'dark');
            });
        } else {
            console.warn('⚠️ Bouton theme-toggle non trouvé dans le DOM');
        }
        
        console.log('✅ ThemeManager initialisé, thème actuel :', localStorage.getItem(themeKey) || 'système');
    }
    
    // Exécuter immédiatement si le DOM est déjà chargé, sinon attendre
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();