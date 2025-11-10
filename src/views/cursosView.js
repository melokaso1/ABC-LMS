import { renderCursosTable, renderCursoForm } from "../components/cursos.js";

class CursosView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.afterRender();
  }

  render() {
    this.innerHTML = `
      <div class="terminal-cursos">
        <div class="cursos-terminal-header">
          <div class="terminal-prompt-line">
            <span class="prompt-user">admin@abc-educate</span>
            <span class="prompt-separator">:</span>
            <span class="prompt-path">~/cursos</span>
            <span class="prompt-symbol">$</span>
            <span class="terminal-text"> manage_cursos.sh</span>
          </div>
        </div>
        
        <div class="cursos-terminal-content">
          <div class="terminal-output-section">
            <div class="output-header">
              <span class="output-prefix">[SYSTEM]</span>
              <span class="output-text">Gestión de Cursos - ABC Educate Terminal</span>
            </div>
          </div>
          
          <div class="cursos-actions-header">
            <h2 class="section-title-terminal">
              <span class="terminal-bracket">[</span>
              CURSOS REGISTRADOS
              <span class="terminal-bracket">]</span>
            </h2>
            <button id="cursos-add-btn" class="btn btn-primary terminal-action-btn">
              <span class="btn-prefix">$</span>
              CREAR_CURSO
              <span class="btn-suffix">→</span>
            </button>
          </div>
          
          <div id="cursos-table-container" class="cursos-table-wrapper">
            <!-- Aquí se renderiza la tabla de cursos -->
          </div>
          
          <div id="cursos-form-container" class="terminal-form-container" style="display:none;">
            <!-- Aquí se renderiza el formulario de curso -->
          </div>
        </div>
      </div>
    `;

    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      cursos-view {
        display: block;
        width: 100%;
        min-height: 100vh;
        background: var(--terminal-bg);
        font-family: var(--font-terminal);
      }
      
      .terminal-cursos {
        width: 100%;
        min-height: 100vh;
        padding: 2rem;
      }
      
      .cursos-terminal-header {
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
      
      .cursos-terminal-content {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .terminal-output-section {
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        border-left: 4px solid var(--terminal-text);
      }
      
      .output-header {
        font-size: 0.875rem;
      }
      
      .output-prefix {
        color: var(--terminal-accent);
        font-weight: 600;
        margin-right: 0.75rem;
      }
      
      .output-text {
        color: var(--terminal-text);
      }
      
      .cursos-actions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .section-title-terminal {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--terminal-accent);
        text-shadow: var(--glow-blue);
        letter-spacing: 3px;
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
      
      .cursos-table-wrapper {
        margin-bottom: 2rem;
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
        .terminal-cursos {
          padding: 1rem;
        }
        
        .cursos-actions-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .section-title-terminal {
          font-size: 1.25rem;
        }
      }
    `;
    this.appendChild(style);
  }

  afterRender() {
    const tableContainer = this.querySelector('#cursos-table-container');
    const formContainer = this.querySelector('#cursos-form-container');
    const addBtn = this.querySelector('#cursos-add-btn');

    // Renderizar tabla inicial
    if (tableContainer) {
      renderCursosTable(tableContainer);
    }

    // Configurar botón de agregar
    if (addBtn) {
      addBtn.onclick = () => {
        if (formContainer) {
          formContainer.style.display = 'block';
          if (typeof renderCursoForm === 'function') {
            renderCursoForm(formContainer, null);
          }
        }
      };
    }

    // Verificar si hay parámetro ?nuevo=1 en la URL
    const hash = window.location.hash.replace('#', '') || '';
    const [path, queryString] = hash.split('?');
    const urlParams = new URLSearchParams(queryString || '');
    
    if (urlParams.get('nuevo') === '1' && formContainer) {
      formContainer.style.display = 'block';
      if (typeof renderCursoForm === 'function') {
        renderCursoForm(formContainer, null);
      }
    }
  }
}

customElements.define('cursos-view', CursosView);
