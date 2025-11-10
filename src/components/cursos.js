// Cargar cursos desde localStorage
export function loadCursos() {
  const cursosJson = localStorage.getItem('cursos');
  try {
    const list = cursosJson ? JSON.parse(cursosJson) : [];
    if (Array.isArray(list)) return list;
    return [];
  } catch {
    return [];
  }
}

// Guardar un curso (nuevo o editado)
export function saveCurso(curso) {
  if (!curso || !curso.id) return false;
  let cursos = loadCursos();
  const idx = cursos.findIndex(c => c.id === curso.id);
  if (idx !== -1) {
    cursos[idx] = { ...cursos[idx], ...curso };
  } else {
    if (!Array.isArray(curso.modulos)) curso.modulos = [];
    cursos.push(curso);
  }
  localStorage.setItem('cursos', JSON.stringify(cursos));
  return true;
}

// Eliminar un curso por id
export function deleteCurso(id) {
  let cursos = loadCursos();
  cursos = cursos.filter(c => c.id !== id);
  localStorage.setItem('cursos', JSON.stringify(cursos));
}

// Cargar módulos de un curso
export function loadModulos(cursoId) {
  const curso = loadCursos().find(c => c.id === cursoId);
  return curso && Array.isArray(curso.modulos) ? curso.modulos : [];
}

// Guardar un módulo (nuevo o editado) en un curso
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
  localStorage.setItem('cursos', JSON.stringify(cursos));
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
  localStorage.setItem('cursos', JSON.stringify(cursos));
}

// Renderiza la lista de módulos de un curso
export function renderModulosList(container, cursoId) {
  if (!container) return;
  const modulos = loadModulos(cursoId);
  if (!modulos.length) {
    container.innerHTML = `<div class="abc-empty-state">No hay módulos registrados.</div>`;
    return;
  }
  let table = `<table class="modulos-table">
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
            <button class="modulo-edit-btn" data-id="${m.id}">Editar</button>
            <button class="modulo-delete-btn" data-id="${m.id}">Eliminar</button>
            <button class="modulo-lecciones-btn" data-id="${m.id}">Ver Lecciones</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
  container.innerHTML = table;

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
      deleteModulo(cursoId, btn.dataset.id);
      renderModulosList(container, cursoId);
    }
  });
  container.querySelectorAll('.modulo-lecciones-btn').forEach(btn => {
    btn.onclick = () => {
      if (typeof renderLeccionesList === "function") {
        renderLeccionesList(
          document.getElementById('lecciones-list-container'),
          cursoId,
          btn.dataset.id
        );
      }
    }
  });
}

// Cargar lecciones de un módulo
export function loadLecciones(cursoId, moduloId) {
  const modulos = loadModulos(cursoId);
  const modulo = modulos.find(m => m.id === moduloId);
  return modulo && Array.isArray(modulo.lecciones) ? modulo.lecciones : [];
}

// Guardar una lección (nueva o editada)
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
  localStorage.setItem('cursos', JSON.stringify(cursos));
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
  localStorage.setItem('cursos', JSON.stringify(cursos));
}

// Renderiza la lista de lecciones de un módulo
export function renderLeccionesList(container, cursoId, moduloId) {
  if (!container) return;
  const lecciones = loadLecciones(cursoId, moduloId);
  if (!lecciones.length) {
    container.innerHTML = '<div class="abc-empty-state">No hay lecciones registradas.</div>';
    return;
  }
  let table = `<table class="lecciones-table">
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
            <button class="leccion-edit-btn" data-id="${l.id}">Editar</button>
            <button class="leccion-delete-btn" data-id="${l.id}">Eliminar</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
  container.innerHTML = table;

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
      deleteLeccion(cursoId, moduloId, btn.dataset.id);
      renderLeccionesList(container, cursoId, moduloId);
    }
  });
}

