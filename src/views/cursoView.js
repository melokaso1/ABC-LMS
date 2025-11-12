import { getData } from '../utils/storage.js';
import '../styles/cursoView.css';

class CursoView extends HTMLElement {
    constructor() {
        super();
        this.cursoId = null;
    }
    
    connectedCallback() {
        // Obtener el ID del curso de la URL
        const hash = window.location.hash;
        const match = hash.match(/\/curso\/([^\/]+)/);
        this.cursoId = match ? match[1] : null;
        
        this.render();
        this.setupEventListeners();
    }
    
    scrollToModule(moduleCard) {
        if (!moduleCard) return;
        
        const moduleRect = moduleCard.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollOffset = 100; // Espacio desde la parte superior
        
        // Calcular la posición del scroll
        const scrollPosition = window.pageYOffset + moduleRect.top - scrollOffset;
        
        // Hacer scroll suave
        window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth'
        });
    }
    
    setupEventListeners() {
        // Botón de volver
        const backBtn = this.querySelector('#btn-back');
        if (backBtn) {
            // Remover listener anterior si existe
            backBtn.replaceWith(backBtn.cloneNode(true));
            const newBackBtn = this.querySelector('#btn-back');
            newBackBtn.addEventListener('click', () => {
                window.location.hash = '#/public';
            });
        }
        
        // Toggle de módulos - usar delegación de eventos para evitar duplicados
        const modulesContainer = this.querySelector('.modules-container');
        if (modulesContainer) {
            // Remover listeners anteriores
            const newContainer = modulesContainer.cloneNode(true);
            modulesContainer.replaceWith(newContainer);
            
            // Agregar listener al contenedor usando delegación
            newContainer.addEventListener('click', (e) => {
                // Si se hace click en el header o en el toggle button
                const moduleHeader = e.target.closest('.module-header');
                const toggleButton = e.target.closest('.module-toggle');
                
                if (moduleHeader || toggleButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const moduleCard = (moduleHeader || toggleButton).closest('.module-card');
                    if (moduleCard) {
                        const wasExpanded = moduleCard.classList.contains('expanded');
                        moduleCard.classList.toggle('expanded');
                        const isNowExpanded = moduleCard.classList.contains('expanded');
                        
                        // Si se acaba de expandir, hacer scroll automático
                        if (!wasExpanded && isNowExpanded) {
                            // Esperar un poco para que la animación comience
                            setTimeout(() => {
                                this.scrollToModule(moduleCard);
                            }, 150);
                        }
                    }
                }
            });
        }
    }
    
    render() {
        const appData = getData('app-data');
        if (!appData || !appData.cursos) {
            this.innerHTML = `
                <div class="curso-view">
                    <div class="error-message">
                        <p>No se encontraron cursos disponibles</p>
                        <a href="#/public" class="btn-back">Volver</a>
                    </div>
                </div>
            `;
            return;
        }
        
        const curso = appData.cursos.find(c => c.id === this.cursoId);
        if (!curso) {
            this.innerHTML = `
                <div class="curso-view">
                    <div class="error-message">
                        <p>Curso no encontrado</p>
                        <a href="#/public" class="btn-back">Volver a cursos</a>
                    </div>
                </div>
            `;
            return;
        }
        
        // Buscar información del docente
        const docente = appData.docentes?.find(d => d.email === curso.docente);
        
        this.innerHTML = `
            <div class="curso-view">
                <header class="curso-header">
                    <button class="btn-back" id="btn-back">
                        <span class="material-icons">arrow_back</span>
                        Volver a Cursos
                    </button>
                    <div class="curso-header-content">
                        <div class="curso-title-section">
                            <h1 class="curso-title">${curso.nombre}</h1>
                            <p class="curso-codigo">Código: ${curso.codigo}</p>
                        </div>
                        ${docente ? `
                        <div class="curso-instructor">
                            ${docente.fotoUrl ? `<img src="${docente.fotoUrl}" alt="${docente.nombres}" class="instructor-photo">` : ''}
                            <div class="instructor-info">
                                <p class="instructor-name">${docente.nombres} ${docente.apellidos}</p>
                                <p class="instructor-area">${docente.areaAcademica}</p>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </header>
                
                <main class="curso-main">
                    <div class="curso-content">
                        <section class="curso-description">
                            <h2>Descripción del Curso</h2>
                            <p>${curso.descripcion}</p>
                        </section>
                        
                        <section class="curso-modules">
                            <div class="section-header">
                                <h2>Módulos y Lecciones</h2>
                                <p class="modules-count">${curso.modulos?.length || 0} módulos disponibles</p>
                            </div>
                            
                            ${curso.modulos && curso.modulos.length > 0 ? `
                                <div class="modules-container">
                                    ${curso.modulos.map((modulo, index) => `
                                        <div class="module-card">
                                            <div class="module-header">
                                                <div class="module-header-content">
                                                    <div class="module-icon">
                                                        <span class="material-icons">menu_book</span>
                                                    </div>
                                                    <div class="module-title-section">
                                                        <h3 class="module-title">Módulo ${index + 1}: ${modulo.nombre}</h3>
                                                        <p class="module-info">
                                                            <span class="material-icons" style="font-size: 16px;">article</span>
                                                            ${modulo.lecciones?.length || 0} lecciones
                                                        </p>
                                                    </div>
                                                </div>
                                                <button class="module-toggle" type="button" aria-label="Expandir/Contraer módulo">
                                                    <span class="material-icons">expand_more</span>
                                                </button>
                                            </div>
                                            <div class="module-content">
                                                ${modulo.descripcion ? `
                                                    <div class="module-description-wrapper">
                                                        <h4 class="module-description-title">
                                                            <span class="material-icons">description</span>
                                                            Descripción del Módulo
                                                        </h4>
                                                        <p class="module-description">${modulo.descripcion}</p>
                                                    </div>
                                                ` : ''}
                                                
                                                ${modulo.lecciones && modulo.lecciones.length > 0 ? `
                                                    <div class="lessons-container">
                                                        <h4 class="lessons-title">
                                                            <span class="material-icons">article</span>
                                                            Lecciones
                                                        </h4>
                                                        <div class="lessons-grid">
                                                            ${modulo.lecciones.map((leccion, lecIndex) => `
                                                                <div class="lesson-card">
                                                                    <div class="lesson-number">${lecIndex + 1}</div>
                                                                    <div class="lesson-content">
                                                                        <h5 class="lesson-title">${leccion.nombre}</h5>
                                                                        ${leccion.descripcion ? `<p class="lesson-description">${leccion.descripcion}</p>` : ''}
                                                                        ${leccion.archivo ? `
                                                                            <a href="${leccion.archivo}" target="_blank" class="lesson-link" rel="noopener noreferrer">
                                                                                <span class="material-icons">link</span>
                                                                                Ver recurso
                                                                            </a>
                                                                        ` : ''}
                                                                    </div>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                ` : '<p class="no-lessons">Este módulo aún no tiene lecciones disponibles.</p>'}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<p class="no-modules">Este curso aún no tiene módulos disponibles.</p>'}
                        </section>
                    </div>
                    
                    <aside class="curso-sidebar">
                        <div class="sidebar-card">
                            <h3>Información del Curso</h3>
                            <ul class="course-info-list">
                                <li>
                                    <span class="material-icons">tag</span>
                                    <div>
                                        <strong>ID:</strong>
                                        <span>${curso.id}</span>
                                    </div>
                                </li>
                                <li>
                                    <span class="material-icons">code</span>
                                    <div>
                                        <strong>Código:</strong>
                                        <span>${curso.codigo}</span>
                                    </div>
                                </li>
                                <li>
                                    <span class="material-icons">library_books</span>
                                    <div>
                                        <strong>Módulos:</strong>
                                        <span>${curso.modulos?.length || 0}</span>
                                    </div>
                                </li>
                                <li>
                                    <span class="material-icons">article</span>
                                    <div>
                                        <strong>Total Lecciones:</strong>
                                        <span>${curso.modulos?.reduce((total, mod) => total + (mod.lecciones?.length || 0), 0) || 0}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        ${docente ? `
                        <div class="sidebar-card">
                            <h3>Instructor</h3>
                            <div class="sidebar-instructor">
                                ${docente.fotoUrl ? `<img src="${docente.fotoUrl}" alt="${docente.nombres}" class="sidebar-instructor-photo">` : ''}
                                <div class="sidebar-instructor-info">
                                    <p class="sidebar-instructor-name">${docente.nombres} ${docente.apellidos}</p>
                                    <p class="sidebar-instructor-area">${docente.areaAcademica}</p>
                                    <p class="sidebar-instructor-email">${docente.email}</p>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="sidebar-card">
                            <a href="#/login" class="btn-enroll">
                                <span class="material-icons">school</span>
                                Comprar Curso
                            </a>
                        </div>
                    </aside>
                </main>
            </div>
        `;
        
        // Re-setup event listeners después de renderizar
        this.setupEventListeners();
    }
}

customElements.define('curso-view', CursoView);
export default CursoView;

