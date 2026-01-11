import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice } from '@/lib/utils';

const CauseSection = () => {
  const { toast } = useToast();

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
              CORRE POR <br />
              <span className="text-gray-500">EL BIEN</span>
            </h2>
            
            <p className="text-xl mb-8 text-gray-600 font-light leading-relaxed">
              Creemos que cada paso cuenta. Por eso el 5% de cada compra se destina directamente a programas deportivos juveniles en comunidades necesitadas.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-8 mb-10 border-t border-gray-200 pt-8">
              <div>
                <div className="text-4xl font-black text-black mb-1">50K+</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider">PARES DONADOS</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black mb-1">{formatPrice(120000)}</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider">RECAUDADO</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black mb-1">20+</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider">COMUNIDADES</div>
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 grayscale">
                <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c"
                alt="Community Impact"
                className="w-full h-[600px] object-cover"
                />
                <div className="absolute bottom-8 left-8 z-20 max-w-xs">
                    <p className="text-white font-bold text-lg italic drop-shadow-md">"Sport has the power to change the world."</p>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CauseSection;