// Servicio que sincroniza la galería usando localStorage + archivo JSON
// Los cambios se guardan en localStorage y se leen del archivo de configuración

import galleryConfig from '@/data/gallery-config.json';

const STORAGE_KEY = 'gallery_images_local';
const CONFIG_UPDATE_KEY = 'gallery_config_version';

export const galleryLocalSync = {
  // Cargar imágenes (primero desde localStorage si hay cambios recientes, sino del archivo)
  async loadChanges() {
    try {
      // Obtener última versión guardada localmente
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        return JSON.parse(localData);
      }
      
      // Si no hay datos locales, usar el archivo de configuración
      return {
        images: galleryConfig.images || [],
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error loading gallery:', error);
      return {
        images: galleryConfig.images || [],
        timestamp: Date.now()
      };
    }
  },

  // Guardar cambios en localStorage (se sincronizarán al hacer git push)
  async saveChanges(imageData) {
    try {
      const syncData = {
        images: imageData,
        timestamp: Date.now(),
        version: parseInt(localStorage.getItem(CONFIG_UPDATE_KEY) || '0') + 1
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncData));
      localStorage.setItem(CONFIG_UPDATE_KEY, syncData.version.toString());
      
      // Notificar a otros tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(syncData),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href
      }));

      return syncData;
    } catch (error) {
      console.error('Error saving gallery:', error);
      throw error;
    }
  },

  // Escuchar cambios en tiempo real
  onChange(callback) {
    // Cargar datos inicialmente
    this.loadChanges().then(data => {
      callback(data);
    });

    // Verificar cambios cada 1 segundo
    const checkInterval = setInterval(async () => {
      try {
        const data = await this.loadChanges();
        callback(data);
      } catch (error) {
        console.error('Error checking changes:', error);
      }
    }, 1000);

    // Escuchar cambios en localStorage desde otros tabs
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          callback(data);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Retornar función de limpieza
    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  },

  // Obtener datos para exportar/guardar en archivo
  getExportData(images) {
    return {
      images: images,
      exportedAt: new Date().toISOString()
    };
  },

  // Resetear a valores originales del archivo
  async resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONFIG_UPDATE_KEY);
    return {
      images: galleryConfig.images || [],
      timestamp: Date.now()
    };
  }
};

export default galleryLocalSync;
