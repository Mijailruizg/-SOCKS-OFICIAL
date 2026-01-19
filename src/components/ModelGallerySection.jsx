import React, { useState, useEffect } from 'react';
import { galleryImages as defaultGalleryImages } from '@/data/gallery';
import { galleryLocalSync } from '@/lib/galleryLocalSync';

const ModelGallerySection = () => {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);

  useEffect(() => {
    try {
      // Cargar imágenes inicialmente
      const loadInitial = async () => {
        const syncData = await galleryLocalSync.loadChanges();
        if (syncData && syncData.images && syncData.images.length > 0) {
          const imagePaths = syncData.images.map(img => {
            const baseUrl = img.url || img;
            if (img.cacheBuster) {
              return `${baseUrl}?v=${img.cacheBuster}`;
            }
            return baseUrl;
          });
          setGalleryImages(imagePaths);
        }
      };

      loadInitial();

      // Escuchar cambios en tiempo real
      const unsubscribe = galleryLocalSync.onChange((syncData) => {
        if (syncData && syncData.images && syncData.images.length > 0) {
          const imagePaths = syncData.images.map(img => {
            const baseUrl = img.url || img;
            if (img.cacheBuster) {
              return `${baseUrl}?v=${img.cacheBuster}`;
            }
            return baseUrl;
          });
          setGalleryImages(imagePaths);
        } else {
          setGalleryImages(defaultGalleryImages);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error in ModelGallerySection:', error);
      setGalleryImages(defaultGalleryImages);
    }
  }, []);

  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 justify-center items-start py-6 flex-wrap">
          {galleryImages.map((src, i) => (
            <div key={`img-${i}`} className="rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
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
