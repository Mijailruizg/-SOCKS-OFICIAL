import React from 'react';
import { motion } from 'framer-motion';
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

        <div className="flex gap-4 overflow-x-auto py-4 snap-x snap-mandatory items-start">
          {galleryImages.map((src, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex-none rounded-2xl overflow-hidden bg-gray-100 snap-center"
            >
              <img src={src} alt={`modelo-${i}`} className="h-[600px] w-auto object-contain block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelGallerySection;
