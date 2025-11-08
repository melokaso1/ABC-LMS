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
                areaAcademica: "Tecnología y Programación"
            },
            {
                codigo: "D102",
                identificacion: "2001003002",
                nombres: "Carlos",
                apellidos: "Ramírez Díaz",
                email: "carlos.ramirez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/43.jpg",
                areaAcademica: "Tecnología y Programación"
            },
            {
                codigo: "D103",
                identificacion: "2001003003",
                nombres: "Lucía",
                apellidos: "Fernández Ospina",
                email: "lucia.fernandez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
                areaAcademica: "Tecnología y Programación"
            }
        ],
        cursos: [],
        administrativos: [
            {
                id: "A001",
                nombre: "Patricia Silva",
                email: "patricia.silva@abc.edu"
            },
            {
                id: "A002",
                nombre: "Jorge Méndez",
                email: "jorge.mendez@abc.edu"
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