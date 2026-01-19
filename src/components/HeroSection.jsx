import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  // Usar la imagen específica en public/galeria
  const bgImage = '/galeria/521320355_18072665359996750_586440822232935836_n.jpg';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1637666639858-e914177a9146'; }}
          alt="Fondo superior"
          className="w-full h-full object-cover object-center opacity-80"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-black bg-white rounded-full"
          >
            NEW COLLECTION 2026
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-xl"
          >
            ELEVATE <br />
            <span className="text-white/80">
              YOUR STRIDE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed font-light"
          >
            Engineered for peak performance. Designed for ultimate comfort. 
            Discover the socks that change the game.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/shop"
              onClick={() => {
                try {
                  const s = JSON.parse(sessionStorage.getItem('shop_state') || '{}');
                  s.scrollY = 0;
                  sessionStorage.setItem('shop_state', JSON.stringify(s));
                } catch (err) {
                  sessionStorage.setItem('shop_state', JSON.stringify({ scrollY: 0 }));
                }
              }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 rounded-full text-lg transition-all hover:scale-105"
              >
                SHOP NOW
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;