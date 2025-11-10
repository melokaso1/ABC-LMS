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

// Importar storage
import { getItemSync, setItemSync } from './utils/storage.js';

// Inicializar datos si no existen
function initializeAppData() {
  // Obtener datos iniciales una sola vez
  const appData = getInitialData();
  
  // Inicializar datos principales (docentes, cursos, etc.) en appData
  if (!getItemSync('appData')) {
    setItemSync('appData', appData);
  }
  
  // Inicializar usuarios para login si no existen
  if (!getItemSync('users')) {
    // Convertir credenciales a formato de usuarios para el login
    if (appData.credenciales && appData.credenciales.length > 0) {
      const users = appData.credenciales.map(cred => ({
        email: cred.email,
        password: cred.password,
        rol: cred.rol
      }));
      setItemSync('users', users);
    }
  }
  
  // También inicializar docentes, cursos y administrativos directamente para compatibilidad con componentes existentes
  if (!getItemSync('docentes') && appData.docentes) {
    setItemSync('docentes', appData.docentes);
  }
  if (!getItemSync('cursos')) {
    // Inicializar cursos incluso si está vacío para evitar problemas
    setItemSync('cursos', appData.cursos || []);
  }
  if (!getItemSync('administrativos') && appData.administrativos) {
    setItemSync('administrativos', appData.administrativos);
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