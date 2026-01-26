import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import CauseSection from '@/components/CauseSection';
import ModelsSection from '@/components/ModelsSection';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SOCKS OFICIAL | Elevate Your Stride</title>
        <meta name="description" content="Premium athletic socks for running, golf, and winter sports." />
      </Helmet>

      <main className="bg-gray-50 overflow-hidden">
        <HeroSection />

        {/* Galería de modelos en lugar de New Arrivals */}
        <ModelsSection />

        <ProductSection 
          title="PRODUCTS" 
          category="hybrid"
          className="bg-gray-50"
        />

        <CauseSection />

        {/* New Arrivals movido más abajo */}
        <ProductSection 
          title="New Arrivals" 
          category="new-arrivals"
          className="bg-white"
        />

        <ProductSection 
          title="Sub 0 Winter Merino" 
          category="winter"
          className="bg-white"
        />

        <ProductSection 
          title="TERRY SOCKS ESSENTIALS" 
          category="terry-socks"
          className="bg-gray-50"
        />

        {/* Simple Newsletter Section */}
        <section 
          className="py-80 px-4 bg-black text-white text-center relative bg-cover bg-center"
          style={{
            backgroundImage: 'url(/galeria/cafe.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlend: 'darken'
          }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
        </section>
      </main>
    </>
  );
};

export default HomePage;