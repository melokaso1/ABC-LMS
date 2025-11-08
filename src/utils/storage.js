import { getInitialData } from '../data/initializeData';

// Guarda datos en localStorage usando una clave
export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Carga datos desde localStorage usando una clave
export function loadData(key) {
    const item = localStorage.getItem(key);
    try {
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Error al analizar los datos de localStorage para la clave:", key, e);
        return null;
    }
}

// Inicializa los datos solo si no existen en localStorage
export function initData() {
    if (!localStorage.getItem("appData")) {
        const initialData = getInitialData(); // Obtiene datos iniciales
        saveData("appData", initialData);     // Guarda datos iniciales
    }
}

// Funciones CRUD específicas para docentes

// Cargar lista de docentes desde appData en localStorage
export function loadDocentes() {
    const appData = loadData("appData");
    return appData && appData.docentes ? appData.docentes : [];
}

// Guardar (crear/actualizar) un docente en appData
export function saveDocente(docente) {
    const appData = loadData("appData") || getInitialData();
    let docentes = appData.docentes || [];
    const index = docentes.findIndex(d => d.codigo === docente.codigo);

    if (index !== -1) {
        // Actualizar docente existente
        docentes[index] = docente;
    } else {
        // Agregar nuevo docente
        docentes.push(docente);
    }
    appData.docentes = docentes;
    saveData("appData", appData);
}

// Eliminar un docente por código
export function deleteDocente(codigo) {
    const appData = loadData("appData");
    if (!appData || !appData.docentes) return;
    const docentes = appData.docentes.filter(d => d.codigo !== codigo);
    appData.docentes = docentes;
    saveData("appData", appData);
}


// Valida si el email es único (entre todos los docentes), excluyendo opcionalmente un docente por 'codigo'
export function validateEmailUnique(email, excludeId = null) {
    const appData = loadData("appData");
    if (!appData || !appData.docentes) return true;
    return !appData.docentes.some(docente => 
        docente.email === email && 
        (excludeId ? docente.codigo !== excludeId : true)
    );
}

// Valida si el código es único en un tipo ('docente', 'administrativo', etc), excluyendo opcionalmente por id
export function validateCodigoUnique(codigo, tipo = "docente", excludeId = null) {
    const appData = loadData("appData");
    if (!appData) return true;

    let lista = [];
    if (tipo === "docente" && appData.docentes) {
        lista = appData.docentes;
    } else if (tipo === "administrativo" && appData.administrativos) {
        lista = appData.administrativos;
    } else if (tipo === "curso" && appData.cursos) {
        lista = appData.cursos;
    }

    // Para administrativos asumimos 'id', para docentes 'codigo'
    const idKey = tipo === "administrativo" ? "id" : "codigo";

    return !lista.some(item =>
        item[idKey] === codigo &&
        (excludeId ? item[idKey] !== excludeId : true)
    );
}

// Valida si un docente tiene cursos asignados (retorna true si tiene al menos un curso)
export function validateDocenteHasCursos(docenteId) {
    const appData = loadData("appData");
    if (!appData || !appData.cursos) return false;

    // Supone que cada curso tiene una propiedad 'docenteId' o 'docente' que referencia el código/id del docente
    return appData.cursos.some(curso => 
        curso.docenteId === docenteId || curso.docente === docenteId
    );
}



