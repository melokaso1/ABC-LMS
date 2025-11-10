import { handleLogin } from "../components/login.js";

class LoginView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="terminal-login">
        <div class="login-terminal-window">
          <div class="terminal-window-header">
            <div class="window-controls">
              <span class="control-dot" style="background: #ff5f56;"></span>
              <span class="control-dot" style="background: #ffbd2e;"></span>
              <span class="control-dot" style="background: #27c93f;"></span>
            </div>
            <div class="window-title">abc-educate@login:~</div>
            <div class="window-spacer"></div>
          </div>
          
          <div class="terminal-window-body">
            <div class="login-header-terminal">
              <div class="terminal-logo">
                <pre class="ascii-art">
    ╔═══════════════════════════════╗
    ║   ABC EDUCATE TERMINAL v2.0   ║
    ║   [AUTHORIZED ACCESS ONLY]    ║
    ╚═══════════════════════════════╝
                </pre>
              </div>
              <div class="login-prompt-text">
                <span class="prompt-line">[SYSTEM] Iniciando protocolo de autenticación...</span>
                <span class="prompt-line">[SYSTEM] Por favor, ingrese sus credenciales</span>
              </div>
            </div>
            
            <form id="login-form" class="terminal-login-form">
              <div class="form-group-terminal">
                <label for="login-email" class="terminal-label">
                  <span class="label-prefix">></span>
                  EMAIL_ADDRESS
                </label>
                <input 
                  type="email" 
                  id="login-email" 
                  name="email" 
                  placeholder="user@example.com" 
                  required 
                  autocomplete="username"
                  class="terminal-input"
                />
              </div>
              
              <div class="form-group-terminal">
                <label for="login-password" class="terminal-label">
                  <span class="label-prefix">></span>
                  PASSWORD
                </label>
                <input 
                  type="password" 
                  id="login-password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  autocomplete="current-password"
                  class="terminal-input"
                />
              </div>
              
              <div id="login-error" class="terminal-error" style="display:none;"></div>
              
              <button type="submit" class="btn btn-primary terminal-submit">
                <span class="btn-prefix">$</span>
                EJECUTAR_LOGIN
                <span class="btn-suffix">→</span>
              </button>
            </form>
            
            <div class="login-footer-terminal">
              <div class="footer-line">
                <span class="footer-prefix">[INFO]</span>
                <span class="footer-text">Acceso no autorizado será registrado y reportado</span>
              </div>
              <div class="footer-link">
                <a href="#/public" class="terminal-link-small">
                  <span class="link-prefix">←</span>
                  Volver al catálogo público
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
    this.setupLoginForm();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      login-view {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        background: var(--terminal-bg);
        font-family: var(--font-terminal);
      }
      
      .terminal-login {
        width: 100%;
        max-width: 600px;
        animation: fadeIn 0.2s ease-out;
      }
      
      .login-terminal-window {
        background: var(--terminal-surface);
        border: 2px solid var(--terminal-border);
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
        overflow: hidden;
      }
      
      .terminal-window-header {
        background: var(--terminal-border);
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 2px solid var(--terminal-text);
      }
      
      .window-controls {
        display: flex;
        gap: 0.5rem;
      }
      
      .control-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.3);
      }
      
      .window-title {
        flex: 1;
        color: var(--terminal-text);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .window-spacer {
        flex: 1;
      }
      
      .terminal-window-body {
        padding: 2.5rem;
      }
      
      .login-header-terminal {
        text-align: center;
        margin-bottom: 2.5rem;
      }
      
      .ascii-art {
        color: var(--terminal-accent);
        font-size: 0.75rem;
        line-height: 1.2;
        margin: 0;
        text-shadow: var(--glow-blue);
        font-family: var(--font-terminal);
      }
      
      .login-prompt-text {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .prompt-line {
        color: var(--terminal-text-dim);
        font-size: 0.875rem;
        display: block;
      }
      
      .terminal-login-form {
        margin-top: 2rem;
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
        transition: all var(--transition-base);
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
      
      .terminal-submit {
        width: 100%;
        margin-top: 1.5rem;
        padding: 1rem;
        font-size: 0.875rem;
        justify-content: space-between;
      }
      
      .btn-prefix {
        color: var(--terminal-accent);
      }
      
      .btn-suffix {
        transition: transform var(--transition-fast);
      }
      
      .terminal-submit:hover .btn-suffix {
        transform: translateX(5px);
      }
      
      .login-footer-terminal {
        margin-top: 2.5rem;
        padding-top: 2rem;
        border-top: 1px solid var(--terminal-border);
      }
      
      .footer-line {
        margin-bottom: 1rem;
        font-size: 0.75rem;
        color: var(--terminal-text-dim);
      }
      
      .footer-prefix {
        color: var(--terminal-accent);
        margin-right: 0.5rem;
      }
      
      .terminal-link-small {
        color: var(--terminal-text);
        text-decoration: none;
        font-size: 0.875rem;
        transition: all var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .terminal-link-small:hover {
        color: var(--terminal-accent);
        text-shadow: var(--glow-blue);
      }
      
      .link-prefix {
        transition: transform var(--transition-fast);
      }
      
      .terminal-link-small:hover .link-prefix {
        transform: translateX(-5px);
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @media (max-width: 480px) {
        login-view {
          padding: 1rem;
        }
        
        .terminal-window-body {
          padding: 1.5rem;
        }
        
        .ascii-art {
          font-size: 0.625rem;
        }
      }
    `;
    this.appendChild(style);
  }

  setupLoginForm() {
    const formElem = this.querySelector('#login-form');
    if (!formElem) return;
    
    const errorDiv = this.querySelector('#login-error');
    const submitBtn = this.querySelector('.terminal-submit');

    formElem.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.style.display = "none";
      errorDiv.textContent = "";
      
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = '<span class="btn-prefix">[</span> PROCESANDO... <span class="btn-suffix">]</span>';

      const email = formElem.email.value.trim();
      const password = formElem.password.value;

      if (!email || !this.validateEmail(email)) {
        errorDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
            <div>
              <div style="margin-bottom: 0.5rem;">El formato del correo electrónico no es válido.</div>
              <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                <strong>Formato correcto:</strong> nombre@dominio.com<br>
                <strong>Ejemplo:</strong> admin@abc.edu
              </div>
            </div>
          </div>
        `;
        errorDiv.style.display = "block";
        formElem.email.style.borderColor = 'var(--terminal-error)';
        formElem.email.focus();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.innerHTML = `
          <span class="btn-prefix">$</span>
          EJECUTAR_LOGIN
          <span class="btn-suffix">→</span>
        `;
        return;
      }
      
      // Resetear estilo de error
      formElem.email.style.borderColor = '';
      
      if (!password) {
        errorDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
            <div>
              <div style="margin-bottom: 0.5rem;">La contraseña es obligatoria.</div>
              <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                Por favor, ingresa tu contraseña para continuar.
              </div>
            </div>
          </div>
        `;
        errorDiv.style.display = "block";
        formElem.password.style.borderColor = 'var(--terminal-error)';
        formElem.password.focus();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.innerHTML = `
          <span class="btn-prefix">$</span>
          EJECUTAR_LOGIN
          <span class="btn-suffix">→</span>
        `;
        return;
      }
      
      // Resetear estilo de error
      formElem.password.style.borderColor = '';

      await new Promise(resolve => setTimeout(resolve, 500));

      const result = handleLogin(email, password);
      if (result.success) {
        submitBtn.innerHTML = '<span class="btn-prefix">[</span> ✓ ACCESO CONCEDIDO <span class="btn-suffix">]</span>';
        submitBtn.style.borderColor = 'var(--terminal-success)';
        submitBtn.style.color = 'var(--terminal-success)';
        submitBtn.style.textShadow = '0 0 10px rgba(0, 255, 136, 0.5)';
        
        setTimeout(() => {
          window.location.hash = "/dashboard";
        }, 800);
      } else {
        errorDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>
            <div>
              <div style="margin-bottom: 0.5rem;">${result.message || "Credenciales inválidas. Acceso denegado."}</div>
              <div style="font-size: 0.85rem; color: var(--terminal-text-dim);">
                Verifica que el correo y la contraseña sean correctos. Si olvidaste tus credenciales, contacta al administrador.
              </div>
            </div>
          </div>
        `;
        errorDiv.style.display = "block";
        formElem.email.style.borderColor = 'var(--terminal-error)';
        formElem.password.style.borderColor = 'var(--terminal-error)';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.innerHTML = `
          <span class="btn-prefix">$</span>
          EJECUTAR_LOGIN
          <span class="btn-suffix">→</span>
        `;
      }
    });
  }

  validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
}

customElements.define('login-view', LoginView);

export function renderLoginView(container = document.body) {
  const view = document.createElement('login-view');
  if (container) {
    container.innerHTML = '';
    container.appendChild(view);
  }
}
