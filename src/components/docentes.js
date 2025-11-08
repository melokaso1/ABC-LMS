
// Cargar docentes de localStorage
export function loadDocentes() {
  const docentesJson = localStorage.getItem('docentes');
  try {
    const list = docentesJson ? JSON.parse(docentesJson) : [];
    if (Array.isArray(list)) return list;
    return [];
  } catch {
    return [];
  }
}

// Guarda (agrega o actualiza) un docente en localStorage
export function saveDocente(docente) {
  if (!docente || !docente.email) return false; // debe tener email único
  let docentes = loadDocentes();
  // Busca si ya existe (por email)
  const idx = docentes.findIndex(d => d.email === docente.email);
  if (idx !== -1) {
    // Actualiza
    docentes[idx] = { ...docentes[idx], ...docente };
  } else {
    // Agrega nuevo
    docentes.push(docente);
  }
  localStorage.setItem('docentes', JSON.stringify(docentes));
  return true;
}

// Renderiza tabla de docentes en un contenedor
export function renderDocentesTable(container) {
  if (!container) return;
  const docentes = loadDocentes();
  if (docentes.length === 0) {
    container.innerHTML = `<div class="abc-empty-state">No hay docentes registrados.</div>`;
    return;
  }
  let table = `<table class="abc-docentes-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${docentes.map(d =>
        `<tr>
          <td>${d.nombre || ""}</td>
          <td>${d.email}</td>
          <td>
            <button class="docente-edit-btn" data-email="${d.email}">Editar</button>
            <button class="docente-delete-btn" data-email="${d.email}">Eliminar</button>
          </td>
        </tr>`
      ).join('')}
    </tbody>
  </table>`;
  container.innerHTML = table;

  // Eventos para editar/eliminar
  container.querySelectorAll('.docente-edit-btn').forEach(btn => {
    btn.onclick = () => renderDocenteForm(
      document.getElementById('docentes-form-container'),
      docentes.find(d => d.email === btn.dataset.email)
    );
  });
  container.querySelectorAll('.docente-delete-btn').forEach(btn => {
    btn.onclick = () => handleDeleteDocente(btn.dataset.email, container);
  });
}

// Renderiza formulario de docente (nuevo o editar)
export function renderDocenteForm(container, docente = null) {
  if (!container) return;
  container.style.display = "block";
  container.innerHTML = `
    <form id="docente-form" class="abc-docente-form">
      <h2>${docente ? "Editar docente" : "Nuevo docente"}</h2>
      <div>
        <label>Nombre</label>
        <input type="text" name="nombre" required value="${docente?.nombre || ''}">
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" required value="${docente?.email || ''}" ${docente ? "readonly" : ''}>
      </div>
      <div class="abc-form-actions">
        <button type="submit">${docente ? "Guardar cambios" : "Agregar"}</button>
        <button type="button" id="cancelar-docente-form">Cancelar</button>
      </div>
      <div id="form-error" class="abc-error" style="display:none;color:#a33;margin-top:0.5em;"></div>
    </form>
  `;
  
  container.querySelector('#cancelar-docente-form').onclick = () => {
    container.style.display = "none";
    container.innerHTML = "";
  };

  container.querySelector('#docente-form').onsubmit = (e) => {
    e.preventDefault();
    handleSaveDocente(e.target, container);
  };
}

// Guarda el docente desde los datos del formulario y recarga la tabla
export function handleSaveDocente(formElem, formContainer) {
  const nombre = formElem.nombre.value.trim();
  const email = formElem.email.value.trim();
  const errorDiv = formElem.querySelector('#form-error');

  if (!nombre || !email) {
    errorDiv.textContent = "Nombre y email son obligatorios.";
    errorDiv.style.display = "block";
    return;
  }
  // comprobación de formato de correo
  if (!/\S+@\S+\.\S+/.test(email)) {
    errorDiv.textContent = "Correo electrónico inválido.";
    errorDiv.style.display = "block";
    return;
  }

  const docentes = loadDocentes();
  const yaExiste = docentes.some(d => d.email === email);
  // Si es alta y ya existe (el campo email solo es readonly en edición)
  if (!formElem.email.readOnly && yaExiste) {
    errorDiv.textContent = "Ya existe un docente con ese correo.";
    errorDiv.style.display = "block";
    return;
  }

  const docente = { nombre, email };
  saveDocente(docente);
  // Oculta formulario
  if (formContainer) {
    formContainer.style.display = "none";
    formContainer.innerHTML = "";
  }
  // Recarga la tabla
  const tableContainer = document.getElementById('docentes-table-container');
  if (tableContainer) renderDocentesTable(tableContainer);
}

// Borra un docente por email y recarga la tabla
export function handleDeleteDocente(email, tableContainer) {
  if (!email) return;
  if (!window.confirm("¿Está seguro de eliminar este docente?")) return;
  let docentes = loadDocentes();
  docentes = docentes.filter(d => d.email !== email);
  localStorage.setItem('docentes', JSON.stringify(docentes));
  // Recarga la tabla
  if (tableContainer) renderDocentesTable(tableContainer);
}

