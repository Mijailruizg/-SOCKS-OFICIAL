import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ImpactPage = () => {
  // Scroll al tope cuando se monta la página
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Usuario 1',
      comment: 'Comentario del usuario 1',
      image: '/path-to-image-1.jpg',
      delay: 0
    },
    {
      id: 2,
      name: 'Usuario 2',
      comment: 'Comentario del usuario 2',
      image: '/path-to-image-2.jpg',
      delay: 0.1
    },
    {
      id: 3,
      name: 'Usuario 3',
      comment: 'Comentario del usuario 3',
      image: '/path-to-image-3.jpg',
      delay: 0.2
    },
    {
      id: 4,
      name: 'Usuario 4',
      comment: 'Comentario del usuario 4',
      image: '/path-to-image-4.jpg',
      delay: 0.3
    },
    {
      id: 5,
      name: 'Usuario 5',
      comment: 'Comentario del usuario 5',
      image: '/path-to-image-5.jpg',
      delay: 0.4
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-black hover:text-gray-600 mb-8 font-semibold">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-black">
              NUESTRO IMPACTO
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Conoce a las personas detrás de SOCKS OFICIAL. Estos son nuestros usuarios y modelos compartiendo su experiencia con nuestros productos premium. Cada foto representa la calidad y comodidad que caracteriza a SOCKS OFICIAL.
            </p>
          </div>
        </div>

        {/* Testimonials Grid - Floating Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              custom={index}
              className="flex flex-col items-center"
            >
              {/* Foto grande arriba */}
              <div className="w-48 h-56 rounded-2xl overflow-hidden border-4 border-black shadow-2xl flex-shrink-0 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x250?text=Model';
                  }}
                />
              </div>

              {/* Nube de mensaje abajo */}
              <div className="bg-white rounded-3xl shadow-lg p-6 relative w-full border-2 border-black hover:shadow-2xl transition-all duration-300">
                {/* Cola de la nube */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-black rounded-full"></div>
                
                {/* Contenido */}
                <div className="text-center mt-2">
                  <h3 className="font-black text-lg text-black mb-2">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-700 italic leading-relaxed text-sm md:text-base">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactPage;
