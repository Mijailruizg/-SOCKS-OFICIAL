import React from 'react';
import { motion } from 'framer-motion';
import ModelCard from './ModelCard';

const CustomizedModelsSection = ({ title = 'CUSTOMIZED SOCKS', models = [] }) => {
  if (!models || models.length === 0) return null;

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4 tracking-tight">{title}</h2>
          <div className="w-16 h-1 bg-black mx-auto"></div>
        </motion.div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ModelCard product={model} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomizedModelsSection;
