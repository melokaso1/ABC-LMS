import '../views/loginView.js';
import '../views/dashboardView.js';
import '../views/docentesView.js';
import '../views/cursosView.js';
import '../views/adminView.js';
import '../views/publicView.js';

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

const root = document.getElementById('root');

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
        // Ejemplo: verificar si existe un 'session' en localStorage
        return !!localStorage.getItem('session');
    },

    handleRoute() {
        let path = window.location.hash.replace('#', '') || '/public';

        // Protección de rutas
        if (protectedRoutes.includes(path) && !this.isAuthenticated()) {
            // Redirigir a login si no autenticado
            path = '/login';
            window.location.hash = path; // Forzar hash para mantener consistencia
        }

        const viewTag = this.routes[path] || this.routes['/public'];
        // Renderizado de la vista
        if (root) {
            root.innerHTML = '';
            root.appendChild(document.createElement(viewTag));
        }
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        document.addEventListener('DOMContentLoaded', () => this.handleRoute());
    }
};

export { Router };
