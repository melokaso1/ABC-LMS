# 📚 Documentación Técnica - ABC Educate

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Flujo de la Aplicación](#flujo-de-la-aplicación)
3. [Sistema de Enrutamiento](#sistema-de-enrutamiento)
4. [Gestión de Datos](#gestión-de-datos)
5. [Autenticación y Sesiones](#autenticación-y-sesiones)
6. [Componentes Principales](#componentes-principales)
7. [Vistas](#vistas)
8. [Sistema de Estilos](#sistema-de-estilos)
9. [Flujos de Datos](#flujos-de-datos)

---

## 🏗️ Arquitectura General

### Estructura del Proyecto

```
proyecto/
├── src/
│   ├── main.js              # Punto de entrada principal
│   ├── components/          # Componentes reutilizables
│   │   ├── cursos.js       # Gestión de cursos, módulos y lecciones
│   │   ├── docentes.js      # Gestión de docentes
│   │   ├── administrativos.js # Gestión de administrativos
│   │   ├── login.js        # Lógica de autenticación
│   │   ├── modal.js        # Sistema de modales
│   │   ├── navbar.js       # Barra de navegación
│   │   └── stats.js        # Estadísticas del dashboard
│   ├── views/              # Vistas principales (Web Components)
│   │   ├── loginView.js    # Vista de login
│   │   ├── dashboardView.js # Vista del dashboard
│   │   ├── adminView.js    # Vista de administración (unificada)
│   │   └── publicView.js   # Vista pública del catálogo
│   ├── utils/              # Utilidades
│   │   ├── router.js       # Sistema de enrutamiento
│   │   ├── storage.js      # Gestión de localStorage
│   │   └── helpers.js      # Funciones helper básicas
│   ├── data/               # Datos iniciales
│   │   └── initializeData.js # Datos de ejemplo
│   └── styles/             # Estilos
│       └── main.css        # Estilos principales
├── index.html              # HTML principal
└── package.json            # Configuración del proyecto
```

### Tecnologías Utilizadas

- **JavaScript Básico**: Sin frameworks, código vanilla fácil de entender
- **Web Components**: Custom Elements API para componentes reutilizables
- **LocalStorage**: Persistencia de datos en el navegador
- **Hash Routing**: Navegación basada en hash (#/ruta)
- **Vite**: Herramienta de desarrollo y build
- **CSS Variables**: Sistema de diseño con variables CSS

---

## 🔄 Flujo de la Aplicación

### 1. Inicialización (`main.js`)

```javascript
// 1. Importa todas las vistas para registrar los Web Components
import './views/loginView.js';
import './views/dashboardView.js';
// ... otras vistas

// 2. Importa el Router
import { Router } from './utils/router.js';

// 3. Inicializa datos si no existen
function initializeAppData() {
  const appData = getInitialData();
  if (!getItemSync('appData')) {
    setItemSync('appData', appData);
  }
  // Inicializa usuarios, docentes y cursos
}

// 4. Inicializa la aplicación cuando el DOM está listo
window.addEventListener('DOMContentLoaded', init);
```

**Proceso:**
1. Se cargan todos los módulos de vistas (registran los Web Components)
2. Se inicializan los datos en localStorage si no existen
3. Se inicializa el Router que maneja la navegación
4. El Router detecta la ruta actual y renderiza la vista correspondiente

### 2. Flujo de Navegación

```
Usuario accede → Router detecta hash → Verifica autenticación → Renderiza vista
```

**Ejemplo:**
- Usuario visita `#/admin`
- Router verifica si hay sesión activa
- Si no hay sesión → redirige a `#/login`
- Si hay sesión → renderiza `admin-view`

---

## 🧭 Sistema de Enrutamiento

### Archivo: `src/utils/router.js`

El Router es el corazón de la navegación de la aplicación.

#### Configuración de Rutas

```javascript
const routes = {
    '/login': 'login-view',
    '/dashboard': 'dashboard-view',
    '/docentes': 'docentes-view',
    '/cursos': 'cursos-view',
    '/admin': 'admin-view',
    '/public': 'public-view',
};
```

#### Rutas Protegidas

```javascript
const protectedRoutes = [
    '/dashboard',
    '/docentes',
    '/cursos',
    '/admin'
];
```

#### Funciones Principales

**1. `Router.init()`**
- Escucha cambios en `window.location.hash`
- Maneja la carga inicial de la página
- Ejecuta `handleRoute()` cuando cambia el hash

**2. `Router.handleRoute()`**
- Extrae la ruta del hash (`#/admin` → `/admin`)
- Verifica autenticación para rutas protegidas
- Renderiza la vista correspondiente
- Renderiza la navbar si el usuario está autenticado

**3. `Router.navigate(route)`**
- Navega programáticamente a una ruta
- Actualiza `window.location.hash`

**4. `Router.isAuthenticated()`**
- Verifica si existe `session` en localStorage
- Retorna `true` o `false`

#### Flujo de Protección de Rutas

```javascript
if (protectedRoutes.includes(path) && !this.isAuthenticated()) {
    window.location.hash = '/login';
    return;
}
```

Si un usuario intenta acceder a una ruta protegida sin autenticación, es redirigido automáticamente al login.

---

## 💾 Gestión de Datos

### Archivo: `src/utils/storage.js`

El sistema de almacenamiento proporciona una capa de abstracción sobre `localStorage`.

#### Funciones Síncronas (usadas principalmente)

**`getItemSync(key)`**
- Lee un valor de localStorage
- Parsea JSON automáticamente
- Retorna `null` si no existe o hay error

**Ejemplo:**
```javascript
const docentes = getItemSync('docentes');
// Retorna array de docentes o null
```

**`setItemSync(key, value)`**
- Guarda un valor en localStorage
- Serializa a JSON automáticamente
- Retorna `true` si se guardó correctamente

**Ejemplo:**
```javascript
setItemSync('docentes', [docente1, docente2]);
// Guarda el array en localStorage
```

**`removeItemSync(key)`**
- Elimina un valor de localStorage
- Retorna `true` si se eliminó correctamente

### Archivo: `src/utils/helpers.js`

Funciones helper básicas que simplifican operaciones comunes.

#### Funciones Disponibles

**`getArray(key)`**
- Obtiene un array de localStorage
- Si no existe, retorna array vacío `[]`
- Evita errores de null/undefined

**Ejemplo:**
```javascript
const docentes = getArray('docentes');
// Siempre retorna un array, nunca null
```

**`saveArray(key, array)`**
- Guarda un array en localStorage
- Wrapper simple de `setItemSync`

**`upsertItem(array, item, findKey)`**
- Busca un item en un array
- Si existe, lo actualiza
- Si no existe, lo agrega
- `findKey` es la propiedad para buscar (por defecto 'email')

**Ejemplo:**
```javascript
const docentes = loadDocentes();
const docenteActualizado = { email: 'test@abc.edu', nombre: 'Juan' };
const nuevosDocentes = upsertItem(docentes, docenteActualizado, 'email');
saveArray('docentes', nuevosDocentes);
```

**`deleteItem(array, value, findKey)`**
- Elimina un item de un array
- Crea un nuevo array sin el item
- `findKey` es la propiedad para buscar

**Ejemplo:**
```javascript
const docentes = loadDocentes();
const docentesFiltrados = deleteItem(docentes, 'test@abc.edu', 'email');
saveArray('docentes', docentesFiltrados);
```

**`isValidEmail(email)`**
- Valida si un email tiene formato correcto
- Verifica que tenga @ y un punto después del @
- Retorna `true` o `false`

**Ejemplo:**
```javascript
if (isValidEmail(email)) {
  // Email válido
} else {
  // Email inválido
}
```

**`imageToBase64(file)`**
- Convierte un archivo de imagen a base64
- Valida tamaño (máximo 2MB)
- Valida tipo (debe ser imagen)
- Retorna una Promise

**Ejemplo:**
```javascript
const file = input.files[0];
imageToBase64(file).then(function(base64) {
  // base64 contiene la imagen en formato base64
  docente.fotoBase64 = base64;
}).catch(function(error) {
  // Error al convertir
  console.error(error.message);
});
```

**`getFullName(item)`**
- Obtiene el nombre completo de una persona
- Combina nombres y apellidos
- Si no hay nombre, usa email o 'Sin nombre'

**Ejemplo:**
```javascript
const nombre = getFullName(docente);
// Retorna "Juan Pérez" o email si no hay nombre
```

**`showError(container, message)`**
- Muestra un mensaje de error en un contenedor
- Formatea el mensaje con estilo terminal

**Ejemplo:**
```javascript
const errorDiv = document.getElementById('error');
showError(errorDiv, 'El email ya está registrado');
```

**`hideError(container)`**
- Oculta el mensaje de error

**Ejemplo:**
```javascript
hideError(errorDiv);
```

### Estructura de Datos en LocalStorage

```javascript
{
  "session": { email: "admin@abc.edu" },
  "users": [
    { email: "admin@abc.edu", password: "admin123", rol: "administrativo" }
  ],
  "docentes": [
    {
      codigo: "D101",
      nombres: "Sofía",
      apellidos: "García Torres",
      email: "sofia.garcia@abc.edu",
      // ... más campos
    }
  ],
  "cursos": [
    {
      id: "C001",
      codigo: "C101",
      nombre: "JavaScript Avanzado",
      descripcion: "...",
      docente: "D101",
      modulos: [
        {
          id: "M001",
          codigo: "M101",
          nombre: "Módulo 1",
          descripcion: "...",
          lecciones: [
            {
              id: "L001",
              titulo: "Introducción",
              tipo: "video",
              intensidadHoraria: 2.5,
              contenido: "...",
              multimedia: {
                videoUrl: "...",
                pdfUrl: "...",
                imagenUrl: "...",
                enlaces: ["..."]
              }
            }
          ]
        }
      ]
    }
  ],
  "administrativos": [
    {
      identificacion: "1001001001",
      nombres: "Patricia",
      apellidos: "Silva",
      email: "patricia.silva@abc.edu",
      telefono: "+57 300 123 4567",
      cargo: "Coordinadora Académica"
    }
  ],
  "appData": { /* datos iniciales completos */ }
}
```

### Operaciones CRUD

**Administrativos:**
- `loadAdministrativos()`: Carga todos los administrativos
- `saveAdministrativo(administrativo)`: Guarda o actualiza un administrativo
- `deleteAdministrativo(identificacion)`: Elimina un administrativo

**Docentes:**
- `loadDocentes()`: Carga todos los docentes
- `saveDocente(docente)`: Guarda o actualiza un docente
- Eliminación: Se filtra el array y se guarda

**Cursos:**
- `loadCursos()`: Carga todos los cursos
- `saveCurso(curso)`: Guarda o actualiza un curso
- `deleteCurso(id)`: Elimina un curso y sus módulos/lecciones
- `loadModulos(cursoId)`: Carga módulos de un curso
- `saveModulo(cursoId, modulo)`: Guarda un módulo en un curso
- `deleteModulo(cursoId, moduloId)`: Elimina un módulo

**Lecciones:**
- Se gestionan dentro de los módulos
- `saveLeccion(cursoId, moduloId, leccion)`: Guarda una lección
- `deleteLeccion(cursoId, moduloId, leccionId)`: Elimina una lección

---

## 🔐 Autenticación y Sesiones

### Archivo: `src/components/login.js`

#### Funciones Principales

**`validateCredentials(email, password)`**
- Busca el usuario en `localStorage.users`
- Compara email y password
- Retorna `true` si las credenciales son válidas

**`handleLogin(email, password)`**
- Valida las credenciales
- Si son válidas, crea una sesión en localStorage
- Retorna objeto con `success` y `user` o `message` de error

#### Flujo de Login

```
1. Usuario ingresa email y password
2. handleLogin() valida credenciales
3. Si válido → guarda { email } en localStorage.session
4. Router detecta sesión y redirige a /dashboard
```

#### Cierre de Sesión

```javascript
// En navbar.js
logoutBtn.onclick = function () {
  removeItemSync('session');
  window.location.hash = '/public';
};
```

Al eliminar `session` de localStorage, el Router detecta que no hay autenticación y protege las rutas.

---

## 🧩 Componentes Principales

### 1. Sistema de Modales (`src/components/modal.js`)

Sistema centralizado para mostrar modales con estilo terminal.

#### Funciones Disponibles

**`showAlert(message, options)`**
- Muestra un modal de alerta
- Opciones: `title`, `icon`, `onClose`

**`showConfirm(message, options)`**
- Muestra un modal de confirmación
- Opciones: `title`, `icon`, `onConfirm`, `onCancel`

**`showFormModal(formHTML, options)`**
- Muestra un modal con un formulario
- Opciones: `title`, `icon`, `onFormReady`

#### Ejemplo de Uso

```javascript
showAlert('Operación exitosa', {
  title: 'ÉXITO',
  icon: '[OK]',
  onClose: () => console.log('Modal cerrado')
});
```

### 2. Gestión de Administrativos (`src/components/administrativos.js`)

#### Funciones Principales

**`loadAdministrativos()`**
- Carga todos los administrativos de localStorage usando `getArray()`
- Retorna array vacío si no hay datos

**Ejemplo:**
```javascript
const administrativos = loadAdministrativos();
// Retorna array de administrativos
```

**`saveAdministrativo(administrativo)`**
- Guarda o actualiza un administrativo
- Usa `email` e `identificacion` como identificadores únicos
- Si existe (mismo email o identificación), actualiza
- Si no existe, agrega nuevo
- Usa `saveArray()` para guardar

**Ejemplo:**
```javascript
const nuevoAdmin = {
  identificacion: '1234567890',
  nombres: 'Juan',
  apellidos: 'Pérez',
  email: 'juan@abc.edu',
  telefono: '+57 300 123 4567',
  cargo: 'Coordinador'
};
saveAdministrativo(nuevoAdmin);
```

**`deleteAdministrativo(identificacion)`**
- Elimina un administrativo por identificación
- Usa `deleteItem()` helper
- Retorna `true` si se eliminó correctamente

**`renderAdministrativosTable(container)`**
- Renderiza una tabla HTML con todos los administrativos
- Incluye botones de editar y eliminar
- Agrega event listeners para las acciones
- Muestra mensaje si no hay administrativos

**`renderAdministrativoForm(container, administrativo)`**
- Renderiza formulario en modal para crear/editar administrativo
- Si `administrativo` es `null`, es modo creación
- Si `administrativo` existe, es modo edición
- Campos: identificación, nombres, apellidos, email, teléfono, cargo

#### Validaciones

- Identificación es obligatoria y única (en creación)
- Email es obligatorio y único (validado con `isValidEmail()`)
- Todos los campos son obligatorios
- Usa `showError()` para mostrar errores

### 3. Gestión de Docentes (`src/components/docentes.js`)

#### Funciones Principales

**`loadDocentes()`**
- Carga todos los docentes de localStorage usando `getArray()`
- Retorna array vacío si no hay datos

**Ejemplo:**
```javascript
const docentes = loadDocentes();
// Retorna array de docentes
```

**`saveDocente(docente)`**
- Guarda o actualiza un docente usando `upsertItem()`
- Usa `email` como identificador único
- Si existe (mismo email), actualiza
- Si no existe, agrega nuevo
- Guarda foto como base64 en `fotoBase64`

**Ejemplo:**
```javascript
const nuevoDocente = {
  codigo: 'D101',
  identificacion: '2001003001',
  nombres: 'María',
  apellidos: 'García',
  email: 'maria@abc.edu',
  fotoBase64: 'data:image/jpeg;base64,...', // Imagen en base64
  areaAcademica: 'Programación'
};
saveDocente(nuevoDocente);
```

**`renderDocentesTable(container)`**
- Renderiza una tabla HTML con todos los docentes
- Muestra foto del docente (base64 o placeholder)
- Incluye botones de editar y eliminar
- Agrega event listeners para las acciones
- Muestra mensaje si no hay docentes

**`showDocenteFormModal(docente, tableContainer)`**
- Muestra formulario en modal para crear/editar docente
- Si `docente` es `null`, es modo creación
- Si `docente` existe, es modo edición
- Campos: código, identificación, nombres, apellidos, email, foto (archivo), área académica
- La foto se sube como archivo y se convierte a base64 con `imageToBase64()`

**`renderDocentesPublic(container)`**
- Renderiza lista pública de docentes en formato de tarjetas
- Muestra foto, nombre, código, área académica y cantidad de cursos
- Usa `getFullName()` para nombres completos

#### Validaciones

- Email es obligatorio y único (validado con `isValidEmail()`)
- Foto es obligatoria en creación (se sube como archivo)
- Todos los campos son obligatorios
- Usa `showError()` para mostrar errores
- No se puede eliminar docente si está asignado a un curso

### 4. Gestión de Cursos (`src/components/cursos.js`)

Este es el componente más complejo, maneja cursos, módulos y lecciones.

#### Estructura de Datos

```javascript
curso = {
  id: "C001",
  codigo: "C101",
  nombre: "JavaScript Avanzado",
  descripcion: "Curso completo de JavaScript...",
  docente: "maria@abc.edu", // Email del docente
  modulos: [
    {
      id: "M001",
      codigo: "M101",
      nombre: "Módulo 1",
      descripcion: "Introducción a JavaScript",
      lecciones: [
        {
          id: "L001",
          titulo: "Introducción a Variables",
          tipo: "video", // "video", "lectura", o "quiz"
          intensidadHoraria: 2.5,
          contenido: "Texto del material de estudio...",
          videoUrl: "https://youtube.com/...", // Si tipo es video
          multimedia: {
            pdfUrl: "https://ejemplo.com/doc.pdf",
            imagenUrl: "https://ejemplo.com/img.jpg",
            enlaces: ["https://link1.com", "https://link2.com"]
          }
        }
      ]
    }
  ]
}
```

#### Funciones Principales

**Cursos:**
- `loadCursos()`: Carga todos los cursos usando `getArray()`
- `saveCurso(curso)`: Guarda o actualiza un curso usando `saveArray()`
- `deleteCurso(id)`: Elimina curso y todo su contenido anidado (módulos y lecciones)
- `renderCursosTable(container)`: Renderiza tabla de cursos con botones de acción
- `renderCursoForm(container, curso)`: Renderiza formulario en modal para crear/editar curso

**Ejemplo de crear curso:**
```javascript
const nuevoCurso = {
  id: 'C' + Date.now(),
  codigo: 'C101',
  nombre: 'JavaScript Avanzado',
  descripcion: 'Curso completo...',
  docente: 'maria@abc.edu',
  modulos: []
};
saveCurso(nuevoCurso);
```

**Módulos:**
- `loadModulos(cursoId)`: Carga módulos de un curso específico
- `saveModulo(cursoId, modulo)`: Guarda módulo en un curso
- `deleteModulo(cursoId, moduloId)`: Elimina módulo y todas sus lecciones
- `renderModulosList(container, cursoId)`: Renderiza lista de módulos con botones

**Ejemplo de crear módulo:**
```javascript
const nuevoModulo = {
  id: 'M' + Date.now(),
  codigo: 'M101',
  nombre: 'Módulo 1',
  descripcion: 'Introducción...',
  lecciones: []
};
saveModulo('C001', nuevoModulo);
```

**Lecciones:**
- `saveLeccion(cursoId, moduloId, leccion)`: Guarda lección en un módulo
- `deleteLeccion(cursoId, moduloId, leccionId)`: Elimina lección
- `renderLeccionesList(container, cursoId, moduloId)`: Renderiza lista de lecciones
- `renderMultimediaInput(container, tipo, leccion)`: Renderiza campos multimedia según tipo

**Ejemplo de crear lección:**
```javascript
const nuevaLeccion = {
  id: 'L' + Date.now(),
  titulo: 'Introducción a Variables',
  tipo: 'video', // 'video', 'lectura', o 'quiz'
  intensidadHoraria: 2.5,
  contenido: 'Texto del material de estudio...',
  videoUrl: 'https://youtube.com/watch?v=...',
  multimedia: {
    pdfUrl: 'https://ejemplo.com/doc.pdf',
    imagenUrl: 'https://ejemplo.com/img.jpg',
    enlaces: ['https://link1.com']
  }
};
saveLeccion('C001', 'M001', nuevaLeccion);
```

**Vista Pública:**
- `renderCursosAcordeon(container)`: Renderiza cursos en formato acordeón para vista pública
- `renderDocentesPublic(container)`: Renderiza lista pública de docentes (en docentes.js)

#### Flujo de Navegación Anidada

```
Cursos → Módulos → Lecciones
  ↓         ↓          ↓
Tabla    Lista      Lista
```

Cada nivel tiene sus propios botones de acción y formularios.

### 5. Navbar (`src/components/navbar.js`)

#### Función Principal

**`renderNavbar(container)`**
- Crea la barra de navegación
- Muestra diferentes enlaces según estado de autenticación
- Incluye botón de logout si hay sesión
- Marca la ruta actual como activa

#### Enlaces Dinámicos

```javascript
const items = [
  { label: 'Inicio', route: '/dashboard', showIfSession: true },
  { label: 'Admin', route: '/admin', showIfSession: true },
  { label: 'Público', route: '/public', showIfNoSession: true },
  { label: 'Login', route: '/login', showIfNoSession: true },
];
```

### 6. Estadísticas (`src/components/stats.js`)

#### Función Principal

**`renderStats()`**
- Lee docentes y cursos de localStorage
- Actualiza contadores en el DOM
- Se llama desde `dashboardView` después de renderizar

---

## 🖼️ Vistas

Las vistas son Web Components que extienden `HTMLElement`.

### 1. LoginView (`src/views/loginView.js`)

**Características:**
- Formulario de login con estilo terminal
- Validación de email y password
- Manejo de errores visual
- Redirección automática al dashboard si login exitoso

**Ciclo de Vida:**
```javascript
connectedCallback() {
  this.render(); // Renderiza el HTML
  this.setupLoginForm(); // Configura event listeners
}
```

### 2. DashboardView (`src/views/dashboardView.js`)

**Características:**
- Muestra estadísticas de docentes y cursos
- Botones de acceso rápido a crear docente/curso
- Animaciones de barras de progreso

**Métodos:**
- `render()`: Genera el HTML
- `afterRender()`: Configura funcionalidad después de renderizar
- `renderQuickActions()`: Configura botones de acción rápida
- `animateStats()`: Anima las barras de progreso

### 3. AdminView (`src/views/adminView.js`)

**Características:**
- Vista unificada para gestionar docentes y cursos
- Dos secciones: Gestión de Docentes y Gestión de Cursos
- Contenedores para tablas y formularios

**Métodos:**
- `render()`: Genera el HTML con contenedores
- `afterRender()`: Renderiza tablas y configura botones

**Flujo:**
```
1. Renderiza estructura HTML
2. Renderiza tabla de docentes
3. Renderiza tabla de cursos
4. Configura botones de crear
5. Al hacer clic en crear → muestra modal con formulario
```

### 4. PublicView (`src/views/publicView.js`)

**Características:**
- Vista pública del catálogo de cursos
- No requiere autenticación
- Muestra cursos en formato acordeón
- Enlace para iniciar sesión

**Renderizado:**
- Usa `renderCursosAcordeon()` para mostrar cursos
- Cada curso muestra información básica y docente asignado

---

## 🎨 Sistema de Estilos

### Archivo: `src/styles/main.css`

#### Variables CSS (Design Tokens)

```css
:root {
    /* Colores */
    --terminal-bg: #0a0a0a;
    --terminal-surface: #121212;
    --terminal-text: #00ff41;
    --terminal-accent: #00d9ff;
    --terminal-error: #ff0044;
    --terminal-success: #00ff88;
    
    /* Tipografía */
    --font-terminal: 'JetBrains Mono', monospace;
    
    /* Transiciones */
    --transition-fast: 100ms ease;
    --transition-base: 150ms ease;
}
```

#### Estilos por Componente

Cada componente puede agregar sus propios estilos inline usando `<style>` tags dentro del Web Component. Esto permite:

- **Encapsulación**: Los estilos no afectan otros componentes
- **Portabilidad**: Cada componente es autocontenido
- **Mantenibilidad**: Estilos cerca del código que los usa

#### Ejemplo de Estilos en Componente

```javascript
addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    dashboard-view {
      display: block;
      background: var(--terminal-bg);
    }
  `;
  this.appendChild(style);
}
```

#### Responsive Design

Los estilos incluyen media queries para:
- **Móviles**: 320px+
- **Tablets**: 768px+
- **Desktop**: 1200px+

---

## 🔄 Flujos de Datos

### Flujo de Creación de Administrativo

```
1. Usuario hace clic en "CREAR_ADMINISTRATIVO"
2. showFormModal() muestra modal con formulario HTML
3. Usuario completa: identificación, nombres, apellidos, email, teléfono, cargo
4. Al enviar formulario:
   - Se validan campos obligatorios
   - Se valida email único usando isValidEmail()
   - Se valida identificación única (solo en creación)
5. saveAdministrativo() usa upsertItem() y saveArray()
6. Se guarda en localStorage bajo clave 'administrativos'
7. Se actualiza la tabla con renderAdministrativosTable()
8. Se cierra el modal
```

### Flujo de Creación de Docente

```
1. Usuario hace clic en "CREAR_DOCENTE"
2. showDocenteFormModal() muestra modal con formulario
3. Usuario completa: código, identificación, nombres, apellidos, email, foto (archivo), área académica
4. Al seleccionar foto:
   - Se muestra preview de la imagen
   - Se valida tamaño (máximo 2MB) y tipo (imagen)
   - Se convierte a base64 con imageToBase64()
5. Al enviar formulario:
   - Se validan campos obligatorios
   - Se valida email único usando isValidEmail()
   - Se valida que foto esté presente (obligatoria)
6. saveDocente() usa upsertItem() y saveArray()
7. Se guarda en localStorage bajo clave 'docentes'
8. Se actualiza la tabla con renderDocentesTable()
9. Se cierra el modal
```

### Flujo de Creación de Curso

```
1. Usuario hace clic en "CREAR_CURSO"
2. renderCursoForm() muestra modal con formulario
3. Usuario selecciona docente (de lista desplegable de docentes disponibles)
4. Usuario completa: código, nombre, descripción
5. Al enviar formulario:
   - Se validan campos obligatorios
   - Se valida que haya docente seleccionado
6. saveCurso() guarda curso con modulos: [] (array vacío)
7. Se guarda en localStorage bajo clave 'cursos'
8. Se actualiza la tabla con renderCursosTable()
9. Se cierra el modal
```

### Flujo de Gestión de Módulos

```
1. Usuario hace clic en "MODULOS" en un curso
2. Se renderiza lista de módulos del curso
3. Usuario puede:
   - Agregar módulo → formulario de módulo
   - Editar módulo → formulario prellenado
   - Eliminar módulo → confirmación → elimina módulo y lecciones
   - Ver lecciones → renderiza lista de lecciones
```

### Flujo de Gestión de Lecciones

```
1. Usuario hace clic en "LECCIONES" en un módulo
2. Se renderiza lista de lecciones del módulo
3. Usuario puede:
   - Agregar lección → formulario con tipo (video/lectura/quiz)
   - Editar lección → formulario prellenado
   - Eliminar lección → confirmación → elimina lección
```

### Flujo de Eliminación con Validaciones

**Eliminar Docente:**
```
1. Usuario hace clic en "ELIMINAR"
2. Sistema verifica si docente está asignado a cursos
3. Si está asignado → muestra error con lista de cursos
4. Si no está asignado → confirma → elimina → actualiza tabla
```

**Eliminar Curso:**
```
1. Usuario hace clic en "ELIMINAR"
2. Sistema confirma eliminación
3. Elimina curso y TODOS sus módulos y lecciones
4. Muestra mensaje con cantidad de elementos eliminados
5. Actualiza tabla
```

---

## 🔍 Detalles Técnicos Importantes

### 1. Generación de IDs

Los IDs se generan usando timestamps simples:

```javascript
// Para cursos
const id = 'C' + Date.now();

// Para módulos
const id = 'M' + Date.now();

// Para lecciones
const id = 'L' + Date.now();
```

**Ejemplo:**
```javascript
const nuevoCurso = {
  id: 'C' + Date.now(), // Ejemplo: "C1703123456789"
  codigo: 'C101',
  nombre: 'JavaScript Avanzado'
};
```

### 2. Búsqueda y Filtrado

**Buscar en arrays:**
```javascript
// Buscar docente por email
const docentes = loadDocentes();
let docenteEncontrado = null;
for (let i = 0; i < docentes.length; i++) {
  if (docentes[i].email === email) {
    docenteEncontrado = docentes[i];
    break;
  }
}

// O usando find (más simple)
const docente = docentes.find(function(d) {
  return d.email === email;
});

// Buscar curso por ID
const cursos = loadCursos();
const curso = cursos.find(function(c) {
  return c.id === cursoId;
});
```

**Filtrar arrays:**
```javascript
// Eliminar módulo de un curso
const modulos = curso.modulos;
const modulosFiltrados = [];
for (let i = 0; i < modulos.length; i++) {
  if (modulos[i].id !== moduloId) {
    modulosFiltrados.push(modulos[i]);
  }
}
curso.modulos = modulosFiltrados;
```

### 3. Actualización de Vistas

Después de cualquier operación CRUD, siempre se debe:

1. **Guardar en localStorage** usando `saveArray()`
2. **Re-renderizar la tabla/lista** correspondiente
3. **Cerrar modales** si es necesario

**Ejemplo:**
```javascript
// Guardar docente
if (saveDocente(nuevoDocente)) {
  // Actualizar tabla
  renderDocentesTable(container);
  // Cerrar modal
  closeModal();
}
```

### 4. Manejo de Errores

**Validaciones básicas:**
```javascript
// Validar campos obligatorios
if (!email || !nombre) {
  showError(errorDiv, 'Todos los campos son obligatorios');
  return;
}

// Validar email
if (!isValidEmail(email)) {
  showError(errorDiv, 'Email inválido');
  return;
}

// Validar que no exista
const existe = docentes.find(function(d) {
  return d.email === email;
});
if (existe) {
  showError(errorDiv, 'El email ya está registrado');
  return;
}
```

**Fallbacks para datos faltantes:**
```javascript
// Siempre usar getArray() que retorna [] si no hay datos
const docentes = getArray('docentes'); // Nunca null

// Verificar existencia antes de usar
if (curso && curso.modulos) {
  // Usar curso.modulos
} else {
  // Usar array vacío
  curso.modulos = [];
}
```

### 5. Trabajo con Imágenes Base64

**Subir y convertir imagen:**
```javascript
// Obtener archivo del input
const fileInput = document.getElementById('foto-input');
const file = fileInput.files[0];

// Convertir a base64
imageToBase64(file).then(function(base64) {
  // Guardar en objeto
  docente.fotoBase64 = base64;
  // Mostrar preview
  previewImg.src = base64;
}).catch(function(error) {
  // Mostrar error
  showError(errorDiv, error.message);
});
```

**Mostrar imagen:**
```javascript
// En HTML
const fotoSrc = docente.fotoBase64 || docente.fotoUrl || '';
if (fotoSrc) {
  img.src = fotoSrc;
} else {
  // Mostrar placeholder
}
```

### 5. Inicialización de Datos

El archivo `initializeData.js` proporciona:
- 3 docentes de ejemplo
- 1 usuario administrador (admin@abc.edu / admin123)
- Arrays vacíos para cursos (se crean dinámicamente)

---

## 📝 Notas de Desarrollo

### Patrones Utilizados

1. **Web Components**: Cada vista es un Custom Element (clase que extiende HTMLElement)
2. **Modularidad**: Funciones exportadas para reutilización
3. **Separación de Concerns**: Lógica, presentación y datos separados
4. **Event-Driven**: Navegación y acciones basadas en eventos del DOM
5. **LocalStorage como BD**: Simula una base de datos en el navegador
6. **JavaScript Básico**: Código vanilla sin frameworks, fácil de entender

### Cómo Funciona el Código (Explicación Simple)

**1. Inicio de la Aplicación:**
- `main.js` se ejecuta cuando la página carga
- Inicializa datos en localStorage si no existen
- Configura el Router para manejar navegación

**2. Navegación:**
- El Router escucha cambios en `window.location.hash`
- Cuando cambia el hash (ej: `#/admin`), busca la vista correspondiente
- Si la ruta requiere autenticación, verifica si hay sesión
- Renderiza la vista correspondiente en el contenedor `#root`

**3. Vistas (Web Components):**
- Cada vista es una clase que extiende `HTMLElement`
- Tiene método `render()` que genera el HTML
- Tiene método `afterRender()` que configura eventos después de renderizar
- Se registra con `customElements.define()`

**4. Componentes:**
- Son funciones que renderizan partes de la UI
- Ejemplo: `renderDocentesTable()` crea una tabla HTML
- Ejemplo: `renderDocenteForm()` crea un formulario en modal

**5. Datos:**
- Todo se guarda en localStorage como JSON
- Se usa `getArray()` para leer (retorna [] si no existe)
- Se usa `saveArray()` para guardar
- Se usa `upsertItem()` para actualizar o agregar

**6. Modales:**
- Sistema centralizado en `modal.js`
- `showFormModal()` muestra formularios en modales
- Los formularios se crean como strings HTML
- Los eventos se configuran después de renderizar

### Ejemplo Completo: Crear un Docente

```javascript
// 1. Usuario hace clic en botón "CREAR_DOCENTE"
boton.onclick = function() {
  // 2. Mostrar modal con formulario
  showDocenteFormModal(null, container);
};

// 3. Dentro del modal, usuario completa formulario y envía
form.onsubmit = async function(e) {
  e.preventDefault();
  
  // 4. Obtener valores del formulario
  const email = form.email.value.trim();
  const nombres = form.nombres.value.trim();
  const fotoFile = form.foto.files[0];
  
  // 5. Validar
  if (!email || !nombres) {
    showError(errorDiv, 'Campos obligatorios');
    return;
  }
  
  // 6. Convertir imagen a base64
  let fotoBase64 = null;
  if (fotoFile) {
    try {
      fotoBase64 = await imageToBase64(fotoFile);
    } catch (error) {
      showError(errorDiv, error.message);
      return;
    }
  }
  
  // 7. Crear objeto docente
  const nuevoDocente = {
    codigo: form.codigo.value,
    identificacion: form.identificacion.value,
    nombres: nombres,
    apellidos: form.apellidos.value,
    email: email,
    fotoBase64: fotoBase64,
    areaAcademica: form.areaAcademica.value
  };
  
  // 8. Guardar
  if (saveDocente(nuevoDocente)) {
    // 9. Actualizar tabla
    renderDocentesTable(tableContainer);
    // 10. Cerrar modal
    closeModal();
    // 11. Mostrar mensaje de éxito
    showAlert('Docente creado exitosamente');
  }
};
```

### Mejoras Futuras Posibles

1. **Backend Real**: Reemplazar localStorage con API REST
2. **Autenticación JWT**: Tokens en lugar de sesiones simples
3. **State Management**: Redux o Context API para estado global
4. **Testing**: Unit tests y integration tests
5. **TypeScript**: Tipado estático para mayor seguridad
6. **PWA**: Service Workers para funcionamiento offline

---

## 🚀 Cómo Extender el Código

### Agregar una Nueva Vista

1. Crear archivo en `src/views/nuevaView.js`
2. Crear clase que extienda `HTMLElement`
3. Implementar `connectedCallback()` y `render()`
4. Registrar con `customElements.define('nueva-view', NuevaView)`
5. Agregar ruta en `router.js`
6. Importar en `main.js`

**Ejemplo básico:**
```javascript
class NuevaView extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.innerHTML = '<div>Contenido de la vista</div>';
  }
}

customElements.define('nueva-view', NuevaView);
```

### Agregar un Nuevo Componente

1. Crear archivo en `src/components/nuevoComponente.js`
2. Exportar funciones reutilizables
3. Importar donde se necesite

**Ejemplo básico:**
```javascript
import { getArray, saveArray } from '../utils/helpers.js';

export function loadItems() {
  return getArray('items');
}

export function saveItem(item) {
  const items = loadItems();
  items.push(item);
  return saveArray('items', items);
}
```

### Agregar una Nueva Entidad

1. Crear funciones CRUD en un componente usando helpers
2. Definir estructura de datos
3. Agregar funciones de renderizado
4. Integrar en una vista existente o crear nueva

**Ejemplo completo:**
```javascript
// En src/components/nuevaEntidad.js
import { getArray, saveArray, upsertItem, deleteItem, showError } from '../utils/helpers.js';

// Cargar
export function loadNuevaEntidad() {
  return getArray('nuevaEntidad');
}

// Guardar
export function saveNuevaEntidad(item) {
  if (!item || !item.id) return false;
  const items = loadNuevaEntidad();
  const updated = upsertItem(items, item, 'id');
  return saveArray('nuevaEntidad', updated);
}

// Eliminar
export function deleteNuevaEntidad(id) {
  const items = loadNuevaEntidad();
  const updated = deleteItem(items, id, 'id');
  return saveArray('nuevaEntidad', updated);
}

// Renderizar tabla
export function renderNuevaEntidadTable(container) {
  const items = loadNuevaEntidad();
  if (items.length === 0) {
    container.innerHTML = '<div>No hay items</div>';
    return;
  }
  
  let html = '<table><thead><tr><th>Nombre</th></tr></thead><tbody>';
  for (let i = 0; i < items.length; i++) {
    html += '<tr><td>' + items[i].nombre + '</td></tr>';
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}
```

## 📚 Guía Rápida de Uso de Helpers

### Operaciones Básicas con Arrays

```javascript
// 1. Cargar array
const docentes = getArray('docentes');

// 2. Agregar item
docentes.push(nuevoDocente);
saveArray('docentes', docentes);

// 3. Actualizar o agregar (upsert)
const updated = upsertItem(docentes, docenteActualizado, 'email');
saveArray('docentes', updated);

// 4. Eliminar item
const filtered = deleteItem(docentes, 'email@abc.edu', 'email');
saveArray('docentes', filtered);

// 5. Buscar item
const docente = docentes.find(function(d) {
  return d.email === 'test@abc.edu';
});
```

### Validaciones Comunes

```javascript
// Validar email
if (!isValidEmail(email)) {
  showError(errorDiv, 'Email inválido');
  return;
}

// Validar campos obligatorios
if (!nombre || !email) {
  showError(errorDiv, 'Todos los campos son obligatorios');
  return;
}

// Validar que no exista
const existe = docentes.find(function(d) {
  return d.email === email;
});
if (existe) {
  showError(errorDiv, 'El email ya está registrado');
  return;
}
```

### Trabajo con Imágenes

```javascript
// Obtener archivo
const file = input.files[0];

// Convertir a base64
imageToBase64(file).then(function(base64) {
  // Usar base64
  docente.fotoBase64 = base64;
  preview.src = base64;
}).catch(function(error) {
  showError(errorDiv, error.message);
});
```

---

## 📖 Conclusión

Este proyecto utiliza una arquitectura modular basada en Web Components, con enrutamiento hash-based y almacenamiento local. La separación clara entre componentes, vistas y utilidades facilita el mantenimiento y la extensión del código.

El sistema está diseñado para ser:
- **Escalable**: Fácil agregar nuevas funcionalidades
- **Mantenible**: Código organizado y documentado
- **Modular**: Componentes reutilizables
- **Responsive**: Diseño adaptable a diferentes dispositivos

---

**Última actualización**: 2024
**Versión**: 2.0

