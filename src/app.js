import { router } from './utils/router.js';

export function renderRouter() {
    const rootElement = document.getElementById('root');    
    const viewName = router.handleRoute();
    
    rootElement.innerHTML = '';
    const viewElement = document.createElement(viewName);
    rootElement.appendChild(viewElement);
}

// Esperar a que todo esté listo
async function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(renderRouter, 100);
        });
    } else {
        setTimeout(renderRouter, 100);
    }
}

init();

// Escuchar cambios en el hash
window.addEventListener('hashchange', () => {
    renderRouter();
});

export default renderRouter;