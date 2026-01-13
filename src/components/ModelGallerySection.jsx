import React from 'react';
import { galleryImages } from '@/data/gallery';

const ModelGallerySection = ({ title = 'Modelos' }) => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">{title}</h2>
            <div className="h-1 w-20 bg-black mt-2 rounded-full"></div>
          </div>
        </div>

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
