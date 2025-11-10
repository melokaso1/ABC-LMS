import { getArray, saveArray, upsertItem, deleteItem, showError, hideError } from '../utils/helpers.js';
import { loadDocentes } from './docentes.js';
import { showAlert, showConfirm, showFormModal } from './modal.js';

// Cargar cursos desde localStorage
export function loadCursos() {
  return getArray('cursos');
}

// Guardar un curso (nuevo o editado)
export function saveCurso(curso) {
  if (!curso || !curso.id) return false;
  const cursos = loadCursos();
  const idx = cursos.findIndex(c => c.id === curso.id);
  if (idx !== -1) {
    cursos[idx] = { ...cursos[idx], ...curso };
  } else {
    if (!Array.isArray(curso.modulos)) curso.modulos = [];
    cursos.push(curso);
  }
  return saveArray('cursos', cursos);
}

// Eliminar un curso por id (con caché)
// También elimina automáticamente todos los módulos y lecciones asociados
export function deleteCurso(id) {
  let cursos = loadCursos();
  const curso = cursos.find(c => c.id === id);
  
  if (!curso) return { success: false, modulosEliminados: 0, leccionesEliminadas: 0 };
  
  // Contar módulos y lecciones antes de eliminar
  let modulosEliminados = 0;
  let leccionesEliminadas = 0;
  
  if (Array.isArray(curso.modulos)) {
    modulosEliminados = curso.modulos.length;
    // Contar lecciones en todos los módulos
    curso.modulos.forEach(modulo => {
      if (Array.isArray(modulo.lecciones)) {
        leccionesEliminadas += modulo.lecciones.length;
      }
    });
  }
  
  // Eliminar el curso (esto elimina automáticamente todos los módulos y lecciones)
  cursos = cursos.filter(c => c.id !== id);
  saveArray('cursos', cursos);
  
  return { 
    success: true, 
    modulosEliminados, 
    leccionesEliminadas,
    nombreCurso: curso.nombre || id
  };
}

// Cargar módulos de un curso
export function loadModulos(cursoId) {
  const curso = loadCursos().find(c => c.id === cursoId);
  return curso && Array.isArray(curso.modulos) ? curso.modulos : [];
}

// Guardar un módulo (nuevo o editado) en un curso (con caché)
export function saveModulo(cursoId, modulo) {
  if (!cursoId || !modulo || !modulo.id) return false;
  let cursos = loadCursos();
  const idxCurso = cursos.findIndex(c => c.id === cursoId);
  if (idxCurso === -1) return false;
  let modulos = cursos[idxCurso].modulos || [];
  const idxModulo = modulos.findIndex(m => m.id === modulo.id);
  if (idxModulo !== -1) {
    modulos[idxModulo] = { ...modulos[idxModulo], ...modulo };
  } else {
    if (!Array.isArray(modulo.lecciones)) modulo.lecciones = [];
    modulos.push(modulo);
  }
  cursos[idxCurso].modulos = modulos;
  saveArray('cursos', cursos);
  return true;
}

// Eliminar un módulo de un curso
export function deleteModulo(cursoId, moduloId) {
  let cursos = loadCursos();
  const idxCurso = cursos.findIndex(c => c.id === cursoId);
  if (idxCurso === -1) return;
  let modulos = cursos[idxCurso].modulos || [];
  modulos = modulos.filter(m => m.id !== moduloId);
  cursos[idxCurso].modulos = modulos;
  saveArray('cursos', cursos);
}

