/* ============================================================
   THEME.JS – Dark / Light mode toggle
   ============================================================ */

(function () {
  const html        = document.documentElement;
  const btn         = document.getElementById('themeToggle');
  const STORAGE_KEY = 'portfolio-theme';

  // Icons for each mode
  const ICONS = {
    dark:  '🌙',
    light: '☀️'
  };

  // Determine initial theme:
  // 1. Use saved preference, or
  // 2. Use system preference (prefers-color-scheme)
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (btn) {
      btn.textContent  = ICONS[theme];
      btn.title        = theme === 'dark' ? 'Mode Terang' : 'Mode Gelap';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply on load (no flash — HTML already has data-theme="dark" as default)
  applyTheme(getInitialTheme());

  // Wire up button
  if (btn) btn.addEventListener('click', toggleTheme);

  // Listen to OS-level preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only follow OS if the user hasn't manually chosen
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
