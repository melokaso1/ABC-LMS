import { renderCursosAcordeon } from "../components/cursos.js";
import { renderDocentesPublic } from "../components/docentes.js";

class PublicView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="terminal-view">
        <div class="terminal-header">
          <div class="terminal-prompt">
            <span class="prompt-user">user@abc-educate</span>
            <span class="prompt-separator">:</span>
            <span class="prompt-path">~/cursos</span>
            <span class="prompt-symbol">$</span>
            <span class="terminal-text"> cat catalogo.txt</span>
          </div>
        </div>
        
        <div class="terminal-content">
          <div class="terminal-output">
            <div class="output-line">
              <span class="output-prefix">[INFO]</span>
              <span class="output-text">Inicializando catálogo de cursos...</span>
            </div>
            <div class="output-line">
              <span class="output-prefix">[OK]</span>
              <span class="output-text">Sistema de cursos cargado correctamente</span>
            </div>
          </div>
          
          <div class="cursos-section">
            <h2 class="section-title-terminal">
              <span class="terminal-bracket">[</span>
              CATÁLOGO DE CURSOS
              <span class="terminal-bracket">]</span>
            </h2>
            <div id="public-cursos-acordeon" class="cursos-terminal-container"></div>
          </div>
          
          <div class="docentes-section">
            <h2 class="section-title-terminal">
              <span class="terminal-bracket">[</span>
              NUESTROS DOCENTES
              <span class="terminal-bracket">]</span>
            </h2>
            <div id="public-docentes-container" class="docentes-terminal-container"></div>
          </div>
          
          <div class="terminal-footer">
            <div class="terminal-command">
              <span class="command-prompt">></span>
              <a href="#/login" class="terminal-link">
                iniciar_sesion.exe
                <span class="link-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
    
    setTimeout(() => {
      const cursosContainer = this.querySelector('#public-cursos-acordeon');
      if (cursosContainer) {
        renderCursosAcordeon(cursosContainer);
      }
      
      const docentesContainer = this.querySelector('#public-docentes-container');
      if (docentesContainer) {
        renderDocentesPublic(docentesContainer);
      }
    }, 100);
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      public-view {
        display: block;
        width: 100%;
        min-height: 100vh;
        background: var(--terminal-bg);
      }
      
      .terminal-view {
        width: 100%;
        min-height: 100vh;
        padding: 2rem;
        font-family: var(--font-terminal);
      }
      
      .terminal-header {
        border-bottom: 2px solid var(--terminal-border);
        padding-bottom: 1rem;
        margin-bottom: 2rem;
      }
      
      .terminal-prompt {
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
      
      .terminal-content {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .terminal-output {
        margin-bottom: 3rem;
        padding: 1rem;
        background: var(--terminal-surface);
        border: 1px solid var(--terminal-border);
        border-left: 4px solid var(--terminal-text);
      }
      
      .output-line {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
      
      .output-prefix {
        color: var(--terminal-accent);
        font-weight: 600;
        margin-right: 1rem;
      }
      
      .output-text {
        color: var(--terminal-text-dim);
      }
      
      .cursos-section, .docentes-section {
        margin: 3rem 0;
        animation: fadeIn 0.2s ease-out;
      }
      
      .docentes-terminal-container {
        margin-top: 2rem;
      }
      
      .section-title-terminal {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        color: var(--terminal-accent);
        text-shadow: var(--glow-blue);
        letter-spacing: 3px;
      }
      
      .terminal-bracket {
        color: var(--terminal-text);
        margin: 0 0.5rem;
      }
      
      .cursos-terminal-container {
        margin-top: 2rem;
      }
      
      .terminal-footer {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 2px solid var(--terminal-border);
      }
      
      .terminal-command {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--terminal-text);
      }
      
      .command-prompt {
        color: var(--terminal-accent);
        font-weight: 600;
      }
      
      .terminal-link {
        color: var(--terminal-text);
        text-decoration: none;
        transition: all var(--transition-base);
        text-shadow: var(--glow-green);
      }
      
      .terminal-link:hover {
        color: var(--terminal-accent);
        text-shadow: var(--glow-blue);
      }
      
      .link-arrow {
        margin-left: 0.5rem;
        transition: transform var(--transition-fast);
      }
      
      .terminal-link:hover .link-arrow {
        transform: translateX(5px);
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
        .terminal-view {
          padding: 1rem;
        }
        
        .section-title-terminal {
          font-size: 1.25rem;
        }
      }
    `;
    this.appendChild(style);
  }
}

customElements.define('public-view', PublicView);

export function renderPublicView(container = document.body) {
  const view = document.createElement('public-view');
  if (container) {
    container.innerHTML = '';
    container.appendChild(view);
  }
}
