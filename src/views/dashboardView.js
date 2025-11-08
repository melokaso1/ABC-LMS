import { renderStats } from "../components/stats.js";

// Muestra el dashboard
export function renderDashboardView(container = document.body) {
  const old = container.querySelector('.abc-dashboard-container');
  if (old) old.remove();

  const section = document.createElement('section');
  section.className = 'abc-dashboard-container';

  section.innerHTML = `
    <header class="abc-dashboard-header">
      <h1>Bienvenido al panel de control</h1>
      <p class="abc-dashboard-subtitle">Resumen general y accesos rápidos</p>
    </header>
    <div class="abc-dashboard-stats">
      <div class="abc-dashboard-stat">
        <div class="stat-value" id="dashboard-stat-users">--</div>
        <div class="stat-label">Docentes registrados</div>
      </div>
      <div class="abc-dashboard-stat">
        <div class="stat-value" id="dashboard-stat-courses">--</div>
        <div class="stat-label">Cursos</div>
      </div>
    </div>
    <div class="abc-dashboard-actions">
      <button id="dashboard-add-docente">+ Nuevo docente</button>
      <button id="dashboard-add-curso">+ Nuevo curso</button>
    </div>
  `;

  container.appendChild(section);
}

// Después de renderizar dashboard
export function afterDashboardRender() {
  renderStats();
  renderQuickActions();
}

// Acciones rápidas
export function renderQuickActions(container = document.body) {
  const section = container.querySelector('.abc-dashboard-container') || container;
  const docenteBtn = section.querySelector('#dashboard-add-docente');
  const cursoBtn = section.querySelector('#dashboard-add-curso');

  if (docenteBtn) {
    docenteBtn.onclick = () => {
      window.location.hash = "/docentes?nuevo=1";
    };
  }
  if (cursoBtn) {
    cursoBtn.onclick = () => {
      window.location.hash = "/cursos?nuevo=1";
    };
  }
}
