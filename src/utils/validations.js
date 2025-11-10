// Valida si el email tiene formato correcto básico
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Valida si el teléfono es válido (mínimo 7 dígitos, solo caracteres permitidos)
export function validatePhone(phone) {
  if (typeof phone !== 'string' && typeof phone !== 'number') return false;
  const digits = String(phone).replace(/[^\d]/g, '');
  if (digits.length < 7) return false;
  return /^[- +()0-9]+$/.test(String(phone).trim());
}

// Valida campo requerido (que no sea vacío, nulo o solo espacios)
export function validateRequired(value) {
  if (value == null) return false;
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

// Validación en tiempo real para formularios
export function setupRealtimeValidation(form, rules, messages={}) {
  if (!form || typeof rules !== "object") return;

  Object.keys(rules).forEach((name) => {
    const input = form.elements.namedItem(name);
    if (!input) return;
    input.addEventListener('input', () => {
      const valor = input.value;
      let error = "";
      for (const fn of rules[name]) {
        const res = fn(valor, input);
        if (res === false) {
          error = messages[name] || "Campo inválido";
          break;
        } else if (typeof res === "string") {
          error = res;
          break;
        }
      }
      showInputError(input, error);
    });
  });

  form.addEventListener("submit", e => {
    let hayError = false;
    Object.keys(rules).forEach((name) => {
      const input = form.elements.namedItem(name);
      if (!input) return;
      const valor = input.value;
      let error = "";
      for (const fn of rules[name]) {
        const res = fn(valor, input);
        if (res === false) {
          error = messages[name] || "Campo inválido";
          hayError = true;
          break;
        } else if (typeof res === "string") {
          error = res;
          hayError = true;
          break;
        }
      }
      showInputError(input, error);
    });
    if (hayError) e.preventDefault();
  });
}

// Muestra error visual bajo el input y resalta borde rojo
function showInputError(input, msg) {
  if (input._valerrorEl) {
    input._valerrorEl.remove();
    input._valerrorEl = null;
    input.classList.remove("abc-input-error");
  }
  if (msg) {
    input.classList.add("abc-input-error");
    const err = document.createElement("div");
    err.textContent = msg;
    err.className = "abc-input-error-msg";
    input.after(err);
    input._valerrorEl = err;
  }
}

// Inyecta el CSS mínimo para los errores una sola vez
(function injectValidationStyles() {
  if (document.getElementById("abc-valstyle")) return;
  const style = document.createElement("style");
  style.id = "abc-valstyle";
  style.textContent = `
    .abc-input-error { border-color: #c23d3d !important; background: #ffecec !important; }
    .abc-input-error-msg {
      color: #c23d3d; font-size: 0.88em; margin-top: 0.17em; margin-bottom: 0.7em; line-height:1.15;
    }
  `;
  document.head.appendChild(style);
})();

