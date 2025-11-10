import { getItemSync, setItemSync } from '../utils/storage.js';

// Busca las credenciales en localStorage, retorna true si es válido
export function validateCredentials(email, password) {
  // Obtener usuarios del storage
  const users = getItemSync('users');
  if (!Array.isArray(users)) return false;
  // Buscar usuario que coincida
  return users.some(
    u => (u.email === email && u.password === password)
  );
}

// Valida el login y guarda la sesión en localStorage si es válido
export function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: "Correo y contraseña son requeridos." };
  }
  // Validar credenciales
  const isOk = validateCredentials(email, password);
  if (isOk) {
    const user = { email };
    setItemSync("session", user);
    return { success: true, user };
  } else {
    return { success: false, message: "Usuario o contraseña incorrectos." };
  }
}
