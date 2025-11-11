import { getData } from '../utils/storage.js';
import '../styles/cursos.css';
import './modal.js';

class CursosComponent extends HTMLElement {
    constructor() {
        super();
        this.appData = null;
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const cursoCards = this.querySelectorAll('.curso-card');
        cursoCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.openModal(this.appData.cursos[index]);
            });
        });
    }
    
    openModal(curso) {
        // Buscar o crear el modal
        let modal = document.querySelector('modal-component');
        if (!modal) {
            modal = document.createElement('modal-component');
            document.body.appendChild(modal);
        }
        
        // Buscar información del docente
        const docente = this.appData.docentes?.find(d => d.email === curso.docente);
        
        // Establecer contenido y abrir
        modal.setContent(curso, docente);
        modal.open();
    }

    render() {
        this.appData = getData('app-data');
        if (!this.appData || !this.appData.cursos) {
            this.innerHTML = '<p>No hay cursos disponibles</p>';
            return;
        }
        
        const cursos = this.appData.cursos;
        this.innerHTML = `
            <h2>Cursos Disponibles</h2>
            <div class="cursos-container">
                ${cursos.map(curso => `
                    <div class="curso-card" data-curso-id="${curso.id}">
                        <h3>${curso.nombre}</h3>
                        <p class="curso-codigo">Código: ${curso.codigo}</p>
                        <p class="curso-descripcion">${curso.descripcion}</p>
                        <div class="curso-action">Ver detalles →</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('cursos-component', CursosComponent);
export default CursosComponent;