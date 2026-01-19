import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ModelsSection = () => {
  const [models, setModels] = useState([
    { 
      id: '1', 
      url: 'public/galeria/2.jpeg',
      name: 'SOCKS OFICIAL 1',
      rating: 4.8,
      reviews: 256,
      price: 30.00
    },
    { 
      id: '2', 
      url: 'public/galeria/4.jpeg',
      name: 'SOCKS OFICIAL 2',
      rating: 4.7,
      reviews: 198,
      price: 30.00
    },
    { 
      id: '3', 
      url: 'public/galeria/5.jpeg',
      name: 'SOCKS OFICIAL 3',
      rating: 4.6,
      reviews: 142,
      price: 30.00
    },
    { 
      id: '4', 
      url: 'public/galeria/3.jpeg',
      name: 'SOCKS OFICIAL 4',
      rating: 4.9,
      reviews: 187,
      price: 30.00
    }
  ]);

  useEffect(() => {
    const storedModels = localStorage.getItem('model_images');
    if (storedModels) {
      try {
        const parsed = JSON.parse(storedModels);
        if (parsed && parsed.length > 0) {
          setModels(parsed);
        }
      } catch (e) {
        console.error('Error parsing models:', e);
      }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition">
                  {model.name}
                </h2>

                {/* Precio */}
                <p className="text-xl font-bold text-gray-900 mt-3">
                  
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelsSection;
