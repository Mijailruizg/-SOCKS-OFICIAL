import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice } from '@/lib/utils';

const IMPACTO_IMAGES = [
  '/galeria/IMPACTO SOCIAL/imagen1.jpeg',
  '/galeria/IMPACTO SOCIAL/imagen 3.jpeg',
  '/galeria/IMPACTO SOCIAL/imagen 2.jpeg'
];

const CauseSection = () => {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [impactoData, setImpactoData] = useState({
    heading: 'Our Commitment',
    subheading: 'to Athletes',
    description: 'At SOCKS OFICIAL, our commitment is clear: support athletes who give their best every day. Because when you commit to your sport, we commit to you',
    donated: '1.5K+',
    donatedLabel: 'PARES DONADOS',
    communities: '20+',
    communitiesLabel: 'COMUNIDADES',
    image: '/galeria/IMPACTO SOCIAL/imagen1.jpeg'
  });

  // Cambiar imagen cada 1.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % IMPACTO_IMAGES.length;
        console.log('Cambiando a imagen', next, ':', IMPACTO_IMAGES[next]);
        return next;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('impacto_data');
    if (storedData) {
      try {
        setImpactoData(JSON.parse(storedData));
      } catch (err) {
        console.error('Error loading impacto data:', err);
      }
    }
  }, []);

  const handleLearnMore = () => {
    toast({
      title: '🚧 Coming Soon',
      description: 'Our detailed impact report will be available next month.',
    });
  };

  return (
    <section className="py-20 px-4 bg-gray-50 text-black overflow-hidden relative border-y border-gray-100">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-bold mb-6">
                <Heart className="w-3 h-3" /> IMPACTO SOCIAL
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none text-black">
              {impactoData.heading} <br />
              <span className="text-gray-500">{impactoData.subheading}</span>
            </h2>
            
            <p className="text-xl mb-8 text-gray-600 font-light leading-relaxed">
              {impactoData.description}
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-8 mb-10 border-t border-gray-200 pt-8">
              <div>
                <div className="text-4xl font-black text-black mb-1">{impactoData.donated}</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider">{impactoData.donatedLabel}</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black mb-1">{impactoData.raised}</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider">{impactoData.raisedLabel}</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black mb-1">{impactoData.communities}</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider">{impactoData.communitiesLabel}</div>
              </div>
            </div>

            <Button
              onClick={handleLearnMore}
              size="lg"
              className="bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black font-bold px-8 rounded-full"
            >
              VER NUESTRO IMPACTO <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
          
           {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <motion.img
                src={IMPACTO_IMAGES[currentImageIndex]}
                alt="Community Impact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  console.error('Error loading image:', e.target.src);
                  e.target.src = IMPACTO_IMAGES[0];
                }}
                />
                <div className="absolute bottom-8 left-8 z-20 max-w-xs">
                    <p className="text-white font-bold text-base italic drop-shadow-md" style={{ fontSize: '16px' }}>XPLOSIVE CLUB PERÚ</p>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CauseSection;