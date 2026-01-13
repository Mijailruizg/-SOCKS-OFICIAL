import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import CauseSection from '@/components/CauseSection';
import ModelGallerySection from '@/components/ModelGallerySection';

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
        <ModelGallerySection />

        <ProductSection 
          title="Hybrid Collection" 
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
          title="Pro Golf Socks" 
          category="golf"
          className="bg-gray-50"
        />

        {/* Simple Newsletter Section */}
        <section className="py-20 px-4 bg-black text-white text-center">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">JOIN THE SQUAD</h2>
                <p className="text-gray-400 mb-8">Sign up for exclusive drops, early access to sales, and pro tips.</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    <button type="submit" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">SUSCRIBIRSE</button>
                </form>
            </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;