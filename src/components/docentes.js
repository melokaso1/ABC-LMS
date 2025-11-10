
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
    container.innerHTML = `<div class="abc-empty-state terminal-empty-state">[INFO] No hay docentes registrados en el sistema.</div>`;
    return;
  }
  
  // Agregar estilos si no existen
  if (!document.getElementById('docentes-table-styles')) {
    const style = document.createElement('style');
    style.id = 'docentes-table-styles';
    style.textContent = `
      .abc-docentes-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
      }
      
      .abc-docentes-table th {
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
      
      .abc-docentes-table td {
        padding: 1rem;
        border-bottom: 1px solid var(--terminal-border);
        color: var(--terminal-text-dim);
      }
      
      .abc-docentes-table tr:hover {
        background: rgba(0, 255, 65, 0.05);
        color: var(--terminal-text);
      }
      
      .abc-docentes-table tr:last-child td {
        border-bottom: none;
      }
      
      .docente-edit-btn, .docente-delete-btn {
        padding: 0.5rem 1rem;
        margin-right: 0.5rem;
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
      
      .docente-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .docente-edit-btn:hover {
        background: rgba(0, 217, 255, 0.1);
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
      }
      
      .docente-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .docente-delete-btn:hover {
        background: rgba(255, 0, 68, 0.1);
        box-shadow: 0 0 10px rgba(255, 0, 68, 0.3);
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
  
  let table = `<table class="abc-docentes-table">
    <thead>
      <tr>
        <th>NOMBRE</th>
        <th>EMAIL</th>
        <th>ACCIONES</th>
      </tr>
    </thead>
    <tbody>
      ${docentes.map(d =>
        `<tr>
          <td>${d.nombres || d.nombre || ""} ${d.apellidos || ""}</td>
          <td>${d.email}</td>
          <td>
            <button class="docente-edit-btn" data-email="${d.email}">EDITAR</button>
            <button class="docente-delete-btn" data-email="${d.email}">ELIMINAR</button>
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
    <div class="terminal-form-header">
      <h3 class="form-title-terminal">
        <span class="form-prefix">[FORM]</span>
        ${docente ? "EDITAR DOCENTE" : "NUEVO DOCENTE"}
      </h3>
    </div>
    <form id="docente-form" class="terminal-form">
      <div class="form-group-terminal">
        <label for="docente-nombre" class="terminal-label">
          <span class="label-prefix">></span>
          NOMBRE_COMPLETO
        </label>
        <input 
          type="text" 
          id="docente-nombre"
          name="nombre" 
          required 
          value="${docente?.nombres || docente?.nombre || ''}"
          class="terminal-input"
          placeholder="Ingrese el nombre del docente"
        />
      </div>
      <div class="form-group-terminal">
        <label for="docente-email" class="terminal-label">
          <span class="label-prefix">></span>
          EMAIL
        </label>
        <input 
          type="email" 
          id="docente-email"
          name="email" 
          required 
          value="${docente?.email || ''}" 
          ${docente ? "readonly" : ''}
          class="terminal-input"
          placeholder="docente@example.com"
        />
      </div>
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success">
          <span class="btn-prefix">$</span>
          ${docente ? "ACTUALIZAR" : "CREAR"}
          <span class="btn-suffix">→</span>
        </button>
        <button type="button" id="cancelar-docente-form" class="btn btn-secondary">
          <span class="btn-prefix">[</span>
          CANCELAR
          <span class="btn-suffix">]</span>
        </button>
      </div>
      <div id="form-error" class="terminal-error" style="display:none;"></div>
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
    errorDiv.textContent = "[ERROR] Nombre y email son obligatorios";
    errorDiv.style.display = "block";
    return;
  }
  // comprobación de formato de correo
  if (!/\S+@\S+\.\S+/.test(email)) {
    errorDiv.textContent = "[ERROR] Correo electrónico inválido";
    errorDiv.style.display = "block";
    return;
  }

  const docentes = loadDocentes();
  const esEdicion = formElem.email.readOnly;
  const yaExiste = docentes.some(d => d.email === email && (!esEdicion || true));
  
  // Si es alta y ya existe
  if (!esEdicion && yaExiste) {
    errorDiv.textContent = "[ERROR] Ya existe un docente con ese correo";
    errorDiv.style.display = "block";
    return;
  }

  const docente = { nombre, email };
  
  if (saveDocente(docente)) {
    // Si es un nuevo docente, crear credenciales de login
    if (!esEdicion && !yaExiste) {
      const usersJson = localStorage.getItem('users');
      let users = [];
      try {
        users = usersJson ? JSON.parse(usersJson) : [];
      } catch {
        users = [];
      }
      
      // Verificar si el usuario ya existe
      if (!users.find(u => u.email === email)) {
        // Crear credenciales por defecto (password = "docente123")
        users.push({
          email: email,
          password: "docente123",
          rol: "docente"
        });
        localStorage.setItem('users', JSON.stringify(users));
        console.log('[SYSTEM] Credenciales creadas para:', email);
        console.log('[INFO] Password por defecto: docente123');
      }
    }
    
    // Oculta formulario
    if (formContainer) {
      formContainer.style.display = "none";
      formContainer.innerHTML = "";
    }
    
    // Recarga la tabla
    const tableContainer = document.getElementById('docentes-table-container');
    if (tableContainer) {
      renderDocentesTable(tableContainer);
    }
    
    // Limpiar parámetro de URL si existe
    const hash = window.location.hash.replace('#', '') || '';
    const [path] = hash.split('?');
    if (path === '/docentes') {
      window.location.hash = '/docentes';
    }
  } else {
    errorDiv.textContent = "[ERROR] No se pudo guardar el docente";
    errorDiv.style.display = "block";
  }
}

// Borra un docente por email y recarga la tabla
export function handleDeleteDocente(email, tableContainer) {
  if (!email) return;
  
  const confirmMessage = `
[WARNING] Eliminar docente
[INFO] Se eliminará el docente: ${email}
[WARNING] Esta acción no se puede deshacer

¿Continuar? (S/N)
  `.trim();
  
  if (!window.confirm(confirmMessage)) {
    console.log('[INFO] Operación cancelada');
    return;
  }
  
  let docentes = loadDocentes();
  docentes = docentes.filter(d => d.email !== email);
  localStorage.setItem('docentes', JSON.stringify(docentes));
  
  // También eliminar credenciales si existen
  const usersJson = localStorage.getItem('users');
  if (usersJson) {
    try {
      let users = JSON.parse(usersJson);
      users = users.filter(u => u.email !== email);
      localStorage.setItem('users', JSON.stringify(users));
    } catch {
      // Ignorar errores
    }
  }
  
  console.log('[SYSTEM] Docente eliminado:', email);
  
  // Recarga la tabla
  if (tableContainer) renderDocentesTable(tableContainer);
}

