import { renderDocentesTable, renderDocenteForm } from "../components/docentes.js";

class DocentesView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.afterRender();
  }

  render() {
    this.innerHTML = `
      <div class="terminal-docentes">
        <div class="docentes-terminal-header">
          <div class="terminal-prompt-line">
            <span class="prompt-user">admin@abc-educate</span>
            <span class="prompt-separator">:</span>
            <span class="prompt-path">~/docentes</span>
            <span class="prompt-symbol">$</span>
            <span class="terminal-text"> manage_docentes.sh</span>
          </div>
        </div>
        
        <div class="docentes-terminal-content">
          <div class="terminal-output-section">
            <div class="output-header">
              <span class="output-prefix">[SYSTEM]</span>
              <span class="output-text">Gestión de Docentes - ABC Educate Terminal</span>
            </div>
          </div>
          
          <div class="docentes-actions-header">
            <h2 class="section-title-terminal">
              <span class="terminal-bracket">[</span>
              DOCENTES REGISTRADOS
              <span class="terminal-bracket">]</span>
            </h2>
            <button id="docentes-add-btn" class="btn btn-primary terminal-action-btn">
              <span class="btn-prefix">$</span>
              CREAR_DOCENTE
              <span class="btn-suffix">→</span>
            </button>
          </div>
          
          <div id="docentes-table-container" class="docentes-table-wrapper">
            <!-- Aquí se renderiza la tabla de docentes -->
          </div>
          
          <div id="docentes-form-container" class="terminal-form-container" style="display:none;">
            <!-- Aquí se renderiza el formulario de docente -->
          </div>
        </div>
      </div>
    `;

    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      docentes-view {
        display: block;
        width: 100%;
        min-height: 100vh;
        background: var(--terminal-bg);
        font-family: var(--font-terminal);
      }
      
      .terminal-docentes {
        width: 100%;
        min-height: 100vh;
        padding: 2rem;
      }
      
      .docentes-terminal-header {
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
      
      .docentes-terminal-content {
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
      
      .docentes-actions-header {
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
      
      .docentes-table-wrapper {
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
        .terminal-docentes {
          padding: 1rem;
        }
        
        .docentes-actions-header {
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
    const tableContainer = this.querySelector('#docentes-table-container');
    const formContainer = this.querySelector('#docentes-form-container');
    const addBtn = this.querySelector('#docentes-add-btn');

    // Renderizar tabla inicial
    if (tableContainer) {
      renderDocentesTable(tableContainer);
    }

    // Configurar botón de agregar
    if (addBtn) {
      addBtn.onclick = () => {
        if (formContainer) {
          formContainer.style.display = 'block';
          renderDocenteForm(formContainer, null);
        }
      };
    }

    // Verificar si hay parámetro ?nuevo=1 en la URL
    const hash = window.location.hash.replace('#', '') || '';
    const [path, queryString] = hash.split('?');
    const urlParams = new URLSearchParams(queryString || '');
    
    if (urlParams.get('nuevo') === '1' && formContainer) {
      formContainer.style.display = 'block';
      renderDocenteForm(formContainer, null);
    }
  }
}

customElements.define('docentes-view', DocentesView);

export function renderDocentesView(container = document.body) {
  const view = document.createElement('docentes-view');
  if (container) {
    container.innerHTML = '';
    container.appendChild(view);
  }
}
