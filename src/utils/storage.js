import { getInitialData } from '../data/initializeData.js';


export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function deleteData(key) {
    localStorage.removeItem(key);
}

export function initializeData() {
    const data = getInitialData();
    saveData('app-data', data);
}

export function loadData() {
    return getData('app-data');
}