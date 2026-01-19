// Sync Manager - Sincroniza datos entre dispositivos sin necesidad de servidor
// Usa localStorage con eventos de almacenamiento para sincronización en tiempo real

export const syncManager = {
  // Guardar datos y notificar a otros tabs/dispositivos
  saveAndSync: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    
    // Notificar dentro del mismo navegador (otros tabs)
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: JSON.stringify(data),
      oldValue: null,
      storageArea: localStorage,
      url: window.location.href
    }));

    // Guardar timestamp de última actualización para detectar cambios
    localStorage.setItem(`${key}_updated`, Date.now().toString());
  },

  // Cargar datos
  load: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  // Obtener timestamp de última actualización
  getLastUpdate: (key) => {
    return parseInt(localStorage.getItem(`${key}_updated`) || '0');
  },

  // Escuchar cambios en localStorage (sincronización entre tabs)
  onSync: (key, callback) => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          callback(data);
        } catch (error) {
          console.error('Error parsing synced data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  },

  // Agregar cache buster a URLs de imágenes
  addCacheBuster: (url, timestamp = Date.now()) => {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${timestamp}`;
  },

  // Limpiar cache buster
  removeCacheBuster: (url) => {
    if (!url) return url;
    return url.split('?')[0];
  }
};

export default syncManager;
