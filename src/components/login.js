// Busca las credenciales en localStorage, retorna true si es válido
export function validateCredentials(email, password) {
  // Obtener usuarios de localStorage
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return false;
  let users;
  try {
    users = JSON.parse(usersJson);
    if (!Array.isArray(users)) return false;
  } catch {
    return false;
  }
  // Buscar usuario que coincida
  return users.some(
    u => (u.email === email && u.password === password)
  );
}

// Valida el login y guarda la sesión en sessionStorage si es válido
export function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: "Correo y contraseña son requeridos." };
  }
  // Validar con localStorage
  const isOk = validateCredentials(email, password);
  if (isOk) {
    const user = { email };
    sessionStorage.setItem("session", JSON.stringify(user));
    return { success: true, user };
  } else {
    return { success: false, message: "Usuario o contraseña incorrectos." };
  }
}
