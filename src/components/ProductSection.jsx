import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const ProductSection = ({ title, category, className = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState(title);

  useEffect(() => {
    // Cargar título dinámicamente desde localStorage
    const sections = JSON.parse(localStorage.getItem('content_sections') || '[]');
    const section = sections.find(s => s.category === category);
    if (section && section.title) {
      setSectionTitle(section.title);
    }
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await api.getProducts();
        // Filter by category
        const filtered = all.filter(p => p.category === category).slice(0, 4);
        setProducts(filtered);
      } catch (e) {
        console.error("Failed to load products", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <section className={`py-16 px-4 md:px-8 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
              <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
                {sectionTitle}
              </h2>
              <div className="h-1 w-20 bg-black mt-2 rounded-full"></div>
          </div>
          <Link
            to={`/shop?category=${category}`}
            className="group flex items-center gap-1 text-sm font-bold text-black hover:underline transition-all"
          >
            VIEW ALL
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;