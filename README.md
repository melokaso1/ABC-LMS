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

### 📦 Gestión de Módulos
- ➕ Crear módulos dentro de cursos (disponible para administradores)
- ✏️ Editar módulos
- 🗑️ Eliminar módulos (elimina también las lecciones asociadas)
- 📋 Visualizar módulos por curso
- 👁️ Acceso desde el botón "MODULOS" en la tabla de cursos
- 📝 Campos: Código, nombre, descripción

### 📝 Gestión de Lecciones
- ➕ Crear lecciones dentro de módulos
- ✏️ Editar lecciones
- 🗑️ Eliminar lecciones
- 🎥 Soporte para diferentes tipos: video, lectura, quiz
- 📄 Campos: Título, intensidad horaria, contenido (texto)
- 🎬 Multimedia: Videos, PDFs, imágenes y enlaces adicionales

### 🔐 Autenticación
- 🔒 Sistema de login para administradores
- 👤 Gestión de sesiones
- 🚪 Cierre de sesión desde la navbar
- 🛡️ Protección de rutas
- 👥 Los docentes no requieren login (solo se registran con email)

### 📊 Dashboard
- 📈 Estadísticas de docentes y cursos
- 🎯 Accesos rápidos
- 📱 Vista responsive
- 💾 Datos persistidos en localStorage

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
│   ├── components/       # Componentes reutilizables
│   │   ├── cursos.js     # Gestión de cursos
│   │   ├── docentes.js   # Gestión de docentes
│   │   ├── navbar.js     # Barra de navegación
│   │   └── ...
│   ├── views/            # Vistas principales
│   │   ├── dashboardView.js
│   │   ├── cursosView.js
│   │   ├── docentesView.js
│   │   ├── adminView.js
│   │   └── ...
│   ├── utils/            # Utilidades
│   │   ├── router.js     # Enrutador
│   │   ├── cache.js      # Sistema de caché
│   │   └── ...
│   ├── data/             # Datos iniciales
│   │   └── initializeData.js
│   ├── styles/           # Estilos
│   │   └── main.css      # Estilos principales
│   └── main.js           # Punto de entrada
├── index.html
├── package.json
└── README.md
```

## 🎯 Uso

### 👤 Credenciales por Defecto

Al iniciar la aplicación, se crean usuarios de ejemplo. Consulta `src/data/initializeData.js` para ver las credenciales de administrador.

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
- El administrador puede gestionar cursos, docentes, módulos y lecciones desde la vista Admin
- Los módulos se gestionan desde el botón "MODULOS" en la tabla de cursos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión educativa

---

**¡Disfruta gestionando tu institución educativa con estilo hacker! 🚀💻**

