import { getArray, saveArray, upsertItem, deleteItem, isValidEmail, imageToBase64, getFullName, showError, hideError } from '../utils/helpers.js';
import { showAlert, showConfirm, showFormModal } from './modal.js';
import { loadCursos } from './cursos.js';

// Cargar docentes de localStorage
export function loadDocentes() {
  return getArray('docentes');
}

// Guarda (agrega o actualiza) un docente en localStorage
export function saveDocente(docente) {
  if (!docente || !docente.email) return false;
  const docentes = loadDocentes();
  const updated = upsertItem(docentes, docente, 'email');
  return saveArray('docentes', updated);
}

// Renderiza tabla de docentes en un contenedor
export function renderDocentesTable(container) {
  if (!container) return;
  const docentes = loadDocentes();
  if (docentes.length === 0) {
    container.innerHTML = `
      <div class="abc-empty-state terminal-empty-state" style="text-align: center; padding: 3rem 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">📚</div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--terminal-accent); margin-bottom: 0.75rem;">
          [INFO] No hay docentes registrados
        </div>
        <div style="color: var(--terminal-text-dim); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Para comenzar, crea tu primer docente haciendo clic en el botón <strong>"CREAR_DOCENTE"</strong> arriba.
        </div>
        <div style="color: var(--terminal-text-dim); font-size: 0.85rem; line-height: 1.6;">
          💡 <strong>Tip:</strong> Los docentes son necesarios para asignarlos a los cursos que crees.
        </div>
      </div>
    `;
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
        table-layout: auto;
      }
      
      .abc-docentes-table th {
        background: var(--terminal-surface);
        padding: 1rem 0.75rem;
        text-align: left;
        font-weight: 700;
        color: var(--terminal-accent);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
        border-bottom: 2px solid var(--terminal-border);
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .abc-docentes-table th:first-child {
        width: 80px;
        text-align: center;
        padding-left: 1rem;
      }
      
      .abc-docentes-table th:nth-child(2) {
        width: 120px;
      }
      
      .abc-docentes-table th:nth-child(3) {
        min-width: 180px;
      }
      
      .abc-docentes-table th:nth-child(4) {
        min-width: 200px;
      }
      
      .abc-docentes-table th:nth-child(5) {
        min-width: 150px;
      }
      
      .abc-docentes-table td {
        padding: 1rem 0.75rem;
        border-bottom: 1px solid var(--terminal-border);
        color: var(--terminal-text-dim);
        transition: all var(--transition-base);
        vertical-align: middle;
      }
      
      .abc-docentes-table td:first-child {
        text-align: center;
        padding-left: 1rem;
        width: 80px;
      }
      
      .abc-docentes-table td:nth-child(2) {
        width: 120px;
        font-weight: 600;
        color: var(--terminal-text);
      }
      
      .abc-docentes-table td:nth-child(3) {
        min-width: 180px;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .abc-docentes-table td:nth-child(4) {
        min-width: 200px;
        max-width: 280px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.8rem;
      }
      
      .abc-docentes-table td:nth-child(5) {
        min-width: 150px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .abc-docentes-table td:last-child {
        max-width: none;
        overflow: visible;
        white-space: normal;
        padding-right: 1rem;
      }
      
      .abc-docentes-table tr {
        transition: background var(--transition-base);
      }
      
      .abc-docentes-table tr:hover {
        background: rgba(0, 255, 65, 0.05);
      }
      
      .abc-docentes-table tr:hover td {
        color: var(--terminal-text);
      }
      
      .abc-docentes-table tr:last-child td {
        border-bottom: none;
      }
      
      .docente-edit-btn, .docente-delete-btn {
        padding: 0.5rem 1rem;
        margin: 0;
        font-family: var(--font-terminal);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 1px solid;
        background: transparent;
        cursor: pointer;
        transition: all var(--transition-base);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        white-space: nowrap;
        min-width: 90px;
        flex-shrink: 0;
      }
      
      .docente-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .docente-edit-btn:hover {
        background: rgba(0, 217, 255, 0.15);
        border-color: var(--terminal-accent);
        transform: translateY(-1px);
      }
      
      .docente-edit-btn:active {
        transform: translateY(0);
      }
      
      .docente-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .docente-delete-btn:hover {
        background: rgba(255, 0, 68, 0.15);
        border-color: var(--terminal-error);
        transform: translateY(-1px);
      }
      
      .docente-delete-btn:active {
        transform: translateY(0);
      }
      
      .abc-docentes-table td:last-child {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.6rem;
        align-items: center;
        justify-content: flex-start;
        min-width: 200px;
      }
      
      .abc-docentes-table th:last-child {
        min-width: 200px;
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
        .abc-docentes-table {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 0.75rem;
        }
        
        .abc-docentes-table thead {
          display: none;
        }
        
        .abc-docentes-table tbody {
          display: block;
        }
        
        .abc-docentes-table tr {
          display: block;
          margin-bottom: 1rem;
          border: 2px solid var(--terminal-border);
          background: var(--terminal-surface);
          padding: 0.75rem;
        }
        
        .abc-docentes-table td {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--terminal-border);
          max-width: 100%;
          white-space: normal;
          text-overflow: initial;
        }
        
        .abc-docentes-table td:last-child {
          border-bottom: none;
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }
        
        .abc-docentes-table td::before {
          content: attr(data-label);
          font-weight: 700;
          color: var(--terminal-accent);
          text-transform: uppercase;
          font-size: 0.7rem;
          margin-right: 0.5rem;
          min-width: 120px;
          flex-shrink: 0;
        }
        
        .docente-edit-btn, .docente-delete-btn {
          width: 100%;
          justify-content: center;
          margin: 0;
          min-width: auto;
          white-space: nowrap;
        }
      }
      
      @media (max-width: 480px) {
        .abc-docentes-table {
          font-size: 0.7rem;
        }
        
        .abc-docentes-table tr {
          padding: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .abc-docentes-table td {
          padding: 0.4rem 0.5rem;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        
        .abc-docentes-table td::before {
          margin-right: 0;
          margin-bottom: 0.25rem;
          min-width: auto;
        }
        
        .docente-edit-btn, .docente-delete-btn {
          font-size: 0.65rem;
          padding: 0.5rem 0.75rem;
          min-width: auto;
          white-space: nowrap;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Agregar estilos para imágenes en tabla
  if (!document.getElementById('docentes-table-img-styles')) {
    const imgStyle = document.createElement('style');
    imgStyle.id = 'docentes-table-img-styles';
    imgStyle.textContent = `
      .docente-table-foto {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--terminal-accent);
        flex-shrink: 0;
        display: block;
        margin: 0 auto;
        transition: transform var(--transition-base), box-shadow var(--transition-base);
      }
      
      .abc-docentes-table tr:hover .docente-table-foto {
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
      }
      
      .docente-table-foto-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--terminal-accent);
        font-size: 1.5rem;
        flex-shrink: 0;
        margin: 0 auto;
        transition: all var(--transition-base);
      }
      
      .abc-docentes-table tr:hover .docente-table-foto-placeholder {
        background: rgba(0, 217, 255, 0.1);
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(imgStyle);
  }
  
  // Agregar data-label a las celdas para responsive
  const tableRows = docentes.map(d => {
    const nombreCompleto = getFullName(d);
    const fotoSrc = d.fotoBase64 || d.fotoUrl || '';
    return `<tr>
      <td data-label="FOTO">
        ${fotoSrc ? `
          <img src="${fotoSrc}" alt="${nombreCompleto}" class="docente-table-foto" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="docente-table-foto-placeholder" style="display: none;">👨‍🏫</div>
        ` : `<div class="docente-table-foto-placeholder">👨‍🏫</div>`}
      </td>
      <td data-label="CÓDIGO">${d.codigo || 'N/A'}</td>
      <td data-label="NOMBRE">${nombreCompleto}</td>
      <td data-label="EMAIL">${d.email}</td>
      <td data-label="ÁREA ACADÉMICA">${d.areaAcademica || 'N/A'}</td>
      <td data-label="ACCIONES">
        <button class="docente-edit-btn" data-email="${d.email}">EDITAR</button>
        <button class="docente-delete-btn" data-email="${d.email}">ELIMINAR</button>
      </td>
    </tr>`;
  }).join('');
  
  let table = `<table class="abc-docentes-table">
    <thead>
      <tr>
        <th>FOTO</th>
        <th>CÓDIGO</th>
        <th>NOMBRE</th>
        <th>EMAIL</th>
        <th>ÁREA ACADÉMICA</th>
        <th>ACCIONES</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>`;
  
  container.innerHTML = table;

  // Eventos para editar/eliminar
  container.querySelectorAll('.docente-edit-btn').forEach(btn => {
    btn.onclick = () => {
      const docente = docentes.find(d => d.email === btn.dataset.email);
      showDocenteFormModal(docente, container);
    };
  });
  container.querySelectorAll('.docente-delete-btn').forEach(btn => {
    btn.onclick = () => handleDeleteDocente(btn.dataset.email, container);
  });
}

// Muestra formulario de docente en modal
function showDocenteFormModal(docente = null, tableContainer = null) {
  const codigoValue = docente?.codigo || '';
  const identificacionValue = docente?.identificacion || '';
  const nombresValue = docente?.nombres || '';
  const apellidosValue = docente?.apellidos || '';
  const emailValue = docente?.email || '';
  const fotoUrlValue = docente?.fotoUrl || '';
  const areaAcademicaValue = docente?.areaAcademica || '';
  const isEdit = !!docente;
  
  const formHTML = `
    <form id="docente-form" class="terminal-form">
      <div class="form-group-terminal">
        <label for="docente-codigo" class="terminal-label">
          <span class="label-prefix">></span>
          CÓDIGO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="docente-codigo"
          name="codigo" 
          required 
          value="${codigoValue}"
          class="terminal-input"
          placeholder="Ejemplo: D101"
          autocomplete="off"
          ${isEdit ? "readonly" : ''}
        />
        <div class="field-hint">
          ${isEdit ? '🔒 Código no modificable' : '💡 Código único del docente'}
        </div>
      </div>
      <div class="form-group-terminal">
        <label for="docente-identificacion" class="terminal-label">
          <span class="label-prefix">></span>
          IDENTIFICACIÓN
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="docente-identificacion"
          name="identificacion" 
          required 
          value="${identificacionValue}"
          class="terminal-input"
          placeholder="Ejemplo: 2001003001"
          autocomplete="off"
        />
      </div>
      <div class="form-group-terminal">
        <label for="docente-nombres" class="terminal-label">
          <span class="label-prefix">></span>
          NOMBRES
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="docente-nombres"
          name="nombres" 
          required 
          value="${nombresValue}"
          class="terminal-input"
          placeholder="Ejemplo: María"
          autocomplete="given-name"
        />
      </div>
      <div class="form-group-terminal">
        <label for="docente-apellidos" class="terminal-label">
          <span class="label-prefix">></span>
          APELLIDOS
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="docente-apellidos"
          name="apellidos" 
          required 
          value="${apellidosValue}"
          class="terminal-input"
          placeholder="Ejemplo: García López"
          autocomplete="family-name"
        />
      </div>
      <div class="form-group-terminal">
        <label for="docente-email" class="terminal-label">
          <span class="label-prefix">></span>
          EMAIL
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="email" 
          id="docente-email"
          name="email" 
          required 
          value="${emailValue}" 
          ${isEdit ? "readonly" : ''}
          class="terminal-input"
          placeholder="Ejemplo: maria.garcia@abc.edu"
          autocomplete="email"
        />
        <div class="field-hint">
          ${isEdit ? '🔒 Email no modificable' : '💡 Correo único (no se puede cambiar)'}
        </div>
      </div>
      <div class="form-group-terminal">
        <label for="docente-foto" class="terminal-label">
          <span class="label-prefix">></span>
          FOTO_DEL_DOCENTE
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <div class="file-input-wrapper">
          <input 
            type="file" 
            id="docente-foto"
            name="foto" 
            accept="image/*"
            class="terminal-input file-input"
            ${isEdit ? '' : 'required'}
          />
          <div id="file-name-display" class="file-name-display" style="display: none;">
            <span class="file-name-text"></span>
            <button type="button" class="file-remove-btn" id="file-remove-btn">×</button>
          </div>
        </div>
        <div id="foto-preview-container" class="foto-preview-wrapper" style="${(docente?.fotoBase64 || docente?.fotoUrl) ? '' : 'display: none;'}">
          <div class="foto-preview-label">[VISTA PREVIA]</div>
          <img 
            id="foto-preview" 
            src="${docente?.fotoBase64 || docente?.fotoUrl || ''}" 
            alt="Vista previa"
            class="foto-preview-img"
            onerror="this.parentElement.style.display='none'"
          />
        </div>
        <div class="field-hint">
          💡 Selecciona una imagen del docente (JPG, PNG, GIF, WebP). Máximo 2MB. La imagen se guardará localmente.
        </div>
      </div>
      <div class="form-group-terminal">
        <label for="docente-areaAcademica" class="terminal-label">
          <span class="label-prefix">></span>
          ÁREA_ACADÉMICA
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <select 
          id="docente-areaAcademica"
          name="areaAcademica" 
          required
          class="terminal-input"
        >
          <option value="">-- Seleccione un área --</option>
          <option value="Programación" ${areaAcademicaValue === 'Programación' ? 'selected' : ''}>Programación</option>
          <option value="Desarrollo Web" ${areaAcademicaValue === 'Desarrollo Web' ? 'selected' : ''}>Desarrollo Web</option>
          <option value="Base de Datos" ${areaAcademicaValue === 'Base de Datos' ? 'selected' : ''}>Base de Datos</option>
          <option value="Algoritmos" ${areaAcademicaValue === 'Algoritmos' ? 'selected' : ''}>Algoritmos</option>
          <option value="Estructuras de Datos" ${areaAcademicaValue === 'Estructuras de Datos' ? 'selected' : ''}>Estructuras de Datos</option>
          <option value="JavaScript" ${areaAcademicaValue === 'JavaScript' ? 'selected' : ''}>JavaScript</option>
          <option value="Python" ${areaAcademicaValue === 'Python' ? 'selected' : ''}>Python</option>
          <option value="Java" ${areaAcademicaValue === 'Java' ? 'selected' : ''}>Java</option>
          <option value="Frontend" ${areaAcademicaValue === 'Frontend' ? 'selected' : ''}>Frontend</option>
          <option value="Backend" ${areaAcademicaValue === 'Backend' ? 'selected' : ''}>Backend</option>
        </select>
        <div class="field-hint">
          💡 Área académica del docente
        </div>
      </div>
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success" id="submit-docente-btn">
          <span class="btn-prefix">$</span>
          <span class="btn-text">${isEdit ? "ACTUALIZAR DOCENTE" : "CREAR DOCENTE"}</span>
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
  
  const { closeModal, content } = showFormModal(formHTML, {
    title: isEdit ? "EDITAR DOCENTE" : "NUEVO DOCENTE",
    icon: "[>]",
    onFormReady: (modalContent, closeFn) => {
      // Configurar event listeners usando el contenido del modal
      const form = modalContent.querySelector('#docente-form');
      const cancelBtn = modalContent.querySelector('#cancelar-docente-form');
      const errorDiv = modalContent.querySelector('#form-error');
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          closeFn();
        };
      }
      
      // Usar helper para convertir imagen
      
      // Preview de imagen y nombre de archivo
      const fotoInput = modalContent.querySelector('#docente-foto');
      const fotoPreview = modalContent.querySelector('#foto-preview');
      const fotoPreviewContainer = modalContent.querySelector('#foto-preview-container');
      const fileNameDisplay = modalContent.querySelector('#file-name-display');
      const fileNameText = modalContent.querySelector('.file-name-text');
      const fileRemoveBtn = modalContent.querySelector('#file-remove-btn');
      
      // Función para limpiar el archivo seleccionado
      const clearFile = () => {
        if (fotoInput) fotoInput.value = '';
        if (fileNameDisplay) fileNameDisplay.style.display = 'none';
        if (fotoPreviewContainer) fotoPreviewContainer.style.display = 'none';
        if (errorDiv) errorDiv.style.display = 'none';
      };
      
      // Botón para remover archivo
      if (fileRemoveBtn) {
        fileRemoveBtn.onclick = () => {
          clearFile();
        };
      }
      
      if (fotoInput) {
        fotoInput.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            // Mostrar nombre del archivo
            if (fileNameDisplay && fileNameText) {
              fileNameText.textContent = file.name;
              fileNameDisplay.style.display = 'flex';
            }
            
            try {
              const base64 = await imageToBase64(file);
              if (base64 && fotoPreview) {
                fotoPreview.src = base64;
                if (fotoPreviewContainer) fotoPreviewContainer.style.display = 'block';
              }
              hideError(errorDiv);
            } catch (error) {
              showError(errorDiv, error.message);
              clearFile();
            }
          } else {
            clearFile();
          }
        };
      }
      
      // Si hay una foto existente en edición, mostrar el nombre
      if (isEdit && docente && (docente.fotoBase64 || docente.fotoUrl)) {
        if (fileNameDisplay && fileNameText) {
          fileNameText.textContent = 'Imagen actual (selecciona otra para reemplazar)';
          fileNameDisplay.style.display = 'flex';
        }
      }
      
      if (form) {
        form.onsubmit = async (e) => {
          e.preventDefault();
          const codigo = form.codigo.value.trim();
          const identificacion = form.identificacion.value.trim();
          const nombres = form.nombres.value.trim();
          const apellidos = form.apellidos.value.trim();
          const email = form.email.value.trim();
          const areaAcademica = form.areaAcademica.value.trim();
          const fotoFile = form.foto?.files[0];
          let fotoBase64 = docente?.fotoBase64 || docente?.fotoUrl || null;
          
          if (fotoFile) {
            try {
              fotoBase64 = await imageToBase64(fotoFile);
            } catch (error) {
              showError(errorDiv, error.message);
              return;
            }
          } else if (!isEdit && !fotoBase64) {
            showError(errorDiv, 'La foto del docente es obligatoria. Por favor selecciona una imagen.');
            if (fotoInput) fotoInput.style.borderColor = 'var(--terminal-error)';
            return;
          }
          
          // Validación mejorada con mensajes claros
          if (!codigo || !identificacion || !nombres || !apellidos || !email || !areaAcademica) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.25rem;">Por favor completa todos los campos obligatorios:</div>
                    <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
                      ${!codigo ? '<li>El <strong>código</strong> es obligatorio</li>' : ''}
                      ${!identificacion ? '<li>La <strong>identificación</strong> es obligatoria</li>' : ''}
                      ${!nombres ? '<li>Los <strong>nombres</strong> son obligatorios</li>' : ''}
                      ${!apellidos ? '<li>Los <strong>apellidos</strong> son obligatorios</li>' : ''}
                      ${!email ? '<li>El <strong>email</strong> es obligatorio</li>' : ''}
                      ${!areaAcademica ? '<li>El <strong>área académica</strong> es obligatoria</li>' : ''}
                    </ul>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
              // Resaltar campos vacíos
              if (!codigo) form.codigo.style.borderColor = 'var(--terminal-error)';
              if (!identificacion) form.identificacion.style.borderColor = 'var(--terminal-error)';
              if (!nombres) form.nombres.style.borderColor = 'var(--terminal-error)';
              if (!apellidos) form.apellidos.style.borderColor = 'var(--terminal-error)';
              if (!email) form.email.style.borderColor = 'var(--terminal-error)';
              if (!areaAcademica) form.areaAcademica.style.borderColor = 'var(--terminal-error)';
            }
            return;
          }
          
          // Resetear estilos de error
          form.codigo.style.borderColor = '';
          form.identificacion.style.borderColor = '';
          form.nombres.style.borderColor = '';
          form.apellidos.style.borderColor = '';
          form.email.style.borderColor = '';
          form.areaAcademica.style.borderColor = '';
          
          if (!/\S+@\S+\.\S+/.test(email)) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.5rem;">El formato del correo electrónico no es válido.</div>
                    <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                      <strong>Formato correcto:</strong> nombre@dominio.com<br>
                      <strong>Ejemplo:</strong> juan.perez@abc.edu
                    </div>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
              form.email.style.borderColor = 'var(--terminal-error)';
              form.email.focus();
            }
            return;
          }
          
          const docentes = loadDocentes();
          const esEdicion = form.email.readOnly;
          const yaExisteEmail = docentes.some(d => d.email === email && !esEdicion);
          const yaExisteCodigo = docentes.some(d => d.codigo === codigo && !esEdicion);
          
          if (!esEdicion && yaExisteEmail) {
            if (errorDiv) {
              const docenteExistente = docentes.find(d => d.email === email);
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.5rem;">Ya existe un docente registrado con este correo electrónico.</div>
                    <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                      <strong>Docente existente:</strong> ${docenteExistente?.nombres || 'Sin nombre'}<br>
                      Por favor, usa un correo diferente o edita el docente existente.
                    </div>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
              form.email.style.borderColor = 'var(--terminal-error)';
              form.email.focus();
            }
            return;
          }
          
          if (!esEdicion && yaExisteCodigo) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.5rem;">Ya existe un docente con este código.</div>
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
          
          // Mostrar indicador de carga
          const submitBtn = modalContent.querySelector('#submit-docente-btn');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-prefix">[</span> GUARDANDO... <span class="btn-suffix">]</span>';
          submitBtn.style.opacity = '0.7';
          
          // Simular pequeño delay para mejor UX
          setTimeout(() => {
            const nuevoDocente = { 
              codigo,
              identificacion,
              nombres,
              apellidos,
              email,
              fotoBase64: fotoBase64 || undefined,
              fotoUrl: fotoBase64 || docente?.fotoUrl || undefined, // Mantener compatibilidad
              areaAcademica,
              nombre: `${nombres} ${apellidos}`.trim() // Para compatibilidad
            };
            
            if (saveDocente(nuevoDocente)) {
              closeFn();
              
              // Recargar tabla de docentes
              if (tableContainer) {
                renderDocentesTable(tableContainer);
              } else {
                const tableContainer2 = document.getElementById('docentes-table-container') || 
                                       document.getElementById('admin-docentes-table-container');
                if (tableContainer2) {
                  renderDocentesTable(tableContainer2);
                }
              }
              
              // Actualizar tabla de cursos si existe
              const cursosTableContainer = document.getElementById('cursos-table-container') || 
                                           document.getElementById('admin-cursos-table-container');
              if (cursosTableContainer && typeof renderCursosTable === 'function') {
                renderCursosTable(cursosTableContainer);
              }
              
              showAlert(`[SUCCESS] ¡Docente ${isEdit ? 'actualizado' : 'creado'} exitosamente!\n\n[INFO] Detalles:\n• Código: ${codigo}\n• Nombre: ${nombres} ${apellidos}\n• Email: ${email}\n• Área: ${areaAcademica}\n\n[OK] El docente ya está disponible en el sistema y puede ser asignado a cursos.`, {
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
                      <div style="margin-bottom: 0.5rem;">No se pudo guardar el docente. Por favor intenta de nuevo.</div>
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

// Renderiza formulario de docente (nuevo o editar) - Mantener para compatibilidad
export function renderDocenteForm(container, docente = null) {
  if (!container) return;
  // Si se llama desde admin view, usar modal
  const adminView = document.querySelector('admin-view');
  if (adminView) {
    const tableContainer = adminView.querySelector('#admin-docentes-table-container');
    showDocenteFormModal(docente, tableContainer);
    return;
  }
  
  // Comportamiento legacy para otras vistas
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
          value="${docente ? ((docente.nombres || docente.nombre || '') + (docente.apellidos ? ' ' + docente.apellidos : '')).trim() : ''}"
          class="terminal-input"
          placeholder="Ingrese el nombre completo del docente"
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

// Guarda el docente desde los datos del formulario y recarga la tabla - Mantener para compatibilidad
export function handleSaveDocente(formElem, formContainer) {
  const nombre = formElem.nombre.value.trim();
  const email = formElem.email.value.trim();
  const errorDiv = formElem.querySelector('#form-error');

  if (!nombre || !email) {
    errorDiv.textContent = "[ERROR] Nombre y email son obligatorios";
    errorDiv.style.display = "block";
    return;
  }
  if (!isValidEmail(email)) {
    showError(errorDiv, 'Correo electrónico inválido');
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

  // Separar nombre en nombres y apellidos si es posible
  const nombreParts = nombre.trim().split(' ');
  const nombres = nombreParts[0] || '';
  const apellidos = nombreParts.slice(1).join(' ') || '';
  
  const docente = { 
    nombres: nombres,
    apellidos: apellidos,
    nombre: nombre, // Mantener por compatibilidad
    email 
  };
  
  if (saveDocente(docente)) {
    // Los docentes no requieren credenciales de login, solo se registran con email
    
    // Oculta formulario
    if (formContainer) {
      formContainer.style.display = "none";
      formContainer.innerHTML = "";
    }
    
    // Recargar tabla de docentes (buscar en admin o docentes view)
    const tableContainer = document.getElementById('docentes-table-container') || 
                           document.getElementById('admin-docentes-table-container');
    if (tableContainer) {
      renderDocentesTable(tableContainer);
    }
    
    // También actualizar tabla de cursos por si se necesita el selector de docentes
    const cursosTableContainer = document.getElementById('cursos-table-container') || 
                                  document.getElementById('admin-cursos-table-container');
    if (cursosTableContainer && typeof renderCursosTable === 'function') {
      renderCursosTable(cursosTableContainer);
    }
    
    showAlert(`[SUCCESS] Docente ${esEdicion ? 'actualizado' : 'creado'}\n[INFO] El docente "${nombre}" ha sido ${esEdicion ? 'actualizado' : 'creado'} correctamente`, {
      title: '[SUCCESS] Operación exitosa',
      icon: '[✓]',
      type: 'success'
    });
    
    // Limpiar parámetro de URL si existe (solo si no estamos en admin)
    const hash = window.location.hash.replace('#', '') || '';
    const [path] = hash.split('?');
    if (path === '/docentes' && !window.location.hash.includes('/admin')) {
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
  
  const cursos = getArray('cursos');
  const cursosAsignados = cursos.filter(curso => curso.docente === email);
  const docente = loadDocentes().find(d => d.email === email);
  const nombreDocente = docente ? getFullName(docente) : email;
  
  if (cursosAsignados.length > 0) {
    // Buscar los cursos asignados para mostrar información
    const nombresCursos = cursosAsignados.map(c => c.nombre || c.id).join(', ');
    
    const errorMessage = `
[ERROR] No se puede eliminar este docente

[INFO] El docente "${nombreDocente}" está asignado a ${cursosAsignados.length} curso(s):

${cursosAsignados.map((c, i) => `  ${i + 1}. ${c.nombre || c.id}`).join('\n')}

[WARNING] Para eliminar este docente, primero debes:
  1. Editar cada curso asignado y cambiar el docente, O
  2. Eliminar los cursos asignados

[INFO] Después de desasignar o eliminar los cursos, podrás eliminar el docente.
    `.trim();
    
    showAlert(errorMessage, { 
      title: '[ERROR] No se puede eliminar',
      icon: '[X]',
      type: 'error'
    });
    console.log('[ERROR] No se puede eliminar el docente porque está asignado a cursos');
    console.log('[INFO] Cursos afectados:', nombresCursos);
    return;
  }
  
  const confirmMessage = `
[WARNING] ¿Estás seguro de eliminar este docente?

[INFO] Detalles del docente:
  • Nombre: ${nombreDocente}
  • Email: ${email}

[WARNING] ⚠️ Esta acción es PERMANENTE y NO se puede deshacer.

[INFO] El docente será eliminado completamente del sistema.
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
    performDelete();
  });
  
  function performDelete() {
    let docentes = loadDocentes();
    docentes = docentes.filter(d => d.email !== email);
    saveArray('docentes', docentes);
    
    // Los docentes no tienen credenciales de login, no es necesario eliminarlas
    
    console.log('[SYSTEM] Docente eliminado:', email);
    
    // Recarga la tabla
    if (tableContainer) renderDocentesTable(tableContainer);
    
    showAlert(`[SUCCESS] ¡Docente eliminado exitosamente!

[INFO] El docente "${nombreDocente}" (${email}) ha sido eliminado del sistema.

[OK] La tabla de docentes ha sido actualizada.`, {
      title: '[SUCCESS] Eliminación completada',
      icon: '[✓]',
      type: 'success'
    });
  }
}

// Renderiza lista pública de docentes (sin botones de editar/eliminar)
export function renderDocentesPublic(container) {
  if (!container) return;
  const docentes = loadDocentes();
  const cursos = loadCursos();

  if (docentes.length === 0) {
    container.innerHTML = `
      <div class="abc-empty-state terminal-empty-state" style="text-align: center; padding: 3rem 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">👨‍🏫</div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--terminal-accent); margin-bottom: 0.75rem;">
          [INFO] No hay docentes registrados
        </div>
      </div>
    `;
    return;
  }

  // Función auxiliar para contar cursos de un docente
  const contarCursosDocente = (email) => {
    if (!email) return 0;
    return cursos.filter(c => c.docente === email || c.docenteId === email).length;
  };

  // Agregar estilos si no existen
  if (!document.getElementById('docentes-public-styles')) {
    const style = document.createElement('style');
    style.id = 'docentes-public-styles';
    style.textContent = `
      .docentes-public-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      
      .docente-public-card {
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        padding: 1.5rem;
        transition: all var(--transition-base);
        font-family: var(--font-terminal);
      }
      
      .docente-public-card:hover {
        border-color: var(--terminal-accent);
        box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
        transform: translateY(-2px);
      }
      
      .docente-public-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--terminal-border);
      }
      
      .docente-public-foto {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid var(--terminal-accent);
        object-fit: cover;
        flex-shrink: 0;
      }
      
      .docente-public-info {
        flex: 1;
        min-width: 0;
      }
      
      .docente-public-nombre {
        font-size: 1rem;
        font-weight: 700;
        color: var(--terminal-accent);
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .docente-public-codigo {
        font-size: 0.75rem;
        color: var(--terminal-text-dim);
        font-family: var(--font-terminal);
      }
      
      .docente-public-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        font-size: 0.875rem;
      }
      
      .docente-public-detail-item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .docente-public-detail-label {
        color: var(--terminal-accent);
        font-weight: 600;
        min-width: 80px;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.5px;
      }
      
      .docente-public-detail-value {
        color: var(--terminal-text);
        flex: 1;
        word-break: break-word;
      }
      
      .docente-public-email {
        color: var(--terminal-text-dim);
        font-size: 0.8125rem;
        word-break: break-all;
      }
      
      .docente-public-cursos-count {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid var(--terminal-success);
        border-radius: 4px;
        color: var(--terminal-success);
        font-weight: 600;
        font-size: 0.75rem;
        margin-top: 0.5rem;
      }
      
      @media (max-width: 768px) {
        .docentes-public-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .docente-public-card {
          padding: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const docentesHTML = `
    <div class="docentes-public-grid">
      ${docentes.map(docente => {
        const nombreCompleto = `${docente.nombres || ''} ${docente.apellidos || ''}`.trim() || docente.email;
        const cursosCount = contarCursosDocente(docente.email);
        
        return `
          <div class="docente-public-card">
            <div class="docente-public-header">
              ${(docente.fotoBase64 || docente.fotoUrl) ? `
                <img 
                  src="${docente.fotoBase64 || docente.fotoUrl}" 
                  alt="${nombreCompleto}"
                  class="docente-public-foto"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />
                <div class="docente-public-foto" style="background: var(--terminal-surface); display: none; align-items: center; justify-content: center; color: var(--terminal-accent); font-size: 1.5rem;">
                  👨‍🏫
                </div>
              ` : `
                <div class="docente-public-foto" style="background: var(--terminal-surface); display: flex; align-items: center; justify-content: center; color: var(--terminal-accent); font-size: 1.5rem;">
                  👨‍🏫
                </div>
              `}
              <div class="docente-public-info">
                <div class="docente-public-nombre">${nombreCompleto}</div>
                <div class="docente-public-codigo">${docente.codigo || 'N/A'}</div>
              </div>
            </div>
            <div class="docente-public-details">
              <div class="docente-public-detail-item">
                <span class="docente-public-detail-label">Área:</span>
                <span class="docente-public-detail-value">${docente.areaAcademica || 'No especificada'}</span>
              </div>
              <div class="docente-public-detail-item">
                <span class="docente-public-detail-label">Email:</span>
                <span class="docente-public-email">${docente.email || 'N/A'}</span>
              </div>
              ${cursosCount > 0 ? `
                <div class="docente-public-cursos-count">
                  📚 ${cursosCount} ${cursosCount === 1 ? 'curso' : 'cursos'} asignado${cursosCount === 1 ? '' : 's'}
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = docentesHTML;
}

