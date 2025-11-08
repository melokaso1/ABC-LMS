import { renderDocentesTable, renderDocenteForm } from "../components/docentes.js";

export function renderDocentesView(container = document.body) {
  // Elimina la vista anterior si existe
  const old = container.querySelector('.abc-docentes-container');
  if (old) old.remove();

  // Crea el contenedor principal
  const section = document.createElement('section');
  section.className = 'abc-docentes-container';

  section.innerHTML = `
    <header class="abc-docentes-header">
      <h1>Docentes</h1>
      <button id="docentes-add-btn">+ Nuevo docente</button>
    </header>
    <div id="docentes-table-container">
      <!-- Aquí se renderiza la tabla de docentes -->
    </div>
    <div id="docentes-form-container" style="display:none;">
      <!-- Aquí se renderiza el formulario de docente -->
    </div>
  `;

  container.appendChild(section);
}



export function afterDocentesRender(container = document.body) {
  const section = container.querySelector('.abc-docentes-container') || container;
  const tableContainer = section.querySelector('#docentes-table-container');
  const formContainer = section.querySelector('#docentes-form-container');
  const addBtn = section.querySelector('#docentes-add-btn');

  // Renderiza la tabla inicial
  renderDocentesTable(tableContainer);

  // Configura botón de agregar
  if (addBtn) {
    addBtn.onclick = () => {
      renderDocenteForm(formContainer, null);
    };
  }
}

