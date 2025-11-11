// Router simple para navegación
import '../views/loginView.js';
import '../views/dashboardView.js';
import '../views/adminView.js';
import '../views/publicView.js';

// Rutas disponibles
const routes = {
    '/login': 'login-view',
    '/dashboard': 'dashboard-view',
    '/admin': 'admin-view',
    '/public': 'public-view',
};

// Rutas que requieren login
const protectedRoutes = [
    '/dashboard',
    '/admin'
];

class Router {
    constructor() {
        this.routes = routes;
    }
    handleRoute() {
        // Verificar rutas protegidas primero
        const route = window.location.hash.slice(1) || '/public';
        
        if (protectedRoutes.includes(route)) {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.hash = '#/login';
                // Retornar login-view después de cambiar el hash
                // El hashchange event se disparará y renderizará de nuevo
                return 'login-view';
            }
        }
        
        // Obtener el nombre del custom element
        const viewName = this.routes[route] || 'public-view';
        return viewName;
    }
}

export const router = new Router();

