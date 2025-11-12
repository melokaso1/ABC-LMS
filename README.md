# 🎓 ABC Educate - Sistema de Gestión Educativa

## 📖 Descripción

**ABC Educate** es una aplicación web de gestión educativa con un diseño inspirado en terminales y estética hacker. Permite gestionar docentes, cursos, módulos y lecciones de manera intuitiva y moderna.

## 🌐 Demo en Vivo

🚀 **Accede a la aplicación desplegada:** [https://abc-curses.netlify.app/](https://abc-curses.netlify.app/)

👉 La aplicación está disponible en producción y lista para usar.

## ✨ Características

### 🎨 Diseño Terminal/Hacker
- ✨ Interfaz inspirada en terminales con efectos visuales
- 🌈 Colores neón (verde, cyan, rosa)
- ⚡ Animaciones rápidas y fluidas
- 📱 Diseño responsive para móviles y tablets

### 👥 Gestión de Docentes
- ➕ Crear nuevos docentes
- ✏️ Editar información de docentes
- 🗑️ Eliminar docentes (solo si no están asignados a cursos)
- 📧 Campos: Código, identificación, nombres, apellidos, email, foto URL, área académica

### 👨‍💼 Gestión de Administrativos
- ➕ Crear nuevos administrativos
- ✏️ Editar información de administrativos
- 🗑️ Eliminar administrativos
- 📋 Campos: Identificación, nombres, apellidos, email, teléfono, cargo

### 📚 Gestión de Cursos
- ➕ Crear cursos nuevos
- ✏️ Editar cursos existentes
- 🗑️ Eliminar cursos
- 👨‍🏫 Asignar docentes a cursos (selector de docentes disponibles)
- 📊 Visualización de estadísticas
- 📝 Campos: Código, nombre, descripción, docente asignado
- 🎯 Vista detallada de cursos con módulos y lecciones expandibles
- 🔍 Navegación directa a cursos desde dashboard

### 📦 Gestión de Módulos
- ➕ Crear módulos dentro de cursos (disponible para administradores)
- ✏️ Editar módulos
- 🗑️ Eliminar módulos (elimina también las lecciones asociadas)
- 📋 Visualizar módulos por curso
- 👁️ Acceso desde el botón "MODULOS" en la tabla de cursos
- 📝 Campos: Código, nombre, descripción
- 🔽 Expansión/colapso de módulos en vista de curso
- 📜 Auto-scroll al expandir módulos

### 📝 Gestión de Lecciones
- ➕ Crear lecciones dentro de módulos
- ✏️ Editar lecciones
- 🗑️ Eliminar lecciones
- 🎥 Soporte para diferentes tipos: video, lectura, quiz
- 📄 Campos: Título, intensidad horaria, contenido (texto)
- 🎬 Multimedia: Videos, PDFs, imágenes y enlaces adicionales
- 🎨 Vista mejorada de lecciones en página dedicada (no modal)
- 📱 Diseño responsive y fácil de leer

### 🔐 Autenticación
- 🔒 Sistema de login para administradores y usuarios
- 👤 Gestión de sesiones con tokens
- 🚪 Cierre de sesión desde la navbar
- 🛡️ Protección de rutas
- 🔄 Redirección automática a Dashboard después del login
- 👥 Los docentes no requieren login (solo se registran con email)

### 📊 Dashboard
- 📈 Estadísticas en tiempo real: cursos, módulos, lecciones y docentes
- 🎯 Accesos rápidos a cursos y panel de administración
- 📱 Vista responsive y moderna que ocupa toda la pantalla
- 💾 Datos persistidos en localStorage
- 🎨 Diseño intuitivo con tarjetas de estadísticas
- 🔗 Navegación integrada con navbar
- 👨‍🏫 Sección de Docentes Activos con información detallada (foto, código, área académica, cursos asignados)

### 🔑 Gestión de Credenciales
- ➕ Crear nuevas credenciales de usuario
- ✏️ Editar contraseñas de usuarios existentes
- 🗑️ Eliminar credenciales
- 👤 Gestión de roles (administrativo, docente, etc.)
- 📋 Campos: Email, contraseña, rol

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd proyecto
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 📁 Estructura del Proyecto

```
proyecto/
├── src/
│   ├── auth/             # Autenticación
│   │   └── gentoken.js   # Generación de tokens
│   ├── components/        # Componentes reutilizables
│   │   ├── cursos.js     # Componente de cursos
│   │   ├── modal.js      # Componente de modal
│   │   └── ...
│   ├── views/            # Vistas principales
│   │   ├── dashboardView.js    # Dashboard principal
│   │   ├── adminView.js        # Panel de administración
│   │   ├── loginView.js        # Vista de login
│   │   ├── publicView.js       # Vista pública de cursos
│   │   ├── cursoView.js        # Vista detallada de curso
│   │   └── ...
│   ├── utils/            # Utilidades
│   │   ├── router.js     # Enrutador con rutas dinámicas
│   │   ├── storage.js    # Gestión de localStorage
│   │   ├── helpers.js    # Funciones auxiliares
│   │   └── ...
│   ├── data/             # Datos iniciales
│   │   └── initializeData.js
│   ├── styles/           # Estilos
│   │   ├── main.css      # Estilos principales
│   │   ├── dashboardView.css
│   │   ├── adminView.css
│   │   ├── loginView.css
│   │   ├── publicView.css
│   │   ├── cursoView.css
│   │   ├── modal.css
│   │   ├── variables.css
│   │   └── ...
│   └── main.js           # Punto de entrada
├── index.html
├── package.json
└── README.md
```

## 🎯 Uso

### 🔐 Iniciar Sesión

1. Al abrir la aplicación, serás redirigido automáticamente a la página de login
2. Ingresa tus credenciales (email y contraseña)
3. Después del login, serás redirigido automáticamente al **Dashboard**
4. Desde el Dashboard puedes acceder al **Panel de Administración** o navegar a los cursos

### 📊 Dashboard

El Dashboard es la primera vista después del login y muestra:
- **Estadísticas generales**: Cursos disponibles, módulos totales, lecciones totales, docentes
- **Lista de cursos**: Acceso directo a cada curso con información de módulos y lecciones
- **Docentes activos**: Lista completa de docentes con foto, código, área académica y cantidad de cursos asignados
- **Navegación**: Botones para acceder al Panel Admin y cerrar sesión
- **Pantalla completa**: Diseño optimizado que utiliza todo el espacio disponible

### 👤 Credenciales por Defecto

Al iniciar la aplicación, se crean usuarios de ejemplo. Consulta `src/data/initializeData.js` para ver las credenciales de administrador.

### 🔑 Gestionar Credenciales

1. Navega a **Admin** → Tab **Credenciales**
2. Para **crear una nueva credencial**: Haz clic en **AGREGAR_CREDENCIAL**
3. Para **editar una contraseña**: Haz clic en el botón de editar (✏️) junto a la credencial
4. Para **eliminar una credencial**: Haz clic en el botón de eliminar (🗑️)
5. Completa los campos: Email, contraseña y rol

### 👨‍💼 Crear un Administrativo

1. Navega a **Admin**
2. Haz clic en **CREAR_ADMINISTRATIVO** en la sección de Gestión de Administrativos
3. Completa el formulario (identificación, nombres, apellidos, email, teléfono, cargo)
4. Guarda el administrativo

### 📝 Crear un Docente

1. Navega a **Admin**
2. Haz clic en **CREAR_DOCENTE** en la sección de Gestión de Docentes
3. Completa el formulario (código, identificación, nombres, apellidos, email, foto URL, área académica)
4. Los docentes no requieren credenciales de login, solo se registran con su email

### 📚 Crear un Curso

1. Navega a **Admin**
2. Haz clic en **CREAR_CURSO** en la sección de Gestión de Cursos
3. Selecciona un docente de la lista desplegable (debe haber docentes creados primero)
4. Completa el formulario (nombre y descripción)
5. Guarda el curso

### 📦 Crear un Módulo

1. Ve a **Admin** → Sección de **GESTIÓN DE CURSOS**
2. Haz clic en el botón **MODULOS** del curso deseado
3. Se mostrará la lista de módulos del curso
4. Haz clic en **AGREGAR MÓDULO**
5. Completa el formulario (nombre y descripción)
6. Guarda el módulo

### 📝 Crear una Lección

1. Ve a **Admin** → **GESTIÓN DE CURSOS**
2. Haz clic en **MODULOS** del curso
3. Haz clic en **Ver Lecciones** del módulo deseado
4. Haz clic en **AGREGAR LECCIÓN**
5. Selecciona el tipo (video, lectura, quiz)
6. Completa el formulario
7. Guarda la lección

### 🎓 Ver Detalles de un Curso

1. Desde el **Dashboard**, haz clic en cualquier tarjeta de curso
2. O desde la **Vista Pública**, haz clic en un curso
3. Se abrirá la vista detallada del curso con:
   - Información del curso y docente
   - Lista de módulos expandibles/colapsables
   - Lecciones dentro de cada módulo
   - Auto-scroll al expandir módulos
4. Usa el botón **"Volver a Cursos"** para regresar

### 🔄 Navegación entre Vistas

- **Dashboard** → Panel Admin: Botón "Panel Admin" en el header
- **Panel Admin** → Dashboard: Botón "Dashboard" en el header
- **Cualquier vista** → Cerrar sesión: Botón "Cerrar Sesión" en el header

## 🎨 Personalización

### Colores

Los colores se definen en `src/styles/main.css`:

```css
:root {
    --terminal-bg: #0a0a0a;
    --terminal-text: #00ff41;
    --terminal-accent: #00d9ff;
    --terminal-error: #ff0044;
    --terminal-success: #00ff88;
}
```

### Animaciones

Las animaciones se pueden ajustar en las variables CSS:

```css
--transition-fast: 100ms ease;
--transition-base: 150ms ease;
--transition-slow: 250ms ease;
```

## 🔧 Stack Tecnológico

- HTML
- CSS
- JavaScript

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1200px+)

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Vista previa de producción
npm run preview
```

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que el navegador soporte LocalStorage
- Revisa la consola del navegador para errores

### Las animaciones son lentas
- Ajusta las variables de transición en `main.css`
- Verifica el rendimiento del navegador

### El selector de docentes está vacío
- Asegúrate de crear docentes primero en la sección Admin
- Verifica que los docentes estén guardados en LocalStorage
- Debes tener al menos un docente creado antes de crear un curso

### No se puede eliminar un docente
- Verifica que el docente no esté asignado a ningún curso
- Si está asignado, primero debes desasignarlo del curso o eliminar el curso
- El sistema mostrará un mensaje con los cursos asignados

### El botón de módulos no funciona
- Asegúrate de estar en la vista Admin
- Verifica que el curso tenga un ID válido
- Revisa la consola del navegador para mensajes de error

## 📝 Notas

- Los datos se almacenan en LocalStorage del navegador
- Los docentes no requieren credenciales de login, solo se registran con email
- No se pueden eliminar docentes que estén asignados a cursos (primero desasignar o eliminar el curso)
- Al eliminar un módulo, se eliminan también todas sus lecciones
- La aplicación utiliza Web Components para una arquitectura modular
- El administrador puede gestionar cursos, docentes, módulos, lecciones y credenciales desde la vista Admin
- Los módulos se gestionan desde el botón "MODULOS" en la tabla de cursos
- Después del login, todos los usuarios son redirigidos al Dashboard
- El Dashboard es la vista principal y punto de entrada después de la autenticación
- Las rutas están protegidas: se requiere token de autenticación para acceder a Dashboard y Admin
- La vista de curso utiliza rutas dinámicas (ej: `#/curso/1`) para navegación directa
- Los módulos en la vista de curso se pueden expandir/colapsar individualmente

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión educativa

---

**¡Disfruta gestionando tu institución educativa con estilo hacker! 🚀💻**

