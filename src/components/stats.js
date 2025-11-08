// Función para calcular y mostrar estadísticas simples: docentes y cursos
export function renderStats() {
  // Busca datos en localStorage
  const docentesJson = localStorage.getItem('docentes');
  const cursosJson = localStorage.getItem('cursos');

  let docentes = [];
  let cursos = [];

  try {
    docentes = docentesJson ? JSON.parse(docentesJson) : [];
    if (!Array.isArray(docentes)) docentes = [];
  } catch {
    docentes = [];
  }

  try {
    cursos = cursosJson ? JSON.parse(cursosJson) : [];
    if (!Array.isArray(cursos)) cursos = [];
  } catch {
    cursos = [];
  }

  // Busca los contadores en el DOM y actualízalos
  const docentesStat = document.getElementById('dashboard-stat-users');
  const cursosStat = document.getElementById('dashboard-stat-courses');
  if (docentesStat) docentesStat.textContent = docentes.length;
  if (cursosStat) cursosStat.textContent = cursos.length;
}
