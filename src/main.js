// Importar todas las vistas para registrar los Web Components
import './views/loginView.js';
import './views/dashboardView.js';
import './views/docentesView.js';
import './views/cursosView.js';
import './views/adminView.js';
import './views/publicView.js';

// Importar Router
import { Router } from './utils/router.js';

// Importar inicialización de datos
import { getInitialData } from './data/initializeData.js';

// Inicializar datos si no existen
function initializeAppData() {
  // Obtener datos iniciales una sola vez
  const appData = getInitialData();
  
  // Inicializar datos principales (docentes, cursos, etc.) en appData
  if (!localStorage.getItem('appData')) {
    localStorage.setItem('appData', JSON.stringify(appData));
  }
  
  // Inicializar usuarios para login si no existen
  if (!localStorage.getItem('users')) {
    // Convertir credenciales a formato de usuarios para el login
    if (appData.credenciales && appData.credenciales.length > 0) {
      const users = appData.credenciales.map(cred => ({
        email: cred.email,
        password: cred.password,
        rol: cred.rol
      }));
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
  
  // También inicializar docentes y cursos directamente para compatibilidad con componentes existentes
  if (!localStorage.getItem('docentes') && appData.docentes) {
    localStorage.setItem('docentes', JSON.stringify(appData.docentes));
  }
  if (!localStorage.getItem('cursos')) {
    // Inicializar cursos incluso si está vacío para evitar problemas
    localStorage.setItem('cursos', JSON.stringify(appData.cursos || []));
  }
}

// Inicializar la aplicación
function init() {
  // Inicializar datos
  initializeAppData();
  
  // El Router maneja las rutas y la autenticación
  Router.init();
}

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', init);