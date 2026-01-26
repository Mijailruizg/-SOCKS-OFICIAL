import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { api } from '@/lib/api';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState('newest');
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'running', 'hybrid', 'winter', 'golf'];

  // Scroll to top when page loads or category changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    });
  }, [searchParams.get('category')]);

  // Load products from API once on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await api.getProducts();
      if (!mounted) return;
      setAllProducts(data);
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Restore filters + scroll position from sessionStorage if available
  useEffect(() => {
    const stored = sessionStorage.getItem('shop_state');
    if (stored) {
      try {
        const s = JSON.parse(stored);
        if (s.selectedCategory) setSelectedCategory(s.selectedCategory);
        if (s.priceRange) setPriceRange(s.priceRange);
        if (s.sortBy) setSortBy(s.sortBy);
        if (typeof s.showNewArrivals === 'boolean') setShowNewArrivals(s.showNewArrivals);
        // Delay scrolling until after render
        setTimeout(() => {
          if (s.scrollY) window.scrollTo(0, s.scrollY);
        }, 50);
      } catch (err) {
        console.error('Error parsing shop_state', err);
      }
    }
  }, []);

  // Whenever filters or allProducts change, compute filtered products
  useEffect(() => {
    const paramCategory = searchParams.get('category');
    if (paramCategory === 'new-arrivals') {
      setShowNewArrivals(true);
      setSelectedCategory('all');
      setSortBy('newest');
    } else if (paramCategory) {
      setShowNewArrivals(false);
      setSelectedCategory(paramCategory);
    } else {
      setShowNewArrivals(false);
    }

    // Compute filtered products
    const filterProducts = () => {
      setLoading(true);
      let filtered = [...allProducts];

      // Excluir categorías que no son productos reales
      filtered = filtered.filter(p => 
        p.category !== 'new-arrivals' && p.category !== 'customized-socks' && p.category !== 'winter' && p.id !== '10'
      );

      // Category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }

      // Price filter
      filtered = filtered.filter(p => {
        const price = p.sale_price || p.price;
        return price >= priceRange[0] && price <= priceRange[1];
      });

      // Search filter
      const search = searchParams.get('search');
      if (search) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // If showing new arrivals (via ?category=new-arrivals), filter only new products
      if (showNewArrivals) {
        filtered = filtered.filter(p => p.is_new);
      }

      // Sort
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      setProducts(filtered);
      setLoading(false);

      // Persist current filters and (latest) scroll position to sessionStorage
      try {
        const state = {
          selectedCategory,
          priceRange,
          sortBy,
          showNewArrivals,
          scrollY: window?.scrollY || 0,
        };
        sessionStorage.setItem('shop_state', JSON.stringify(state));
      } catch (err) {
        console.error('Could not save shop_state', err);
      }
    };

    filterProducts();
  }, [selectedCategory, priceRange, sortBy, searchParams, showNewArrivals, allProducts]);

  // Save scroll position on scroll (debounced)
  useEffect(() => {
    let timeout = null;
    const onScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          const stored = JSON.parse(sessionStorage.getItem('shop_state') || '{}');
          stored.scrollY = window.scrollY || 0;
          sessionStorage.setItem('shop_state', JSON.stringify(stored));
        } catch (err) {}
      }, 150);
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Shop - SOCKSPORT</title>
        <meta name="description" content="Browse our complete collection of premium athletic socks" />
      </Helmet>

      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
              Shop - All Products
            </h1>
            <p className="text-sm text-black/70">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
                  <Filter className="w-5 h-5 text-black" />
                  Filters
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-black">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 text-black focus:ring-black"
                        />
                        <span className="ml-2 text-black lowercase">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-black">Price Range</h4>
                  <Slider
                    min={0}
                    max={50}
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-black/70">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="font-medium mb-3 text-black">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
