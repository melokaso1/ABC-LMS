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
                areaAcademica: "Programación"
            },
            {
                codigo: "D102",
                identificacion: "2001003002",
                nombres: "Carlos",
                apellidos: "Ramírez Díaz",
                email: "carlos.ramirez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/men/43.jpg",
                areaAcademica: "Programación"
            },
            {
                codigo: "D103",
                identificacion: "2001003003",
                nombres: "Lucía",
                apellidos: "Fernández Ospina",
                email: "lucia.fernandez@abc.edu",
                fotoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
                areaAcademica: "Programación"
            }
        ],
        cursos: [],
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