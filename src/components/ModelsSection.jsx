import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ModelsSection = () => {
  const [models, setModels] = useState([
    { 
      id: '1', 
      image: '/galeria/2.jpeg',
      name: 'SOCKS OFICIAL 1',
      rating: 4.8,
      reviews: 256,
      price: 30.00
    },
    { 
      id: '2', 
      image: '/galeria/model.jpeg',
      name: 'SOCKS OFICIAL 2',
      rating: 4.7,
      reviews: 198,
      price: 30.00
    },
    { 
      id: '3', 
      image: '/galeria/5.jpeg',
      name: 'SOCKS OFICIAL 3',
      rating: 4.6,
      reviews: 142,
      price: 30.00
    },
    { 
      id: '4', 
      image: '/galeria/3.jpeg',
      name: 'SOCKS OFICIAL 4',
      rating: 4.9,
      reviews: 187,
      price: 30.00
    }
  ]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const apiUrl = `http://${window.location.hostname}:3000/api/gallery?t=${Date.now()}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error fetching gallery');
        
        const data = await response.json();
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          const updatedModels = data.images.map((img, index) => ({
            id: (index + 1).toString(),
            image: img.image || '/galeria/2.jpeg',
            name: img.name || `SOCKS OFICIAL ${index + 1}`,
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(100 + Math.random() * 200),
            price: 30.00
          }));
          setModels(updatedModels);
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
      }
    };

    // Cargar inicial
    loadImages();

    // Verificar cambios cada 3 segundos
    const pollInterval = setInterval(loadImages, 3000);

    return () => clearInterval(pollInterval);
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
                  src={model.image}
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
