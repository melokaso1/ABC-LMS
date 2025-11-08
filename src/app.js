// Importa router y vistas
import Router from './utils/router.js';
import '../views/loginView.js';
import '../views/dashboardView.js';
import '../views/docentesView.js';
import '../views/cursosView.js';
import '../views/adminView.js';
import '../views/publicView.js';

// Inicializa la app
function init() {
  const hasSession = !!localStorage.getItem('session');

  // Redirige según sesión y ruta
  if (!hasSession && window.location.hash !== '#/login') {
    window.location.hash = '/login';
  } else if (
    hasSession &&
    (window.location.hash === '' ||
      window.location.hash === '#/public' ||
      window.location.hash === '#/login')
  ) {
    window.location.hash = '/dashboard';
  }

  if (typeof Router.handleRoute === 'function') {
    Router.handleRoute();
  }
}

// Espera DOM
window.addEventListener('DOMContentLoaded', init);
