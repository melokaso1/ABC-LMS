import { renderStats } from "../components/stats.js";

class DashboardView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.afterRender();
  }

  render() {
    this.innerHTML = `
      <div class="terminal-dashboard">
        <div class="dashboard-terminal-header">
          <div class="terminal-prompt-line">
            <span class="prompt-user">admin@abc-educate</span>
            <span class="prompt-separator">:</span>
            <span class="prompt-path">~/dashboard</span>
            <span class="prompt-symbol">$</span>
            <span class="terminal-text"> system_status.sh</span>
          </div>
        </div>
        
        <div class="dashboard-terminal-content">
          <div class="terminal-output-section">
            <div class="output-header">
              <span class="output-prefix">[SYSTEM]</span>
              <span class="output-text">Panel de Control - ABC Educate Terminal</span>
            </div>
            <div class="output-line">
              <span class="output-prefix">[INFO]</span>
              <span class="output-text">Cargando estadísticas del sistema...</span>
            </div>
          </div>
          
          <div class="dashboard-stats-terminal">
            <div class="stat-card-terminal">
              <div class="stat-header">
                <span class="stat-icon">[USER]</span>
                <span class="stat-label">DOCENTES REGISTRADOS</span>
              </div>
              <div class="stat-value-terminal" id="dashboard-stat-users">--</div>
              <div class="stat-bar">
                <div class="stat-bar-fill" id="stat-users-bar"></div>
              </div>
            </div>
            
            <div class="stat-card-terminal">
              <div class="stat-header">
                <span class="stat-icon">[COURSE]</span>
                <span class="stat-label">CURSOS DISPONIBLES</span>
              </div>
              <div class="stat-value-terminal" id="dashboard-stat-courses">--</div>
              <div class="stat-bar">
                <div class="stat-bar-fill" id="stat-courses-bar"></div>
              </div>
            </div>
          </div>
          
          <div class="dashboard-actions-terminal">
            <div class="actions-header">
              <span class="section-prefix">[ACTIONS]</span>
              <span class="section-title">COMANDOS DISPONIBLES</span>
            </div>
            <div class="action-buttons-terminal">
              <button id="dashboard-add-docente" class="action-btn-terminal">
                <span class="btn-icon">$</span>
                <span class="btn-text">crear_docente</span>
                <span class="btn-arrow">→</span>
              </button>
              
              <button id="dashboard-add-curso" class="action-btn-terminal">
                <span class="btn-icon">$</span>
                <span class="btn-text">crear_curso</span>
                <span class="btn-arrow">→</span>
              </button>
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
      dashboard-view {
        display: block;
        width: 100%;
        min-height: 100vh;
        background: var(--terminal-bg);
        font-family: var(--font-terminal);
      }
      
      .terminal-dashboard {
        width: 100%;
        min-height: 100vh;
        padding: 2rem;
      }
      
      .dashboard-terminal-header {
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
      
      .dashboard-terminal-content {
        max-width: 1200px;
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
      
      .dashboard-stats-terminal {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }
      
      .stat-card-terminal {
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        padding: 2rem;
        transition: all var(--transition-base);
        position: relative;
        overflow: hidden;
      }
      
      .stat-card-terminal::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, var(--terminal-text), var(--terminal-accent));
        opacity: 0;
        transition: opacity var(--transition-base);
      }
      
      .stat-card-terminal:hover {
        border-color: var(--terminal-text);
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
      }
      
      .stat-card-terminal:hover::before {
        opacity: 1;
      }
      
      .stat-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .stat-icon {
        color: var(--terminal-accent);
        font-weight: 700;
        font-size: 0.75rem;
      }
      
      .stat-label {
        color: var(--terminal-text-dim);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 600;
      }
      
      .stat-value-terminal {
        font-size: 3rem;
        font-weight: 800;
        color: var(--terminal-text);
        line-height: 1;
        margin-bottom: 1rem;
        text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
        font-family: var(--font-terminal);
      }
      
      .stat-bar {
        width: 100%;
        height: 4px;
        background: var(--terminal-border);
        overflow: hidden;
      }
      
      .stat-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--terminal-text), var(--terminal-accent));
        width: 0%;
        transition: width 0.5s ease-out;
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
      }
      
      .dashboard-actions-terminal {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
      }
      
      .actions-header {
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .section-prefix {
        color: var(--terminal-accent);
        font-weight: 700;
        font-size: 0.75rem;
      }
      
      .section-title {
        color: var(--terminal-text);
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 700;
      }
      
      .action-buttons-terminal {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      .action-btn-terminal {
        background: transparent;
        border: 2px solid var(--terminal-border);
        padding: 1.5rem;
        color: var(--terminal-text);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all var(--transition-base);
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        position: relative;
        overflow: hidden;
      }
      
      .action-btn-terminal::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: var(--terminal-text);
        transform: scaleY(0);
        transition: transform var(--transition-base);
      }
      
      .action-btn-terminal:hover {
        border-color: var(--terminal-text);
        background: rgba(0, 255, 65, 0.05);
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
        transform: translateX(5px);
      }
      
      .action-btn-terminal:hover::before {
        transform: scaleY(1);
      }
      
      .btn-icon {
        color: var(--terminal-accent);
        font-weight: 700;
        margin-right: 0.75rem;
      }
      
      .btn-text {
        flex: 1;
      }
      
      .btn-arrow {
        color: var(--terminal-text-dim);
        transition: all var(--transition-fast);
      }
      
      .action-btn-terminal:hover .btn-arrow {
        color: var(--terminal-accent);
        transform: translateX(5px);
      }
      
      @media (max-width: 768px) {
        .terminal-dashboard {
          padding: 1rem;
        }
        
        .dashboard-stats-terminal {
          grid-template-columns: 1fr;
        }
        
        .action-buttons-terminal {
          grid-template-columns: 1fr;
        }
      }
    `;
    this.appendChild(style);
  }

  afterRender() {
    renderStats();
    this.renderQuickActions();
    this.animateStats();
  }

  animateStats() {
    // Animar las barras de progreso
    setTimeout(() => {
      const usersStat = document.getElementById('dashboard-stat-users');
      const coursesStat = document.getElementById('dashboard-stat-courses');
      
      if (usersStat && coursesStat) {
        const usersValue = parseInt(usersStat.textContent) || 0;
        const coursesValue = parseInt(coursesStat.textContent) || 0;
        
        const maxValue = Math.max(usersValue, coursesValue, 10);
        
        const usersBar = document.getElementById('stat-users-bar');
        const coursesBar = document.getElementById('stat-courses-bar');
        
        if (usersBar) {
          usersBar.style.width = `${(usersValue / maxValue) * 100}%`;
        }
        if (coursesBar) {
          coursesBar.style.width = `${(coursesValue / maxValue) * 100}%`;
        }
      }
    }, 500);
  }

  renderQuickActions() {
    const docenteBtn = this.querySelector('#dashboard-add-docente');
    const cursoBtn = this.querySelector('#dashboard-add-curso');

    if (docenteBtn) {
      docenteBtn.onclick = () => {
        window.location.hash = "/admin";
      };
    }
    if (cursoBtn) {
      cursoBtn.onclick = () => {
        window.location.hash = "/admin";
      };
    }
  }
}

customElements.define('dashboard-view', DashboardView);

export function renderDashboardView(container = document.body) {
  const view = document.createElement('dashboard-view');
  if (container) {
    container.innerHTML = '';
    container.appendChild(view);
  }
}
