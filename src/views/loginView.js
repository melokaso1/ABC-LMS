import { initializeData, loadData, saveData } from '../utils/storage.js';
import { router } from '../utils/router.js';
import { renderRouter } from '../app.js';
import '../styles/loginView.css';
import generateToken from '../auth/gentoken.js';


class LoginView extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        this.validate();
    }
    validate(){
        const form = this.querySelector('#loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const data = loadData();
            const username = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');

            // Limpiar mensaje de error anterior
            if (errorMessage) {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
            }

            // Validar que existan credenciales
            if (!data || !data.credenciales || data.credenciales.length === 0) {
                if (errorMessage) {
                    errorMessage.textContent = 'No hay usuarios registrados en el sistema';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            // Buscar usuario
            const user = data.credenciales.find(u => u.email === username && u.password === password);

            if (user) {
                // Generar token y guardar sesión
                const token = generateToken();
                // Guardar con la clave 'token' que el router espera
                localStorage.setItem('token', token);
                saveData('current-user', user);
                
                // Redirigir a dashboard por defecto (todos los usuarios van a dashboard primero)
                window.location.hash = '#/dashboard';
                
                // Forzar re-renderizado
                renderRouter();
            } else {
                if (errorMessage) {
                    errorMessage.textContent = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    render() {
        this.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <div class="login-logo">
                        <img src="/logo.png" alt="ABC Educate Logo" class="logo-image">
                    </div>
                    <h1 class="login-title">Iniciar Sesión</h1>
                    <p class="login-subtitle">Ingresa tus credenciales para acceder al sistema</p>
                </div>
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label for="email" class="form-label">
                            <span class="material-icons">email</span>
                            Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            class="form-input" 
                            placeholder="tu@email.com"
                            required
                            autocomplete="email"
                        />
                    </div>
                    <div class="form-group">
                        <label for="password" class="form-label">
                            <span class="material-icons">lock</span>
                            Contraseña
                        </label>
                        <div class="password-input-wrapper">
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="form-input" 
                                placeholder="••••••••"
                                required
                                autocomplete="current-password"
                            />
                            <button type="button" class="password-toggle" id="passwordToggle">
                                <span class="material-icons">visibility</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-error" id="errorMessage"></div>
                    <button type="submit" class="btn-login">
                        <span class="material-icons">login</span>
                        Iniciar Sesión
                    </button>
                </form>
                <div class="login-footer">
                    <a href="#/public" class="link-back">
                        <span class="material-icons">arrow_back</span>
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('login-view', LoginView);
export default LoginView;

