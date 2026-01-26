import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ModelCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const hasMultipleImages = product.images && product.images.length > 1;
  
  // Efecto de cambio de imagen tipo gif al hacer hover
  useEffect(() => {
    if (!isHovering || !hasMultipleImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 1500); // Cambiar imagen cada 1.5 segundos
    
    return () => clearInterval(interval);
  }, [isHovering, hasMultipleImages, product.images]);
  
  // Resetear índice cuando se quita el hover
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
        <img
          src={hasMultipleImages ? product.images[currentImageIndex] : product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow"></div>
    </motion.div>
  );
};

export default ModelCard;
