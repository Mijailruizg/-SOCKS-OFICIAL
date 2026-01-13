import React from 'react';
import { galleryImages } from '@/data/gallery';

const ModelGallerySection = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 justify-center items-start py-6 flex-wrap">
          {galleryImages.map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={src} alt={`modelo-${i}`} className="max-h-[520px] w-auto object-contain block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelGallerySection;
