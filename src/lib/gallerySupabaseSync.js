import { supabase } from '@/lib/supabase';

// Servicio real de Supabase para sincronización de galería entre dispositivos
// Si no hay credenciales, cae a localStorage

const TABLE_NAME = 'gallery_images';
const useSupabase = () => supabase?.auth !== undefined;

export const gallerySupabaseSync = {
  // Guardar imágenes en Supabase o localStorage
  async saveChanges(imageData) {
    try {
      if (!useSupabase()) {
        // Fallback a localStorage
        const syncData = {
          images: imageData,
          timestamp: Date.now(),
          version: parseInt(localStorage.getItem('gallery_version') || '0') + 1
        };
        localStorage.setItem('gallery_sync', JSON.stringify(syncData));
        localStorage.setItem('gallery_version', syncData.version.toString());
        return syncData;
      }

      // Usar Supabase
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert({
          id: 'main-gallery',
          images: imageData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.error('Error saving to Supabase:', error);
        // Fallback a localStorage si falla Supabase
        this.saveFallback(imageData);
        return { images: imageData, timestamp: Date.now() };
      }

      return { images: imageData, timestamp: Date.now() };
    } catch (error) {
      console.error('Error in saveChanges:', error);
      this.saveFallback(imageData);
      return { images: imageData, timestamp: Date.now() };
    }
  },

  // Guardar en localStorage como respaldo
  saveFallback(imageData) {
    const syncData = {
      images: imageData,
      timestamp: Date.now(),
      version: parseInt(localStorage.getItem('gallery_version') || '0') + 1
    };
    localStorage.setItem('gallery_sync', JSON.stringify(syncData));
    localStorage.setItem('gallery_version', syncData.version.toString());
  },

  // Cargar imágenes de Supabase o localStorage
  async loadChanges() {
    try {
      if (!useSupabase()) {
        // Cargar desde localStorage
        const data = localStorage.getItem('gallery_sync');
        return data ? JSON.parse(data) : null;
      }

      // Cargar desde Supabase
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', 'main-gallery')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading from Supabase:', error);
        return this.loadFromLocalStorage();
      }

      if (data) {
        return {
          images: data.images,
          timestamp: new Date(data.updated_at).getTime()
        };
      }

      return this.loadFromLocalStorage();
    } catch (error) {
      console.error('Error in loadChanges:', error);
      return this.loadFromLocalStorage();
    }
  },

  // Cargar desde localStorage
  loadFromLocalStorage() {
    const data = localStorage.getItem('gallery_sync');
    return data ? JSON.parse(data) : null;
  },

  // Escuchar cambios en tiempo real
  onChange(callback) {
    let lastVersion = parseInt(localStorage.getItem('gallery_version') || '0');

    // Verificar cambios periódicamente
    const checkInterval = setInterval(async () => {
      try {
        const syncData = await this.loadChanges();
        if (syncData && syncData.images) {
          callback(syncData);
        }
      } catch (error) {
        console.error('Error checking changes:', error);
      }
    }, 2000); // Verificar cada 2 segundos

    // Escuchar cambios en localStorage (otros tabs)
    const handleStorageChange = (event) => {
      if (event.key === 'gallery_sync' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data) {
            callback(data);
          }
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Suscribirse a cambios en Supabase si está disponible
    let subscription = null;
    if (useSupabase()) {
      try {
        subscription = supabase
          .channel('gallery_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: TABLE_NAME,
              filter: `id=eq.main-gallery`
            },
            (payload) => {
              if (payload.new) {
                callback({
                  images: payload.new.images,
                  timestamp: new Date(payload.new.updated_at).getTime()
                });
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error subscribing to Supabase:', error);
      }
    }

    // Retornar función de limpieza
    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('storage', handleStorageChange);
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }
};

export default gallerySupabaseSync;
