// Servicio de sincronización entre dispositivos
// Usa un sistema de polling para verificar cambios

const SYNC_KEY = 'admin_gallery_sync';
const SYNC_INTERVAL = 3000; // Verificar cada 3 segundos

export const gallerySync = {
  // Guardar cambios en "base de datos" simulada
  saveChanges: (imageData) => {
    const timestamp = Date.now();
    const syncData = {
      images: imageData,
      timestamp: timestamp,
      version: (parseInt(localStorage.getItem(`${SYNC_KEY}_version`) || '0') + 1)
    };
    
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncData));
    localStorage.setItem(`${SYNC_KEY}_version`, syncData.version.toString());
    localStorage.setItem(`${SYNC_KEY}_updated`, timestamp.toString());
    
    // Forzar recarga en otros tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: SYNC_KEY,
      newValue: JSON.stringify(syncData),
      oldValue: null,
      storageArea: localStorage,
      url: window.location.href
    }));
    
    return syncData;
  },

  // Cargar último cambio
  loadChanges: () => {
    try {
      const data = localStorage.getItem(SYNC_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Obtener versión actual
  getVersion: () => {
    return parseInt(localStorage.getItem(`${SYNC_KEY}_version`) || '0');
  },

  // Escuchar cambios
  onChange: (callback) => {
    const checkChanges = () => {
      const data = gallerySync.loadChanges();
      if (data) {
        callback(data);
      }
    };

    // Verificar al inicio
    checkChanges();

    // Verificar periódicamente
    const interval = setInterval(checkChanges, SYNC_INTERVAL);

    // Escuchar eventos de storage (otros tabs)
    const handleStorageChange = (event) => {
      if (event.key === SYNC_KEY && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          callback(data);
        } catch (error) {
          console.error('Error parsing sync data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Retornar función de limpieza
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};

export default gallerySync;
