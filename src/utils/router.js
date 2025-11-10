import '../views/loginView.js';
import '../views/dashboardView.js';
import '../views/docentesView.js';
import '../views/cursosView.js';
import '../views/adminView.js';
import '../views/publicView.js';
import { renderNavbar } from '../components/navbar.js';
import { getItemSync } from './storage.js';

// Definición de vistas/rutas
const routes = {
    '/login': 'login-view',
    '/dashboard': 'dashboard-view',
    '/docentes': 'docentes-view',
    '/cursos': 'cursos-view',
    '/admin': 'admin-view',
    '/public': 'public-view',
};

// Rutas que requieren autenticación
const protectedRoutes = [
    '/dashboard',
    '/docentes',
    '/cursos',
    '/admin'
];

const Router = {
    routes,

    navigate(route) {
        if (window.location.hash !== `#${route}`) {
            window.location.hash = route;
        } else {
            // Si ya estamos en la ruta, forzar el render
            this.handleRoute();
        }
    },

    isAuthenticated() {
        // Verificar si existe un 'session' en storage
        return !!getItemSync('session');
    },

    handleRoute() {
        const root = document.getElementById('root');
        if (!root) {
            console.error('Root element not found');
            return;
        }

        // Extraer path y query parameters del hash
        const hash = window.location.hash.replace('#', '') || '/public';
        const [path, queryString] = hash.split('?');
        const queryParams = new URLSearchParams(queryString || '');

        // Protección de rutas - solo redirigir a login si se intenta acceder a una ruta protegida sin autenticación
        if (protectedRoutes.includes(path) && !this.isAuthenticated()) {
            window.location.hash = '/login';
            return; // Salir aquí, el hashchange disparará otro handleRoute
        }

        // Si está autenticado y está en /public o /login, redirigir a dashboard (solo si no hay query params)
        if (this.isAuthenticated() && (path === '/public' || path === '/login') && !queryString) {
            window.location.hash = '/dashboard';
            return;
        }

        // Redirigir /docentes y /cursos a /admin (ya que ahora están unificados)
        if (this.isAuthenticated() && (path === '/docentes' || path === '/cursos')) {
            window.location.hash = '/admin' + (queryString ? '?' + queryString : '');
            return;
        }

        const viewTag = this.routes[path] || this.routes['/public'];
        
        // Renderizado de la vista
        root.innerHTML = '';
        
        // Renderizar navbar si está autenticado y no es la vista pública o login
        if (this.isAuthenticated() && path !== '/public' && path !== '/login') {
            renderNavbar(root);
        }
        
        // Renderizar la vista
        const viewElement = document.createElement(viewTag);
        root.appendChild(viewElement);
    },

    init() {
        // Manejar cambios de hash
        window.addEventListener('hashchange', () => this.handleRoute());
        // Manejar carga inicial
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleRoute());
        } else {
            // Si el DOM ya está listo, ejecutar inmediatamente
            this.handleRoute();
        }
    }
};

export { Router };
export { routes };
