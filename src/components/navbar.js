// Navbar principal mejorado

export function renderNavbar(container = document.body) {
  // Borrar navbar anterior
  const old = container.querySelector('.abc-navbar');
  if (old) old.remove();

  // Crear nav
  const nav = document.createElement('nav');
  nav.className = 'abc-navbar navbar';

  // Agregar estilos una sola vez
  if (!document.getElementById('abc-navbar-style')) {
    const style = document.createElement('style');
    style.id = 'abc-navbar-style';
    style.textContent = `
      .abc-navbar {
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 2rem;
        backdrop-filter: blur(10px);
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: var(--shadow-sm);
      }
      
      .navbar-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
      }
      
      .abc-navbar-brand {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .abc-navbar-menu {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex: 1;
        justify-content: center;
      }
      
      .abc-navbar-link {
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: all var(--transition-fast);
        position: relative;
      }
      
      .abc-navbar-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        transition: width var(--transition-base);
      }
      
      .abc-navbar-link:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }
      
      .abc-navbar-link.active {
        color: var(--primary-color);
        background: rgba(99, 102, 241, 0.1);
      }
      
      .abc-navbar-link.active::after {
        width: 80%;
      }
      
      .abc-navbar-logout-btn {
        background: transparent;
        border: 2px solid var(--danger-color);
        color: var(--danger-color);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.875rem;
      }
      
      .abc-navbar-logout-btn:hover {
        background: var(--danger-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      
      @media (max-width: 768px) {
        .navbar-content {
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .abc-navbar-menu {
          order: 3;
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        
        .abc-navbar {
          padding: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Contenedor del contenido
  const navbarContent = document.createElement('div');
  navbarContent.className = 'navbar-content';

  // Marca de la app
  const brand = document.createElement('a');
  brand.className = 'abc-navbar-brand';
  brand.href = '#/dashboard';
  brand.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>ABC Educate</span>
  `;

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
      a.className = 'abc-navbar-link';
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
    logoutBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; margin-right: 0.25rem; vertical-align: middle;">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Cerrar sesión
    `;
    logoutBtn.onclick = function () {
      localStorage.removeItem('session');
      window.location.hash = '/public';
    };
  }

  // Ensamblar navbar
  navbarContent.appendChild(brand);
  navbarContent.appendChild(menu);
  if (logoutBtn) navbarContent.appendChild(logoutBtn);
  nav.appendChild(navbarContent);

  // Insertar navbar al inicio del contenedor
  if (container.firstChild) {
    container.insertBefore(nav, container.firstChild);
  } else {
    container.appendChild(nav);
  }
}
