// Sistema de modales con estilo terminal/hacker
let currentModal = null;

// Estilos del modal terminal (se agregan una vez)
function ensureModalStyles() {
  if (document.getElementById('terminal-modal-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'terminal-modal-styles';
  style.textContent = `
    .terminal-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }
    
    .terminal-modal {
      background: var(--terminal-surface, #000000);
      border-top: 2px solid var(--terminal-accent, #00d9ff);
      border-left: 2px solid var(--terminal-accent, #00d9ff);
      border-bottom: 2px solid var(--terminal-success, #00ff41);
      border-right: 2px solid var(--terminal-success, #00ff41);
      min-width: 320px;
      max-width: 600px;
      width: 90vw;
      position: relative;
      overflow: visible;
      font-family: var(--font-terminal, 'JetBrains Mono', monospace);
      animation: slideDown 0.3s ease-out;
    }
    
    .terminal-modal.form-modal {
      max-width: 700px;
      width: auto;
      min-width: 500px;
      max-height: 90vh;
      height: auto;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
    }
    
    .terminal-modal-content.form-content {
      padding: 1rem 1.25rem;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(90vh - 100px);
      flex: 1 1 auto;
    }
    
    /* Estilos para formularios en modales - compactos */
    .terminal-modal .terminal-form {
      margin: 0;
      width: 100%;
    }
    
    .terminal-modal .form-group-terminal {
      margin-bottom: 0.75rem;
    }
    
    .terminal-modal .form-group-terminal:last-of-type {
      margin-bottom: 0;
    }
    
    .terminal-modal .terminal-label {
      margin-bottom: 0.35rem;
      font-size: 0.75rem;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    
    .terminal-modal .terminal-input,
    .terminal-modal textarea.terminal-input,
    .terminal-modal select.terminal-input {
      padding: 0.5rem 0.7rem;
      font-size: 0.8rem;
      margin-bottom: 0;
      line-height: 1.4;
      width: 100%;
      background: var(--terminal-bg, #0a0a0a);
      border: 1px solid var(--terminal-border, #1a1a1a);
      color: var(--terminal-text, #00ff41);
      transition: border-color var(--transition-base);
    }
    
    .terminal-modal .terminal-input:focus,
    .terminal-modal textarea.terminal-input:focus,
    .terminal-modal select.terminal-input:focus {
      border-color: var(--terminal-text, #00ff41);
      background: rgba(0, 255, 65, 0.05);
      outline: none;
    }
    
    .terminal-modal .file-input-wrapper {
      position: relative;
      width: 100%;
    }
    
    .terminal-modal input[type="file"] {
      padding: 0.4rem;
      cursor: pointer;
      width: 100%;
    }
    
    .terminal-modal input[type="file"]::-webkit-file-upload-button {
      padding: 0.35rem 0.7rem;
      background: var(--terminal-surface, #121212);
      border: 1px solid var(--terminal-border, #1a1a1a);
      color: var(--terminal-text, #00ff41);
      font-family: var(--font-terminal, monospace);
      font-size: 0.7rem;
      cursor: pointer;
      margin-right: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all var(--transition-base);
    }
    
    .terminal-modal input[type="file"]::-webkit-file-upload-button:hover {
      background: rgba(0, 255, 65, 0.1);
      border-color: var(--terminal-text, #00ff41);
    }
    
    .terminal-modal .file-name-display {
      margin-top: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(0, 255, 65, 0.05);
      border: 1px solid var(--terminal-success, #00ff88);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    
    .terminal-modal .file-name-text {
      color: var(--terminal-text, #00ff41);
      font-size: 0.75rem;
      font-family: var(--font-terminal, monospace);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .terminal-modal .file-remove-btn {
      background: transparent;
      border: 1px solid var(--terminal-error, #ff0044);
      color: var(--terminal-error, #ff0044);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
      padding: 0;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }
    
    .terminal-modal .file-remove-btn:hover {
      background: rgba(255, 0, 68, 0.1);
    }
    
    .terminal-modal .field-hint {
      margin-top: 0.25rem;
      font-size: 0.65rem;
      line-height: 1.3;
      color: var(--terminal-text-dim, #00cc33);
    }
    
    .terminal-modal .foto-preview-wrapper {
      margin-top: 0.5rem;
    }
    
    .terminal-modal .foto-preview-label {
      color: var(--terminal-accent, #00d9ff);
      font-size: 0.7rem;
      margin-bottom: 0.4rem;
      font-weight: 600;
    }
    
    .terminal-modal .foto-preview-img {
      max-width: 200px;
      max-height: 200px;
      border: 2px solid var(--terminal-accent, #00d9ff);
      border-radius: 8px;
      object-fit: cover;
      display: block;
    }
    
    .terminal-modal .form-help-text {
      margin-bottom: 0.75rem !important;
      padding: 0.6rem 0.8rem !important;
      font-size: 0.7rem;
      line-height: 1.3;
      border-radius: 4px;
    }
    
    .terminal-modal .form-help-warning {
      background: rgba(255, 170, 0, 0.1) !important;
      border-left: 3px solid var(--terminal-warning, #ffaa00) !important;
    }
    
    .terminal-modal .form-help-title {
      color: var(--terminal-warning, #ffaa00);
      font-weight: 600;
      margin-bottom: 0.25rem;
      font-size: 0.65rem;
    }
    
    .terminal-modal .form-help-content {
      color: var(--terminal-text-dim, #00cc33);
      font-size: 0.65rem;
      line-height: 1.3;
    }
    
    .terminal-modal .form-actions-terminal {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--terminal-border, #1a1a1a);
      gap: 0.6rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .terminal-modal .form-actions-terminal .btn {
      min-width: 100px;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }
    
    .terminal-modal .terminal-error {
      margin-top: 0.75rem;
      padding: 0.6rem 0.8rem;
      font-size: 0.75rem;
      line-height: 1.4;
      border-radius: 4px;
    }
    
    /* Responsive - Tablet y móvil grande (768px y menos) */
    @media (max-width: 768px) {
      .terminal-modal {
        max-width: 95vw;
        min-width: 90vw;
        width: 90vw;
        margin: 0.5rem;
        max-height: 95vh;
      }
      
      .terminal-modal.form-modal {
        min-width: 90vw;
        max-width: 95vw;
        width: 90vw;
        max-height: 90vh;
      }
      
      .terminal-modal-overlay {
        padding: 0.5rem;
        align-items: flex-start;
        padding-top: 2rem;
      }
      
      .terminal-modal-header {
        padding: 0.5rem 0.75rem;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
      
      .terminal-modal-title {
        font-size: 0.8rem;
        letter-spacing: 1px;
        flex: 1;
        min-width: 0;
      }
      
      .terminal-modal-icon {
        font-size: 0.95rem;
      }
      
      .terminal-modal-close {
        width: 24px;
        height: 24px;
        font-size: 0.95rem;
        flex-shrink: 0;
      }
      
      .terminal-modal-content {
        padding: 0.85rem 0.7rem;
        font-size: 0.75rem;
        max-height: calc(90vh - 100px);
        overflow-y: auto;
      }
      
      .terminal-modal-content.form-content {
        padding: 0.85rem 0.9rem;
        max-height: calc(90vh - 100px);
        overflow-y: auto;
      }
      
      .terminal-modal .form-group-terminal {
        margin-bottom: 0.65rem;
      }
      
      .terminal-modal .terminal-label {
        font-size: 0.7rem;
        margin-bottom: 0.3rem;
      }
      
      .terminal-modal .terminal-input,
      .terminal-modal textarea.terminal-input,
      .terminal-modal select.terminal-input {
        padding: 0.45rem 0.65rem;
        font-size: 0.75rem;
      }
      
      .terminal-modal .field-hint {
        font-size: 0.6rem;
        margin-top: 0.2rem;
      }
      
      .terminal-modal .form-help-text {
        padding: 0.55rem 0.7rem !important;
        font-size: 0.65rem;
        margin-bottom: 0.65rem !important;
      }
      
      .terminal-modal .form-actions-terminal {
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.65rem;
        padding-top: 0.65rem;
      }
      
      .terminal-modal .form-actions-terminal .btn {
        width: 100%;
        padding: 0.55rem 0.9rem;
        font-size: 0.7rem;
      }
      
      .terminal-modal-actions {
        padding: 0.5rem 0.75rem;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .terminal-modal-btn {
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 0.75rem;
        min-width: auto;
      }
      
      .terminal-modal-message-line {
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .terminal-modal-prefix {
        min-width: auto;
        font-size: 0.75rem;
      }
    }
    
    /* Responsive - Móvil pequeño (480px y menos) */
    @media (max-width: 480px) {
      .terminal-modal {
        max-width: 98vw;
        min-width: 95vw;
        width: 95vw;
        margin: 0.25rem;
        max-height: 98vh;
      }
      
      .terminal-modal.form-modal {
        min-width: 95vw;
        max-width: 98vw;
        width: 95vw;
        max-height: 95vh;
      }
      
      .terminal-modal-overlay {
        padding: 0.25rem;
        padding-top: 1rem;
      }
      
      .terminal-modal-header {
        padding: 0.4rem 0.5rem;
      }
      
      .terminal-modal-title {
        font-size: 0.7rem;
        letter-spacing: 0.5px;
      }
      
      .terminal-modal-icon {
        font-size: 0.85rem;
      }
      
      .terminal-modal-close {
        width: 22px;
        height: 22px;
        font-size: 0.85rem;
      }
      
      .terminal-modal-content {
        padding: 0.7rem 0.5rem;
        font-size: 0.7rem;
        max-height: calc(95vh - 90px);
      }
      
      .terminal-modal-content.form-content {
        padding: 0.75rem 0.65rem;
        max-height: calc(95vh - 90px);
      }
      
      .terminal-modal .form-group-terminal {
        margin-bottom: 0.6rem;
      }
      
      .terminal-modal .terminal-label {
        font-size: 0.65rem;
        margin-bottom: 0.25rem;
      }
      
      .terminal-modal .terminal-input,
      .terminal-modal textarea.terminal-input,
      .terminal-modal select.terminal-input {
        padding: 0.4rem 0.6rem;
        font-size: 0.7rem;
      }
      
      .terminal-modal .field-hint {
        font-size: 0.55rem;
        margin-top: 0.15rem;
      }
      
      .terminal-modal .form-help-text {
        padding: 0.5rem 0.65rem !important;
        font-size: 0.6rem;
        margin-bottom: 0.6rem !important;
      }
      
      .terminal-modal .form-actions-terminal {
        margin-top: 0.6rem;
        padding-top: 0.6rem;
        gap: 0.45rem;
      }
      
      .terminal-modal .form-actions-terminal .btn {
        padding: 0.5rem 0.85rem;
        font-size: 0.65rem;
      }
      
      .terminal-modal-actions {
        padding: 0.4rem 0.5rem;
        gap: 0.4rem;
      }
      
      .terminal-modal-btn {
        padding: 0.55rem 0.9rem;
        font-size: 0.7rem;
      }
      
      .terminal-modal-prefix {
        font-size: 0.7rem;
      }
    }
    
    /* Orientación landscape en móviles */
    @media (max-width: 768px) and (orientation: landscape) {
      .terminal-modal-overlay {
        align-items: center;
        padding-top: 0.5rem;
      }
      
      .terminal-modal {
        max-height: 85vh;
      }
      
      .terminal-modal.form-modal {
        max-height: 85vh;
      }
      
      .terminal-modal-content {
        max-height: calc(85vh - 100px);
      }
      
      .terminal-modal-content.form-content {
        max-height: calc(85vh - 100px);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .terminal-modal-header {
      padding: 0.6rem 1.25rem;
      border-bottom: 1px solid var(--terminal-border, #1a1a1a);
      background: transparent;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    
    .terminal-modal-title {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--terminal-accent, #00d9ff);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    
    .terminal-modal-icon {
      font-size: 1.1rem;
      font-weight: 700;
    }
    
    .terminal-modal-close {
      background: transparent;
      border: 1px solid var(--terminal-text-dim, #666);
      color: var(--terminal-text-dim, #666);
      font-size: 1.1rem;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--font-terminal, monospace);
      line-height: 1;
      padding: 0;
    }
    
    .terminal-modal-close:hover {
      border-color: var(--terminal-error, #ff0044);
      color: var(--terminal-error, #ff0044);
      background: rgba(255, 0, 68, 0.1);
    }
    
    .terminal-modal-content {
      padding: 1rem 1.25rem;
      color: var(--terminal-text, #00ff41);
      font-size: 0.8rem;
      line-height: 1.5;
      white-space: pre-line;
      background: var(--terminal-surface, #000000);
    }
    
    .terminal-modal-message {
      margin-bottom: 1rem;
    }
    
    .terminal-modal-message-line {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .terminal-modal-prefix {
      color: var(--terminal-accent, #00d9ff);
      font-weight: 600;
      min-width: 80px;
    }
    
    .terminal-modal-prefix.error {
      color: var(--terminal-error, #ff0044);
    }
    
    .terminal-modal-prefix.warning {
      color: #ffaa00;
    }
    
    .terminal-modal-prefix.info {
      color: var(--terminal-accent, #00d9ff);
    }
    
    .terminal-modal-prefix.success {
      color: var(--terminal-success, #00ff88);
    }
    
    .terminal-modal-text {
      color: var(--terminal-text, #00ff41);
      flex: 1;
    }
    
    .terminal-modal-actions {
      padding: 0.5rem 1rem;
      border-top: 1px solid var(--terminal-border, #1a1a1a);
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      align-items: center;
      background: transparent;
      flex-shrink: 0;
    }
    
    .terminal-modal-btn {
      padding: 0.45rem 0.9rem;
      font-family: var(--font-terminal, monospace);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border: 1px solid var(--terminal-border, #1a1a1a);
      background: transparent;
      color: var(--terminal-text, #00ff41);
      cursor: pointer;
      transition: all 0.15s ease;
      min-width: 75px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
    }
    
    .terminal-modal-btn:hover {
      background: rgba(0, 255, 65, 0.05);
    }
    
    .terminal-modal-btn-primary {
      border-color: var(--terminal-success, #00ff88);
      color: var(--terminal-success, #00ff88);
    }
    
    .terminal-modal-btn-primary:hover {
      background: rgba(0, 255, 136, 0.1);
      border-color: var(--terminal-success, #00ff88);
    }
    
    .terminal-modal-btn-danger {
      border-color: var(--terminal-error, #ff0044);
      color: var(--terminal-error, #ff0044);
    }
    
    .terminal-modal-btn-danger:hover {
      background: rgba(255, 0, 68, 0.1);
      border-color: var(--terminal-error, #ff0044);
    }
    
    .terminal-modal-btn-secondary {
      border-color: var(--terminal-text-dim, #666);
      color: var(--terminal-text-dim, #666);
    }
    
    .terminal-modal-btn-secondary:hover {
      border-color: var(--terminal-text, #00ff41);
      color: var(--terminal-text, #00ff41);
      background: rgba(0, 255, 65, 0.05);
    }
    
  `;
  document.head.appendChild(style);
}

// Función para parsear mensajes con prefijos [ERROR], [WARNING], etc.
function parseMessage(message) {
  const lines = message.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const match = line.match(/^\[(\w+)\]\s*(.*)$/);
    if (match) {
      const [, prefix, text] = match;
      return { prefix: prefix.toUpperCase(), text: text.trim() };
    }
    return { prefix: 'INFO', text: line.trim() };
  });
}

