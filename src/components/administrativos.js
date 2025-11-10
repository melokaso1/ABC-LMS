import { getArray, saveArray, upsertItem, deleteItem, isValidEmail, getFullName, showError, hideError } from '../utils/helpers.js';
import { showAlert, showConfirm, showFormModal } from './modal.js';

// Cargar administrativos desde localStorage
export function loadAdministrativos() {
  return getArray('administrativos');
}

// Guarda (agrega o actualiza) un administrativo en localStorage
export function saveAdministrativo(administrativo) {
  if (!administrativo || !administrativo.email) return false;
  const administrativos = loadAdministrativos();
  // Buscar por email o identificación
  const idx = administrativos.findIndex(a => a.email === administrativo.email || a.identificacion === administrativo.identificacion);
  if (idx !== -1) {
    administrativos[idx] = { ...administrativos[idx], ...administrativo };
  } else {
    administrativos.push(administrativo);
  }
  return saveArray('administrativos', administrativos);
}

// Eliminar un administrativo
export function deleteAdministrativo(identificacion) {
  const administrativos = loadAdministrativos();
  const updated = deleteItem(administrativos, identificacion, 'identificacion');
  return saveArray('administrativos', updated);
}

// Renderiza tabla de administrativos en un contenedor
export function renderAdministrativosTable(container) {
  if (!container) return;
  const administrativos = loadAdministrativos();
  if (administrativos.length === 0) {
    container.innerHTML = `
      <div class="abc-empty-state terminal-empty-state" style="text-align: center; padding: 3rem 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">👥</div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--terminal-accent); margin-bottom: 0.75rem;">
          [INFO] No hay administrativos registrados
        </div>
        <div style="color: var(--terminal-text-dim); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Para comenzar, crea tu primer administrativo haciendo clic en el botón <strong>"CREAR_ADMINISTRATIVO"</strong> arriba.
        </div>
      </div>
    `;
    return;
  }
  
  // Agregar estilos si no existen
  if (!document.getElementById('administrativos-table-styles')) {
    const style = document.createElement('style');
    style.id = 'administrativos-table-styles';
    style.textContent = `
      .abc-administrativos-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        font-family: var(--font-terminal);
        font-size: 0.875rem;
      }
      
      .abc-administrativos-table th {
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
      
      .abc-administrativos-table td {
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
      
      .abc-administrativos-table td:last-child {
        max-width: none;
        overflow: visible;
        white-space: normal;
      }
      
      .abc-administrativos-table tr:hover {
        background: rgba(0, 255, 65, 0.03);
      }
      
      .abc-administrativos-table tr:hover td {
        color: var(--terminal-text);
      }
      
      .abc-administrativos-table tr:last-child td {
        border-bottom: none;
      }
      
      .administrativo-edit-btn, .administrativo-delete-btn {
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
        margin-right: 0.5rem;
      }
      
      .administrativo-edit-btn {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      .administrativo-edit-btn:hover {
        background: rgba(0, 217, 255, 0.1);
      }
      
      .administrativo-delete-btn {
        border-color: var(--terminal-error);
        color: var(--terminal-error);
      }
      
      .administrativo-delete-btn:hover {
        background: rgba(255, 0, 68, 0.1);
      }
      
      @media (max-width: 768px) {
        .abc-administrativos-table {
          font-size: 0.75rem;
        }
        
        .abc-administrativos-table th,
        .abc-administrativos-table td {
          padding: 0.75rem 0.5rem;
        }
        
        .administrativo-edit-btn, .administrativo-delete-btn {
          padding: 0.4rem 0.6rem;
          font-size: 0.65rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  const tableHTML = `
    <table class="abc-administrativos-table">
      <thead>
        <tr>
          <th>Identificación</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Cargo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${administrativos.map(a => `
          <tr>
            <td data-label="Identificación">${a.identificacion || 'N/A'}</td>
            <td data-label="Nombres">${a.nombres || 'N/A'}</td>
            <td data-label="Apellidos">${a.apellidos || 'N/A'}</td>
            <td data-label="Email">${a.email || 'N/A'}</td>
            <td data-label="Teléfono">${a.telefono || 'N/A'}</td>
            <td data-label="Cargo">${a.cargo || 'N/A'}</td>
            <td data-label="Acciones">
              <button class="administrativo-edit-btn" data-identificacion="${a.identificacion}">
                EDITAR
              </button>
              <button class="administrativo-delete-btn" data-identificacion="${a.identificacion}">
                ELIMINAR
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHTML;
  
  // Event listeners para botones de editar
  container.querySelectorAll('.administrativo-edit-btn').forEach(btn => {
    btn.onclick = () => {
      const identificacion = btn.getAttribute('data-identificacion');
      const administrativo = administrativos.find(a => a.identificacion === identificacion);
      if (administrativo) {
        // Pasar el contenedor de la tabla para poder actualizarlo después
        renderAdministrativoForm(container, administrativo);
      }
    };
  });
  
  // Event listeners para botones de eliminar
  container.querySelectorAll('.administrativo-delete-btn').forEach(btn => {
    btn.onclick = () => {
      const identificacion = btn.getAttribute('data-identificacion');
      const administrativo = administrativos.find(a => a.identificacion === identificacion);
      if (administrativo) {
        const nombreCompleto = getFullName(administrativo);
        showConfirm(
          `¿Estás seguro de eliminar al administrativo "${nombreCompleto}"?\n\n[WARNING] Esta acción no se puede deshacer.`,
          {
            title: '[CONFIRMAR] Eliminar Administrativo',
            icon: '[⚠]',
            onConfirm: () => {
              if (deleteAdministrativo(identificacion)) {
                renderAdministrativosTable(container);
                showAlert(`[SUCCESS] Administrativo eliminado exitosamente.\n\n[INFO] "${nombreCompleto}" ha sido removido del sistema.`, {
                  title: '[SUCCESS] Operación completada',
                  icon: '[✓]',
                  type: 'success'
                });
              } else {
                showAlert('[ERROR] No se pudo eliminar el administrativo. Intenta de nuevo.', {
                  title: '[ERROR] Operación fallida',
                  icon: '[✗]',
                  type: 'error'
                });
              }
            }
          }
        );
      }
    };
  });
}

// Renderiza formulario de administrativo (nuevo o edición)
export function renderAdministrativoForm(container, administrativo = null) {
  const isEdit = !!administrativo;
  const formHTML = `
    <form id="administrativo-form" class="terminal-form">
      <div class="form-group-terminal">
        <label for="administrativo-identificacion" class="terminal-label">
          <span class="label-prefix">></span>
          IDENTIFICACIÓN
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="administrativo-identificacion"
          name="identificacion" 
          required 
          value="${administrativo?.identificacion || ''}"
          class="terminal-input"
          placeholder="Ejemplo: 1234567890"
          autocomplete="off"
          ${isEdit ? "readonly" : ''}
        />
        <div class="field-hint" style="margin-top: 0.15rem; font-size: 0.65rem; color: var(--terminal-text-dim); line-height: 1.2;">
          ${isEdit ? '🔒 Identificación no modificable' : '💡 Número de identificación único'}
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="administrativo-nombres" class="terminal-label">
          <span class="label-prefix">></span>
          NOMBRES
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="administrativo-nombres"
          name="nombres" 
          required 
          value="${administrativo?.nombres || ''}"
          class="terminal-input"
          placeholder="Ejemplo: Juan"
          autocomplete="off"
        />
      </div>
      
      <div class="form-group-terminal">
        <label for="administrativo-apellidos" class="terminal-label">
          <span class="label-prefix">></span>
          APELLIDOS
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="administrativo-apellidos"
          name="apellidos" 
          required 
          value="${administrativo?.apellidos || ''}"
          class="terminal-input"
          placeholder="Ejemplo: Pérez García"
          autocomplete="off"
        />
      </div>
      
      <div class="form-group-terminal">
        <label for="administrativo-email" class="terminal-label">
          <span class="label-prefix">></span>
          EMAIL
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="email" 
          id="administrativo-email"
          name="email" 
          required 
          value="${administrativo?.email || ''}"
          class="terminal-input"
          placeholder="Ejemplo: juan.perez@abc.edu"
          autocomplete="off"
        />
        <div class="field-hint" style="margin-top: 0.15rem; font-size: 0.65rem; color: var(--terminal-text-dim); line-height: 1.2;">
          💡 Email único del administrativo
        </div>
      </div>
      
      <div class="form-group-terminal">
        <label for="administrativo-telefono" class="terminal-label">
          <span class="label-prefix">></span>
          TELÉFONO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="tel" 
          id="administrativo-telefono"
          name="telefono" 
          required 
          value="${administrativo?.telefono || ''}"
          class="terminal-input"
          placeholder="Ejemplo: +57 300 123 4567"
          autocomplete="off"
        />
      </div>
      
      <div class="form-group-terminal">
        <label for="administrativo-cargo" class="terminal-label">
          <span class="label-prefix">></span>
          CARGO
          <span class="required-asterisk" style="color: var(--terminal-error); margin-left: 0.25rem;">*</span>
        </label>
        <input 
          type="text" 
          id="administrativo-cargo"
          name="cargo" 
          required 
          value="${administrativo?.cargo || ''}"
          class="terminal-input"
          placeholder="Ejemplo: Coordinador Académico"
          autocomplete="off"
        />
      </div>
      
      <div class="form-actions-terminal">
        <button type="submit" class="btn btn-success" id="submit-administrativo-btn">
          <span class="btn-prefix">$</span>
          <span class="btn-text">${isEdit ? "ACTUALIZAR ADMINISTRATIVO" : "CREAR ADMINISTRATIVO"}</span>
          <span class="btn-suffix">→</span>
        </button>
        <button type="button" id="administrativo-cancel-btn" class="btn btn-secondary">
          <span class="btn-prefix">[</span>
          CANCELAR
          <span class="btn-suffix">]</span>
        </button>
      </div>
      <div id="administrativo-form-error" class="terminal-error" style="display:none;"></div>
    </form>
  `;
  
  const { closeModal, content } = showFormModal(formHTML, {
    title: isEdit ? "EDITAR ADMINISTRATIVO" : "NUEVO ADMINISTRATIVO",
    icon: "[>]",
    onFormReady: (modalContent, closeFn) => {
      const form = modalContent.querySelector('#administrativo-form');
      const cancelBtn = modalContent.querySelector('#administrativo-cancel-btn');
      const errorDiv = modalContent.querySelector('#administrativo-form-error');
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          closeFn();
        };
      }
      
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const identificacion = form.identificacion.value.trim();
          const nombres = form.nombres.value.trim();
          const apellidos = form.apellidos.value.trim();
          const email = form.email.value.trim();
          const telefono = form.telefono.value.trim();
          const cargo = form.cargo.value.trim();
          
          // Validación
          if (!identificacion || !nombres || !apellidos || !email || !telefono || !cargo) {
            if (errorDiv) {
              errorDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
                  <div>
                    <div style="margin-bottom: 0.25rem;">Por favor completa todos los campos obligatorios:</div>
                    <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
                      ${!identificacion ? '<li>La <strong>identificación</strong> es obligatoria</li>' : ''}
                      ${!nombres ? '<li>Los <strong>nombres</strong> son obligatorios</li>' : ''}
                      ${!apellidos ? '<li>Los <strong>apellidos</strong> son obligatorios</li>' : ''}
                      ${!email ? '<li>El <strong>email</strong> es obligatorio</li>' : ''}
                      ${!telefono ? '<li>El <strong>teléfono</strong> es obligatorio</li>' : ''}
                      ${!cargo ? '<li>El <strong>cargo</strong> es obligatorio</li>' : ''}
                    </ul>
                  </div>
                </div>
              `;
              errorDiv.style.display = "block";
            }
            return;
          }
          
          // Validar email único
          const administrativos = loadAdministrativos();
          const emailExiste = administrativos.some(a => a.email === email && a.identificacion !== identificacion);
          if (emailExiste) {
            showError(errorDiv, `El email "${email}" ya está registrado para otro administrativo.`);
            form.email.style.borderColor = 'var(--terminal-error)';
            return;
          }
          
          // Validar identificación única (solo en creación)
          if (!isEdit) {
            const identificacionExiste = administrativos.some(a => a.identificacion === identificacion);
            if (identificacionExiste) {
              showError(errorDiv, `La identificación "${identificacion}" ya está registrada.`);
              form.identificacion.style.borderColor = 'var(--terminal-error)';
              return;
            }
          }
          
          // Resetear estilos de error
          form.email.style.borderColor = '';
          form.identificacion.style.borderColor = '';
          
          // Mostrar indicador de carga
          const submitBtn = modalContent.querySelector('#submit-administrativo-btn');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-prefix">[</span> GUARDANDO... <span class="btn-suffix">]</span>';
          submitBtn.style.opacity = '0.7';
          
          setTimeout(() => {
            const nuevoAdministrativo = {
              identificacion: identificacion,
              nombres: nombres,
              apellidos: apellidos,
              email: email,
              telefono: telefono,
              cargo: cargo
            };
            
            if (saveAdministrativo(nuevoAdministrativo)) {
              closeFn();
              
              // Recargar tabla - buscar el contenedor correcto
              const tableContainer = document.getElementById('admin-administrativos-table-container');
              if (tableContainer) {
                renderAdministrativosTable(tableContainer);
              } else if (container) {
                // Fallback: usar el contenedor pasado como parámetro
                renderAdministrativosTable(container);
              }
              
              showAlert(`[SUCCESS] ¡Administrativo ${isEdit ? 'actualizado' : 'creado'} exitosamente!\n\n[INFO] "${nombres} ${apellidos}" (${email}) está registrado.`, {
                title: '[SUCCESS] Operación completada',
                icon: '[✓]',
                type: 'success'
              });
            } else {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
              submitBtn.style.opacity = '1';
              if (errorDiv) {
                showError(errorDiv, 'No se pudo guardar el administrativo. Intenta de nuevo.');
              }
            }
          }, 300);
        };
      }
    }
  });
  
  return closeModal;
}

