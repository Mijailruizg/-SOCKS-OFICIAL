import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice } from '@/lib/utils';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const hasMultipleImages = product.images && product.images.length > 1;
  
  // Efecto de cambio de imagen tipo gif al hacer hover
  useEffect(() => {
    if (!isHovering || !hasMultipleImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 500); // Cambiar imagen cada 500ms
    
    return () => clearInterval(interval);
  }, [isHovering, hasMultipleImages, product.images]);
  
  // Resetear índice cuando se quita el hover
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast({ title: "Added to wishlist!", description: "Save your favorites for later." });
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="block h-full"
      onClick={() => {
        try {
          const stored = JSON.parse(sessionStorage.getItem('shop_state') || '{}');
          stored.scrollY = window.scrollY || 0;
          stored.lastClickedProductId = product.id;
          sessionStorage.setItem('shop_state', JSON.stringify(stored));
        } catch (err) {}
      }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={handleMouseLeave}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest uppercase border border-black">
              Nuevo
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest uppercase border border-black">
              Oferta
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white hover:bg-black hover:text-white text-black transition-colors shadow-sm border border-gray-200"
        >
            <Heart className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
          <img
            src={hasMultipleImages ? product.images[currentImageIndex] : product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{product.category.replace('-', ' ')}</span>
              <h3 className="text-lg font-bold text-black group-hover:underline transition-all line-clamp-1">
                {product.name}
              </h3>
          </div>

          <div className="flex items-center gap-1 mb-4">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            <span className="text-sm font-medium text-black">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-xl font-bold text-black">
                {formatPrice(product.sale_price || product.price)}
              </span>
            </div>
            
            <Button
                onClick={handleAddToCart}
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black transition-colors"
            >
                <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;