// Mostrar alerta
export function showAlert(message, options = {}) {
  ensureModalStyles();
  
  // Cerrar modal anterior si existe
  if (currentModal) {
    currentModal();
  }
  
  const { title = '[ALERT]', icon = '[!]', type = 'info' } = options;
  const messages = parseMessage(message);
  
  const overlay = document.createElement('div');
  overlay.className = 'terminal-modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'terminal-modal';
  
  // Header
  const header = document.createElement('div');
  header.className = 'terminal-modal-header';
  header.innerHTML = `
    <h3 class="terminal-modal-title">
      <span class="terminal-modal-icon">${icon}</span>
      ${title}
    </h3>
    <button class="terminal-modal-close" aria-label="Cerrar">×</button>
  `;
  
  // Content
  const content = document.createElement('div');
  content.className = 'terminal-modal-content';
  const messageDiv = document.createElement('div');
  messageDiv.className = 'terminal-modal-message';
  
  messages.forEach(msg => {
    const line = document.createElement('div');
    line.className = 'terminal-modal-message-line';
    const prefix = document.createElement('span');
    prefix.className = `terminal-modal-prefix ${msg.prefix.toLowerCase()}`;
    prefix.textContent = `[${msg.prefix}]`;
    const text = document.createElement('span');
    text.className = 'terminal-modal-text';
    text.textContent = msg.text;
    line.appendChild(prefix);
    line.appendChild(text);
    messageDiv.appendChild(line);
  });
  
  content.appendChild(messageDiv);
  
  // Actions
  const actions = document.createElement('div');
  actions.className = 'terminal-modal-actions';
  const okBtn = document.createElement('button');
  okBtn.className = 'terminal-modal-btn terminal-modal-btn-primary';
  okBtn.textContent = 'OK';
  okBtn.onclick = () => closeModal();
  actions.appendChild(okBtn);
  
  // Ensamblar
  modal.appendChild(header);
  modal.appendChild(content);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Event listeners
  const closeBtn = header.querySelector('.terminal-modal-close');
  closeBtn.onclick = () => closeModal();
  
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
  
  const escHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', escHandler);
  
  // Función para cerrar
  function closeModal() {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', escHandler);
      currentModal = null;
    }
  }
  
  currentModal = closeModal;
  
  // Focus en el botón OK
  setTimeout(() => okBtn.focus(), 100);
  
  return closeModal;
}

