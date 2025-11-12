import { loadData, initializeData } from '../utils/storage.js';
import '../styles/dashboardView.css';

class DashboardView extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.validateToken();
        this.render();
    }
    
    validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.hash = '#/login';
            return;
        }
    }
    
    render() {
        // Inicializar datos si no existen
        let data = loadData();
        if (!data) {
            initializeData();
            data = loadData();
        }
        
        const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
        const cursos = data?.cursos || [];
        const docentes = data?.docentes || [];
        const totalLecciones = cursos.reduce((total, curso) => {
            return total + (curso.modulos?.reduce((sum, mod) => sum + (mod.lecciones?.length || 0), 0) || 0);
        }, 0);
        
        this.innerHTML = `
            <div class="dashboard-view">
                <header class="dashboard-header">
                    <div class="dashboard-header-content">
                        <div class="dashboard-title-section">
                            <img src="/logo.png" alt="ABC Educate Logo" class="dashboard-logo">
                            <h1 class="dashboard-title">Dashboard</h1>
                        </div>
                        <nav class="dashboard-nav">
                            <a href="#/admin" class="dashboard-nav-btn">
                                <span class="material-icons">admin_panel_settings</span>
                                Panel Admin
                            </a>
                            <button class="dashboard-nav-btn" id="logoutBtn">
                                <span class="material-icons">logout</span>
                                Cerrar Sesión
                            </button>
                        </nav>
                    </div>
                </header>
                
                <main class="dashboard-main">
                    <div class="dashboard-welcome">
                        <h2>Bienvenido, ${currentUser.email || 'Usuario'}</h2>
                        <p>Aquí puedes ver un resumen de los cursos disponibles y tu progreso</p>
                    </div>
                    
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <span class="material-icons">book</span>
                            </div>
                            <div class="stat-content">
                                <p class="stat-value">${cursos.length}</p>
                                <p class="stat-label">Cursos Disponibles</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: var(--color-secondary);">
                                <span class="material-icons">library_books</span>
                            </div>
                            <div class="stat-content">
                                <p class="stat-value">${cursos.reduce((sum, c) => sum + (c.modulos?.length || 0), 0)}</p>
                                <p class="stat-label">Módulos Totales</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: #8b5cf6;">
                                <span class="material-icons">article</span>
                            </div>
                            <div class="stat-content">
                                <p class="stat-value">${totalLecciones}</p>
                                <p class="stat-label">Lecciones Totales</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: #f59e0b;">
                                <span class="material-icons">school</span>
                            </div>
                            <div class="stat-content">
                                <p class="stat-value">${docentes.length}</p>
                                <p class="stat-label">Docentes</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-section">
                        <h3>
                            <span class="material-icons">book</span>
                            Cursos Disponibles
                        </h3>
                        ${cursos.length > 0 ? `
                            <div class="courses-grid">
                                ${cursos.map(curso => `
                                    <a href="#/curso/${curso.id}" class="course-card-dashboard">
                                        <h4>${curso.nombre}</h4>
                                        <p>${curso.descripcion}</p>
                                        <div class="course-meta">
                                            <span>
                                                <span class="material-icons" style="font-size: 16px; vertical-align: middle;">library_books</span>
                                                ${curso.modulos?.length || 0} módulos
                                            </span>
                                            <span>
                                                <span class="material-icons" style="font-size: 16px; vertical-align: middle;">article</span>
                                                ${curso.modulos?.reduce((sum, m) => sum + (m.lecciones?.length || 0), 0) || 0} lecciones
                                            </span>
                                        </div>
                                    </a>
                                `).join('')}
                            </div>
                        ` : '<p style="text-align: center; color: var(--color-text-secondary);">No hay cursos disponibles</p>'}
                    </div>
                    
                    <div class="dashboard-section">
                        <h3>
                            <span class="material-icons">school</span>
                            Docentes Activos
                        </h3>
                        ${docentes.length > 0 ? `
                            <div class="docentes-grid">
                                ${docentes.map(docente => {
                                    const cursosAsignados = cursos.filter(c => c.docenteId === docente.id).length;
                                    return `
                                        <div class="docente-card-dashboard">
                                            <div class="docente-header">
                                                ${docente.foto ? `
                                                    <img src="${docente.foto}" alt="${docente.nombres} ${docente.apellidos}" class="docente-photo">
                                                ` : `
                                                    <div class="docente-photo-placeholder">
                                                        <span class="material-icons">person</span>
                                                    </div>
                                                `}
                                                <div class="docente-info">
                                                    <h4>${docente.nombres} ${docente.apellidos}</h4>
                                                    <p class="docente-email">${docente.email}</p>
                                                </div>
                                            </div>
                                            <div class="docente-details">
                                                <div class="docente-detail-item">
                                                    <span class="material-icons">badge</span>
                                                    <span>Código: ${docente.codigo || 'N/A'}</span>
                                                </div>
                                                <div class="docente-detail-item">
                                                    <span class="material-icons">category</span>
                                                    <span>${docente.areaAcademica || 'Sin área'}</span>
                                                </div>
                                                <div class="docente-detail-item">
                                                    <span class="material-icons">book</span>
                                                    <span>${cursosAsignados} curso${cursosAsignados !== 1 ? 's' : ''} asignado${cursosAsignados !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : '<p style="text-align: center; color: var(--color-text-secondary);">No hay docentes registrados</p>'}
                    </div>
                </main>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const logoutBtn = this.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('current-user');
                window.location.hash = '#/login';
            });
        }
    }
}

customElements.define('dashboard-view', DashboardView);
export default DashboardView;

