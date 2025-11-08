import { handleLogin } from "../components/login.js";

// Muestra el formulario de login en el contenedor
export function renderLoginView(container = document.body) {
  // Quita formulario anterior si existe
  const old = container.querySelector('.abc-login-container');
  if (old) old.remove();

  const div = document.createElement('section');
  div.className = 'abc-login-container';

  div.innerHTML = `
    <div class="abc-login-card">
      <form id="login-form" autocomplete="on">
        <div class="abc-inputs">
          <input name="email" id="login-email" type="email" placeholder="Correo" required autocomplete="username">
          <input name="password" id="login-password" type="password" placeholder="Contraseña" required autocomplete="current-password">
        </div>
        <button type="submit">Ingresar</button>
        <div id="login-error" class="abc-error" style="color:#a33;margin-top:0.5em;display:none;"></div>
      </form>
    </div>
  `;

  container.appendChild(div);

  setupLoginForm(div.querySelector('#login-form'));
}

// Configura envío y validación del login
export function setupLoginForm(formElem) {
  if (!formElem) return;
  const errorDiv = formElem.querySelector('#login-error');

  formElem.addEventListener('submit', function(e) {
    e.preventDefault();
    errorDiv.style.display = "none";
    errorDiv.textContent = "";

    const email = formElem.email.value.trim();
    const password = formElem.password.value;

    // Valida email
    if (!email || !validateEmail(email)) {
      errorDiv.textContent = "Correo inválido";
      errorDiv.style.display = "block";
      formElem.email.focus();
      return;
    }
    // Valida password
    if (!password) {
      errorDiv.textContent = "La contraseña es obligatoria";
      errorDiv.style.display = "block";
      formElem.password.focus();
      return;
    }

    // sólo acepta admin@example.com / admin
    if (email === "admin@example.com" && password === "admin") {
      localStorage.setItem("session", JSON.stringify({ email }));
      window.location.hash = "/dashboard";
    } else {
      errorDiv.textContent = "Usuario o contraseña incorrectos";
      errorDiv.style.display = "block";
    }
  });
}

// Validación rápida de correo electrónico
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}


// Reemplaza la lógica de login para que use handleLogin()
export function setupLoginForm(formElem) {
  if (!formElem) return;
  const errorDiv = formElem.querySelector('#login-error');

  formElem.addEventListener('submit', function(e) {
    e.preventDefault();
    errorDiv.style.display = "none";
    errorDiv.textContent = "";

    const email = formElem.email.value.trim();
    const password = formElem.password.value;

    // Valida email
    if (!email || !validateEmail(email)) {
      errorDiv.textContent = "Correo inválido";
      errorDiv.style.display = "block";
      formElem.email.focus();
      return;
    }
    // Valida password
    if (!password) {
      errorDiv.textContent = "La contraseña es obligatoria";
      errorDiv.style.display = "block";
      formElem.password.focus();
      return;
    }

    // Usa handleLogin para validar y guardar sesión
    const result = handleLogin(email, password);
    if (result.success) {
      window.location.hash = "/dashboard";
    } else {
      errorDiv.textContent = result.message || "Usuario o contraseña incorrectos";
      errorDiv.style.display = "block";
    }
  });
}
