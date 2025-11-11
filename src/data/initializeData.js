// Datos iniciales del sistema
export function getInitialData() {
    return {
        docentes: [
            {
                codigo: "D101",
                identificacion: "2001003001",
                nombres: "Sofía",
                apellidos: "García Torres",
                email: "sofia.garcia@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/12.jpg",
                areaAcademica: "Programación Web"
            },
            {
                codigo: "D102",
                identificacion: "2001003002",
                nombres: "Carlos",
                apellidos: "Ramírez Díaz",
                email: "carlos.ramirez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/43.jpg",
                areaAcademica: "Base de Datos"
            },
            {
                codigo: "D103",
                identificacion: "2001003003",
                nombres: "Lucía",
                apellidos: "Fernández Ospina",
                email: "lucia.fernandez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
                areaAcademica: "JavaScript"
            },
            {
                codigo: "D104",
                identificacion: "2001003004",
                nombres: "Andrés",
                apellidos: "Martínez López",
                email: "andres.martinez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
                areaAcademica: "Python"
            },
            {
                codigo: "D105",
                identificacion: "2001003005",
                nombres: "María",
                apellidos: "Rodríguez Pérez",
                email: "maria.rodriguez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/28.jpg",
                areaAcademica: "React"
            },
            {
                codigo: "D106",
                identificacion: "2001003006",
                nombres: "Juan",
                apellidos: "Sánchez Gómez",
                email: "juan.sanchez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
                areaAcademica: "Node.js"
            },
            {
                codigo: "D107",
                identificacion: "2001003007",
                nombres: "Ana",
                apellidos: "López Hernández",
                email: "ana.lopez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
                areaAcademica: "HTML y CSS"
            },
            {
                codigo: "D108",
                identificacion: "2001003008",
                nombres: "Diego",
                apellidos: "González Castro",
                email: "diego.gonzalez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
                areaAcademica: "Git y GitHub"
            },
            {
                codigo: "D109",
                identificacion: "2001003009",
                nombres: "Laura",
                apellidos: "Torres Méndez",
                email: "laura.torres@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/19.jpg",
                areaAcademica: "APIs REST"
            },
            {
                codigo: "D110",
                identificacion: "2001003010",
                nombres: "Roberto",
                apellidos: "Vargas Silva",
                email: "roberto.vargas@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/38.jpg",
                areaAcademica: "TypeScript"
            }
        ],
        cursos: [
            {
                id: "C001",
                codigo: "C101",
                nombre: "Introducción a la Programación Web",
                descripcion: "Aprende los fundamentos de la programación web desde cero. HTML, CSS y JavaScript básico para crear tu primera página web.",
                docente: "sofia.garcia@abc.edu",
                modulos: [
                    {
                        nombre: "Introducción y Conceptos Básicos",
                        descripcion: "Familiarízate con el mundo del desarrollo web y sus conceptos clave.",
                        lecciones: [
                            {
                                nombre: "¿Qué es la web?",
                                descripcion: "Historia y concepto base de la World Wide Web.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work"
                            },
                            {
                                nombre: "Herramientas del desarrollador",
                                descripcion: "Uso de editores, navegadores y herramientas básicas.",
                                archivo: "https://www.freecodecamp.org/news/developer-tools-for-beginners/"
                            },
                            {
                                nombre: "Buenas prácticas web",
                                descripcion: "Recomendaciones para comenzar desarrollo web.",
                                archivo: "https://web.dev/best-practices/"
                            },
                            {
                                nombre: "Redes y funcionamiento de internet",
                                descripcion: "Descubre cómo funciona internet a nivel técnico.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work"
                            }
                        ]
                    },
                    {
                        nombre: "Fundamentos de HTML",
                        descripcion: "Comprende y utiliza HTML para estructurar páginas.",
                        lecciones: [
                            {
                                nombre: "Etiquetas HTML esenciales",
                                descripcion: "Conoce las etiquetas más utilizadas en HTML.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/HTML/Element"
                            },
                            {
                                nombre: "Imágenes y multimedia",
                                descripcion: "Añade imágenes y contenido multimedia en tu web.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/HTML/Multimedia_and_embedding"
                            },
                            {
                                nombre: "Listas y tablas",
                                descripcion: "Crea listas y tablas en tus páginas HTML.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/HTML/Element/Table"
                            },
                            {
                                nombre: "Enlaces y navegación",
                                descripcion: "Aprende cómo vincular páginas entre sí.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Formularios básicos",
                                descripcion: "Introducción al manejo de formularios en HTML.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/Forms/Your_first_form"
                            }
                        ]
                    },
                    {
                        nombre: "Fundamentos de CSS",
                        descripcion: "Aprende a dar estilo profesional a tus páginas web.",
                        lecciones: [
                            {
                                nombre: "Colores y fuentes",
                                descripcion: "Personaliza tus sitios con paletas y tipografías.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/CSS/font"
                            },
                            {
                                nombre: "Box Model",
                                descripcion: "Comprende el modelo de cajas en CSS.",
                                archivo: "https://css-tricks.com/the-css-box-model/"
                            },
                            {
                                nombre: "Selectores y especificidad",
                                descripcion: "Domina la forma de apuntar estilos a tus elementos.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/CSS/CSS_selectors"
                            },
                            {
                                nombre: "Responsive design",
                                descripcion: "Haz tus páginas adaptables con media queries.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Media_queries"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Transiciones y animaciones básicas",
                                descripcion: "Animaciones simples con CSS.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/CSS/CSS_Transitions"
                            }
                        ]
                    },
                    {
                        nombre: "Introducción a JavaScript",
                        descripcion: "Comienza con la programación en el navegador.",
                        lecciones: [
                            {
                                nombre: "Sintaxis y variables en JavaScript",
                                descripcion: "Aprende la sintaxis básica y cómo declarar variables.",
                                archivo: "https://javascript.info/variable"
                            },
                            {
                                nombre: "Eventos y DOM",
                                descripcion: "Maneja eventos y accede al DOM de la página.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction"
                            },
                            {
                                nombre: "Interacción con el usuario",
                                descripcion: "Realiza alertas, prompts, y confirma acciones del usuario.",
                                archivo: "https://es.javascript.info/alert-prompt-confirm"
                            },
                            {
                                nombre: "Condicionales y ciclos",
                                descripcion: "Controla el flujo de tu programa.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Funciones simples",
                                descripcion: "Cómo escribir y llamar funciones básicas en JS.",
                                archivo: "https://es.javascript.info/function-basics"
                            }
                        ]
                    },
                    {
                        nombre: "Proyecto Final: Página Web Personal",
                        descripcion: "Pon en práctica todo lo aprendido construyendo tu portafolio.",
                        lecciones: [
                            {
                                nombre: "Estructura y boceto de tu sitio",
                                descripcion: "Planifica la estructura de tu web personal.",
                                archivo: "https://www.figma.com/templates/websites/"
                            },
                            {
                                nombre: "Implementación HTML y CSS",
                                descripcion: "Construye tu sitio con HTML y dale estilo con CSS.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/Getting_started_with_the_web/Building_a_simple_website"
                            },
                            {
                                nombre: "Interactividad con JS",
                                descripcion: "Agrega scripts para mejorar la experiencia del usuario.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/JavaScript/First_steps/What_is_JavaScript"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Publicando tu sitio",
                                descripcion: "Sube tu web personal a la nube con GitHub Pages.",
                                archivo: "https://pages.github.com/"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Despliegue y Buenas Prácticas",
                        descripcion: "Prepara y publica tu sitio web siguiendo buenas prácticas.",
                        lecciones: [
                            {
                                nombre: "Optimización de imágenes",
                                descripcion: "Reduce el peso de tus imágenes para un mejor rendimiento.",
                                archivo: "https://web.dev/fast/#optimize-images"
                            },
                            {
                                nombre: "SEO básico",
                                descripcion: "Mejorando la visibilidad de tu sitio en buscadores.",
                                archivo: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
                            }
                        ]
                    }
                ]
            },
            {
                id: "C002",
                codigo: "C102",
                nombre: "Base de Datos para Principiantes",
                descripcion: "Curso completo sobre bases de datos. Aprende SQL, diseño de bases de datos y gestión de información.",
                docente: "carlos.ramirez@abc.edu",
                modulos: [
                    {
                        nombre: "Introducción a las Bases de Datos",
                        descripcion: "Aprende qué es una base de datos y sus componentes principales.",
                        lecciones: [
                            {
                                nombre: "¿Qué es una base de datos?",
                                descripcion: "Definición, historia y usos principales.",
                                archivo: "https://www.oracle.com/database/what-is-database/"
                            },
                            {
                                nombre: "Sistemas de gestión de bases de datos",
                                descripcion: "DBMS y ejemplos populares.",
                                archivo: "https://es.wikipedia.org/wiki/Sistema_de_gesti%C3%B3n_de_bases_de_datos"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Bases de datos NoSQL",
                                descripcion: "Qué son y en qué casos utilizarlas.",
                                archivo: "https://www.mongodb.com/nosql-explained"
                            }
                        ]
                    },
                    {
                        nombre: "SQL Básico",
                        descripcion: "Domina los comandos esenciales de SQL.",
                        lecciones: [
                            {
                                nombre: "Seleccionar datos (SELECT)",
                                descripcion: "Consulta y obtén información de tablas.",
                                archivo: "https://www.w3schools.com/sql/sql_select.asp"
                            },
                            {
                                nombre: "Eliminar datos (DELETE)",
                                descripcion: "Quitar registros y limpiar información.",
                                archivo: "https://www.sqlservertutorial.net/sql-server-basics/sql-server-delete/"
                            },
                            {
                                nombre: "Insertar y actualizar datos (INSERT, UPDATE)",
                                descripcion: "Agrega o modifica información en tus tablas.",
                                archivo: "https://www.w3schools.com/sql/sql_insert.asp"
                            },
                            {
                                nombre: "Condiciones y filtros",
                                descripcion: "Filtra resultados en tus consultas SQL.",
                                archivo: "https://www.w3schools.com/sql/sql_where.asp"
                            }
                        ]
                    },
                    {
                        nombre: "Diseño de Bases de Datos",
                        descripcion: "Aprende a modelar y relacionar tablas.",
                        lecciones: [
                            {
                                nombre: "Modelo entidad-relación",
                                descripcion: "Cómo estructurar los datos lógicamente.",
                                archivo: "https://www.lucidchart.com/pages/es/modelo-entidad-relacion"
                            },
                            {
                                nombre: "Claves primarias y foráneas",
                                descripcion: "Establece relaciones entre tus tablas.",
                                archivo: "https://www.w3schools.com/sql/sql_primarykey.asp"
                            },
                            {
                                nombre: "Normalización",
                                descripcion: "Evita redundancias y errores comunes.",
                                archivo: "https://www.ionos.es/digitalguide/paginas-web/desarrollo-web/normalizacion-de-bases-de-datos/"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Índices y rendimiento",
                                descripcion: "Cómo los índices mejoran las consultas.",
                                archivo: "https://www.sqlservertutorial.net/sql-server-indexes/"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Administración de Bases de Datos",
                        descripcion: "Gestiona usuarios, permisos y copias de seguridad.",
                        lecciones: [
                            {
                                nombre: "Gestión de usuarios y permisos",
                                descripcion: "Cómo conceder y revocar privilegios.",
                                archivo: "https://www.mysqltutorial.org/mysql-grant.aspx"
                            },
                            {
                                nombre: "Copias de seguridad y recuperación",
                                descripcion: "Respalda y recupera tus datos.",
                                archivo: "https://dev.mysql.com/doc/mysql-backup-excerpt/8.0/en/"
                            }
                        ]
                    }
                ]
            },
            {
                id: "C003",
                codigo: "C103",
                nombre: "JavaScript desde Cero",
                descripcion: "Domina JavaScript paso a paso. Variables, funciones, objetos, arrays y programación orientada a objetos.",
                docente: "lucia.fernandez@abc.edu",
                modulos: [
                    {
                        nombre: "JavaScript Básico",
                        descripcion: "Domina sintaxis y conceptos esenciales.",
                        lecciones: [
                            {
                                nombre: "Condicionales (if, switch)",
                                descripcion: "Controla el flujo del programa con condicionales.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"
                            },
                            {
                                nombre: "Funciones básicas",
                                descripcion: "Crea funciones simples y flecha.",
                                archivo: "https://es.javascript.info/function-basics"
                            },
                            {
                                nombre: "Arrays en JavaScript",
                                descripcion: "Cómo se usan y manipulan los arrays.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array"
                            },
                            {
                                nombre: "Bucles for y while",
                                descripcion: "Ciclos y recorridos de datos.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Loops_and_iteration"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Operadores lógicos y de comparación",
                                descripcion: "Usa operadores para tomar decisiones.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_Operators"
                            }
                        ]
                    },
                    {
                        nombre: "Objetos y POO en JavaScript",
                        descripcion: "Profundiza en objetos, clases y la orientación a objetos.",
                        lecciones: [
                            {
                                nombre: "Objetos literales y propiedades",
                                descripcion: "Creación y manipulación básica.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects"
                            },
                            {
                                nombre: "Clases y constructores",
                                descripcion: "Organiza tu código con clases.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes"
                            },
                            {
                                nombre: "Prototipos y herencia",
                                descripcion: "Comprende cómo funciona la herencia prototípica.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Inheritance_and_the_prototype_chain"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Métodos y this",
                                descripcion: "Cómo funciona el contexto en los objetos.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this"
                            }
                        ]
                    },
                    {
                        nombre: "JavaScript en el Navegador",
                        descripcion: "Interactúa con el usuario y el DOM.",
                        lecciones: [
                            {
                                nombre: "Almacenamiento local (localStorage)",
                                descripcion: "Guarda y lee información desde el navegador.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/API/Window/localStorage"
                            },
                            {
                                nombre: "Manejo de eventos",
                                descripcion: "Captura interacciones del usuario.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/Events"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Manipulación avanzada del DOM",
                                descripcion: "Agrega, elimina y modifica elementos dinámicamente.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/API/Document/createElement"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Asincronía en JavaScript",
                        descripcion: "Manejo de código asíncrono con callbacks y promesas.",
                        lecciones: [
                            {
                                nombre: "Callbacks",
                                descripcion: "Comienza con callbacks y funciones de retrollamada.",
                                archivo: "https://developer.mozilla.org/es/docs/Glossary/Callback_function"
                            },
                            {
                                nombre: "Promesas",
                                descripcion: "Introducción a Promise y manejo de asincronía.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Using_promises"
                            },
                            {
                                nombre: "Async y Await",
                                descripcion: "Sintaxis moderna para asincronía.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function"
                            }
                        ]
                    }
                ]
            },
            // Más cursos también pueden ser enriquecidos siguiendo la misma lógica.
            {
                id: "C004",
                codigo: "C104",
                nombre: "Python para Principiantes",
                descripcion: "Aprende Python desde lo básico. Sintaxis, estructuras de datos, funciones y proyectos prácticos.",
                docente: "andres.martinez@abc.edu",
                modulos: [
                    {
                        nombre: "Fundamentos de Python",
                        descripcion: "Aprende la sintaxis base de Python y ejecuta tus primeros scripts.",
                        lecciones: [
                            {
                                nombre: "Introducción a Python",
                                descripcion: "Historia, filosofía y casos de uso de Python.",
                                archivo: "https://docs.python.org/es/3/tutorial/index.html"
                            },
                            {
                                nombre: "Comentarios y buenas prácticas",
                                descripcion: "Aprende la importancia de comentar tu código y seguir buenas normas.",
                                archivo: "https://realpython.com/python-comments-guide/"
                            },
                            {
                                nombre: "Variables y tipos de datos",
                                descripcion: "Declara variables y usa tipos básicos.",
                                archivo: "https://realpython.com/python-data-types/"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Operadores y expresiones",
                                descripcion: "Operadores matemáticos y lógicos en Python.",
                                archivo: "https://docs.python.org/es/3/tutorial/introduction.html#using-python-as-a-calculator"
                            }
                        ]
                    },
                    {
                        nombre: "Estructuras de Datos en Python",
                        descripcion: "Manipulación de listas, tuplas y diccionarios.",
                        lecciones: [
                            {
                                nombre: "Listas y métodos de listas",
                                descripcion: "Cómo crear y usar listas.",
                                archivo: "https://docs.python.org/es/3/tutorial/datastructures.html#more-on-lists"
                            },
                            {
                                nombre: "Tuplas y diccionarios",
                                descripcion: "Estructuras para manejar colecciones de datos.",
                                archivo: "https://docs.python.org/es/3/tutorial/datastructures.html#tuples-and-sequences"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Conjuntos (set)",
                                descripcion: "Uso y ventajas de los conjuntos.",
                                archivo: "https://docs.python.org/es/3/tutorial/datastructures.html#sets"
                            }
                        ]
                    },
                    {
                        nombre: "Funciones y control de flujo",
                        descripcion: "Aprende a modularizar y controlar la ejecución.",
                        lecciones: [
                            {
                                nombre: "Definición y uso de funciones",
                                descripcion: "Cómo crear funciones propias.",
                                archivo: "https://docs.python.org/es/3/tutorial/controlflow.html#defining-functions"
                            },
                            {
                                nombre: "Condicionales y bucles",
                                descripcion: "Si, para, mientras y control del flujo.",
                                archivo: "https://docs.python.org/es/3/tutorial/controlflow.html#more-control-flow-tools"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Comprensión de listas",
                                descripcion: "List comprehensions en Python.",
                                archivo: "https://docs.python.org/es/3/tutorial/datastructures.html#list-comprehensions"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Manejo de Archivos en Python",
                        descripcion: "Abre, lee y escribe archivos desde tus scripts.",
                        lecciones: [
                            {
                                nombre: "Lectura de archivos",
                                descripcion: "Cómo leer archivos de texto.",
                                archivo: "https://docs.python.org/es/3/tutorial/inputoutput.html#reading-and-writing-files"
                            },
                            {
                                nombre: "Escritura de archivos",
                                descripcion: "Cómo guardar información en archivos.",
                                archivo: "https://docs.python.org/es/3/tutorial/inputoutput.html#methods-of-file-objects"
                            }
                        ]
                    }
                ]
            },
            // Puedes seguir enriqueciendo los demás cursos si deseas más variedad.
            {
                id: "C005",
                codigo: "C105",
                nombre: "React: Desarrollo Moderno",
                descripcion: "Crea aplicaciones web modernas con React. Componentes, hooks, estado y routing.",
                docente: "maria.rodriguez@abc.edu",
                modulos: [
                    {
                        nombre: "Introducción a React",
                        descripcion: "Aprende qué es React y cómo empezar tu primer proyecto.",
                        lecciones: [
                            {
                                nombre: "¿Qué es React?",
                                descripcion: "Historia, características y ventajas del framework.",
                                archivo: "https://es.react.dev/learn"
                            },
                            {
                                nombre: "Primeros pasos con create-react-app",
                                descripcion: "Tu primer proyecto en React.",
                                archivo: "https://es.react.dev/learn/start-a-new-react-project"
                            }
                        ]
                    },
                    {
                        nombre: "Componentes y JSX",
                        descripcion: "Crea interfaces modulares con Componentes.",
                        lecciones: [
                            {
                                nombre: "Definir Componentes",
                                descripcion: "Funciones y clases componentes.",
                                archivo: "https://es.react.dev/learn/your-first-component"
                            },
                            {
                                nombre: "JSX y renderizado",
                                descripcion: "Sintaxis JSX y cómo se representa en HTML.",
                                archivo: "https://es.react.dev/learn/writing-markup-with-jsx"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Props y propiedades",
                                descripcion: "Comunicación entre componentes mediante props.",
                                archivo: "https://es.react.dev/learn/passing-props-to-a-component"
                            }
                        ]
                    },
                    {
                        nombre: "Hooks y Estado",
                        descripcion: "Gestiona datos dinámicos y efectos secundarios.",
                        lecciones: [
                            {
                                nombre: "useState y estado local",
                                descripcion: "Gestionar valores reactivos en componentes.",
                                archivo: "https://es.react.dev/learn/state-a-components-memory"
                            },
                            {
                                nombre: "useEffect y ciclo de vida",
                                descripcion: "Ejecución de código tras renderizar y cambios.",
                                archivo: "https://es.react.dev/learn/synchronizing-with-effects"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Custom Hooks",
                                descripcion: "Crea tus propios hooks reutilizables.",
                                archivo: "https://es.react.dev/learn/reusing-logic-with-custom-hooks"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Routing y Navegación en React",
                        descripcion: "Implementa navegaciones usando React Router.",
                        lecciones: [
                            {
                                nombre: "Instalación de React Router",
                                descripcion: "Agrega React Router a tu proyecto.",
                                archivo: "https://reactrouter.com/en/main/start/tutorial"
                            },
                            {
                                nombre: "Definiendo rutas y enlaces",
                                descripcion: "Navegación entre vistas usando rutas.",
                                archivo: "https://reactrouter.com/en/main/components/link"
                            }
                        ]
                    }
                ]
            },
            // Puedes continuar añadiendo módulos y lecciones extras al resto de cursos si lo deseas
            {
                id: "C006",
                codigo: "C106",
                nombre: "Node.js y Backend",
                descripcion: "Desarrolla aplicaciones del lado del servidor con Node.js. APIs, Express y bases de datos.",
                docente: "juan.sanchez@abc.edu",
                modulos: [
                    {
                        nombre: "Primeros pasos con Node.js",
                        descripcion: "Aprende la instalación y conceptos básicos de Node.js.",
                        lecciones: [
                            {
                                nombre: "¿Qué es Node.js?",
                                descripcion: "Introducción a la plataforma, historia y casos de uso.",
                                archivo: "https://nodejs.org/es/about/"
                            },
                            {
                                nombre: "Ejecución y módulos de Node",
                                descripcion: "Cómo ejecutar código y usar módulos.",
                                archivo: "https://nodejs.org/dist/latest-v20.x/docs/api/modules.html"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Node Package Manager (npm)",
                                descripcion: "Gestión de dependencias en proyectos Node.js.",
                                archivo: "https://docs.npmjs.com/"
                            }
                        ]
                    },
                    {
                        nombre: "Desarrollo con Express",
                        descripcion: "Framework Express para crear servidores web.",
                        lecciones: [
                            {
                                nombre: "¿Qué es Express?",
                                descripcion: "Instala y conoce Express.js.",
                                archivo: "https://expressjs.com/es/"
                            },
                            {
                                nombre: "Rutas y middleware",
                                descripcion: "Gestiona peticiones y respuestas.",
                                archivo: "https://expressjs.com/es/guide/routing.html"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Controladores y arquitectura MVC",
                                descripcion: "Estructura tus aplicaciones con controladores.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/Server-side/Express_Nodejs/routes"
                            }
                        ]
                    },
                    {
                        nombre: "Conexión a Bases de Datos y APIs",
                        descripcion: "Cómo conectar Node/Express con bases de datos y exponer APIs.",
                        lecciones: [
                            {
                                nombre: "Conectar a MongoDB",
                                descripcion: "Guía para conectar Node con MongoDB.",
                                archivo: "https://www.mongodb.com/docs/drivers/node/"
                            },
                            {
                                nombre: "Crear y consumir APIs REST",
                                descripcion: "Crea endpoints y consulta datos desde el backend.",
                                archivo: "https://developer.mozilla.org/es/docs/Glossary/REST"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Uso de middlewares externos",
                                descripcion: "Agrega funcionalidad como autenticación y logs.",
                                archivo: "https://expressjs.com/es/guide/using-middleware.html"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Autenticación y Seguridad",
                        descripcion: "Implementa login y medidas de seguridad básicas.",
                        lecciones: [
                            {
                                nombre: "JSON Web Tokens (JWT)",
                                descripcion: "Autentica usuarios con tokens.",
                                archivo: "https://jwt.io/introduction"
                            },
                            {
                                nombre: "Protección contra ataques comunes",
                                descripcion: "Prevención de XSS, CSRF y otros.",
                                archivo: "https://expressjs.com/es/advanced/best-practice-security.html"
                            }
                        ]
                    }
                ]
            },
            // Cursos adicionales pueden recibir también módulos/lecciones extra, replicando la lógica anterior.
            {
                id: "C007",
                codigo: "C107",
                nombre: "HTML y CSS Avanzado",
                descripcion: "Domina HTML5 y CSS3. Diseño responsive, flexbox, grid y animaciones modernas.",
                docente: "ana.lopez@abc.edu",
                modulos: [
                    {
                        nombre: "HTML5 Avanzado",
                        descripcion: "Domina las características avanzadas de HTML5.",
                        lecciones: [
                            {
                                nombre: "Semántica HTML5",
                                descripcion: "Elementos semánticos modernos de HTML5.",
                                archivo: "https://developer.mozilla.org/es/docs/Glossary/Semantics"
                            },
                            {
                                nombre: "Formularios avanzados",
                                descripcion: "Tipos de input y validación HTML5.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/HTML/Element/input"
                            },
                            {
                                nombre: "Accesibilidad (a11y)",
                                descripcion: "Haz tus páginas accesibles e inclusivas.",
                                archivo: "https://developer.mozilla.org/es/docs/Learn/Accessibility"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Elementos multimedia",
                                descripcion: "Uso de video, audio y SVG.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/SVG"
                            }
                        ]
                    },
                    {
                        nombre: "CSS Layouts Modernos",
                        descripcion: "Flexbox y Grid para diseños profesionales.",
                        lecciones: [
                            {
                                nombre: "Flexbox completo",
                                descripcion: "Domina el sistema de layout Flexbox.",
                                archivo: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
                            },
                            {
                                nombre: "CSS Grid",
                                descripcion: "Crea layouts complejos con Grid.",
                                archivo: "https://css-tricks.com/snippets/css/complete-guide-grid/"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Grid vs Flexbox",
                                descripcion: "Cuándo usar cada técnica de layout.",
                                archivo: "https://css-tricks.com/css-grid-vs-flexbox/"
                            }
                        ]
                    },
                    {
                        nombre: "Animaciones y Transiciones",
                        descripcion: "Anima tus páginas con CSS.",
                        lecciones: [
                            {
                                nombre: "Transiciones CSS",
                                descripcion: "Crea transiciones suaves entre estados.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/CSS/CSS_Transitions"
                            },
                            {
                                nombre: "Animaciones con keyframes",
                                descripcion: "Anima elementos con @keyframes.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/CSS/@keyframes"
                            },
                            {
                                nombre: "Animaciones avanzadas",
                                descripcion: "Secuencias y animaciones complejas.",
                                archivo: "https://css-tricks.com/css-animation-libraries/"
                            }
                        ]
                    },
                    {
                        nombre: "Preprocesadores CSS",
                        descripcion: "Optimiza tu flujo de trabajo con SASS.",
                        lecciones: [
                            {
                                nombre: "Introducción a SASS",
                                descripcion: "Sintaxis y ventajas de SASS.",
                                archivo: "https://sass-lang.com/guide"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Variables y mixins en SASS",
                                descripcion: "Reutiliza código y optimiza estilos.",
                                archivo: "https://sass-lang.com/guide"
                            }
                        ]
                    }
                ]
            },
            {
                id: "C008",
                codigo: "C108",
                nombre: "Git y GitHub para Desarrolladores",
                descripcion: "Aprende control de versiones con Git. Comandos esenciales, ramas, merge y trabajo en equipo.",
                docente: "diego.gonzalez@abc.edu",
                modulos: [
                    {
                        nombre: "Introducción a Git",
                        descripcion: "Qué es Git y cómo instalarlo.",
                        lecciones: [
                            {
                                nombre: "Conceptos básicos de control de versiones",
                                descripcion: "Entiende por qué es importante controlar versiones.",
                                archivo: "https://www.atlassian.com/git/tutorials/what-is-version-control"
                            },
                            {
                                nombre: "Instalación y configuración inicial",
                                descripcion: "Preparar el entorno para usar Git.",
                                archivo: "https://git-scm.com/book/es/v2/Primeros-pasos-Instalando-Git"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Configuración global de Git",
                                descripcion: "Ajustar nombre de usuario y correo.",
                                archivo: "https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup"
                            }
                        ]
                    },
                    {
                        nombre: "Trabajando con Repositorios",
                        descripcion: "Clonar, crear y administrar repositorios locales y remotos.",
                        lecciones: [
                            {
                                nombre: "Crear repositorio local",
                                descripcion: "git init, git status, git add, git commit.",
                                archivo: "https://www.atlassian.com/git/tutorials/setting-up-a-repository"
                            },
                            {
                                nombre: "Repositorios remotos y GitHub",
                                descripcion: "Sube tus proyectos a la nube.",
                                archivo: "https://docs.github.com/es/get-started/quickstart"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Fork y Pull Request",
                                descripcion: "Colabora en proyectos ajenos y envía propuestas de cambio.",
                                archivo: "https://github.com/firstcontributions/first-contributions"
                            }
                        ]
                    },
                    {
                        nombre: "Colaboración y ramas",
                        descripcion: "Gestiona ramas y colaboración en equipo.",
                        lecciones: [
                            {
                                nombre: "Uso de ramas (branch, merge)",
                                descripcion: "Ramificación y unificación de código.",
                                archivo: "https://www.atlassian.com/git/tutorials/using-branches"
                            },
                            {
                                nombre: "Resolución de conflictos",
                                descripcion: "Qué ocurre cuando hay cambios simultáneos.",
                                archivo: "https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Rebasing",
                                descripcion: "Reescribe el historial de tus ramas.",
                                archivo: "https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase"
                            }
                        ]
                    }
                ]
            },
            {
                id: "C009",
                codigo: "C109",
                nombre: "APIs REST y Consumo de Datos",
                descripcion: "Crea y consume APIs REST. Fetch, axios, autenticación y mejores prácticas.",
                docente: "laura.torres@abc.edu",
                modulos: [
                    {
                        nombre: "Conceptos Básicos de APIs",
                        descripcion: "Fundamentos de APIs y arquitecturas REST.",
                        lecciones: [
                            {
                                nombre: "¿Qué es un API?",
                                descripcion: "Definiciones, historia y tipos de APIs.",
                                archivo: "https://www.postman.com/api-101/"
                            },
                            {
                                nombre: "¿Qué es REST?",
                                descripcion: "Principios de las APIs RESTful.",
                                archivo: "https://restfulapi.net/"
                            },
                            // nueva lección agregada
                            {
                                nombre: "SOAP vs REST",
                                descripcion: "Diferencias clave entre API REST y SOAP.",
                                archivo: "https://www.soapui.org/learn/api/soap-vs-rest-apis/"
                            }
                        ]
                    },
                    {
                        nombre: "Consumo de APIs en JavaScript",
                        descripcion: "Usando fetch, axios y la API de promesas.",
                        lecciones: [
                            {
                                nombre: "La función fetch",
                                descripcion: "Maneja peticiones HTTP con fetch.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch"
                            },
                            {
                                nombre: "Uso de Axios",
                                descripcion: "Librería popular para consumir APIs.",
                                archivo: "https://axios-http.com/docs/intro"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Manejo de errores en peticiones",
                                descripcion: "Gestiona errores y caídas de endpoints.",
                                archivo: "https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch#comprobaci%C3%B3n_de_errores"
                            }
                        ]
                    },
                    {
                        nombre: "Creando tu propia API REST",
                        descripcion: "Construcción de endpoints propios.",
                        lecciones: [
                            {
                                nombre: "Diseño de endpoints CRUD",
                                descripcion: "Crea un API que permita todas las operaciones básicas.",
                                archivo: "https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/"
                            },
                            {
                                nombre: "Autenticación básica en APIs",
                                descripcion: "Cómo proteger y controlar el acceso.",
                                archivo: "https://jwt.io/introduction"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Documentación con Swagger",
                                descripcion: "Genera documentación interactiva para tus APIs.",
                                archivo: "https://swagger.io/docs/"
                            }
                        ]
                    }
                ]
            },
            {
                id: "C010",
                codigo: "C110",
                nombre: "TypeScript para JavaScript",
                descripcion: "Mejora tus proyectos JavaScript con TypeScript. Tipos, interfaces, clases y proyectos reales.",
                docente: "roberto.vargas@abc.edu",
                modulos: [
                    {
                        nombre: "Introducción a TypeScript",
                        descripcion: "Qué es TypeScript y por qué usarlo.",
                        lecciones: [
                            {
                                nombre: "¿Qué es TypeScript?",
                                descripcion: "Características principales.",
                                archivo: "https://www.typescriptlang.org/docs/"
                            },
                            {
                                nombre: "Instalación y primer proyecto",
                                descripcion: "Cómo instalar TS y compilar código.",
                                archivo: "https://www.typescriptlang.org/download"
                            }
                        ]
                    },
                    {
                        nombre: "Tipos y Anotaciones",
                        descripcion: "Domina los tipos básicos y avanzados de TS.",
                        lecciones: [
                            {
                                nombre: "Anotación de tipos básicos",
                                descripcion: "number, string, boolean y arrays.",
                                archivo: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"
                            },
                            {
                                nombre: "Interfaces y type alias",
                                descripcion: "Estructura datos personalizados.",
                                archivo: "https://www.typescriptlang.org/docs/handbook/2/objects.html"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Tipos literales y enums",
                                descripcion: "Emplea enums y tipos literales para mayor seguridad.",
                                archivo: "https://www.typescriptlang.org/docs/handbook/enums.html"
                            }
                        ]
                    },
                    {
                        nombre: "POO y TypeScript avanzado",
                        descripcion: "Clases, genéricos y módulos.",
                        lecciones: [
                            {
                                nombre: "Clases y herencia",
                                descripcion: "Crea jerarquías y lógica reutilizable.",
                                archivo: "https://www.typescriptlang.org/docs/handbook/2/classes.html"
                            },
                            {
                                nombre: "Genéricos",
                                descripcion: "Código reutilizable y fuerte tipado.",
                                archivo: "https://www.typescriptlang.org/docs/handbook/2/generics.html"
                            },
                            // nueva lección agregada
                            {
                                nombre: "Decoradores",
                                descripcion: "Introduce metaprogramación con decoradores.",
                                archivo: "https://www.typescriptlang.org/docs/handbook/decorators.html"
                            }
                        ]
                    },
                    // Nuevo módulo agregado
                    {
                        nombre: "Integración TypeScript + React",
                        descripcion: "Usa TS en proyectos modernos React.",
                        lecciones: [
                            {
                                nombre: "Props y estado tipados",
                                descripcion: "Define props y estados robustos en tus componentes React+TS.",
                                archivo: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/"
                            },
                            {
                                nombre: "Custom Hooks con TypeScript",
                                descripcion: "Escribe hooks personalizados con soporte de tipos.",
                                archivo: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/hooks/"
                            }
                        ]
                    }
                ]
            }
        ],
        administrativos: [
            {
                identificacion: "1001001001",
                nombres: "Patricia",
                apellidos: "Silva",
                email: "patricia.silva@abc.edu",
                telefono: "+57 300 123 4567",
                cargo: "Coordinadora Académica"
            },
            {
                identificacion: "1001001002",
                nombres: "Jorge",
                apellidos: "Méndez",
                email: "jorge.mendez@abc.edu",
                telefono: "+57 300 234 5678",
                cargo: "Director Administrativo"
            }
        ],
        credenciales: [
            {
                email: "admin@abc.edu",
                password: "admin123", 
                rol: "administrativo"
            }
        ]
    };
}
