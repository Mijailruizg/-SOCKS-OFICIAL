import React, { useState, useEffect } from 'react';
import { galleryImages as defaultGalleryImages } from '@/data/gallery';

const ModelGallerySection = () => {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);

  useEffect(() => {
    try {
      // Cargar imágenes desde localStorage si existen
      const storedImages = localStorage.getItem('gallery_images');
      if (storedImages) {
        const parsed = JSON.parse(storedImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const imagePaths = parsed.map(img => {
            const baseUrl = img.url || img;
            if (img.cacheBuster) {
              return `${baseUrl}?v=${img.cacheBuster}`;
            }
            return baseUrl;
          });
          setGalleryImages(imagePaths);
        }
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      setGalleryImages(defaultGalleryImages);
    }

    // Escuchar cambios desde otros tabs
    const handleStorageChange = (event) => {
      if (event.key === 'gallery_images' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const imagePaths = parsed.map(img => {
              const baseUrl = img.url || img;
              if (img.cacheBuster) {
                return `${baseUrl}?v=${img.cacheBuster}`;
              }
              return baseUrl;
            });
            setGalleryImages(imagePaths);
          }
        } catch (error) {
          console.error('Error parsing gallery:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