// Mostrar confirmación (retorna Promise)
export function showConfirm(message, options = {}) {
  ensureModalStyles();
  
  // Cerrar modal anterior si existe
  if (currentModal) {
    currentModal();
  }
  
  return new Promise((resolve) => {
    const { title = '[CONFIRM]', icon = '[?]', confirmText = 'SÍ', cancelText = 'NO' } = options;
    const messages = parseMessage(message);
    
    const overlay = document.createElement('div');
    overlay.className = 'terminal-modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'terminal-modal';
    
    // Header
    const header = document.createElement('div');
    header.className = 'terminal-modal-header';
    header.innerHTML = `
      <h3 class="terminal-modal-title">
        <span class="terminal-modal-icon">${icon}</span>
        ${title}
      </h3>
      <button class="terminal-modal-close" aria-label="Cerrar">×</button>
    `;
    
    // Content
    const content = document.createElement('div');
    content.className = 'terminal-modal-content';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'terminal-modal-message';
    
    messages.forEach(msg => {
      const line = document.createElement('div');
      line.className = 'terminal-modal-message-line';
      const prefix = document.createElement('span');
      prefix.className = `terminal-modal-prefix ${msg.prefix.toLowerCase()}`;
      prefix.textContent = `[${msg.prefix}]`;
      const text = document.createElement('span');
      text.className = 'terminal-modal-text';
      text.textContent = msg.text;
      line.appendChild(prefix);
      line.appendChild(text);
      messageDiv.appendChild(line);
    });
    
    content.appendChild(messageDiv);
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'terminal-modal-actions';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'terminal-modal-btn terminal-modal-btn-secondary';
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      closeModal();
      resolve(false);
    };
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'terminal-modal-btn terminal-modal-btn-danger';
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      closeModal();
      resolve(true);
    };
    
    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    
    // Ensamblar
    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Event listeners
    const closeBtn = header.querySelector('.terminal-modal-close');
    closeBtn.onclick = () => {
      closeModal();
      resolve(false);
    };
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeModal();
        resolve(false);
      }
    };
    
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        resolve(false);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Función para cerrar
    function closeModal() {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        document.removeEventListener('keydown', escHandler);
        currentModal = null;
      }
    }
    
    currentModal = closeModal;
    
    // Focus en el botón de cancelar por defecto
    setTimeout(() => cancelBtn.focus(), 100);
  });
}

