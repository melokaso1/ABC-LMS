import { routes } from './utils/router.js';

const root = document.querySelector('#root');

export function render(route) {
  const tagName = routes[route] ?? routes['/public'];
  root.innerHTML = '';
  root.appendChild(document.createElement(tagName));
}

export function resolveRoute() {
  const path = window.location.hash.replace('#', '') || '/public';
  render(path);
}

window.addEventListener('DOMContentLoaded', resolveRoute);
window.addEventListener('hashchange', resolveRoute);