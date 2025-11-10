import { getItemSync } from '../utils/storage.js';

// Función para calcular y mostrar estadísticas simples: docentes y cursos
export function renderStats() {
  // Busca datos en storage
  const docentes = getItemSync('docentes') || [];
  const cursos = getItemSync('cursos') || [];

  // Busca los contadores en el DOM y actualízalos
  const docentesStat = document.getElementById('dashboard-stat-users');
  const cursosStat = document.getElementById('dashboard-stat-courses');
  if (docentesStat) docentesStat.textContent = Array.isArray(docentes) ? docentes.length : 0;
  if (cursosStat) cursosStat.textContent = Array.isArray(cursos) ? cursos.length : 0;
}