// Renderiza la lista de módulos de un curso
export function renderModulosList(container, cursoId) {
  if (!container) {
    console.error('[ERROR] renderModulosList: container no proporcionado');
    return;
  }
  if (!cursoId) {
    console.error('[ERROR] renderModulosList: cursoId no proporcionado');
    return;
  }
  
  const cursos = loadCursos();
  const curso = cursos.find(c => c.id === cursoId);
  const cursoNombre = curso?.nombre || cursoId;
  const modulos = loadModulos(cursoId);
  
  console.log('[SYSTEM] renderModulosList - Curso:', cursoNombre, 'Módulos:', modulos.length);
  
  let html = `
    <div class="modulos-header">
      <h3 class="modulos-title">
        <span class="section-prefix">[MÓDULOS]</span>
        <span class="curso-name">${cursoNombre}</span>
      </h3>
    </div>
    <div class="modulos-actions">
      <button class="agregar-modulo-btn btn btn-success" id="agregar-modulo-btn">
        <span class="btn-prefix">+</span> AGREGAR MÓDULO
      </button>
    </div>
  `;
  if (!modulos.length) {
    html += `<div class="abc-empty-state">No hay módulos registrados.</div>`;
  } else {
    html += `<table class="modulos-table">
      <thead>
        <tr>
          <th>Nombre del Módulo</th>
          <th>Lecciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${modulos.map(m => `
          <tr>
            <td>${m.nombre || ""}</td>
            <td>${Array.isArray(m.lecciones) ? m.lecciones.length : 0}</td>
            <td>
              <button class="modulo-edit-btn" data-id="${m.id}">EDITAR</button>
              <button class="modulo-delete-btn" data-id="${m.id}">ELIMINAR</button>
              <button class="modulo-lecciones-btn" data-id="${m.id}">LECCIONES</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  }
  container.innerHTML = html;

  // Agregar estilos para módulos si no existen
  if (!document.getElementById('modulos-table-styles')) {
    const style = document.createElement('style');
    style.id = 'modulos-table-styles';
    style.textContent = `
      .modulos-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--terminal-border);
      }
      
      .modulos-title {
        font-family: var(--font-terminal);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--terminal-accent);
        text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 0;
      }
      
      .modulos-title .section-prefix {
        color: var(--terminal-accent);
        font-weight: 700;
      }
      
      .modulos-title .curso-name {
        color: var(--terminal-text);
        text-transform: uppercase;
      }
      
      .modulos-actions {
        margin-bottom: 1.5rem;
      }
      
      .agregar-modulo-btn {
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 2px solid var(--terminal-success);
        color: var(--terminal-success);
        cursor: pointer;
        transition: all var(--transition-fast);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }
      
      .agregar-modulo-btn:hover {
        background: rgba(0, 255, 136, 0.1);
        box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        transform: translateY(-2px);
      }
      
      .modulos-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        margin-top: 1rem;
      }
      
      .modulos-table th {
        background: var(--terminal-surface);
        padding: 1rem;
        text-align: left;
        font-weight: 700;
        color: var(--terminal-accent);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
        border-bottom: 1px solid var(--terminal-border);
      }
      
      .modulos-table td {
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--terminal-border);
        color: var(--terminal-text-dim);
        transition: all var(--transition-base);
        vertical-align: middle;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .modulos-table td:last-child {
        max-width: none;
        overflow: visible;
        white-space: normal;
      }
      
      .modulos-table tr:hover {
        background: rgba(0, 255, 65, 0.03);
      }
      
      .modulos-table tr:hover td {
        color: var(--terminal-text);
      }
      
      .modulos-table tr:last-child td {
        border-bottom: none;
      }
      
      .modulos-table td:last-child {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        padding: 1rem;
      }
      
      .modulo-edit-btn, .modulo-delete-btn, .modulo-lecciones-btn {
        padding: 0.5rem 1rem;
        font-family: var(--font-terminal);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 1px solid;
        background: transparent;
        cursor: pointer;
        transition: background var(--transition-fast), border-color var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .modulo-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .modulo-edit-btn:hover {
        background: rgba(0, 217, 255, 0.1);
      }
      
      .modulo-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .modulo-delete-btn:hover {
        background: rgba(255, 0, 68, 0.1);
      }
      
      .modulo-lecciones-btn {
        border-color: var(--terminal-success);
        color: var(--terminal-success);
      }
      
      .modulo-lecciones-btn:hover {
        background: rgba(0, 255, 136, 0.1);
      }
      
      @media (max-width: 768px) {
        .modulos-table {
          font-size: 0.75rem;
        }
        
        .modulos-table th,
        .modulos-table td {
          padding: 0.75rem 0.5rem;
        }
        
        .modulo-edit-btn, .modulo-delete-btn, .modulo-lecciones-btn {
          padding: 0.4rem 0.6rem;
          font-size: 0.65rem;
          margin-right: 0.25rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Listener para agregar módulo
  const agregarBtn = container.querySelector('#agregar-modulo-btn');
  if (agregarBtn) {
    agregarBtn.onclick = () => {
      if (typeof renderModuloForm === "function") {
        const modulosFormContainer = document.getElementById('modulos-form-container');
        renderModuloForm(modulosFormContainer, cursoId, null);
      }
    };
  }

  // Listeners para botones de módulos
  container.querySelectorAll('.modulo-edit-btn').forEach(btn => {
    btn.onclick = () => {
      if (typeof renderModuloForm === "function") {
        renderModuloForm(
          document.getElementById('modulos-form-container'),
          cursoId,
          loadModulos(cursoId).find(m => m.id === btn.dataset.id)
        );
      }
    }
  });
  container.querySelectorAll('.modulo-delete-btn').forEach(btn => {
    btn.onclick = () => {
      const moduloId = btn.dataset.id;
      const modulo = loadModulos(cursoId).find(m => m.id === moduloId);
      const confirmMessage = `
[WARNING] Eliminar módulo
[INFO] Módulo: ${modulo?.nombre || moduloId}
[WARNING] Esta acción eliminará todas las lecciones del módulo
      `.trim();
      
      showConfirm(confirmMessage, {
        title: '[WARNING] Confirmar eliminación',
        icon: '[!]',
        confirmText: 'ELIMINAR',
        cancelText: 'CANCELAR'
      }).then(confirmed => {
        if (!confirmed) {
          console.log('[INFO] Operación cancelada');
          return;
        }
        deleteModulo(cursoId, moduloId);
        renderModulosList(container, cursoId);
        console.log('[SYSTEM] Módulo eliminado:', moduloId);
        
        // También actualizar la tabla de cursos si existe
        const tableContainer = document.querySelector('#cursos-table-container') || 
                               document.querySelector('#admin-cursos-table-container');
        if (tableContainer) {
          renderCursosTable(tableContainer);
        }
        
        showAlert(`[SUCCESS] Módulo eliminado\n[INFO] El módulo ${modulo?.nombre || moduloId} ha sido eliminado correctamente`, {
          title: '[SUCCESS] Operación exitosa',
          icon: '[✓]',
          type: 'success'
        });
      });
    };
  });
  container.querySelectorAll('.modulo-lecciones-btn').forEach(btn => {
    btn.onclick = () => {
      const moduloId = btn.dataset.id;
      const leccionesContainer = document.getElementById('lecciones-list-container');
      const leccionFormContainer = document.getElementById('leccion-form-container');
      const modulosFormContainer = document.getElementById('modulos-form-container');
      
      if (!leccionesContainer) {
        console.error('[ERROR] No se encontró el contenedor #lecciones-list-container');
        return;
      }
      
      if (typeof renderLeccionesList !== "function") {
        console.error('[ERROR] La función renderLeccionesList no está disponible');
        return;
      }
      
      // Ocultar formulario de módulos y lecciones
      if (modulosFormContainer) modulosFormContainer.style.display = 'none';
      if (leccionFormContainer) leccionFormContainer.style.display = 'none';
      
      // Mostrar contenedor de lecciones
      leccionesContainer.style.display = 'block';
      renderLeccionesList(leccionesContainer, cursoId, moduloId);
      console.log('[SYSTEM] Mostrando lecciones para el módulo:', moduloId);
      
      // Hacer scroll suave al contenedor
      setTimeout(() => {
        leccionesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
  });
}

// Cargar lecciones de un módulo
export function loadLecciones(cursoId, moduloId) {
  const modulos = loadModulos(cursoId);
  const modulo = modulos.find(m => m.id === moduloId);
  return modulo && Array.isArray(modulo.lecciones) ? modulo.lecciones : [];
}

// Guardar una lección (nueva o editada) (con caché)
export function saveLeccion(cursoId, moduloId, leccion) {
  if (!cursoId || !moduloId || !leccion || !leccion.id) return false;
  let cursos = loadCursos();
  const idxCurso = cursos.findIndex(c => c.id === cursoId);
  if (idxCurso === -1) return false;
  let modulos = cursos[idxCurso].modulos || [];
  const idxModulo = modulos.findIndex(m => m.id === moduloId);
  if (idxModulo === -1) return false;
  let lecciones = modulos[idxModulo].lecciones || [];
  const idxLeccion = lecciones.findIndex(l => l.id === leccion.id);
  if (idxLeccion !== -1) {
    lecciones[idxLeccion] = { ...lecciones[idxLeccion], ...leccion };
  } else {
    lecciones.push(leccion);
  }
  modulos[idxModulo].lecciones = lecciones;
  cursos[idxCurso].modulos = modulos;
  saveArray('cursos', cursos);
  return true;
}

// Eliminar una lección de un módulo de un curso
export function deleteLeccion(cursoId, moduloId, leccionId) {
  let cursos = loadCursos();
  const idxCurso = cursos.findIndex(c => c.id === cursoId);
  if (idxCurso === -1) return;
  let modulos = cursos[idxCurso].modulos || [];
  const idxModulo = modulos.findIndex(m => m.id === moduloId);
  if (idxModulo === -1) return;
  let lecciones = modulos[idxModulo].lecciones || [];
  lecciones = lecciones.filter(l => l.id !== leccionId);
  modulos[idxModulo].lecciones = lecciones;
  cursos[idxCurso].modulos = modulos;
  saveArray('cursos', cursos);
}

// Renderiza la lista de lecciones de un módulo
export function renderLeccionesList(container, cursoId, moduloId) {
  if (!container) {
    console.error('[ERROR] renderLeccionesList: container no proporcionado');
    return;
  }
  if (!cursoId || !moduloId) {
    console.error('[ERROR] renderLeccionesList: cursoId o moduloId no proporcionados');
    return;
  }
  
  const cursos = loadCursos();
  const curso = cursos.find(c => c.id === cursoId);
  const cursoNombre = curso?.nombre || cursoId;
  const modulos = curso?.modulos || [];
  const modulo = modulos.find(m => m.id === moduloId);
  const moduloNombre = modulo?.nombre || moduloId;
  const lecciones = loadLecciones(cursoId, moduloId);
  
  console.log('[SYSTEM] renderLeccionesList - Curso:', cursoNombre, 'Módulo:', moduloNombre, 'Lecciones:', lecciones.length);
  
  let html = `
    <div class="lecciones-header">
      <h3 class="lecciones-title">
        <span class="section-prefix">[LECCIONES]</span>
        <span class="curso-name">${cursoNombre}</span>
        <span class="separator">→</span>
        <span class="modulo-name">${moduloNombre}</span>
      </h3>
    </div>
    <div class="lecciones-actions">
      <button class="agregar-leccion-btn btn btn-success" id="agregar-leccion-btn">
        <span class="btn-prefix">+</span> AGREGAR LECCIÓN
      </button>
    </div>
  `;
  if (!lecciones.length) {
    html += '<div class="abc-empty-state">No hay lecciones registradas.</div>';
  } else {
    html += `<table class="lecciones-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${lecciones.map(l => `
          <tr>
            <td>${l.titulo || ""}</td>
            <td>${l.tipo || ""}</td>
            <td>
              <button class="leccion-edit-btn" data-id="${l.id}">EDITAR</button>
              <button class="leccion-delete-btn" data-id="${l.id}">ELIMINAR</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  }
  container.innerHTML = html;

  // Agregar estilos para lecciones si no existen
  if (!document.getElementById('lecciones-table-styles')) {
    const style = document.createElement('style');
    style.id = 'lecciones-table-styles';
    style.textContent = `
      .lecciones-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--terminal-border);
      }
      
      .lecciones-title {
        font-family: var(--font-terminal);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--terminal-accent);
        text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0;
        flex-wrap: wrap;
      }
      
      .lecciones-title .section-prefix {
        color: var(--terminal-accent);
        font-weight: 700;
      }
      
      .lecciones-title .curso-name,
      .lecciones-title .modulo-name {
        color: var(--terminal-text);
        text-transform: uppercase;
      }
      
      .lecciones-title .separator {
        color: var(--terminal-text-dim);
        margin: 0 0.5rem;
      }
      
      .lecciones-actions {
        margin-bottom: 1.5rem;
      }
      
      .agregar-leccion-btn {
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 2px solid var(--terminal-success);
        color: var(--terminal-success);
        cursor: pointer;
        transition: all var(--transition-fast);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }
      
      .agregar-leccion-btn:hover {
        background: rgba(0, 255, 136, 0.1);
        box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        transform: translateY(-2px);
      }
      
      .lecciones-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        margin-top: 1rem;
      }
      
      .lecciones-table th {
        background: var(--terminal-surface);
        padding: 1rem;
        text-align: left;
        font-weight: 700;
        color: var(--terminal-accent);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
        border-bottom: 1px solid var(--terminal-border);
      }
      
      .lecciones-table td {
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--terminal-border);
        color: var(--terminal-text-dim);
        transition: all var(--transition-base);
        vertical-align: middle;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .lecciones-table td:last-child {
        max-width: none;
        overflow: visible;
        white-space: normal;
      }
      
      .lecciones-table tr:hover {
        background: rgba(0, 255, 65, 0.03);
      }
      
      .lecciones-table tr:hover td {
        color: var(--terminal-text);
      }
      
      .lecciones-table tr:last-child td {
        border-bottom: none;
      }
      
      .lecciones-table td:last-child {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        padding: 1rem;
      }
      
      .leccion-edit-btn, .leccion-delete-btn {
        padding: 0.5rem 1rem;
        font-family: var(--font-terminal);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 1px solid;
        background: transparent;
        cursor: pointer;
        transition: background var(--transition-fast), border-color var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .leccion-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .leccion-edit-btn:hover {
        background: rgba(0, 217, 255, 0.1);
      }
      
      .leccion-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .leccion-delete-btn:hover {
        background: rgba(255, 0, 68, 0.1);
      }
      
      @media (max-width: 768px) {
        .lecciones-table {
          font-size: 0.75rem;
        }
        
        .lecciones-table th,
        .lecciones-table td {
          padding: 0.75rem 0.5rem;
        }
        
        .leccion-edit-btn, .leccion-delete-btn {
          padding: 0.4rem 0.6rem;
          font-size: 0.65rem;
          margin-right: 0.25rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Listener para agregar lección
  const agregarBtn = container.querySelector('#agregar-leccion-btn');
  if (agregarBtn) {
    agregarBtn.onclick = () => {
      const leccionFormContainer = document.getElementById('leccion-form-container');
      if (leccionFormContainer && typeof renderLeccionForm === "function") {
        // Ocultar otros contenedores si es necesario
        const modulosFormContainer = document.getElementById('modulos-form-container');
        if (modulosFormContainer) modulosFormContainer.style.display = 'none';
        
        leccionFormContainer.style.display = 'block';
        renderLeccionForm(leccionFormContainer, cursoId, moduloId, null);
        
        // Hacer scroll al formulario
        setTimeout(() => {
          leccionFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        console.error('[ERROR] No se encontró el contenedor de formulario de lecciones o la función renderLeccionForm');
      }
    };
  }

  // Listeners para botones de lecciones
  container.querySelectorAll('.leccion-edit-btn').forEach(btn => {
    btn.onclick = () => {
      if (typeof renderLeccionForm === "function") {
        renderLeccionForm(
          document.getElementById('leccion-form-container'),
          cursoId,
          moduloId,
          loadLecciones(cursoId, moduloId).find(l => l.id === btn.dataset.id)
        );
      }
    }
  });
  container.querySelectorAll('.leccion-delete-btn').forEach(btn => {
    btn.onclick = () => {
      const leccionId = btn.dataset.id;
      const leccion = loadLecciones(cursoId, moduloId).find(l => l.id === leccionId);
      const confirmMessage = `
[WARNING] Eliminar lección
[INFO] Lección: ${leccion?.titulo || leccionId}
[WARNING] Esta acción no se puede deshacer
      `.trim();
      
      showConfirm(confirmMessage, {
        title: '[WARNING] Confirmar eliminación',
        icon: '[!]',
        confirmText: 'ELIMINAR',
        cancelText: 'CANCELAR'
      }).then(confirmed => {
        if (!confirmed) {
          console.log('[INFO] Operación cancelada');
          return;
        }
        deleteLeccion(cursoId, moduloId, leccionId);
        renderLeccionesList(container, cursoId, moduloId);
        console.log('[SYSTEM] Lección eliminada:', leccionId);
        
        showAlert(`[SUCCESS] Lección eliminada\n[INFO] La lección ${leccion?.titulo || leccionId} ha sido eliminada correctamente`, {
          title: '[SUCCESS] Operación exitosa',
          icon: '[✓]',
          type: 'success'
        });
      });
    };
  });
}

// Función para mostrar formulario de lección en modal
function showLeccionFormModal(cursoId, moduloId, leccion = null, leccionesListContainer = null) {
  const isEdit = !!leccion;
  
  const formHTML = `
    <form id="leccion-form" class="terminal-form">
      <div class="form-group-terminal">
        <label for="leccion-titulo" class="terminal-label">
          <span class="label-prefix">></span>
          TÍTULO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="leccion-titulo"
          name="titulo" 
          required 
          value="${leccion?.titulo || ''}"
          class="terminal-input"
          placeholder="Ejemplo: Introducción a Variables"
          autocomplete="off"
        />
        <div class="field-hint">
          💡 Título claro y descriptivo de la lección
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="leccion-tipo" class="terminal-label">
          <span class="label-prefix">></span>
          TIPO_LECCIÓN
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <select 
          name="tipo" 
          id="leccion-tipo" 
          class="terminal-input"
          required
        >
          <option value="video" ${leccion?.tipo === 'video' ? 'selected' : ''}>📹 Video</option>
          <option value="lectura" ${leccion?.tipo === 'lectura' ? 'selected' : ''}>📄 Lectura</option>
          <option value="quiz" ${leccion?.tipo === 'quiz' ? 'selected' : ''}>❓ Quiz</option>
        </select>
        <div class="field-hint">
          💡 Selecciona el tipo de contenido de la lección
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="leccion-intensidad" class="terminal-label">
          <span class="label-prefix">></span>
          INTENSIDAD_HORARIA
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="number" 
          id="leccion-intensidad"
          name="intensidadHoraria" 
          required 
          min="0.5"
          step="0.5"
          value="${leccion?.intensidadHoraria || ''}"
          class="terminal-input"
          placeholder="Ejemplo: 2.5"
        />
        <div class="field-hint">
          💡 Horas de duración de la lección (ej: 2.5 = 2 horas y media)
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="leccion-descripcion" class="terminal-label">
          <span class="label-prefix">></span>
          CONTENIDO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <textarea 
          id="leccion-descripcion"
          name="contenido" 
          rows="3"
          required
          class="terminal-input"
          placeholder="Contenido de la lección (texto con el material de estudio)..."
        >${leccion?.contenido || leccion?.descripcion || ''}</textarea>
        <div class="field-hint">
          💡 Texto con el material de estudio de la lección
        </div>
      </div>
      
      <div id="leccion-multimedia-container" class="form-group-terminal"></div>
      
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success" id="submit-leccion-btn">
          <span class="btn-prefix">$</span>
          <span class="btn-text">${isEdit ? "ACTUALIZAR LECCIÓN" : "CREAR LECCIÓN"}</span>
          <span class="btn-suffix">→</span>
        </button>
        <button type="button" id="leccion-cancelar-btn" class="btn btn-secondary">
          <span class="btn-prefix">[</span>
          CANCELAR
          <span class="btn-suffix">]</span>
        </button>
      </div>
      <div id="leccion-form-error" class="terminal-error" style="display:none;"></div>
    </form>
  `;
  
  const { closeModal, content } = showFormModal(formHTML, {
    title: isEdit ? "EDITAR LECCIÓN" : "NUEVA LECCIÓN",
    icon: "[>]",
    onFormReady: (modalContent, closeFn) => {
      // Render input multimedia
      renderMultimediaInput(
        modalContent.querySelector('#leccion-multimedia-container'),
        leccion?.tipo || 'video',
        leccion
      );

      const tipoInput = modalContent.querySelector('#leccion-tipo');
      tipoInput.onchange = () => {
        renderMultimediaInput(
          modalContent.querySelector('#leccion-multimedia-container'),
          tipoInput.value,
          leccion
        );
      };

      const form = modalContent.querySelector('#leccion-form');
      const cancelBtn = modalContent.querySelector('#leccion-cancelar-btn');
      const errorDiv = modalContent.querySelector('#leccion-form-error');
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          closeFn();
        };
      }
      
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const data = new FormData(form);
          const titulo = data.get('titulo')?.trim();
          const tipo = data.get('tipo');
          
          // Validación mejorada
          if (!titulo || !tipo) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.25rem;">Por favor completa todos los campos obligatorios:</div>
                    <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
                      ${!titulo ? '<li>El <strong>título</strong> es obligatorio</li>' : ''}
                      ${!tipo ? '<li>Debes <strong>seleccionar un tipo</strong> de lección</li>' : ''}
                    </ul>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
              if (!titulo) form.titulo.style.borderColor = 'var(--terminal-error)';
              if (!tipo) form.tipo.style.borderColor = 'var(--terminal-error)';
            }
            return;
          }
          
          // Resetear estilos de error
          form.titulo.style.borderColor = '';
          form.tipo.style.borderColor = '';
          
          // Mostrar indicador de carga
          const submitBtn = modalContent.querySelector('#submit-leccion-btn');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-prefix">[</span> GUARDANDO... <span class="btn-suffix">]</span>';
          submitBtn.style.opacity = '0.7';
          
          setTimeout(() => {
            const intensidadHoraria = parseFloat(data.get('intensidadHoraria')) || 0;
            const contenido = data.get('contenido')?.trim() || '';
            const pdfUrl = data.get('pdfUrl')?.trim() || '';
            const imagenUrl = data.get('imagenUrl')?.trim() || '';
            const enlacesStr = data.get('enlaces')?.trim() || '';
            
            // Procesar enlaces: separar por comas o saltos de línea
            let enlaces = [];
            if (enlacesStr) {
              enlaces = enlacesStr
                .split(/[,\n]/)
                .map(e => e.trim())
                .filter(e => e.length > 0);
            }
            
            const nuevaLeccion = {
              id: leccion?.id || `leccion_${Date.now()}`,
              titulo: titulo,
              tipo: tipo,
              intensidadHoraria: intensidadHoraria,
              contenido: contenido,
              descripcion: contenido // Mantener compatibilidad
            };
            
            // Agregar contenido específico según tipo
            if (tipo === 'video') {
              nuevaLeccion.videoUrl = data.get('videoUrl')?.trim() || '';
            } else if (tipo === 'lectura') {
              nuevaLeccion.texto = data.get('texto')?.trim() || contenido;
            } else if (tipo === 'quiz') {
              nuevaLeccion.pregunta = data.get('pregunta')?.trim() || '';
            }
            
            // Agregar multimedia (PDFs, imágenes, enlaces)
            const multimedia = {};
            if (pdfUrl) multimedia.pdfUrl = pdfUrl;
            if (imagenUrl) multimedia.imagenUrl = imagenUrl;
            if (enlaces.length > 0) multimedia.enlaces = enlaces;
            
            // Si hay multimedia, agregarlo al objeto lección
            if (Object.keys(multimedia).length > 0) {
              nuevaLeccion.multimedia = multimedia;
            }
            
            // Mantener compatibilidad con estructura antigua
            if (pdfUrl) nuevaLeccion.pdfUrl = pdfUrl;
            if (imagenUrl) nuevaLeccion.imagenUrl = imagenUrl;
            if (enlaces.length > 0) nuevaLeccion.enlaces = enlaces;
            
            if (saveLeccion(cursoId, moduloId, nuevaLeccion)) {
              closeFn();
              
              // Recargar lista de lecciones
              if (leccionesListContainer) {
                renderLeccionesList(leccionesListContainer, cursoId, moduloId);
              } else {
                const leccionesListCont = document.getElementById('lecciones-list-container');
                if (leccionesListCont) {
                  renderLeccionesList(leccionesListCont, cursoId, moduloId);
                }
              }
              
              showAlert(`[SUCCESS] ¡Lección ${isEdit ? 'actualizada' : 'creada'} exitosamente!\n\n[INFO] La lección "${titulo}" (${tipo}) está lista.`, {
                title: '[SUCCESS] Operación completada',
                icon: '[✓]',
                type: 'success'
              });
            } else {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
              submitBtn.style.opacity = '1';
              if (errorDiv) {
                errorDiv.innerHTML = `
                  <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                    <div>No se pudo guardar la lección. Intenta de nuevo.</div>
                  </div>
                `;
                errorDiv.style.display = "block";
              }
            }
          }, 300);
        };
      }
    }
  });
  
  return closeModal;
}

// Renderiza el formulario de una lección (nuevo o edición)
export function renderLeccionForm(container, cursoId, moduloId, leccion = null) {
  if (!container || !cursoId || !moduloId) {
    console.error('[ERROR] renderLeccionForm: parámetros faltantes');
    return;
  }
  
  // Siempre usar modal para lecciones
  const leccionesListContainer = document.getElementById('lecciones-list-container');
  showLeccionFormModal(cursoId, moduloId, leccion, leccionesListContainer);
}

// Función para mostrar formulario de módulo en modal
function showModuloFormModal(cursoId, modulo = null, modulosListContainer = null) {
  const isEdit = !!modulo;
  
  const formHTML = `
    <form id="modulo-form" class="terminal-form">
      <div class="form-group-terminal">
        <label for="modulo-codigo" class="terminal-label">
          <span class="label-prefix">></span>
          CÓDIGO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input
          type="text"
          id="modulo-codigo"
          name="codigo"
          required
          value="${modulo?.codigo || ''}"
          class="terminal-input"
          placeholder="Ejemplo: M101"
          autocomplete="off"
          ${isEdit ? "readonly" : ''}
        />
        <div class="field-hint">
          ${isEdit ? '🔒 Código no modificable' : '💡 Código único del módulo'}
        </div>
      </div>
      <div class="form-group-terminal">
        <label for="modulo-nombre" class="terminal-label">
          <span class="label-prefix">></span>
          NOMBRE_MODULO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input
          type="text"
          id="modulo-nombre"
          name="nombre"
          required
          value="${modulo?.nombre || ''}"
          class="terminal-input"
          placeholder="Ejemplo: Introducción a JavaScript"
          autocomplete="off"
        />
        <div class="field-hint">
          💡 Nombre descriptivo del módulo
        </div>
      </div>

      <div class="form-group-terminal">
        <label for="modulo-descripcion" class="terminal-label">
          <span class="label-prefix">></span>
          DESCRIPCION
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <textarea
          id="modulo-descripcion"
          name="descripcion"
          rows="2"
          required
          class="terminal-input"
          placeholder="Breve descripción del contenido del módulo..."
        >${modulo?.descripcion || ''}</textarea>
      </div>

      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success" id="submit-modulo-btn">
          <span class="btn-prefix">$</span>
          <span class="btn-text">${isEdit ? "ACTUALIZAR MÓDULO" : "CREAR MÓDULO"}</span>
          <span class="btn-suffix">→</span>
        </button>
        <button type="button" id="modulo-cancel-btn" class="btn btn-secondary">
          <span class="btn-prefix">[</span>
          CANCELAR
          <span class="btn-suffix">]</span>
        </button>
      </div>
      <div id="modulo-form-error" class="terminal-error" style="display:none;"></div>
    </form>
  `;
  
  const { closeModal, content } = showFormModal(formHTML, {
    title: isEdit ? "EDITAR MÓDULO" : "NUEVO MÓDULO",
    icon: "[>]",
    onFormReady: (modalContent, closeFn) => {
      const form = modalContent.querySelector('#modulo-form');
      const cancelBtn = modalContent.querySelector('#modulo-cancel-btn');
      const errorDiv = modalContent.querySelector('#modulo-form-error');
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          closeFn();
        };
      }
      
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const nombre = form.nombre.value.trim();
          const descripcion = form.descripcion.value.trim();
          
          if (!nombre) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>El nombre del módulo es obligatorio</div>
                </div>
              `;
              errorDiv.style.display = "block";
              form.nombre.style.borderColor = 'var(--terminal-error)';
            }
            return;
          }
          
          // Mostrar indicador de carga
          const submitBtn = modalContent.querySelector('#submit-modulo-btn');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-prefix">[</span> GUARDANDO... <span class="btn-suffix">]</span>';
          submitBtn.style.opacity = '0.7';
          
          setTimeout(() => {
            const nuevoModulo = {
              id: modulo?.id || `modulo_${Date.now()}`,
              codigo: form.codigo.value.trim(),
              nombre: nombre,
              descripcion: descripcion,
              lecciones: modulo?.lecciones || []
            };
            
            if (saveModulo(cursoId, nuevoModulo)) {
              closeFn();
              
              // Recargar lista de módulos
              if (modulosListContainer) {
                renderModulosList(modulosListContainer, cursoId);
              } else {
                const modulosContainer = document.getElementById('modulos-list-container');
                if (modulosContainer) {
                  renderModulosList(modulosContainer, cursoId);
                }
              }
              
              // También actualizar la tabla de cursos si existe
              const tableContainer = document.querySelector('#cursos-table-container') || 
                                     document.querySelector('#admin-cursos-table-container');
              if (tableContainer) {
                renderCursosTable(tableContainer);
              }
              
              showAlert(`[SUCCESS] ¡Módulo ${isEdit ? 'actualizado' : 'creado'} exitosamente!\n\n[INFO] El módulo "${nombre}" está listo. Puedes agregar lecciones haciendo clic en "LECCIONES".`, {
                title: '[SUCCESS] Operación completada',
                icon: '[✓]',
                type: 'success'
              });
            } else {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
              submitBtn.style.opacity = '1';
              if (errorDiv) {
                errorDiv.innerHTML = `
                  <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                    <div>No se pudo guardar el módulo. Intenta de nuevo.</div>
                  </div>
                `;
                errorDiv.style.display = "block";
              }
            }
          }, 300);
        };
      }
    }
  });
  
  return closeModal;
}

