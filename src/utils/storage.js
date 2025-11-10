/**
 * Sistema de almacenamiento basado en promesas
 * Maneja operaciones de localStorage de forma asíncrona
 */

/**
 * Obtiene un valor del localStorage
 * @param {string} key - Clave del localStorage
 * @returns {Promise<any>} Promesa que se resuelve con el valor
 */
export function getItem(key) {
  return new Promise((resolve) => {
    try {
      const item = localStorage.getItem(key);
      const value = item ? JSON.parse(item) : null;
      resolve(value);
    } catch (error) {
      console.error(`[STORAGE ERROR] Error al leer ${key}:`, error);
      resolve(null);
    }
  });
}

/**
 * Guarda un valor en localStorage
 * @param {string} key - Clave del localStorage
 * @param {any} value - Valor a guardar
 * @returns {Promise<void>} Promesa que se resuelve cuando se guarda
 */
export function setItem(key, value) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      resolve();
    } catch (error) {
      console.error(`[STORAGE ERROR] Error al escribir ${key}:`, error);
      reject(error);
    }
  });
}

/**
 * Elimina un valor del localStorage
 * @param {string} key - Clave a eliminar
 * @returns {Promise<void>} Promesa que se resuelve cuando se elimina
 */
export function removeItem(key) {
  return new Promise((resolve) => {
    try {
      localStorage.removeItem(key);
      resolve();
    } catch (error) {
      console.error(`[STORAGE ERROR] Error al eliminar ${key}:`, error);
      resolve();
    }
  });
}

/**
 * Elimina un valor de forma síncrona (para casos donde se necesita inmediatamente)
 * @param {string} key - Clave a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
export function removeItemSync(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[STORAGE ERROR] Error al eliminar ${key}:`, error);
    return false;
  }
}

/**
 * Obtiene un valor de forma síncrona (para casos donde se necesita inmediatamente)
 * @param {string} key - Clave del localStorage
 * @returns {any} Valor almacenado o null
 */
export function getItemSync(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`[STORAGE ERROR] Error al leer ${key}:`, error);
    return null;
  }
}

/**
 * Guarda un valor de forma síncrona (para casos donde se necesita inmediatamente)
 * @param {string} key - Clave del localStorage
 * @param {any} value - Valor a guardar
 * @returns {boolean} true si se guardó correctamente
 */
export function setItemSync(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[STORAGE ERROR] Error al escribir ${key}:`, error);
    return false;
  }
}