// Renderiza el formulario de una lección (nuevo o edición)
export function renderLeccionForm(container, cursoId, moduloId, leccion = null) {
  if (!container) return;
  container.style.display = "block";
  container.innerHTML = `
    <form id="leccion-form" class="abc-leccion-form">
      <h2>${leccion ? "Editar lección" : "Nueva lección"}</h2>
      <div>
        <label>Título</label>
        <input type="text" name="titulo" required value="${leccion?.titulo || ''}">
      </div>
      <div>
        <label>Tipo</label>
        <select name="tipo" id="leccion-tipo">
          <option value="video" ${leccion?.tipo === 'video' ? 'selected' : ''}>Video</option>
          <option value="lectura" ${leccion?.tipo === 'lectura' ? 'selected' : ''}>Lectura</option>
          <option value="quiz" ${leccion?.tipo === 'quiz' ? 'selected' : ''}>Quiz</option>
        </select>
      </div>
      <div id="leccion-multimedia-container"></div>
      <button type="submit">${leccion ? "Guardar cambios" : "Agregar lección"}</button>
      <button type="button" id="leccion-cancelar-btn">Cancelar</button>
    </form>
  `;

  // Render input multimedia
  renderMultimediaInput(
    container.querySelector('#leccion-multimedia-container'),
    leccion?.tipo || 'video',
    leccion
  );

  const tipoInput = container.querySelector('#leccion-tipo');
  tipoInput.onchange = () => {
    renderMultimediaInput(
      container.querySelector('#leccion-multimedia-container'),
      tipoInput.value,
      leccion
    );
  };

  // Guardar o cancelar
  const form = container.querySelector('#leccion-form');
  form.onsubmit = e => {
    e.preventDefault();
    const data = new FormData(form);
    const nuevaLeccion = {
      id: leccion?.id || `${Date.now()}`,
      titulo: data.get('titulo'),
      tipo: data.get('tipo')
    };
    if (nuevaLeccion.tipo === 'video') nuevaLeccion.videoUrl = data.get('videoUrl');
    else if (nuevaLeccion.tipo === 'lectura') nuevaLeccion.texto = data.get('texto');
    else if (nuevaLeccion.tipo === 'quiz') nuevaLeccion.pregunta = data.get('pregunta');
    saveLeccion(cursoId, moduloId, nuevaLeccion);
    container.style.display = "none";
    const leccionesListCont = document.getElementById('lecciones-list-container');
    if (leccionesListCont) renderLeccionesList(leccionesListCont, cursoId, moduloId);
  };

  container.querySelector('#leccion-cancelar-btn').onclick = () => {
    container.style.display = "none";
  };
}

// Render input multimedia según el tipo de lección
export function renderMultimediaInput(container, tipo, leccion = null) {
  if (!container) return;
  if (tipo === 'video') {
    container.innerHTML = `
      <div>
        <label>URL del video</label>
        <input type="text" name="videoUrl" value="${leccion && leccion.videoUrl ? leccion.videoUrl : ''}">
      </div>
    `;
  } else if (tipo === 'lectura') {
    container.innerHTML = `
      <div>
        <label>Texto de la lección</label>
        <textarea name="texto">${leccion && leccion.texto ? leccion.texto : ''}</textarea>
      </div>
    `;
  } else if (tipo === 'quiz') {
    container.innerHTML = `
      <div>
        <label>Pregunta del quiz</label>
        <input type="text" name="pregunta" value="${leccion && leccion.pregunta ? leccion.pregunta : ''}">
      </div>
    `;
  } else {
    container.innerHTML = '';
  }
}