// Renderiza el formulario de módulo (nuevo o editar)
export function renderModuloForm(container, cursoId, modulo = null) {
  if (!container || !cursoId) return;
  
  // Siempre usar modal para módulos
  const modulosListContainer = document.getElementById('modulos-list-container');
  showModuloFormModal(cursoId, modulo, modulosListContainer);
}

// Render input multimedia según el tipo de lección
export function renderMultimediaInput(container, tipo, leccion = null) {
  if (!container) return;
  
  if (tipo === 'video') {
    container.innerHTML = `
      <label for="leccion-videoUrl" class="terminal-label">
        <span class="label-prefix">></span>
        URL_VIDEO
      </label>
      <input 
        type="url" 
        id="leccion-videoUrl"
        name="videoUrl" 
        class="terminal-input"
        value="${leccion?.videoUrl || leccion?.multimedia?.videoUrl || ''}"
        placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
      />
      <div class="field-hint">
        💡 URL del video (YouTube, Vimeo, etc.)
      </div>
    `;
  } else if (tipo === 'lectura') {
    container.innerHTML = `
      <label for="leccion-texto" class="terminal-label">
        <span class="label-prefix">></span>
        TEXTO_LECCIÓN
      </label>
      <textarea 
        id="leccion-texto"
        name="texto" 
        rows="3"
        class="terminal-input"
        placeholder="Ingrese el contenido de la lección"
      >${leccion?.texto || ''}</textarea>
    `;
  } else if (tipo === 'quiz') {
    container.innerHTML = `
      <label for="leccion-pregunta" class="terminal-label">
        <span class="label-prefix">></span>
        PREGUNTA_QUIZ
      </label>
      <input 
        type="text" 
        id="leccion-pregunta"
        name="pregunta" 
        class="terminal-input"
        value="${leccion?.pregunta || ''}"
        placeholder="Ingrese la pregunta del quiz"
      />
    `;
  } else {
    container.innerHTML = '';
  }
  
  // Sección adicional de multimedia (PDFs, imágenes, enlaces) - disponible para todos los tipos
  const multimediaSection = document.createElement('div');
  multimediaSection.className = 'form-group-terminal';
  multimediaSection.style.marginTop = '1.5rem';
  multimediaSection.style.paddingTop = '1.5rem';
  multimediaSection.style.borderTop = '1px solid var(--terminal-border)';
  multimediaSection.innerHTML = `
    <label class="terminal-label" style="margin-bottom: 0.75rem;">
      <span class="label-prefix">></span>
      RECURSOS MULTIMEDIA ADICIONALES
      <span style="color: var(--terminal-text-dim); font-size: 0.7rem; font-weight: normal; margin-left: 0.5rem;">(Opcional)</span>
    </label>
    
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label for="leccion-pdfUrl" class="terminal-label" style="font-size: 0.8rem; font-weight: 600;">
          <span class="label-prefix">-</span>
          URL_PDF
        </label>
        <input 
          type="url" 
          id="leccion-pdfUrl"
          name="pdfUrl" 
          class="terminal-input"
          value="${leccion?.multimedia?.pdfUrl || leccion?.pdfUrl || ''}"
          placeholder="https://ejemplo.com/documento.pdf"
        />
      </div>
      
      <div>
        <label for="leccion-imagenUrl" class="terminal-label" style="font-size: 0.8rem; font-weight: 600;">
          <span class="label-prefix">-</span>
          URL_IMAGEN
        </label>
        <input 
          type="url" 
          id="leccion-imagenUrl"
          name="imagenUrl" 
          class="terminal-input"
          value="${leccion?.multimedia?.imagenUrl || leccion?.imagenUrl || ''}"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      
      <div>
        <label for="leccion-enlaces" class="terminal-label" style="font-size: 0.8rem; font-weight: 600;">
          <span class="label-prefix">-</span>
          ENLACES_ADICIONALES
        </label>
        <textarea 
          id="leccion-enlaces"
          name="enlaces" 
          rows="2"
          class="terminal-input"
          placeholder="Ingrese enlaces separados por comas o saltos de línea&#10;Ejemplo: https://ejemplo1.com, https://ejemplo2.com"
        >${leccion?.multimedia?.enlaces ? (Array.isArray(leccion.multimedia.enlaces) ? leccion.multimedia.enlaces.join(', ') : leccion.multimedia.enlaces) : leccion?.enlaces || ''}</textarea>
        <div class="field-hint">
          💡 Enlaces separados por comas o saltos de línea
        </div>
      </div>
    </div>
  `;
  container.appendChild(multimediaSection);
}

