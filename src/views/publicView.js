import '../components/cursos.js';
import { initializeData, loadData } from '../utils/storage.js';
import '../styles/publicView.css';

class PublicView extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // Inicializar datos si no existen
        if (!localStorage.getItem('app-data')) {
            initializeData();
        } else {
            // Si ya existe, actualizar con loadData
            const data = loadData();
            if (data) {
                // Los datos se cargan automáticamente desde localStorage
                // loadData() ya actualiza los datos en memoria
            }
        }
        this.render();
    }
    render() {
        this.innerHTML = `
        <div class="public-view">
            <header class="public-header">
                <div class="header-content">
                    <a href="#/login" class="login-button">
                        <svg class="login-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Iniciar Sesión
                    </a>
                </div>
                <div class="header-logo">
                    <img src="/logo.png" alt="ABC Educate Logo" class="logo-image">
                    <p class="header-tagline">Plataforma de educación en línea</p>
                </div>
            </header>
            <main class="public-main">
                <cursos-component></cursos-component>
            </main>
        </div>
        `;
    }
}

customElements.define('public-view', PublicView);
export default PublicView;