// Renderiza el formulario de curso (nuevo o editar)
export function renderCursoForm(container, curso = null) {
  if (!container) return;
  container.style.display = "block";
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
          rows="3" 
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
        <input 
          type="text" 
          id="curso-docente" 
          name="docente" 
          required
          value="${curso?.docente || ''}"
          class="terminal-input"
          placeholder="Nombre del docente"
        />
      </div>
      
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success">
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
    
    const nuevoCurso = {
      id: curso?.id || `curso_${Date.now()}`,
      nombre: form.nombre.value.trim(),
      descripcion: form.descripcion.value.trim(),
      docente: form.docente.value.trim(),
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
      // Recargar tabla de cursos
      const tableContainer = document.querySelector('#cursos-table-container');
      if (tableContainer) {
        renderCursosTable(tableContainer);
      }
      // Limpiar parámetro de URL
      window.location.hash = window.location.hash.split('?')[0];
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
    container.innerHTML = `<div class="abc-empty-state terminal-empty-state">[INFO] No hay cursos registrados en el sistema.</div>`;
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
        letter-spacing: 2px;
        border-bottom: 2px solid var(--terminal-border);
        text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
      }
      
      .cursos-table td {
        padding: 1rem;
        border-bottom: 1px solid var(--terminal-border);
        color: var(--terminal-text-dim);
      }
      
      .cursos-table tr:hover {
        background: rgba(0, 255, 65, 0.05);
        color: var(--terminal-text);
      }
      
      .cursos-table tr:last-child td {
        border-bottom: none;
      }
      
      .cursos-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      
      .curso-edit-btn, .curso-delete-btn, .curso-modulos-btn {
        padding: 0.5rem 1rem;
        font-family: var(--font-terminal);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 2px solid var(--terminal-border);
        background: transparent;
        color: var(--terminal-text);
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      
      .curso-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .curso-edit-btn:hover {
        background: rgba(0, 217, 255, 0.1);
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
      }
      
      .curso-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .curso-delete-btn:hover {
        background: rgba(255, 0, 68, 0.1);
        box-shadow: 0 0 10px rgba(255, 0, 68, 0.3);
      }
      
      .curso-modulos-btn {
        border-color: var(--terminal-success);
        color: var(--terminal-success);
      }
      
      .curso-modulos-btn:hover {
        background: rgba(0, 255, 136, 0.1);
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
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
    `;
    document.head.appendChild(style);
  }
  
  let table = `<table class="cursos-table">
    <thead>
      <tr>
        <th>NOMBRE</th>
        <th>DESCRIPCION</th>
        <th>MODULOS</th>
        <th>ACCIONES</th>
      </tr>
    </thead>
    <tbody>
      ${cursos.map(c => `
        <tr>
          <td>${c.nombre || ""}</td>
          <td>${c.descripcion || ""}</td>
          <td>${(Array.isArray(c.modulos) ? c.modulos.length : 0)}</td>
          <td class="cursos-actions">
            <button class="curso-edit-btn" data-id="${c.id}">EDITAR</button>
            <button class="curso-delete-btn" data-id="${c.id}">ELIMINAR</button>
            <button class="curso-modulos-btn" data-id="${c.id}">MODULOS</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
  container.innerHTML = table;

  // Listeners para botones de cursos
  container.querySelectorAll('.curso-edit-btn').forEach(btn => {
    btn.onclick = () => {
      if (typeof renderCursoForm === "function") {
        renderCursoForm(
          document.getElementById('cursos-form-container'),
          loadCursos().find(c => c.id === btn.dataset.id)
        );
      }
    }
  });
  container.querySelectorAll('.curso-delete-btn').forEach(btn => {
    btn.onclick = () => {
      const cursoId = btn.dataset.id;
      const curso = loadCursos().find(c => c.id === cursoId);
      const confirmMessage = `
[WARNING] Eliminar curso
[INFO] Curso: ${curso?.nombre || cursoId}
[WARNING] Esta acción no se puede deshacer

¿Continuar? (S/N)
      `.trim();
      
      if (window.confirm(confirmMessage)) {
        deleteCurso(cursoId);
        renderCursosTable(container);
        console.log('[SYSTEM] Curso eliminado:', cursoId);
      } else {
        console.log('[INFO] Operación cancelada');
      }
    };
  });
  container.querySelectorAll('.curso-modulos-btn').forEach(btn => {
    btn.onclick = () => {
      if (typeof renderModulosList === "function") {
        renderModulosList(
          document.getElementById('modulos-list-container'),
          btn.dataset.id
        );
      }
    }
  });
}

// Renderiza vista acordeón de cursos, módulos y lecciones
export function renderCursosAcordeon(container) {
  if (!container) return;
  const cursos = loadCursos();

  if (!cursos.length) {
    container.innerHTML = `<div class="abc-empty-state">No hay cursos registrados.</div>`;
    return;
  }

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
      ${cursos.map(curso => `
        <div class="curso-acordeon" data-curso="${curso.id}">
          <div class="curso-cabecera">
            <span>${curso.nombre || "Curso sin nombre"}</span>
            <span class="modulo-count">[${Array.isArray(curso.modulos) ? curso.modulos.length : 0} módulos]</span>
          </div>
          <div class="curso-cuerpo">
            ${Array.isArray(curso.modulos) && curso.modulos.length ? curso.modulos.map(modulo => `
              <div class="modulo-acordeon" data-modulo="${modulo.id}">
                <div class="modulo-cabecera">
                  <span>${modulo.nombre || "Módulo sin nombre"}</span>
                  <span class="leccion-count">[${Array.isArray(modulo.lecciones) ? modulo.lecciones.length : 0} lecciones]</span>
                </div>
                <div class="modulo-cuerpo">
                  ${Array.isArray(modulo.lecciones) && modulo.lecciones.length ? `
                    <ul class="lecciones-lista">
                      ${modulo.lecciones.map(leccion => `
                        <li>${leccion.nombre || "Lección sin nombre"}</li>
                      `).join('')}
                    </ul>
                  ` : `<div class="abc-empty-state" style="padding:0.4em 0 0.3em 0.2em;">No hay lecciones.</div>`}
                </div>
              </div>
            `).join('') : `<div class="abc-empty-state" style="padding:0.6em;">No hay módulos.</div>`}
          </div>
        </div>
      `).join('')}
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
}