// Función para mostrar formulario de curso en modal (usado desde admin view)
function showCursoFormModal(curso = null, tableContainer = null) {
  const docentes = loadDocentes();
  const isEdit = !!curso;
  
  const formHTML = `
    <form id="curso-form" class="terminal-form">
      ${docentes.length === 0 ? `
      <div class="form-help-text form-help-warning">
        <div class="form-help-title">[ADVERTENCIA]</div>
        <div class="form-help-content">
          Primero crea un docente en <strong>"GESTIÓN DE DOCENTES"</strong> → <strong>"CREAR_DOCENTE"</strong>
        </div>
      </div>
      ` : ''}
      <div class="form-group-terminal">
        <label for="curso-codigo" class="terminal-label">
          <span class="label-prefix">></span>
          CÓDIGO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="curso-codigo"
          name="codigo" 
          required 
          value="${curso?.codigo || ''}"
          class="terminal-input"
          placeholder="Ejemplo: C101"
          autocomplete="off"
          ${isEdit ? "readonly" : ''}
        />
        <div class="field-hint">
          ${isEdit ? '🔒 Código no modificable' : '💡 Código único del curso'}
        </div>
      </div>
      <div class="form-group-terminal">
        <label for="curso-nombre" class="terminal-label">
          <span class="label-prefix">></span>
          NOMBRE_CURSO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="curso-nombre"
          name="nombre" 
          required 
          value="${curso?.nombre || ''}"
          class="terminal-input"
          placeholder="Ejemplo: JavaScript Avanzado"
          autocomplete="off"
        />
        <div class="field-hint">
          💡 Usa un nombre claro y descriptivo
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="curso-descripcion" class="terminal-label">
          <span class="label-prefix">></span>
          DESCRIPCION
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <textarea 
          id="curso-descripcion" 
          name="descripcion" 
          rows="2" 
          required
          class="terminal-input"
          placeholder="Ejemplo: Curso completo de JavaScript para desarrolladores..."
        >${curso?.descripcion || ''}</textarea>
        <div class="field-hint">
          💡 Describe brevemente el contenido del curso
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="curso-docente" class="terminal-label">
          <span class="label-prefix">></span>
          DOCENTE_ASIGNADO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <select 
          id="curso-docente" 
          name="docente" 
          required
          class="terminal-input"
          ${docentes.length === 0 ? "disabled" : ""}
        >
            ${
              docentes.length > 0
                ? `<option value="">-- Seleccione un docente --</option>
                  ${docentes.map(d => {
                    const nombreCompleto = (d.nombres || d.nombre || '') + ' ' + (d.apellidos || '');
                    const nombreDisplay = nombreCompleto.trim() || d.email;
                    return `<option value="${d.email}"${curso && curso.docente === d.email ? " selected" : ""}>
                      ${nombreDisplay} (${d.email})
                    </option>`;
                  }).join('')}`
                : `<option value="">No hay docentes disponibles. Agregue docentes primero.</option>`
            }
        </select>
        <div class="field-hint">
          ${docentes.length === 0 ? '⚠️ Crea un docente primero' : '💡 Selecciona el docente asignado'}
        </div>
      </div>
      
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success" id="submit-curso-btn" ${docentes.length === 0 ? "disabled" : ""}>
          <span class="btn-prefix">$</span>
          <span class="btn-text">${isEdit ? "ACTUALIZAR CURSO" : "CREAR CURSO"}</span>
          <span class="btn-suffix">→</span>
        </button>
        <button type="button" id="curso-cancel-btn" class="btn btn-secondary">
          <span class="btn-prefix">[</span>
          CANCELAR
          <span class="btn-suffix">]</span>
        </button>
      </div>
      <div id="curso-form-error" class="terminal-error" style="display:none;"></div>
    </form>
  `;
  
  const { closeModal, content } = showFormModal(formHTML, {
    title: isEdit ? "EDITAR CURSO" : "NUEVO CURSO",
    icon: "[>]",
    onFormReady: (modalContent, closeFn) => {
      // Configurar event listeners usando el contenido del modal
      const form = modalContent.querySelector('#curso-form');
      const cancelBtn = modalContent.querySelector('#curso-cancel-btn');
      const errorDiv = modalContent.querySelector('#curso-form-error');
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          closeFn();
        };
      }
      
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const codigo = form.codigo.value.trim();
          const nombre = form.nombre.value.trim();
          const descripcion = form.descripcion.value.trim();
          const docente = form.docente.value;
          
          // Validación mejorada con mensajes claros
          if (!codigo || !nombre || !descripcion || !docente) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.25rem;">Por favor completa todos los campos obligatorios:</div>
                    <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
                      ${!codigo ? '<li>El <strong>código</strong> es obligatorio</li>' : ''}
                      ${!nombre ? '<li>El <strong>nombre del curso</strong> es obligatorio</li>' : ''}
                      ${!descripcion ? '<li>La <strong>descripción</strong> es obligatoria</li>' : ''}
                      ${!docente ? '<li>Debes <strong>seleccionar un docente</strong></li>' : ''}
                    </ul>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
              // Resaltar campos vacíos
              if (!codigo) form.codigo.style.borderColor = 'var(--terminal-error)';
              if (!nombre) form.nombre.style.borderColor = 'var(--terminal-error)';
              if (!descripcion) form.descripcion.style.borderColor = 'var(--terminal-error)';
              if (!docente) form.docente.style.borderColor = 'var(--terminal-error)';
            }
            return;
          }
          
          // Resetear estilos de error
          form.codigo.style.borderColor = '';
          form.nombre.style.borderColor = '';
          form.descripcion.style.borderColor = '';
          form.docente.style.borderColor = '';
          
          // Validar código único
          const cursos = loadCursos();
          const esEdicion = !!curso;
          const yaExisteCodigo = cursos.some(c => c.codigo === codigo && c.id !== curso?.id);
          
          if (yaExisteCodigo) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.5rem;">Ya existe un curso con este código.</div>
                    <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                      Por favor, usa un código diferente.
                    </div>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
              form.codigo.style.borderColor = 'var(--terminal-error)';
              form.codigo.focus();
            }
            return;
          }
          
          if (docentes.length === 0) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.5rem;">No hay docentes disponibles en el sistema.</div>
                    <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                      <strong>Para crear un curso:</strong><br>
                      1. Ve a la sección "GESTIÓN DE DOCENTES"<br>
                      2. Haz clic en "CREAR_DOCENTE"<br>
                      3. Crea al menos un docente<br>
                      4. Luego podrás crear cursos
                    </div>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
            }
            return;
          }
          
          // Mostrar indicador de carga
          const submitBtn = modalContent.querySelector('#submit-curso-btn');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-prefix">[</span> GUARDANDO... <span class="btn-suffix">]</span>';
          submitBtn.style.opacity = '0.7';
          
          // Simular pequeño delay para mejor UX
          setTimeout(() => {
            const nuevoCurso = {
              id: curso?.id || `curso_${Date.now()}`,
              codigo: codigo,
              nombre: nombre,
              descripcion: descripcion,
              docente: docente,
              modulos: curso?.modulos || []
            };
            
            if (saveCurso(nuevoCurso)) {
              closeFn();
              
              // Recargar tabla de cursos
              if (tableContainer) {
                renderCursosTable(tableContainer);
              } else {
                const tableContainer2 = document.getElementById('cursos-table-container') || 
                                       document.getElementById('admin-cursos-table-container');
                if (tableContainer2) {
                  renderCursosTable(tableContainer2);
                }
              }
              
              const docenteNombre = docentes.find(d => d.email === docente);
              const docenteDisplay = docenteNombre ? ((docenteNombre.nombres || docenteNombre.nombre || '') + ' ' + (docenteNombre.apellidos || '')).trim() : docente;
              
              showAlert(`[SUCCESS] ¡Curso ${isEdit ? 'actualizado' : 'creado'} exitosamente!\n\n[INFO] Detalles:\n• Nombre: ${nombre}\n• Docente: ${docenteDisplay}\n\n[OK] El curso ya está disponible. Puedes agregar módulos y lecciones haciendo clic en "MODULOS".`, {
                title: '[SUCCESS] Operación completada',
                icon: '[✓]',
                type: 'success'
              });
            } else {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
              submitBtn.style.opacity = '1';
              if (errorDiv) {
                errorDiv.innerHTML = `
                  <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                    <div>
                      <div style="margin-bottom: 0.5rem;">No se pudo guardar el curso. Por favor intenta de nuevo.</div>
                      <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                        Si el problema persiste, verifica que tu navegador permita el almacenamiento local.
                      </div>
                    </div>
                  </div>
                `;
                errorDiv.style.display = "block";
              }
            }
          }, 300);
        };
      }
    }
  });
  
  return closeModal;
}

