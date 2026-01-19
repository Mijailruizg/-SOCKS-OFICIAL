import React, { useState, useEffect } from 'react';
import { galleryImages as defaultGalleryImages } from '@/data/gallery';
import { syncManager } from '@/lib/syncManager';

const ModelGallerySection = () => {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);

  useEffect(() => {
    // Cargar imágenes desde localStorage (datos más recientes)
    const loadImages = () => {
      const storedImages = syncManager.load('gallery_images');
      if (storedImages.length > 0) {
        const imagePaths = storedImages.map(img => {
          // Agregar cache buster a URLs para forzar recarga
          const baseUrl = img.url || img;
          if (img.cacheBuster) {
            return syncManager.addCacheBuster(baseUrl, img.cacheBuster);
          }
          return baseUrl;
        });
        setGalleryImages(imagePaths);
      }
    };

    loadImages();

    // Escuchar cambios desde otros dispositivos/tabs
    const unsubscribe = syncManager.onSync('gallery_images', (updatedImages) => {
      const imagePaths = updatedImages.map(img => {
        const baseUrl = img.url || img;
        if (img.cacheBuster) {
          return syncManager.addCacheBuster(baseUrl, img.cacheBuster);
        }
        return baseUrl;
      });
      setGalleryImages(imagePaths);
    });

    return unsubscribe;
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 justify-center items-start py-6 flex-wrap">
          {galleryImages.map((src, i) => (
            <div key={`${src}-${i}`} className="rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={src} 
                alt={`modelo-${i}`} 
                className="max-h-[520px] w-auto object-contain block"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelGallerySection;
