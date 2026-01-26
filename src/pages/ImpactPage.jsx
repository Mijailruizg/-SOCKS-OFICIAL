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
      name: 'Kraken',
      comment: 'Excelentes, cómodos y comprimen bien la piel para evitar resistencia al viento, me gusta el material y la longitud.',
      image: '/galeria/comentarios/comentario1.jpeg',
      delay: 0
    },
    {
      id: 2,
      name: 'Jean Carlos',
      comment: 'Las medias han sido de mi agrado. La primera vez que las probé se sienten cómodas al tacto. Las recomiendo.',
      image: '/galeria/comentarios/comentario2.jpeg',
      delay: 0.1
    },
    {
      id: 3,
      name: 'Lisbeth Barnett',
      comment: 'Con los calcetines de SOCKS OFICIAL para ciclismo he sentido el ajuste perfecto, alta transpirabilidad y gran comodidad incluso en rutas largas, ayudan mucho que no haya fricción considerando que las zapatillas de ciclismo son rígidas y también ofrecen un diseño personalizado para ciclistas que buscan rendimiento y estilo en cada pedaleo.',
      image: '/galeria/comentarios/comentario3.jpeg',
      delay: 0.2
    },
    {
      id: 4,
      name: 'Ricardo Vidal (Aquiles)',
      comment: 'Excelentes medias de ciclismo. Muy cómodas, con buena ventilación y además se puede personalizar los diseños para que combine con tu outfit de ciclismo.\nSe nota que están hechas por y para ciclistas. Socks Oficial ya es mi marca de confianza para los pies y varios grupos de ciclismo las están usando. Y tú qué esperas para usar socks oficial?',
      image: '/galeria/comentarios/comentario4.jpeg',
      delay: 0.3
    },
    {
      id: 5,
      name: 'Leonardo',
      comment: 'Las medias de Socks Oficial, dan mucho confort, buen diseño, frescas y ligeras. Las llevo en todas mis rutas.',
      image: '/galeria/comentarios/comentario5.jpeg',
      delay: 0.4
    },
    {
      id: 6,
      name: 'Rocio Denisse',
      comment: 'Tienen un excelente material son muy buenas para rutas largas o cuando vas a rutas que hacen demasiado frio las medias te ayudan a comprimir excelente calidad.',
      image: '/galeria/comentarios/comentario6.jpeg',
      delay: 0.5
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