// Renderiza el formulario de curso (nuevo o editar)
export function renderCursoForm(container, curso = null) {
  if (!container) return;
  
  // Si se llama desde admin view, usar modal
  const adminView = document.querySelector('admin-view');
  if (adminView) {
    const tableContainer = adminView.querySelector('#admin-cursos-table-container');
    showCursoFormModal(curso, tableContainer);
    return;
  }
  
  // Comportamiento legacy para otras vistas
  container.style.display = "block";

  // Obtenemos los docentes antes de poblar el form
  const docentes = loadDocentes();

  container.innerHTML = `
    <div class="terminal-form-header">
      <h3 class="form-title-terminal">
        <span class="form-prefix">[FORM]</span>
        ${curso ? "EDITAR CURSO" : "NUEVO CURSO"}
      </h3>
    </div>
    <form id="curso-form" class="terminal-form">
      <div class="form-group-terminal">
        <label for="curso-nombre" class="terminal-label">
          <span class="label-prefix">></span>
          NOMBRE_CURSO
        </label>
        <input 
          type="text" 
          id="curso-nombre" 
          name="nombre" 
          required 
          value="${curso?.nombre || ''}"
          class="terminal-input"
          placeholder="Ingrese el nombre del curso"
        />
      </div>
      
      <div class="form-group-terminal">
        <label for="curso-descripcion" class="terminal-label">
          <span class="label-prefix">></span>
          DESCRIPCION
        </label>
        <textarea 
          id="curso-descripcion" 
          name="descripcion" 
          rows="2" 
          required
          class="terminal-input"
          placeholder="Ingrese la descripción del curso"
        >${curso?.descripcion || ''}</textarea>
      </div>
      
      <div class="form-group-terminal">
        <label for="curso-docente" class="terminal-label">
          <span class="label-prefix">></span>
          DOCENTE_ASIGNADO
        </label>
        <select 
          id="curso-docente" 
          name="docente" 
          required
          class="terminal-input"
          ${docentes.length === 0 ? "disabled" : ""}
        >
            ${
              docentes.length > 0
                ? `<option value="">-- Seleccione un docente --</option>
                  ${docentes.map(d => {
                    const nombreCompleto = (d.nombres || d.nombre || '') + ' ' + (d.apellidos || '');
                    const nombreDisplay = nombreCompleto.trim() || d.email;
                    return `<option value="${d.email}"${curso && curso.docente === d.email ? " selected" : ""}>
                      ${nombreDisplay} (${d.email})
                    </option>`;
                  }).join('')}`
                : `<option value="">No hay docentes disponibles. Agregue docentes primero.</option>`
            }
        </select>
      </div>
      
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success" ${docentes.length === 0 ? "disabled" : ""}>
          <span class="btn-prefix">$</span>
          ${curso ? "ACTUALIZAR" : "CREAR"}
          <span class="btn-suffix">→</span>
        </button>
        <button type="button" id="curso-cancel-btn" class="btn btn-secondary">
          <span class="btn-prefix">[</span>
          CANCELAR
          <span class="btn-suffix">]</span>
        </button>
      </div>
      <div id="curso-form-error" class="terminal-error" style="display:none;"></div>
    </form>
  `;

  // Agregar estilos al formulario
  if (!document.getElementById('curso-form-styles')) {
    const style = document.createElement('style');
    style.id = 'curso-form-styles';
    style.textContent = `
      .terminal-form-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--terminal-border);
      }
      
      .form-title-terminal {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--terminal-accent);
        text-shadow: var(--glow-blue);
        letter-spacing: 2px;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .form-prefix {
        color: var(--terminal-text);
        font-size: 0.875rem;
      }
      
      .terminal-form {
        font-family: var(--font-terminal);
      }
      
      .form-group-terminal {
        margin-bottom: 1.5rem;
      }
      
      .terminal-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        color: var(--terminal-text);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .label-prefix {
        color: var(--terminal-accent);
        font-weight: 700;
      }
      
      .terminal-input {
        width: 100%;
        padding: 0.75rem 1rem;
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        background: var(--terminal-bg);
        border: 2px solid var(--terminal-border);
        color: var(--terminal-text);
        transition: all var(--transition-fast);
        outline: none;
        letter-spacing: 0.5px;
      }
      
      .terminal-input:focus {
        border-color: var(--terminal-text);
        box-shadow: var(--glow-green);
        background: rgba(0, 255, 65, 0.05);
      }
      
      .terminal-input::placeholder {
        color: var(--terminal-text-dim);
        opacity: 0.5;
      }
      
      select.terminal-input {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300ff41' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        padding-right: 2.5rem;
      }
      
      select.terminal-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      select.terminal-input option {
        background: var(--terminal-bg);
        color: var(--terminal-text);
      }
      
      .form-actions-terminal {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--terminal-border);
      }
      
      .terminal-error {
        padding: 1rem;
        background: rgba(255, 0, 68, 0.1);
        border: 2px solid var(--terminal-error);
        color: var(--terminal-error);
        margin-top: 1rem;
        font-size: 0.875rem;
        text-shadow: 0 0 10px rgba(255, 0, 68, 0.5);
        box-shadow: 0 0 20px rgba(255, 0, 68, 0.3);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Configurar cancelar
  container.querySelector('#curso-cancel-btn').onclick = () => {
    container.style.display = "none";
    container.innerHTML = "";
  };

  // Configurar submit
  container.querySelector('#curso-form').onsubmit = (e) => {
    e.preventDefault();
    const errorDiv = container.querySelector('#curso-form-error');
    const form = e.target;

    // Chequeo de docentes disponibles
    if (docentes.length === 0) {
      errorDiv.textContent = "[ERROR] Debe agregar un docente antes de crear cursos.";
      errorDiv.style.display = "block";
      return;
    }
    
    const nuevoCurso = {
      id: curso?.id || `curso_${Date.now()}`,
      codigo: form.codigo?.value.trim() || `C${Date.now()}`,
      nombre: form.nombre.value.trim(),
      descripcion: form.descripcion.value.trim(),
      docente: form.docente.value,
      modulos: curso?.modulos || []
    };

    if (!nuevoCurso.nombre || !nuevoCurso.descripcion || !nuevoCurso.docente) {
      errorDiv.textContent = "[ERROR] Todos los campos son obligatorios";
      errorDiv.style.display = "block";
      return;
    }

    if (saveCurso(nuevoCurso)) {
      container.style.display = "none";
      container.innerHTML = "";
      // Recargar tabla de cursos (buscar en admin o cursos view)
      const tableContainer = document.querySelector('#cursos-table-container') || 
                             document.querySelector('#admin-cursos-table-container');
      if (tableContainer) {
        renderCursosTable(tableContainer);
      }
      // Limpiar parámetro de URL solo si no estamos en admin
      if (!window.location.hash.includes('/admin')) {
        window.location.hash = window.location.hash.split('?')[0];
      }
    } else {
      errorDiv.textContent = "[ERROR] No se pudo guardar el curso";
      errorDiv.style.display = "block";
    }
  };
}

// Renderiza la tabla de cursos
export function renderCursosTable(container) {
  if (!container) return;
  const cursos = loadCursos();
  if (!cursos.length) {
    container.innerHTML = `
      <div class="abc-empty-state terminal-empty-state" style="text-align: center; padding: 3rem 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">📖</div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--terminal-accent); margin-bottom: 0.75rem;">
          [INFO] No hay cursos registrados
        </div>
        <div style="color: var(--terminal-text-dim); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Para comenzar, crea tu primer curso haciendo clic en el botón <strong>"CREAR_CURSO"</strong> arriba.
        </div>
        <div style="color: var(--terminal-text-dim); font-size: 0.85rem; line-height: 1.6;">
          💡 <strong>Tip:</strong> Necesitas tener al menos un docente creado antes de crear un curso.
        </div>
      </div>
    `;
    return;
  }
  
  // Agregar estilos si no existen
  if (!document.getElementById('cursos-table-styles')) {
    const style = document.createElement('style');
    style.id = 'cursos-table-styles';
    style.textContent = `
      .cursos-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
      }
      
      .cursos-table th {
        background: var(--terminal-surface);
        padding: 1rem;
        text-align: left;
        font-weight: 700;
        color: var(--terminal-accent);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
        border-bottom: 1px solid var(--terminal-border);
      }
      
      .cursos-table td {
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--terminal-border);
        color: var(--terminal-text-dim);
        transition: all var(--transition-base);
        vertical-align: middle;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .cursos-table td:last-child {
        max-width: none;
        overflow: visible;
        white-space: normal;
      }
      
      .cursos-table tr:hover {
        background: rgba(0, 255, 65, 0.03);
      }
      
      .cursos-table tr:hover td {
        color: var(--terminal-text);
      }
      
      .cursos-table tr:last-child td {
        border-bottom: none;
      }
      
      .cursos-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
        padding: 0.5rem 0;
      }
      
      .curso-edit-btn, .curso-delete-btn, .curso-modulos-btn {
        padding: 0.5rem 1rem;
        font-family: var(--font-terminal);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 1px solid;
        background: transparent;
        cursor: pointer;
        transition: background var(--transition-fast), border-color var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .curso-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .curso-edit-btn:hover {
        background: rgba(0, 217, 255, 0.1);
      }
      
      .curso-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .curso-delete-btn:hover {
        background: rgba(255, 0, 68, 0.1);
      }
      
      .curso-modulos-btn {
        border-color: var(--terminal-success);
        color: var(--terminal-success);
      }
      
      .curso-modulos-btn:hover {
        background: rgba(0, 255, 136, 0.1);
      }
      
      .cursos-table td:last-child {
        padding: 1rem;
      }
      
      .terminal-empty-state {
        padding: 2rem;
        text-align: center;
        color: var(--terminal-text-dim);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
        border: 2px dashed var(--terminal-border);
        background: var(--terminal-surface);
      }
      
      /* Responsive - Tablet y móvil */
      @media (max-width: 768px) {
        .cursos-table {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 0.75rem;
        }
        
        .cursos-table thead {
          display: none;
        }
        
        .cursos-table tbody {
          display: block;
        }
        
        .cursos-table tr {
          display: block;
          margin-bottom: 1rem;
          border: 2px solid var(--terminal-border);
          background: var(--terminal-surface);
          padding: 0.75rem;
        }
        
        .cursos-table td {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--terminal-border);
          max-width: 100%;
          white-space: normal;
          text-overflow: initial;
        }
        
        .cursos-table td:last-child {
          border-bottom: none;
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }
        
        .cursos-table td::before {
          content: attr(data-label);
          font-weight: 700;
          color: var(--terminal-accent);
          text-transform: uppercase;
          font-size: 0.7rem;
          margin-right: 0.5rem;
          min-width: 120px;
          flex-shrink: 0;
        }
        
        .cursos-actions {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .curso-edit-btn, .curso-delete-btn, .curso-modulos-btn {
          width: 100%;
          justify-content: center;
          margin: 0;
        }
      }
      
      @media (max-width: 480px) {
        .cursos-table {
          font-size: 0.7rem;
        }
        
        .cursos-table tr {
          padding: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .cursos-table td {
          padding: 0.4rem 0.5rem;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        
        .cursos-table td::before {
          margin-right: 0;
          margin-bottom: 0.25rem;
          min-width: auto;
        }
        
        .curso-edit-btn, .curso-delete-btn, .curso-modulos-btn {
          font-size: 0.65rem;
          padding: 0.4rem 0.75rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Agregar data-label a las celdas para responsive
  const tableRows = cursos.map(c => `
    <tr>
      <td data-label="CÓDIGO">${c.codigo || 'N/A'}</td>
      <td data-label="NOMBRE">${c.nombre || ""}</td>
      <td data-label="DESCRIPCION">${c.descripcion || ""}</td>
      <td data-label="MODULOS">${(Array.isArray(c.modulos) ? c.modulos.length : 0)}</td>
      <td data-label="ACCIONES" class="cursos-actions">
        <button class="curso-edit-btn" data-id="${c.id}">EDITAR</button>
        <button class="curso-delete-btn" data-id="${c.id}">ELIMINAR</button>
        <button class="curso-modulos-btn" data-id="${c.id}">MODULOS</button>
      </td>
    </tr>
  `).join('');
  
  let table = `<table class="cursos-table">
    <thead>
      <tr>
        <th>CÓDIGO</th>
        <th>NOMBRE</th>
        <th>DESCRIPCION</th>
        <th>MODULOS</th>
        <th>ACCIONES</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>`;
  container.innerHTML = table;

  // Listeners para botones de cursos
  container.querySelectorAll('.curso-edit-btn').forEach(btn => {
    btn.onclick = () => {
      const curso = loadCursos().find(c => c.id === btn.dataset.id);
      // Si estamos en admin view, usar modal
      const adminView = document.querySelector('admin-view');
      if (adminView) {
        const tableContainer = adminView.querySelector('#admin-cursos-table-container');
        showCursoFormModal(curso, tableContainer);
        return;
      }
      
      // Comportamiento legacy para otras vistas
      const formContainer = document.getElementById('cursos-form-container');
      if (formContainer && typeof renderCursoForm === "function") {
        formContainer.style.display = 'block';
        renderCursoForm(formContainer, curso);
      } else {
        console.error('[ERROR] No se encontró el contenedor de formulario de cursos o la función renderCursoForm');
      }
    };
  });
  container.querySelectorAll('.curso-delete-btn').forEach(btn => {
    btn.onclick = () => {
      const cursoId = btn.dataset.id;
      const curso = loadCursos().find(c => c.id === cursoId);
      
      // Contar módulos y lecciones antes de mostrar el mensaje
      let modulosCount = 0;
      let leccionesCount = 0;
      if (curso && Array.isArray(curso.modulos)) {
        modulosCount = curso.modulos.length;
        curso.modulos.forEach(modulo => {
          if (Array.isArray(modulo.lecciones)) {
            leccionesCount += modulo.lecciones.length;
          }
        });
      }
      
      let confirmMessage = `
[WARNING] ¿Estás seguro de eliminar este curso?

[INFO] Detalles del curso:
  • Nombre: ${curso?.nombre || cursoId}
  • Descripción: ${curso?.descripcion || 'Sin descripción'}
      `.trim();
      
      if (modulosCount > 0 || leccionesCount > 0) {
        confirmMessage += `\n\n[WARNING] ⚠️ ATENCIÓN: También se eliminarán TODOS los contenidos asociados:`;
        if (modulosCount > 0) {
          confirmMessage += `\n  • ${modulosCount} módulo(s)`;
        }
        if (leccionesCount > 0) {
          confirmMessage += `\n  • ${leccionesCount} lección(es)`;
        }
        confirmMessage += `\n\n[INFO] Esto significa que perderás todo el contenido del curso permanentemente.`;
      } else {
        confirmMessage += `\n\n[INFO] Este curso no tiene módulos ni lecciones asociadas.`;
      }
      
      confirmMessage += `\n\n[WARNING] ⚠️ Esta acción es PERMANENTE y NO se puede deshacer.`;
      
      showConfirm(confirmMessage.trim(), {
        title: '[WARNING] Confirmar eliminación',
        icon: '[!]',
        confirmText: 'ELIMINAR',
        cancelText: 'CANCELAR'
      }).then(confirmed => {
        if (!confirmed) {
          console.log('[INFO] Operación cancelada');
          return;
        }
        
        const resultado = deleteCurso(cursoId);
        
        if (resultado.success) {
          renderCursosTable(container);
          console.log('[SYSTEM] Curso eliminado:', cursoId);
          console.log('[SYSTEM] Módulos eliminados:', resultado.modulosEliminados);
          console.log('[SYSTEM] Lecciones eliminadas:', resultado.leccionesEliminadas);
          
          let successMessage = `[SUCCESS] ¡Curso eliminado exitosamente!

[INFO] El curso "${resultado.nombreCurso}" ha sido eliminado del sistema.`;
          
          if (resultado.modulosEliminados > 0 || resultado.leccionesEliminadas > 0) {
            successMessage += `\n\n[INFO] También se eliminaron automáticamente:`;
            if (resultado.modulosEliminados > 0) {
              successMessage += `\n  • ${resultado.modulosEliminados} módulo(s)`;
            }
            if (resultado.leccionesEliminadas > 0) {
              successMessage += `\n  • ${resultado.leccionesEliminadas} lección(es)`;
            }
            successMessage += `\n\n[OK] Todos los contenidos asociados han sido eliminados.`;
          } else {
            successMessage += `\n\n[OK] La tabla de cursos ha sido actualizada.`;
          }
          
          showAlert(successMessage, {
            title: '[SUCCESS] Eliminación completada',
            icon: '[✓]',
            type: 'success'
          });
        } else {
          showAlert(`[ERROR] No se pudo eliminar el curso\n[INFO] El curso no fue encontrado`, {
            title: '[ERROR] Error al eliminar',
            icon: '[X]',
            type: 'error'
          });
        }
      });
    };
  });
  container.querySelectorAll('.curso-modulos-btn').forEach(btn => {
    btn.onclick = () => {
      const cursoId = btn.dataset.id;
      console.log('[SYSTEM] Botón módulos clicked para curso:', cursoId);
      
      // Buscar contenedor en admin view o cursos view
      const modulosContainer = document.getElementById('modulos-list-container');
      const modulosFormContainer = document.getElementById('modulos-form-container');
      const leccionesContainer = document.getElementById('lecciones-list-container');
      const leccionFormContainer = document.getElementById('leccion-form-container');
      
      // Ocultar otros contenedores (formularios de curso, módulo, lección)
      const formContainer = document.getElementById('cursos-form-container') || 
                            document.getElementById('admin-cursos-form-container');
      if (formContainer) formContainer.style.display = 'none';
      if (modulosFormContainer) modulosFormContainer.style.display = 'none';
      if (leccionesContainer) leccionesContainer.style.display = 'none';
      if (leccionFormContainer) leccionFormContainer.style.display = 'none';
      
      // Verificar que renderModulosList existe
      if (typeof renderModulosList !== "function") {
        console.error('[ERROR] La función renderModulosList no está disponible');
        showAlert('[ERROR] La función de módulos no está disponible\n[INFO] Por favor, recarga la página', {
          title: '[ERROR] Error del sistema',
          icon: '[X]',
          type: 'error'
        });
        return;
      }
      
      // Mostrar contenedor de módulos
      if (modulosContainer) {
        modulosContainer.style.display = 'block';
        renderModulosList(modulosContainer, cursoId);
        console.log('[SYSTEM] Módulos renderizados para el curso:', cursoId);
        
        // Hacer scroll suave al contenedor para que sea visible
        setTimeout(() => {
          modulosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        console.error('[ERROR] No se encontró el contenedor #modulos-list-container');
        showAlert('[ERROR] No se encontró el contenedor de módulos\n[INFO] Asegúrate de estar en la vista de Admin o Cursos', {
          title: '[ERROR] Error del sistema',
          icon: '[X]',
          type: 'error'
        });
      }
    };
  });
}

// Renderiza vista acordeón de cursos, módulos y lecciones
export function renderCursosAcordeon(container) {
  if (!container) return;
  const cursos = loadCursos();
  const docentes = loadDocentes();

  if (!cursos.length) {
    container.innerHTML = `<div class="abc-empty-state">No hay cursos registrados.</div>`;
    return;
  }

  // Función auxiliar para obtener el nombre del docente
  const getDocenteNombre = (email) => {
    if (!email) return 'No asignado';
    const docente = docentes.find(d => d.email === email);
    if (!docente) return email; // Si no se encuentra, mostrar el email
    return (docente.nombre || docente.nombres || '') + (docente.apellidos ? ' ' + docente.apellidos : '') || docente.email;
  };

  const contenido = `
    <style>
      .curso-acordeon, .modulo-acordeon { 
        border: 2px solid var(--terminal-border, #1a1a1a); 
        margin-bottom: 1rem; 
        overflow: hidden; 
        background: var(--terminal-surface, #121212);
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        transition: all 0.15s ease;
      }
      .curso-acordeon:hover, .modulo-acordeon:hover {
        border-color: var(--terminal-text, #00ff41);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
      }
      .curso-cabecera, .modulo-cabecera { 
        cursor: pointer; 
        background: var(--terminal-surface, #121212); 
        padding: 1rem 1.25rem; 
        font-weight: 600; 
        display: flex; 
        align-items: center; 
        justify-content: space-between;
        color: var(--terminal-text, #00ff41);
        border-bottom: 1px solid var(--terminal-border, #1a1a1a);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.875rem;
        transition: all 0.15s ease;
      }
      .curso-cabecera:hover, .modulo-cabecera:hover {
        background: rgba(0, 255, 65, 0.1);
        color: var(--terminal-accent, #00d9ff);
        text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
      }
      .curso-cabecera span, .modulo-cabecera span { flex: 1; }
      .curso-cabecera::before {
        content: '[+] ';
        color: var(--terminal-accent, #00d9ff);
        margin-right: 0.5rem;
        font-weight: 700;
      }
      .acordeon-abierto > .curso-cabecera::before,
      .acordeon-abierto > .modulo-cabecera::before {
        content: '[-] ';
      }
      .curso-cuerpo, .modulo-cuerpo { 
        padding: 1rem 1.25rem; 
        background: var(--terminal-bg, #0a0a0a); 
        display: none; 
        border-top: 1px solid var(--terminal-border, #1a1a1a);
      }
      .acordeon-abierto > .curso-cuerpo, .acordeon-abierto > .modulo-cuerpo { 
        display: block; 
        animation: slideDown 0.2s ease-out;
      }
      @keyframes slideDown {
        from {
          opacity: 0;
          max-height: 0;
        }
        to {
          opacity: 1;
          max-height: 1000px;
        }
      }
      .curso-info {
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: rgba(0, 255, 65, 0.05);
        border-left: 3px solid var(--terminal-accent, #00d9ff);
        font-size: 0.8125rem;
      }
      .curso-info-label {
        color: var(--terminal-accent, #00d9ff);
        font-weight: 600;
        margin-right: 0.5rem;
      }
      .curso-info-value {
        color: var(--terminal-text, #00ff41);
      }
      .lecciones-lista { 
        margin-top: 0.75rem; 
        margin-bottom: 0.75rem; 
        padding-left: 1.5rem; 
        list-style: none;
      }
      .lecciones-lista li { 
        margin-bottom: 0.5rem; 
        color: var(--terminal-text-dim, #00cc33);
        font-size: 0.875rem;
        padding: 0.5rem;
        border-left: 2px solid var(--terminal-border, #1a1a1a);
        padding-left: 1rem;
        transition: all 0.15s ease;
      }
      .lecciones-lista li:hover {
        border-left-color: var(--terminal-accent, #00d9ff);
        color: var(--terminal-text, #00ff41);
        background: rgba(0, 255, 65, 0.05);
        padding-left: 1.25rem;
      }
      .lecciones-lista li::before {
        content: '→ ';
        color: var(--terminal-accent, #00d9ff);
        margin-right: 0.5rem;
      }
      .leccion-nombre {
        cursor: pointer;
        text-decoration: underline;
        text-decoration-color: var(--terminal-accent, #00d9ff);
        text-underline-offset: 2px;
        transition: all 0.15s ease;
      }
      .leccion-nombre:hover {
        color: var(--terminal-accent, #00d9ff);
        text-decoration-color: var(--terminal-text, #00ff41);
      }
      .leccion-detalle {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(0, 255, 65, 0.05);
        border: 1px solid var(--terminal-border, #1a1a1a);
        border-left: 3px solid var(--terminal-accent, #00d9ff);
        font-size: 0.8125rem;
        display: none;
      }
      .leccion-detalle.mostrar {
        display: block;
        animation: slideDown 0.2s ease-out;
      }
      .leccion-detalle-label {
        color: var(--terminal-accent, #00d9ff);
        font-weight: 600;
        margin-right: 0.5rem;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
      }
      .leccion-detalle-value {
        color: var(--terminal-text, #00ff41);
        margin-top: 0.5rem;
        display: block;
      }
      .leccion-link {
        color: var(--terminal-accent, #00d9ff);
        text-decoration: underline;
        word-break: break-all;
      }
      .leccion-link:hover {
        color: var(--terminal-text, #00ff41);
      }
      .leccion-texto {
        white-space: pre-wrap;
        line-height: 1.6;
        color: var(--terminal-text-dim, #00cc33);
      }
      .modulo-count, .leccion-count {
        color: var(--terminal-text-dim, #00cc33);
        font-size: 0.75rem;
        margin-left: 1rem;
        font-weight: normal;
        text-transform: none;
        letter-spacing: 0;
      }
      .abc-empty-state {
        color: var(--terminal-text-dim, #00cc33);
        font-size: 0.875rem;
        font-style: italic;
        padding: 1rem;
        text-align: center;
        border: 1px dashed var(--terminal-border, #1a1a1a);
      }
    </style>
    <div>
      ${cursos.map(curso => {
        const docenteNombre = getDocenteNombre(curso.docente);
        return `
        <div class="curso-acordeon" data-curso="${curso.id}">
          <div class="curso-cabecera">
            <span>${curso.nombre || "Curso sin nombre"}</span>
            <span class="modulo-count">[${Array.isArray(curso.modulos) ? curso.modulos.length : 0} módulos]</span>
          </div>
          <div class="curso-cuerpo">
            <div class="curso-info">
              <span class="curso-info-label">[PROFESOR]</span>
              <span class="curso-info-value">${docenteNombre}</span>
            </div>
            ${Array.isArray(curso.modulos) && curso.modulos.length ? curso.modulos.map(modulo => `
              <div class="modulo-acordeon" data-modulo="${modulo.id}">
                <div class="modulo-cabecera">
                  <span>${modulo.nombre || "Módulo sin nombre"}</span>
                  <span class="leccion-count">[${Array.isArray(modulo.lecciones) ? modulo.lecciones.length : 0} lecciones]</span>
                </div>
                <div class="modulo-cuerpo">
                  ${Array.isArray(modulo.lecciones) && modulo.lecciones.length ? `
                    <ul class="lecciones-lista">
                      ${modulo.lecciones.map((leccion, leccionIdx) => `
                        <li data-curso-id="${curso.id}" data-modulo-id="${modulo.id}" data-leccion-id="${leccion.id}" data-leccion-index="${leccionIdx}">
                          <span class="leccion-nombre">${leccion.titulo || "Lección sin nombre"}</span>
                          <div class="leccion-detalle" id="leccion-detalle-${curso.id}-${modulo.id}-${leccion.id}">
                            ${leccion.descripcion ? `
                              <div style="margin-bottom: 0.75rem;">
                                <span class="leccion-detalle-label">[DESCRIPCION]</span>
                                <span class="leccion-detalle-value">${leccion.descripcion}</span>
                              </div>
                            ` : ''}
                            ${leccion.tipo === 'video' && leccion.videoUrl ? `
                              <div>
                                <span class="leccion-detalle-label">[VIDEO]</span>
                                <a href="${leccion.videoUrl}" target="_blank" class="leccion-link leccion-detalle-value">${leccion.videoUrl}</a>
                              </div>
                            ` : ''}
                            ${leccion.tipo === 'lectura' && leccion.texto ? `
                              <div>
                                <span class="leccion-detalle-label">[CONTENIDO]</span>
                                <div class="leccion-texto leccion-detalle-value">${leccion.texto}</div>
                              </div>
                            ` : ''}
                            ${leccion.tipo === 'quiz' && leccion.pregunta ? `
                              <div>
                                <span class="leccion-detalle-label">[PREGUNTA]</span>
                                <span class="leccion-detalle-value">${leccion.pregunta}</span>
                              </div>
                            ` : ''}
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                  ` : `<div class="abc-empty-state" style="padding:0.4em 0 0.3em 0.2em;">No hay lecciones.</div>`}
                </div>
              </div>
            `).join('') : `<div class="abc-empty-state" style="padding:0.6em;">No hay módulos.</div>`}
          </div>
        </div>
      `;
      }).join('')}
    </div>
  `;
  container.innerHTML = contenido;

  // Alternar acordeón abiertos o cerrados
  function alternarAcordeon(elemento, claseAcordeon) {
    if (elemento.classList.contains("acordeon-abierto")) {
      elemento.classList.remove("acordeon-abierto");
    } else {
      const hermanos = elemento.parentElement.querySelectorAll(`:scope > .${claseAcordeon}`);
      hermanos.forEach(h => h.classList.remove("acordeon-abierto"));
      elemento.classList.add("acordeon-abierto");
    }
  }

  // Listener cursos
  container.querySelectorAll('.curso-cabecera').forEach(cabecera => {
    cabecera.onclick = function() {
      const acordeon = this.parentElement;
      alternarAcordeon(acordeon, 'curso-acordeon');
    };
  });

  // Listener módulos
  container.querySelectorAll('.modulo-cabecera').forEach(cabecera => {
    cabecera.onclick = function(e) {
      e.stopPropagation();
      const acordeon = this.parentElement;
      alternarAcordeon(acordeon, 'modulo-acordeon');
    };
  });

  // Listener para nombres de lecciones (mostrar/ocultar detalle)
  container.querySelectorAll('.leccion-nombre').forEach(nombre => {
    nombre.onclick = function(e) {
      e.stopPropagation();
      const li = this.closest('li');
      if (!li) return;
      
      const detalleId = `leccion-detalle-${li.dataset.cursoId}-${li.dataset.moduloId}-${li.dataset.leccionId}`;
      const detalle = document.getElementById(detalleId);
      
      if (detalle) {
        // Toggle mostrar/ocultar
        if (detalle.classList.contains('mostrar')) {
          detalle.classList.remove('mostrar');
        } else {
          // Cerrar otros detalles abiertos en el mismo módulo
          const modulo = li.closest('.modulo-acordeon');
          if (modulo) {
            modulo.querySelectorAll('.leccion-detalle.mostrar').forEach(d => {
              d.classList.remove('mostrar');
            });
          }
          // Mostrar este detalle
          detalle.classList.add('mostrar');
        }
      }
    };
  });
}

