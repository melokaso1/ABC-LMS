import '../styles/adminView.css';

class AdminView extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        this.validateToken();
        this.logoutButton();
        this.crudDocentes();
        this.crudCursos();
        this.crudAdmins();
    }
    
    logoutButton() {
        const tabButtons = this.querySelectorAll('.tab-button');
        const sections = this.querySelectorAll('.admin-section');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Quitar la clase 'active' de todos los botones y secciones
                tabButtons.forEach(btn => btn.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                // Agregar la clase 'active' al botón clickeado y a la sección correspondiente
                button.classList.add('active');
                const targetSection = this.querySelector(`#section-${targetTab}`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
        
        // Configurar el botón de cerrar sesión
        const logoutBtn = this.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('current-user');
                window.location.hash = '#/login';
            });
        }
    }
    render() {
        this.innerHTML = `
        <div class="admin-view">
            <header class="admin-header">
                <div class="admin-header-content">
                    <div class="admin-logo-section">
                        <img src="/logo.png" alt="ABC Educate Logo" class="admin-logo">
                        <div class="admin-title-section">
                            <h1 class="admin-title">Panel de Administración</h1>
                            <p class="admin-subtitle">Gestión de docentes, cursos y administrativos</p>
                        </div>
                    </div>
                    <button class="btn-logout" id="logoutBtn">
                        <span class="material-icons">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <nav class="admin-tabs">
                <button class="tab-button active" data-tab="docentes">
                    <span class="material-icons">school</span>
                    Docentes
                </button>
                <button class="tab-button" data-tab="cursos">
                    <span class="material-icons">book</span>
                    Cursos
                </button>
                <button class="tab-button" data-tab="administrativos">
                    <span class="material-icons">admin_panel_settings</span>
                    Administrativos
                </button>
                <button class="tab-button" data-tab="credenciales">
                    <span class="material-icons">lock</span>
                    Credenciales
                </button>
            </nav>

            <main class="admin-main">
                <!-- Sección Docentes -->
                <section class="admin-section active" id="section-docentes">
                    <div class="section-header">
                        <h2 class="section-title">Gestión de Docentes</h2>
                        <button class="btn-primary" id="btn-add-docente">
                            <span class="material-icons">add</span>
                            Agregar Docente
                        </button>
                    </div>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Área Académica</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="docentes-table-body">
                                <tr>
                                    <td colspan="5" class="empty-state">No hay docentes registrados</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Sección Cursos -->
                <section class="admin-section" id="section-cursos">
                    <div class="section-header">
                        <h2 class="section-title">Gestión de Cursos</h2>
                        <button class="btn-primary" id="btn-add-curso">
                            <span class="material-icons">add</span>
                            Agregar Curso
                        </button>
                    </div>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Docente</th>
                                    <th>Módulos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="cursos-table-body">
                                <tr>
                                    <td colspan="5" class="empty-state">No hay cursos registrados</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Vista detallada de Módulos y Lecciones -->
                    <div class="course-detail-container" id="course-detail-container" style="display: none;">
                        <div class="course-detail-header">
                            <button class="btn-back" id="btn-back-courses">
                                <span class="material-icons">arrow_back</span>
                                Volver a Cursos
                            </button>
                            <h3 class="course-detail-title" id="course-detail-title">Detalle del Curso</h3>
                        </div>
                        
                        <div class="modules-container" id="modules-container">
                            <!-- Template de Módulo -->
                            <!--
                            <div class="module-card">
                                <div class="module-header">
                                    <div class="module-header-content">
                                        <div class="module-icon">
                                            <span class="material-icons">menu_book</span>
                                        </div>
                                        <div class="module-title-section">
                                            <h4 class="module-title">Nombre del Módulo</h4>
                                            <p class="module-info">X lecciones</p>
                                        </div>
                                    </div>
                                    <div class="module-actions">
                                        <button class="btn-action edit" title="Editar módulo">
                                            <span class="material-icons">edit</span>
                                        </button>
                                        <button class="btn-action delete" title="Eliminar módulo">
                                            <span class="material-icons">delete</span>
                                        </button>
                                        <button class="module-toggle" title="Expandir/Contraer">
                                            <span class="material-icons">expand_more</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="module-content">
                                    <p class="module-description">Descripción del módulo</p>
                                    <div class="lessons-header">
                                        <h5 class="lessons-title">
                                            <span class="material-icons">article</span>
                                            Lecciones
                                        </h5>
                                        <button class="btn-add-lesson">
                                            <span class="material-icons">add</span>
                                            Agregar Lección
                                        </button>
                                    </div>
                                    <table class="lessons-table">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Archivo/Enlace</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div class="lesson-name">Nombre de la lección</div>
                                                </td>
                                                <td>
                                                    <div class="lesson-description">Descripción de la lección</div>
                                                </td>
                                                <td>
                                                    <a href="#" target="_blank" class="lesson-link">
                                                        <span class="material-icons">link</span>
                                                        Ver recurso
                                                    </a>
                                                </td>
                                                <td>
                                                    <div class="action-buttons">
                                                        <button class="btn-action edit" title="Editar lección">
                                                            <span class="material-icons">edit</span>
                                                        </button>
                                                        <button class="btn-action delete" title="Eliminar lección">
                                                            <span class="material-icons">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            -->
                        </div>
                    </div>
                </section>

                <!-- Sección Administrativos -->
                <section class="admin-section" id="section-administrativos">
                    <div class="section-header">
                        <h2 class="section-title">Gestión de Administrativos</h2>
                        <button class="btn-primary" id="btn-add-administrativo">
                            <span class="material-icons">add</span>
                            Agregar Administrativo
                        </button>
                    </div>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Identificación</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Cargo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="administrativos-table-body">
                                <tr>
                                    <td colspan="5" class="empty-state">No hay administrativos registrados</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Sección Credenciales -->
                <section class="admin-section" id="section-credenciales">
                    <div class="section-header">
                        <h2 class="section-title">Gestión de Credenciales</h2>
                        <button class="btn-primary" id="btn-add-credencial">
                            <span class="material-icons">add</span>
                            Agregar Credencial
                        </button>
                    </div>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="credenciales-table-body">
                                <tr>
                                    <td colspan="3" class="empty-state">No hay credenciales registradas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
        `;
    }
    validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.hash = '#/login';
        }
    }
    createDocentes() {
        const docentes = loadData('docentes');
        if (!docentes) {
            initializeData('docentes', []);
        }
    }
}

customElements.define('admin-view', AdminView);
export default AdminView;

