// Servicio de galería que sincroniza con el servidor
// Los cambios se guardan en el servidor y se sincronizan entre todos los dispositivos

const API_BASE = process.env.VITE_API_URL || window.location.origin;
const GALLERY_ENDPOINT = `${API_BASE}/api/gallery`;

export const galleryServerSync = {
  // Cargar galería desde el servidor
  async loadChanges() {
    try {
      const response = await fetch(GALLERY_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return {
        images: data.images || [],
        timestamp: new Date(data.updatedAt).getTime() || Date.now()
      };
    } catch (error) {
      console.error('Error loading gallery from server:', error);
      // Fallback a localStorage
      try {
        const local = localStorage.getItem('gallery_images_local');
        if (local) {
          return JSON.parse(local);
        }
      } catch (e) {
        console.error('Fallback error:', e);
      }
      return { images: [], timestamp: Date.now() };
    }
  },

  // Guardar cambios en el servidor
  async saveChanges(imageData) {
    try {
      const response = await fetch(GALLERY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ images: imageData })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        images: data.gallery.images,
        timestamp: new Date(data.gallery.updatedAt).getTime()
      };
    } catch (error) {
      console.error('Error saving gallery to server:', error);
      // Fallback a localStorage
      const syncData = {
        images: imageData,
        timestamp: Date.now()
      };
      localStorage.setItem('gallery_images_local', JSON.stringify(syncData));
      return syncData;
    }
  },

  // Escuchar cambios en tiempo real (polling)
  onChange(callback) {
    // Cargar inicial
    this.loadChanges().then(data => {
      callback(data);
    });

    // Verificar cada 1 segundo
    const pollInterval = setInterval(async () => {
      try {
        const data = await this.loadChanges();
        callback(data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 1000);

    // Escuchar cambios en localStorage (entre tabs)
    const handleStorageChange = (event) => {
      if (event.key === 'gallery_images_local' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          callback(data);
        } catch (error) {
          console.error('Storage event error:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Retornar función de limpieza
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};

export default galleryServerSync;
