import React, { useState, useEffect } from 'react';
import { galleryImages as defaultGalleryImages } from '@/data/gallery';

const ModelGallerySection = () => {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) throw new Error('Error fetching gallery');
        
        const data = await response.json();
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          const imagePaths = data.images.map(img => img.image || img);
          setGalleryImages(imagePaths);
        } else {
          setGalleryImages(defaultGalleryImages);
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
        setGalleryImages(defaultGalleryImages);
      }
    };

    // Cargar inicial
    loadImages();

    // Verificar cambios cada 2 segundos
    const pollInterval = setInterval(loadImages, 2000);

    return () => clearInterval(pollInterval);
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
