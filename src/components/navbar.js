// Navbar principal

export function renderNavbar(container = document.body) {
  // Borrar navbar anterior
  const old = container.querySelector('.abc-navbar');
  if (old) old.remove();

  // Crear nav
  const nav = document.createElement('nav');
  nav.className = 'abc-navbar';

  // Agregar estilos una sola vez
  if (!document.getElementById('abc-navbar-style')) {
    const style = document.createElement('style');
    style.id = 'abc-navbar-style';
    style.textContent = `
      .abc-navbar {
        background: #183049;
        color: #fff;
        padding: 0.5rem 2vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2vw;
        font-family: inherit;
        margin-bottom: 2rem;
      }
      .abc-navbar .abc-navbar-brand {
        font-weight: bold;
        letter-spacing: 1px;
        font-size: 1.2rem;
        margin-right: 2vw;
      }
      .abc-navbar .abc-navbar-menu {
        display: flex;
        gap: 1.5vw;
        flex: 1;
      }
      .abc-navbar a {
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        transition: opacity 0.15s;
        opacity: 0.92;
        padding: 0.15rem 0.5rem;
        border-radius: 3px;
      }
      .abc-navbar a.active, .abc-navbar a:hover {
        background: #375a7e;
        opacity: 1;
      }
      .abc-navbar-logout-btn {
        background: #fff;
        color: #183049;
        border: none;
        border-radius: 4px;
        padding: 0.3rem 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        margin-left: 2vw;
      }
      .abc-navbar-logout-btn:hover {
        background: #c0382b;
        color: #fff;
      }
    `;
    document.head.appendChild(style);
  }

  // Marca de la app
  const brand = document.createElement('span');
  brand.className = 'abc-navbar-brand';
  brand.textContent = 'ABC Gestión';

  // Menú
  const menu = document.createElement('div');
  menu.className = 'abc-navbar-menu';

  // Items de navegación según sesión
  const hasSession = !!localStorage.getItem('session');
  const items = [
    { label: 'Inicio', route: '/dashboard', showIfSession: true },
    { label: 'Docentes', route: '/docentes', showIfSession: true },
    { label: 'Cursos', route: '/cursos', showIfSession: true },
    { label: 'Admin', route: '/admin', showIfSession: true },
    { label: 'Público', route: '/public', showIfNoSession: true },
    { label: 'Login', route: '/login', showIfNoSession: true },
  ];

  // Ruta actual
  const current = window.location.hash.replace('#', '') || '/public';

  // Agregar enlaces
  items.forEach(item => {
    if ((hasSession && item.showIfSession) || (!hasSession && item.showIfNoSession)) {
      const a = document.createElement('a');
      a.href = '#' + item.route;
      a.textContent = item.label;
      if (current === item.route) {
        a.classList.add('active');
      }
      menu.appendChild(a);
    }
  });

  // Botón logout si hay sesión
  let logoutBtn = null;
  if (hasSession) {
    logoutBtn = document.createElement('button');
    logoutBtn.className = 'abc-navbar-logout-btn';
    logoutBtn.type = 'button';
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.onclick = function () {
      localStorage.removeItem('session');
      window.location.hash = '/login';
    };
  }

  // Ensamblar navbar
  nav.appendChild(brand);
  nav.appendChild(menu);
  if (logoutBtn) nav.appendChild(logoutBtn);

  // Insertar navbar
  container.insertBefore(nav, container.firstChild);
}
