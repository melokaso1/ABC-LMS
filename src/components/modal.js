import '../styles/modal.css';

class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this.hashChangeHandler = null;
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setupHashChangeListener();
    }
    
    disconnectedCallback() {
        // Limpiar el listener cuando el componente se desconecta
        if (this.hashChangeHandler) {
            window.removeEventListener('hashchange', this.hashChangeHandler);
        }
    }
    
    setupHashChangeListener() {
        // Cerrar el modal cuando cambie la ruta
        this.hashChangeHandler = () => {
            if (this.isOpen()) {
                this.close();
            }
        };
        window.addEventListener('hashchange', this.hashChangeHandler);
    }
    
    setupEventListeners() {
        // Cerrar al hacer click en el overlay
        const overlay = this.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close();
                }
            });
        }
        
        // Cerrar con el botón X
        const closeBtn = this.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }
    
    open() {
        this.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    isOpen() {
        return this.style.display === 'flex';
    }
    
    renderModulos(modulos) {
        if (!modulos || modulos.length === 0) {
            return '<p class="no-modulos">Este curso aún no tiene módulos disponibles.</p>';
        }
        
        return `
            <div class="carousel-container">
                <div class="carousel-wrapper">
                    <div class="carousel-track" data-total="${modulos.length}">
                        ${modulos.map((modulo, index) => `
                            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <div class="modulo-item">
                                    <div class="modulo-header">
                                        <span class="modulo-number">Módulo ${index + 1}</span>
                                        <div class="modulo-title-wrapper">
                                            <h4 class="modulo-title">${modulo.nombre || `Módulo ${index + 1}`}</h4>
                                            ${modulo.descripcion ? `<p class="modulo-descripcion">${modulo.descripcion}</p>` : ''}
                                        </div>
                                    </div>
                                    ${modulo.lecciones && modulo.lecciones.length > 0 ? `
                                        <ul class="lecciones-list">
                                            ${modulo.lecciones.map((leccion, lecIndex) => `
                                                <li class="leccion-item">
                                                    <div class="leccion-content">
                                                        <span class="leccion-number">${lecIndex + 1}.</span>
                                                        <div class="leccion-info">
                                                            <span class="leccion-title">${leccion.nombre || `Lección ${lecIndex + 1}`}</span>
                                                            ${leccion.descripcion ? `<p class="leccion-descripcion">${leccion.descripcion}</p>` : ''}
                                                        </div>
                                                    </div>
                                                    ${leccion.archivo ? `
                                                        <a href="${leccion.archivo}" target="_blank" class="leccion-link">
                                                            Ver documentación
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                                            </svg>
                                                        </a>
                                                    ` : ''}
                                                </li>
                                            `).join('')}
                                        </ul>
                                    ` : '<p class="no-lecciones">Sin lecciones disponibles</p>'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn carousel-prev" aria-label="Módulo anterior">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div class="carousel-indicators">
                        ${modulos.map((_, index) => `
                            <button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Módulo ${index + 1}"></button>
                        `).join('')}
                    </div>
                    <button class="carousel-btn carousel-next" aria-label="Siguiente módulo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupCarousel() {
        const carouselTrack = this.querySelector('.carousel-track');
        if (!carouselTrack) return;
        
        const slides = carouselTrack.querySelectorAll('.carousel-slide');
        const prevBtn = this.querySelector('.carousel-prev');
        const nextBtn = this.querySelector('.carousel-next');
        const indicators = this.querySelectorAll('.carousel-indicator');
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };
        
        const nextSlide = () => {
            const next = (currentIndex + 1) % totalSlides;
            showSlide(next);
        };
        
        const prevSlide = () => {
            const prev = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(prev);
        };
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showSlide(index));
        });
    }
    
    setContent(curso, docente) {
        const modalContent = this.querySelector('.modal-content');
        if (!modalContent) return;
        
        modalContent.innerHTML = `
            <button class="modal-close" aria-label="Cerrar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="modal-header">
                <h2>${curso.nombre}</h2>
                <span class="modal-codigo">${curso.codigo}</span>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h3>Descripción</h3>
                    <p>${curso.descripcion}</p>
                </div>
                ${docente ? `
                <div class="modal-section">
                    <h3>Instructor</h3>
                    <div class="modal-instructor">
                        ${docente.fotoUrl ? `<img src="${docente.fotoUrl}" alt="${docente.nombres}" class="instructor-photo">` : ''}
                        <div class="instructor-info">
                            <p class="instructor-name">${docente.nombres} ${docente.apellidos}</p>
                            <p class="instructor-area">${docente.areaAcademica}</p>
                            <p class="instructor-email">${docente.email}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
                <div class="modal-section">
                    <h3>Detalles del Curso</h3>
                    <ul class="modal-details">
                        <li><strong>ID:</strong> ${curso.id}</li>
                        <li><strong>Código:</strong> ${curso.codigo}</li>
                        <li><strong>Módulos:</strong> ${curso.modulos?.length || 0} módulos disponibles</li>
                    </ul>
                </div>
                <div class="modal-section">
                    <button class="toggle-modulos" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show')">
                        <span>Módulos y Lecciones</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="modulos-content">
                        ${this.renderModulos(curso.modulos || [])}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('modal-component').close()">Cerrar</button>
                <a href="#/login" class="btn-primary">Comprar Curso</a>
            </div>
        `;
        
        // Re-setup event listeners después de cambiar el contenido
        this.setupEventListeners();
        // Configurar el carrusel
        this.setupCarousel();
    }
    
    render() {
        this.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <!-- El contenido se establece dinámicamente -->
                </div>
            </div>
        `;
        this.style.display = 'none';
    }
}

customElements.define('modal-component', ModalComponent);
export default ModalComponent;

