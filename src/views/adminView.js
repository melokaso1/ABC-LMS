import '../styles/adminView.css';
import { loadData, saveData } from '../utils/storage.js';

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
        this.crudCredenciales();
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
                    
                    // Cargar datos según la tab activa
                    setTimeout(() => {
                        if (targetTab === 'docentes') {
                            this.loadDocentes();
                            this.setupDocentesButtons();
                        } else if (targetTab === 'cursos') {
                            this.loadCursos();
                            this.setupCursosButtons();
                        } else if (targetTab === 'administrativos') {
                            this.loadAdministrativos();
                            this.setupAdministrativosButtons();
                        } else if (targetTab === 'credenciales') {
                            this.loadCredenciales();
                            this.setupCredencialButtons();
                        }
                    }, 50);
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
                    <div class="admin-header-actions">
                        <a href="#/dashboard" class="btn-dashboard">
                            <span class="material-icons">dashboard</span>
                            Dashboard
                        </a>
                        <button class="btn-logout" id="logoutBtn">
                            <span class="material-icons">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
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
    crudDocentes() {
        setTimeout(() => {
            this.loadDocentes();
            this.setupDocentesButtons();
        }, 100);
    }
    
    crudCursos() {
        setTimeout(() => {
            this.loadCursos();
            this.setupCursosButtons();
        }, 100);
    }
    
    crudAdmins() {
        setTimeout(() => {
            this.loadAdministrativos();
            this.setupAdministrativosButtons();
        }, 100);
    }
    
    // ========== DOCENTES ==========
    loadDocentes() {
        const data = loadData();
        const docentes = data?.docentes || [];
        const tableBody = this.querySelector('#docentes-table-body');
        
        if (!tableBody) return;
        
        if (docentes.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">No hay docentes registrados</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = docentes.map((docente, index) => `
            <tr>
                <td>${docente.codigo || 'N/A'}</td>
                <td>${docente.nombres} ${docente.apellidos}</td>
                <td>${docente.email}</td>
                <td>${docente.areaAcademica || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" data-index="${index}" title="Editar">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="btn-action delete" data-index="${index}" title="Eliminar">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.attachDocentesListeners(docentes);
    }
    
    setupDocentesButtons() {
        const btnAdd = this.querySelector('#btn-add-docente');
        if (btnAdd) {
            const newBtn = btnAdd.cloneNode(true);
            btnAdd.replaceWith(newBtn);
            newBtn.addEventListener('click', () => this.showDocenteModal());
        }
    }
    
    attachDocentesListeners(docentes) {
        const tableBody = this.querySelector('#docentes-table-body');
        tableBody.querySelectorAll('.btn-action.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.showDocenteModal(docentes[index], index);
            });
        });
        
        tableBody.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.deleteDocente(index);
            });
        });
    }
    
    showDocenteModal(docente = null, index = null) {
        const modal = document.createElement('dialog');
        modal.className = 'credential-modal';
        modal.innerHTML = `
            <div class="modal-content-credential">
                <div class="modal-header-credential">
                    <h3>${docente ? 'Editar Docente' : 'Agregar Docente'}</h3>
                    <button class="modal-close-credential" type="button">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form class="credential-form" id="docenteForm">
                    <div class="form-group-credential">
                        <label>Código</label>
                        <input type="text" name="codigo" value="${docente?.codigo || ''}" required placeholder="D101" />
                    </div>
                    <div class="form-group-credential">
                        <label>Nombres</label>
                        <input type="text" name="nombres" value="${docente?.nombres || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Apellidos</label>
                        <input type="text" name="apellidos" value="${docente?.apellidos || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Email</label>
                        <input type="email" name="email" value="${docente?.email || ''}" ${docente ? 'readonly' : 'required'} />
                    </div>
                    <div class="form-group-credential">
                        <label>Área Académica</label>
                        <input type="text" name="areaAcademica" value="${docente?.areaAcademica || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Foto URL</label>
                        <input type="url" name="fotoUrl" value="${docente?.fotoUrl || ''}" placeholder="https://..." />
                    </div>
                    <div class="modal-actions-credential">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-save">${docente ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        `;
        
        this.setupModalClose(modal);
        modal.querySelector('#docenteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const docenteData = {
                codigo: formData.get('codigo'),
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                email: formData.get('email'),
                areaAcademica: formData.get('areaAcademica'),
                fotoUrl: formData.get('fotoUrl') || docente?.fotoUrl || ''
            };
            
            if (docente) {
                this.updateDocente(index, docenteData);
            } else {
                this.addDocente(docenteData);
            }
            modal.close();
            modal.remove();
        });
        
        document.body.appendChild(modal);
        modal.showModal();
    }
    
    addDocente(docenteData) {
        const data = loadData();
        if (!data) return;
        if (!data.docentes) data.docentes = [];
        
        if (data.docentes.some(d => d.email === docenteData.email)) {
            alert('Este email ya está registrado');
            return;
        }
        
        data.docentes.push({
            ...docenteData,
            identificacion: `2001003${String(data.docentes.length + 1).padStart(3, '0')}`
        });
        
        saveData('app-data', data);
        this.loadDocentes();
    }
    
    updateDocente(index, docenteData) {
        const data = loadData();
        if (!data || !data.docentes) return;
        if (data.docentes[index]) {
            data.docentes[index] = { ...data.docentes[index], ...docenteData };
            saveData('app-data', data);
            this.loadDocentes();
        }
    }
    
    deleteDocente(index) {
        if (!confirm('¿Eliminar este docente?')) return;
        const data = loadData();
        if (!data || !data.docentes) return;
        data.docentes.splice(index, 1);
        saveData('app-data', data);
        this.loadDocentes();
    }
    
    // ========== ADMINISTRATIVOS ==========
    loadAdministrativos() {
        const data = loadData();
        const administrativos = data?.administrativos || [];
        const tableBody = this.querySelector('#administrativos-table-body');
        
        if (!tableBody) return;
        
        if (administrativos.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">No hay administrativos registrados</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = administrativos.map((admin, index) => `
            <tr>
                <td>${admin.identificacion || 'N/A'}</td>
                <td>${admin.nombres} ${admin.apellidos}</td>
                <td>${admin.email}</td>
                <td>${admin.cargo || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" data-index="${index}" title="Editar">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="btn-action delete" data-index="${index}" title="Eliminar">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.attachAdministrativosListeners(administrativos);
    }
    
    setupAdministrativosButtons() {
        const btnAdd = this.querySelector('#btn-add-administrativo');
        if (btnAdd) {
            const newBtn = btnAdd.cloneNode(true);
            btnAdd.replaceWith(newBtn);
            newBtn.addEventListener('click', () => this.showAdministrativoModal());
        }
    }
    
    attachAdministrativosListeners(administrativos) {
        const tableBody = this.querySelector('#administrativos-table-body');
        tableBody.querySelectorAll('.btn-action.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.showAdministrativoModal(administrativos[index], index);
            });
        });
        
        tableBody.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.deleteAdministrativo(index);
            });
        });
    }
    
    showAdministrativoModal(admin = null, index = null) {
        const modal = document.createElement('dialog');
        modal.className = 'credential-modal';
        modal.innerHTML = `
            <div class="modal-content-credential">
                <div class="modal-header-credential">
                    <h3>${admin ? 'Editar Administrativo' : 'Agregar Administrativo'}</h3>
                    <button class="modal-close-credential" type="button">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form class="credential-form" id="adminForm">
                    <div class="form-group-credential">
                        <label>Identificación</label>
                        <input type="text" name="identificacion" value="${admin?.identificacion || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Nombres</label>
                        <input type="text" name="nombres" value="${admin?.nombres || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Apellidos</label>
                        <input type="text" name="apellidos" value="${admin?.apellidos || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Email</label>
                        <input type="email" name="email" value="${admin?.email || ''}" ${admin ? 'readonly' : 'required'} />
                    </div>
                    <div class="form-group-credential">
                        <label>Teléfono</label>
                        <input type="tel" name="telefono" value="${admin?.telefono || ''}" />
                    </div>
                    <div class="form-group-credential">
                        <label>Cargo</label>
                        <input type="text" name="cargo" value="${admin?.cargo || ''}" required />
                    </div>
                    <div class="modal-actions-credential">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-save">${admin ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        `;
        
        this.setupModalClose(modal);
        modal.querySelector('#adminForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const adminData = {
                identificacion: formData.get('identificacion'),
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                cargo: formData.get('cargo')
            };
            
            if (admin) {
                this.updateAdministrativo(index, adminData);
            } else {
                this.addAdministrativo(adminData);
            }
            modal.close();
            modal.remove();
        });
        
        document.body.appendChild(modal);
        modal.showModal();
    }
    
    addAdministrativo(adminData) {
        const data = loadData();
        if (!data) return;
        if (!data.administrativos) data.administrativos = [];
        
        if (data.administrativos.some(a => a.email === adminData.email)) {
            alert('Este email ya está registrado');
            return;
        }
        
        data.administrativos.push(adminData);
        saveData('app-data', data);
        this.loadAdministrativos();
    }
    
    updateAdministrativo(index, adminData) {
        const data = loadData();
        if (!data || !data.administrativos) return;
        if (data.administrativos[index]) {
            data.administrativos[index] = { ...data.administrativos[index], ...adminData };
            saveData('app-data', data);
            this.loadAdministrativos();
        }
    }
    
    deleteAdministrativo(index) {
        if (!confirm('¿Eliminar este administrativo?')) return;
        const data = loadData();
        if (!data || !data.administrativos) return;
        data.administrativos.splice(index, 1);
        saveData('app-data', data);
        this.loadAdministrativos();
    }
    
    // ========== CURSOS ==========
    loadCursos() {
        const data = loadData();
        const cursos = data?.cursos || [];
        const tableBody = this.querySelector('#cursos-table-body');
        
        if (!tableBody) return;
        
        if (cursos.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">No hay cursos registrados</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = cursos.map((curso, index) => `
            <tr>
                <td>${curso.codigo || 'N/A'}</td>
                <td>${curso.nombre}</td>
                <td>${curso.docente || 'N/A'}</td>
                <td>${curso.modulos?.length || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" data-index="${index}" title="Editar">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="btn-action delete" data-index="${index}" title="Eliminar">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.attachCursosListeners(cursos);
    }
    
    setupCursosButtons() {
        const btnAdd = this.querySelector('#btn-add-curso');
        if (btnAdd) {
            const newBtn = btnAdd.cloneNode(true);
            btnAdd.replaceWith(newBtn);
            newBtn.addEventListener('click', () => this.showCursoModal());
        }
    }
    
    attachCursosListeners(cursos) {
        const tableBody = this.querySelector('#cursos-table-body');
        tableBody.querySelectorAll('.btn-action.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.showCursoModal(cursos[index], index);
            });
        });
        
        tableBody.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.deleteCurso(index);
            });
        });
    }
    
    showCursoModal(curso = null, index = null) {
        const data = loadData();
        const docentes = data?.docentes || [];
        const docenteOptions = docentes.map(d => 
            `<option value="${d.email}" ${curso?.docente === d.email ? 'selected' : ''}>${d.nombres} ${d.apellidos}</option>`
        ).join('');
        
        const modal = document.createElement('dialog');
        modal.className = 'credential-modal';
        modal.innerHTML = `
            <div class="modal-content-credential">
                <div class="modal-header-credential">
                    <h3>${curso ? 'Editar Curso' : 'Agregar Curso'}</h3>
                    <button class="modal-close-credential" type="button">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form class="credential-form" id="cursoForm">
                    <div class="form-group-credential">
                        <label>Código</label>
                        <input type="text" name="codigo" value="${curso?.codigo || ''}" required placeholder="C101" />
                    </div>
                    <div class="form-group-credential">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value="${curso?.nombre || ''}" required />
                    </div>
                    <div class="form-group-credential">
                        <label>Descripción</label>
                        <textarea name="descripcion" rows="3" required>${curso?.descripcion || ''}</textarea>
                    </div>
                    <div class="form-group-credential">
                        <label>Docente</label>
                        <select name="docente" required>
                            <option value="">Seleccione un docente</option>
                            ${docenteOptions}
                        </select>
                    </div>
                    <div class="modal-actions-credential">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-save">${curso ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        `;
        
        this.setupModalClose(modal);
        modal.querySelector('#cursoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const cursoData = {
                codigo: formData.get('codigo'),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                docente: formData.get('docente'),
                modulos: curso?.modulos || []
            };
            
            if (curso) {
                cursoData.id = curso.id;
                this.updateCurso(index, cursoData);
            } else {
                cursoData.id = `C${String((data?.cursos?.length || 0) + 1).padStart(3, '0')}`;
                this.addCurso(cursoData);
            }
            modal.close();
            modal.remove();
        });
        
        document.body.appendChild(modal);
        modal.showModal();
    }
    
    addCurso(cursoData) {
        const data = loadData();
        if (!data) return;
        if (!data.cursos) data.cursos = [];
        
        data.cursos.push(cursoData);
        saveData('app-data', data);
        this.loadCursos();
    }
    
    updateCurso(index, cursoData) {
        const data = loadData();
        if (!data || !data.cursos) return;
        if (data.cursos[index]) {
            data.cursos[index] = { ...data.cursos[index], ...cursoData };
            saveData('app-data', data);
            this.loadCursos();
        }
    }
    
    deleteCurso(index) {
        if (!confirm('¿Eliminar este curso?')) return;
        const data = loadData();
        if (!data || !data.cursos) return;
        data.cursos.splice(index, 1);
        saveData('app-data', data);
        this.loadCursos();
    }
    
    setupModalClose(modal) {
        const closeBtn = modal.querySelector('.modal-close-credential');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const closeModal = () => {
            modal.close();
            modal.remove();
        };
        
        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    crudCredenciales() {
        // Cargar credenciales inicialmente si la tab está activa
        setTimeout(() => {
            const credencialesSection = this.querySelector('#section-credenciales');
            if (credencialesSection && credencialesSection.classList.contains('active')) {
                this.loadCredenciales();
                this.setupCredencialButtons();
            }
        }, 100);
    }
    
    setupCredencialButtons() {
        // Botón agregar credencial
        const btnAdd = this.querySelector('#btn-add-credencial');
        if (btnAdd) {
            // Remover listener anterior si existe
            const newBtn = btnAdd.cloneNode(true);
            btnAdd.replaceWith(newBtn);
            newBtn.addEventListener('click', () => {
                this.showCredencialModal();
            });
        }
    }
    
    loadCredenciales() {
        const data = loadData();
        if (!data) {
            console.log('No hay datos en localStorage');
            return;
        }
        
        const credenciales = data.credenciales || [];
        const tableBody = this.querySelector('#credenciales-table-body');
        
        if (!tableBody) {
            console.log('No se encontró el tbody de credenciales');
            return;
        }
        
        console.log('Credenciales encontradas:', credenciales);
        
        if (credenciales.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">No hay credenciales registradas</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = credenciales.map((credencial, index) => `
            <tr>
                <td>${credencial.email}</td>
                <td>
                    <span class="badge-rol">${credencial.rol || 'N/A'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" data-index="${index}" title="Editar contraseña">
                            <span class="material-icons">lock</span>
                        </button>
                        <button class="btn-action delete" data-index="${index}" title="Eliminar credencial">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Event listeners para editar y eliminar
        tableBody.querySelectorAll('.btn-action.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.showEditPasswordModal(credenciales[index], index);
            });
        });
        
        tableBody.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.deleteCredencial(index);
            });
        });
    }
    
    showCredencialModal() {
        const modal = this.createCredencialModal('Agregar Nueva Credencial', null, null);
        document.body.appendChild(modal);
        modal.showModal();
    }
    
    showEditPasswordModal(credencial, index) {
        const modal = this.createCredencialModal('Editar Contraseña', credencial, index);
        document.body.appendChild(modal);
        modal.showModal();
    }
    
    createCredencialModal(title, credencial, index) {
        const modal = document.createElement('dialog');
        modal.className = 'credential-modal';
        modal.innerHTML = `
            <div class="modal-content-credential">
                <div class="modal-header-credential">
                    <h3>${title}</h3>
                    <button class="modal-close-credential" type="button">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form class="credential-form" id="credentialForm">
                    <div class="form-group-credential">
                        <label for="credential-email">Email</label>
                        <input 
                            type="email" 
                            id="credential-email" 
                            name="email" 
                            value="${credencial?.email || ''}"
                            ${credencial ? 'readonly' : 'required'}
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>
                    <div class="form-group-credential">
                        <label for="credential-password">Contraseña</label>
                        <input 
                            type="password" 
                            id="credential-password" 
                            name="password" 
                            required
                            placeholder="Ingrese la contraseña"
                            minlength="4"
                        />
                    </div>
                    <div class="form-group-credential">
                        <label for="credential-rol">Rol</label>
                        <select id="credential-rol" name="rol" required>
                            <option value="">Seleccione un rol</option>
                            <option value="administrativo" ${credencial?.rol === 'administrativo' ? 'selected' : ''}>Administrativo</option>
                            <option value="docente" ${credencial?.rol === 'docente' ? 'selected' : ''}>Docente</option>
                            <option value="estudiante" ${credencial?.rol === 'estudiante' ? 'selected' : ''}>Estudiante</option>
                        </select>
                    </div>
                    <div class="modal-actions-credential">
                        <button type="button" class="btn-cancel" id="btn-cancel-credential">Cancelar</button>
                        <button type="submit" class="btn-save">${credencial ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        `;
        
        // Cerrar modal
        const closeBtn = modal.querySelector('.modal-close-credential');
        const cancelBtn = modal.querySelector('#btn-cancel-credential');
        const closeModal = () => {
            modal.close();
            modal.remove();
        };
        
        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Submit form
        const form = modal.querySelector('#credentialForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');
            const rol = formData.get('rol');
            
            if (credencial) {
                // Editar contraseña
                this.updateCredencialPassword(index, password, rol);
            } else {
                // Agregar nueva credencial
                this.addCredencial(email, password, rol);
            }
            
            closeModal();
        });
        
        return modal;
    }
    
    addCredencial(email, password, rol) {
        const data = loadData();
        if (!data) return;
        
        if (!data.credenciales) {
            data.credenciales = [];
        }
        
        // Verificar si el email ya existe
        if (data.credenciales.some(c => c.email === email)) {
            alert('Este email ya está registrado');
            return;
        }
        
        data.credenciales.push({
            email,
            password,
            rol
        });
        
        saveData('app-data', data);
        this.loadCredenciales();
    }
    
    updateCredencialPassword(index, password, rol) {
        const data = loadData();
        if (!data || !data.credenciales) return;
        
        if (data.credenciales[index]) {
            data.credenciales[index].password = password;
            if (rol) {
                data.credenciales[index].rol = rol;
            }
            
            saveData('app-data', data);
            this.loadCredenciales();
        }
    }
    
    deleteCredencial(index) {
        if (!confirm('¿Está seguro de que desea eliminar esta credencial?')) {
            return;
        }
        
        const data = loadData();
        if (!data || !data.credenciales) return;
        
        data.credenciales.splice(index, 1);
        saveData('app-data', data);
        this.loadCredenciales();
    }
}

customElements.define('admin-view', AdminView);
export default AdminView;

