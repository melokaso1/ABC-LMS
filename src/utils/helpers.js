// Funciones helper básicas para simplificar el código
// JavaScript básico y fácil de entender

import { getItemSync, setItemSync } from './storage.js';

// Obtiene un array de localStorage, si no existe retorna array vacío
export function getArray(key) {
  const list = getItemSync(key);
  if (Array.isArray(list)) {
    return list;
  }
  return [];
}

// Guarda un array en localStorage
export function saveArray(key, array) {
  return setItemSync(key, array);
}

// Busca un item en un array y lo actualiza, si no existe lo agrega
export function upsertItem(array, item, findKey) {
  // Si no se especifica la clave, usa 'email' por defecto
  if (!findKey) {
    findKey = 'email';
  }
  
  // Buscar si el item ya existe
  let encontrado = false;
  let indice = -1;
  
  for (let i = 0; i < array.length; i++) {
    if (array[i][findKey] === item[findKey]) {
      encontrado = true;
      indice = i;
      break;
    }
  }
  
  // Si existe, actualizarlo
  if (encontrado) {
    // Copiar propiedades del item existente y actualizar con las nuevas
    const itemExistente = array[indice];
    for (let key in item) {
      itemExistente[key] = item[key];
    }
    array[indice] = itemExistente;
  } else {
    // Si no existe, agregarlo
    array.push(item);
  }
  
  return array;
}

// Elimina un item de un array
export function deleteItem(array, value, findKey) {
  // Si no se especifica la clave, usa 'email' por defecto
  if (!findKey) {
    findKey = 'email';
  }
  
  // Crear nuevo array sin el item a eliminar
  const nuevoArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i][findKey] !== value) {
      nuevoArray.push(array[i]);
    }
  }
  
  return nuevoArray;
}

// Valida si un email tiene formato correcto
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  // Verificar que tenga @ y un punto después del @
  const tieneArroba = email.indexOf('@') > 0;
  const tienePunto = email.indexOf('.', email.indexOf('@')) > email.indexOf('@');
  return tieneArroba && tienePunto;
}

// Convierte un archivo de imagen a base64
export function imageToBase64(file) {
  return new Promise(function(resolve, reject) {
    // Si no hay archivo, retornar null
    if (!file) {
      resolve(null);
      return;
    }
    
    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
      reject(new Error('La imagen es demasiado grande. Máximo 2MB.'));
      return;
    }
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen.'));
      return;
    }
    
    // Leer el archivo como base64
    const reader = new FileReader();
    
    reader.onload = function(evento) {
      resolve(evento.target.result);
    };
    
    reader.onerror = function() {
      reject(new Error('Error al leer la imagen.'));
    };
    
    reader.readAsDataURL(file);
  });
}

// Obtiene el nombre completo de una persona (docente o administrativo)
export function getFullName(item) {
  let nombres = '';
  let apellidos = '';
  
  // Obtener nombres
  if (item.nombres) {
    nombres = item.nombres;
  } else if (item.nombre) {
    nombres = item.nombre;
  }
  
  // Obtener apellidos
  if (item.apellidos) {
    apellidos = item.apellidos;
  }
  
  // Combinar nombres y apellidos
  let nombreCompleto = nombres + ' ' + apellidos;
  nombreCompleto = nombreCompleto.trim();
  
  // Si no hay nombre, usar email o 'Sin nombre'
  if (!nombreCompleto) {
    if (item.email) {
      return item.email;
    }
    return 'Sin nombre';
  }
  
  return nombreCompleto;
}

// Muestra un mensaje de error en un contenedor
export function showError(container, message) {
  if (!container) {
    return;
  }
  
  container.innerHTML = '<div style="display: flex; align-items: flex-start; gap: 0.5rem;">' +
    '<span style="color: var(--terminal-error); font-weight: 700;">[ERROR]</span>' +
    '<div>' + message + '</div>' +
    '</div>';
  container.style.display = "block";
}

// Oculta el mensaje de error
export function hideError(container) {
  if (container) {
    container.style.display = "none";
  }
}

