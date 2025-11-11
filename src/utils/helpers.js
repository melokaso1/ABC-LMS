export function getModules(cursos) {
    return cursos.map(curso => curso.modulos).flat();
    return modulos.map((modulo, index) => `
                    <div class="modulo-item">
                        <div class="modulo-header">
                            <span class="modulo-number">Módulo ${index + 1}</span>
                            <h4 class="modulo-title">${modulo.nombre || `Módulo ${index + 1}`}</h4>
                        </div>
                        ${modulo.lecciones && modulo.lecciones.length > 0 ? `
                            <ul class="lecciones-list">
                                ${modulo.lecciones.map((leccion, lecIndex) => `
                                    <li class="leccion-item">
                                        <span class="leccion-number">${lecIndex + 1}</span>
                                        <a href="${leccion.archivo}" target="_blank" class="leccion-link">${leccion.nombre}</a>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p class="no-lecciones">Este módulo aún no tiene lecciones disponibles.</p>'}
                    </div>
                `).join('');
}