import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { galleryLocalSync } from '@/lib/galleryLocalSync';

const ModelsSection = () => {
  const [models, setModels] = useState([
    { 
      id: '1', 
      url: '/galeria/2.jpeg',
      name: 'SOCKS OFICIAL 1',
      rating: 4.8,
      reviews: 256,
      price: 30.00
    },
    { 
      id: '2', 
      url: '/galeria/4.jpeg',
      name: 'SOCKS OFICIAL 2',
      rating: 4.7,
      reviews: 198,
      price: 30.00
    },
    { 
      id: '3', 
      url: '/galeria/5.jpeg',
      name: 'SOCKS OFICIAL 3',
      rating: 4.6,
      reviews: 142,
      price: 30.00
    },
    { 
      id: '4', 
      url: '/galeria/3.jpeg',
      name: 'SOCKS OFICIAL 4',
      rating: 4.9,
      reviews: 187,
      price: 30.00
    }
  ]);

  useEffect(() => {
    try {
      // Cargar imágenes inicialmente
      const loadInitial = async () => {
        const syncData = await galleryLocalSync.loadChanges();
        if (syncData && syncData.images && syncData.images.length > 0) {
          const updatedModels = syncData.images.map((img, index) => ({
            id: (index + 1).toString(),
            url: img.url || img,
            name: `SOCKS OFICIAL ${index + 1}`,
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(100 + Math.random() * 200),
            price: 30.00
          }));
          setModels(updatedModels);
        }
      };

      loadInitial();

      // Escuchar cambios en tiempo real
      const unsubscribe = galleryLocalSync.onChange((syncData) => {
        if (syncData && syncData.images && syncData.images.length > 0) {
          const updatedModels = syncData.images.map((img, index) => ({
            id: (index + 1).toString(),
            url: img.url || img,
            name: `SOCKS OFICIAL ${index + 1}`,
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(100 + Math.random() * 200),
            price: 30.00
          }));
          setModels(updatedModels);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error in ModelsSection useEffect:', error);
    }
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header con VIEW ALL */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
        
          </h2>

        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="group cursor-pointer"
            >
              {/* Imagen */}
              <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-[3/5] rounded-3xl">
                <img
                  src={model.url}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=Modelo';
                  }}
                />
              </div>

              {/* Info del producto */}
              <div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelsSection;
