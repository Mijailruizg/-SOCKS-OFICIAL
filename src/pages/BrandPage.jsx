import React from 'react';
import { motion } from 'framer-motion';

const BrandPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1591534338072-e9e0eff05006" className="w-full h-full object-cover grayscale opacity-20" />
          </div>
          <div className="relative z-10 text-center max-w-2xl px-4">
              <h1 className="text-5xl font-black mb-6">BUILT FOR SPEED</h1>
              <p className="text-xl text-gray-600">The SOCKS OFICIAL story begins on the track and ends on the podium.</p>
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="prose prose-lg mx-auto">
              <h2>Our Mission</h2>
              <p>
                  To provide athletes with the foundation they need to excel. We believe that great performance starts from the ground up.
              </p>
              
              <h2>Sustainability</h2>
              <p>
                  We are committed to reducing our footprint. Our packaging is 100% biodegradable, and our merino wool is ethically sourced.
              </p>
          </div>
      </div>
    </div>
  );
};

export default BrandPage;