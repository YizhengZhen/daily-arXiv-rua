// Theme Management Module
const ThemeManager = {
    // Theme constants
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
    },
    
    // Theme icon SVGs
    ICONS: {
        LIGHT: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 1c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-6-6h.01M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M6.64 17.36l-1.42 1.42M19.78 4.22l-1.42 1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        DARK: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/>
        </svg>`
    },
    
    // Initialize theme management
    init() {
        this.loadThemePreference();
        this.setupEventListeners();
        this.applyTheme();
    },
    
    // Load theme preference from localStorage
    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === this.THEMES.DARK || savedTheme === this.THEMES.LIGHT) {
            this.currentTheme = savedTheme;
        } else if (savedTheme === this.THEMES.SYSTEM) {
            this.currentTheme = prefersDark ? this.THEMES.DARK : this.THEMES.LIGHT;
        } else {
            // Default to system preference
            this.currentTheme = prefersDark ? this.THEMES.DARK : this.THEMES.LIGHT;
            localStorage.setItem('theme', this.THEMES.SYSTEM);
        }
    },
    
    // Setup event listeners
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === this.THEMES.SYSTEM) {
                this.currentTheme = e.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
                this.applyTheme();
            }
        });
    },
    
    // Toggle between light and dark themes
    toggleTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === this.THEMES.SYSTEM) {
            // System -> Light/Dark based on current state
            if (this.currentTheme === this.THEMES.LIGHT) {
                this.currentTheme = this.THEMES.DARK;
                localStorage.setItem('theme', this.THEMES.DARK);
            } else {
                this.currentTheme = this.THEMES.LIGHT;
                localStorage.setItem('theme', this.THEMES.LIGHT);
            }
        } else if (savedTheme === this.THEMES.DARK) {
            this.currentTheme = this.THEMES.LIGHT;
            localStorage.setItem('theme', this.THEMES.LIGHT);
        } else if (savedTheme === this.THEMES.LIGHT) {
            this.currentTheme = this.THEMES.SYSTEM;
            localStorage.setItem('theme', this.THEMES.SYSTEM);
            this.currentTheme = prefersDark ? this.THEMES.DARK : this.THEMES.LIGHT;
        } else {
            // Default case
            this.currentTheme = this.currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
            localStorage.setItem('theme', this.currentTheme);
        }
        
        this.applyTheme();
    },
    
    // Apply the current theme to the document
    applyTheme() {
        const themeIcon = document.getElementById('themeIcon');
        const themeToggle = document.getElementById('themeToggle');
        
        // Update document theme attribute
        if (this.currentTheme === this.THEMES.DARK) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.innerHTML = this.ICONS.LIGHT;
            }
            if (themeToggle) {
                themeToggle.title = 'Switch to light theme';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) {
                themeIcon.innerHTML = this.ICONS.DARK;
            }
            if (themeToggle) {
                themeToggle.title = 'Switch to dark theme';
            }
        }
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        }));
    },
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    },
    
    // Check if dark mode is active
    isDarkMode() {
        return this.currentTheme === this.THEMES.DARK;
    }
};

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}