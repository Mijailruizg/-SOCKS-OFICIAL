/**
 * Gallery Synchronization Helper
 * Centraliza todas las llamadas a la API de galería
 */

const API_BASE_URL = () => `http://${window.location.hostname}:3000/api/gallery`;
const CACHE_BUSTER = () => `?t=${Date.now()}`;

export const gallerySync = {
  /**
   * Obtener la galería actual
   */
  fetchGallery: async () => {
    try {
      const url = `${API_BASE_URL()}${CACHE_BUSTER()}`;
      console.log('📥 [Gallery Sync] GET:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ [Gallery Sync] Recibidas ${data.images.length} imágenes`);
      return data;
    } catch (error) {
      console.error('❌ [Gallery Sync] Error fetching:', error);
      throw error;
    }
  },

  /**
   * Actualizar la galería (agregar, editar o eliminar imágenes)
   */
  updateGallery: async (images) => {
    try {
      const url = `${API_BASE_URL()}${CACHE_BUSTER()}`;
      console.log('📤 [Gallery Sync] POST:', url);
      console.log(`📦 [Gallery Sync] Enviando ${images.length} imágenes`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ [Gallery Sync] Actualización exitosa: ${images.length} imágenes`);
      return data;
    } catch (error) {
      console.error('❌ [Gallery Sync] Error updating:', error);
      throw error;
    }
  },

  /**
   * Setup polling para sincronización en tiempo real
   * @param {function} callback - Función a ejecutar cuando cambia la galería
   * @param {number} interval - Intervalo en ms (default 3000)
   */
  setupPolling: (callback, interval = 3000) => {
    let lastUpdate = null;

    const poll = async () => {
      try {
        const data = await gallerySync.fetchGallery();
        const currentUpdate = JSON.stringify(data.images);
        
        if (lastUpdate !== currentUpdate) {
          console.log('🔄 [Gallery Sync] Cambios detectados - actualizando');
          lastUpdate = currentUpdate;
          callback(data);
        }
      } catch (error) {
        console.error('❌ [Gallery Sync] Poll error:', error);
      }
    };

    // Ejecutar inmediatamente
    poll();

    // Luego ejecutar cada intervalo
    return setInterval(poll, interval);
  },

  // Métodos heredados por compatibilidad
  saveChanges: async (imageData) => {
    return gallerySync.updateGallery(imageData);
  },

  loadChanges: async () => {
    const data = await gallerySync.fetchGallery();
    return data;
  },

  getVersion: () => {
    return Date.now();
  },

  onChange: (callback) => {
    return gallerySync.setupPolling(callback, 3000);
  }
};

export default gallerySync;