// Función para mostrar formulario en modal
export function showFormModal(formHTML, options = {}) {
  ensureModalStyles();
  
  // Cerrar modal anterior si existe
  if (currentModal) {
    currentModal();
  }
  
  const { 
    title = '[FORM]', 
    icon = '[>]', 
    onClose = null,
    closable = true,
    onFormReady = null // Callback cuando el formulario está listo
  } = options;
  
  const overlay = document.createElement('div');
  overlay.className = 'terminal-modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'terminal-modal form-modal';
  
  // Header
  const header = document.createElement('div');
  header.className = 'terminal-modal-header';
  header.innerHTML = `
    <h3 class="terminal-modal-title">
      <span class="terminal-modal-icon">${icon}</span>
      ${title}
    </h3>
    ${closable ? '<button class="terminal-modal-close" aria-label="Cerrar">×</button>' : ''}
  `;
  
  // Content - contiene el formulario
  const content = document.createElement('div');
  content.className = 'terminal-modal-content form-content';
  content.innerHTML = formHTML;
  
  // Ensamblar
  modal.appendChild(header);
  modal.appendChild(content);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Función para cerrar
  function closeModal() {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
      if (closable && escHandler) {
        document.removeEventListener('keydown', escHandler);
      }
      currentModal = null;
      if (onClose) onClose();
    }
  }
  
  let escHandler = null;
  
  // Event listeners
  if (closable) {
    const closeBtn = header.querySelector('.terminal-modal-close');
    if (closeBtn) {
      closeBtn.onclick = () => closeModal();
    }
    
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };
    
    escHandler = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', escHandler);
  }
  
  currentModal = closeModal;
  
  // Llamar callback cuando el formulario esté listo
  if (onFormReady) {
    setTimeout(() => {
      onFormReady(content, closeModal);
    }, 50);
  }
  
  return { closeModal, content };
}

// Función legacy para compatibilidad
export function showModal(contentHTML, options = {}) {
  ensureModalStyles();
  return showAlert(contentHTML, options);
}
