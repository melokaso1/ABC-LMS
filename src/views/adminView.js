import { renderDocentesTable, renderDocenteForm } from "../components/docentes.js";
import { renderCursosTable, renderCursoForm, renderModulosList, renderLeccionesList } from "../components/cursos.js";
import { renderAdministrativosTable, renderAdministrativoForm } from "../components/administrativos.js";

class AdminView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.afterRender();
  }

  render() {
    this.innerHTML = `
      <div class="terminal-admin">
        <div class="admin-terminal-header">
          <div class="terminal-prompt-line">
            <span class="prompt-user">admin@abc-educate</span>
            <span class="prompt-separator">:</span>
            <span class="prompt-path">~/admin</span>
            <span class="prompt-symbol">$</span>
            <span class="terminal-text"> system_management.sh</span>
          </div>
        </div>
        
        <div class="admin-terminal-content">
          <div class="terminal-output-section">
            <div class="output-header">
              <span class="output-prefix">[SYSTEM]</span>
              <span class="output-text">Panel de Administración - ABC Educate Terminal</span>
            </div>
            <div class="output-line">
              <span class="output-prefix">[INFO]</span>
              <span class="output-text">Gestión completa de docentes, cursos y administrativos del sistema.</span>
            </div>
          </div>
          
          <div class="admin-sections">
            <!-- Sección de Administrativos -->
            <div class="admin-section">
              <div class="section-header">
                <h2 class="section-title-terminal">
                  <span class="terminal-bracket">[</span>
                  GESTIÓN DE ADMINISTRATIVOS
                  <span class="terminal-bracket">]</span>
                </h2>
                <button id="admin-administrativos-add-btn" class="btn btn-primary terminal-action-btn">
                  <span class="btn-prefix">$</span>
                  CREAR_ADMINISTRATIVO
                  <span class="btn-suffix">→</span>
                </button>
              </div>
              
              <div id="admin-administrativos-table-container" class="admin-table-wrapper">
                <!-- Aquí se renderiza la tabla de administrativos -->
              </div>
              
              <div id="admin-administrativos-form-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza el formulario de administrativo -->
              </div>
            </div>
            
            <!-- Sección de Docentes -->
            <div class="admin-section">
              <div class="section-header">
                <h2 class="section-title-terminal">
                  <span class="terminal-bracket">[</span>
                  GESTIÓN DE DOCENTES
                  <span class="terminal-bracket">]</span>
                </h2>
                <button id="admin-docentes-add-btn" class="btn btn-primary terminal-action-btn">
                  <span class="btn-prefix">$</span>
                  CREAR_DOCENTE
                  <span class="btn-suffix">→</span>
                </button>
              </div>
              
              <div id="admin-docentes-table-container" class="admin-table-wrapper">
                <!-- Aquí se renderiza la tabla de docentes -->
              </div>
              
              <div id="admin-docentes-form-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza el formulario de docente -->
              </div>
            </div>
            
            <!-- Sección de Cursos -->
            <div class="admin-section">
              <div class="section-header">
                <h2 class="section-title-terminal">
                  <span class="terminal-bracket">[</span>
                  GESTIÓN DE CURSOS
                  <span class="terminal-bracket">]</span>
                </h2>
                <button id="admin-cursos-add-btn" class="btn btn-primary terminal-action-btn">
                  <span class="btn-prefix">$</span>
                  CREAR_CURSO
                  <span class="btn-suffix">→</span>
                </button>
              </div>
              
              <div id="admin-cursos-table-container" class="admin-table-wrapper">
                <!-- Aquí se renderiza la tabla de cursos -->
              </div>
              
              <div id="admin-cursos-form-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza el formulario de curso -->
              </div>
              
              <!-- Contenedores para módulos y lecciones -->
              <div id="modulos-list-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza la lista de módulos -->
              </div>
              
              <div id="modulos-form-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza el formulario de módulo -->
              </div>
              
              <div id="lecciones-list-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza la lista de lecciones -->
              </div>
              
              <div id="leccion-form-container" class="terminal-form-container" style="display:none;">
                <!-- Aquí se renderiza el formulario de lección -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      admin-view {
        display: block;
        width: 100%;
        min-height: 100vh;
        background: var(--terminal-bg);
        font-family: var(--font-terminal);
      }
      
      .terminal-admin {
        width: 100%;
        min-height: 100vh;
        padding: 2rem;
      }
      
      .admin-terminal-header {
        border-bottom: 2px solid var(--terminal-border);
        padding-bottom: 1rem;
        margin-bottom: 2rem;
      }
      
      .terminal-prompt-line {
        color: var(--terminal-text);
        font-size: 0.875rem;
        letter-spacing: 1px;
      }
      
      .prompt-user {
        color: var(--terminal-accent);
        font-weight: 600;
      }
      
      .prompt-separator {
        color: var(--terminal-text-dim);
      }
      
      .prompt-path {
        color: var(--terminal-success);
        font-weight: 600;
      }
      
      .prompt-symbol {
        color: var(--terminal-text);
        margin: 0 0.5rem;
      }
      
      .admin-terminal-content {
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .terminal-output-section {
        margin-bottom: 3rem;
        padding: 1.5rem;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        border-left: 4px solid var(--terminal-text);
      }
      
      .output-header {
        margin-bottom: 1rem;
        font-size: 1rem;
        font-weight: 700;
      }
      
      .output-prefix {
        color: var(--terminal-accent);
        font-weight: 600;
        margin-right: 0.75rem;
      }
      
      .output-text {
        color: var(--terminal-text);
      }
      
      .output-line {
        font-size: 0.875rem;
        color: var(--terminal-text-dim);
      }
      
      .admin-sections {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        width: 100%;
      }
      
      .admin-section {
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        padding: 2rem;
        border-radius: 8px;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--terminal-border);
      }
      
      .section-title-terminal {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--terminal-accent);
        text-shadow: var(--glow-blue);
        letter-spacing: 2px;
        margin: 0;
      }
      
      .terminal-bracket {
        color: var(--terminal-text);
        margin: 0 0.5rem;
      }
      
      .terminal-action-btn {
        font-size: 0.875rem;
        padding: 0.75rem 1.5rem;
      }
      
      .admin-table-wrapper {
        margin-bottom: 2rem;
        overflow-x: auto;
        width: 100%;
        flex: 1;
      }
      
      .admin-section > * {
        width: 100%;
      }
      
      .terminal-form-container {
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        padding: 2rem;
        margin-top: 2rem;
        animation: fadeIn 0.2s ease-out;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @media (max-width: 768px) {
        .terminal-admin {
          padding: 1rem;
        }
        
        .admin-section {
          padding: 1.5rem;
        }
        
        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .section-title-terminal {
          font-size: 1rem;
        }
        
        .admin-table-wrapper {
          overflow-x: scroll;
        }
      }
      
      @media (max-width: 480px) {
        .terminal-admin {
          padding: 0.5rem;
        }
        
        .admin-section {
          padding: 1rem;
        }
        
        .terminal-output-section {
          padding: 1rem;
        }
      }
    `;
    this.appendChild(style);
  }

  afterRender() {
    // Administrativos
    const administrativosTableContainer = this.querySelector('#admin-administrativos-table-container');
    const administrativosFormContainer = this.querySelector('#admin-administrativos-form-container');
    const administrativosAddBtn = this.querySelector('#admin-administrativos-add-btn');

    if (administrativosTableContainer) {
      renderAdministrativosTable(administrativosTableContainer);
    }

    if (administrativosAddBtn) {
      administrativosAddBtn.onclick = () => {
        if (administrativosTableContainer) {
          renderAdministrativoForm(administrativosTableContainer, null);
        }
      };
    }

    // Docentes
    const docentesTableContainer = this.querySelector('#admin-docentes-table-container');
    const docentesFormContainer = this.querySelector('#admin-docentes-form-container');
    const docentesAddBtn = this.querySelector('#admin-docentes-add-btn');

    if (docentesTableContainer) {
      renderDocentesTable(docentesTableContainer);
    }

    if (docentesAddBtn) {
      docentesAddBtn.onclick = () => {
        // Usar modal para crear docente
        const tableContainer = this.querySelector('#admin-docentes-table-container');
        if (typeof showDocenteFormModal === 'function') {
          // Importar la función si no está disponible
          import('../components/docentes.js').then(module => {
            // La función showDocenteFormModal es interna, usar renderDocenteForm que ahora usa modal
            if (docentesFormContainer) {
              renderDocenteForm(docentesFormContainer, null);
            }
          });
        } else {
          // Usar renderDocenteForm que ahora detecta admin view y usa modal
          if (docentesFormContainer) {
            renderDocenteForm(docentesFormContainer, null);
          }
        }
      };
    }

    // Cursos
    const cursosTableContainer = this.querySelector('#admin-cursos-table-container');
    const cursosFormContainer = this.querySelector('#admin-cursos-form-container');
    const cursosAddBtn = this.querySelector('#admin-cursos-add-btn');

    if (cursosTableContainer) {
      renderCursosTable(cursosTableContainer);
    }

    if (cursosAddBtn) {
      cursosAddBtn.onclick = () => {
        // Usar modal para crear curso
        if (typeof renderCursoForm === 'function') {
          renderCursoForm(cursosFormContainer, null);
        }
      };
    }
    
    // Actualizar tabla de cursos cuando cambien los docentes
    // Esto se maneja cuando se renderiza la tabla de cursos
  }
}

customElements.define('admin-view', AdminView);

export function renderAdminView(container = document.body) {
  const view = document.createElement('admin-view');
  if (container) {
    container.innerHTML = '';
    container.appendChild(view);
  }
}
