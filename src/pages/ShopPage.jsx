import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Sample products (in production, fetch from Supabase)
const allProducts = [
  {
    id: 1,
    name: 'Elite Running Socks Pro',
    description: 'Premium moisture-wicking running socks',
    price: 29.99,
    sale_price: 24.99,
    category: 'running',
    image_url: 'https://images.unsplash.com/photo-1587906443886-5f607ca9640c',
    rating: 4.8,
    stock: 45,
    is_new: true,
    reviews: 128
  },
  {
    id: 2,
    name: 'Marathon Compression Socks',
    description: 'Advanced compression for endurance',
    price: 34.99,
    sale_price: null,
    category: 'running',
    image_url: 'https://images.unsplash.com/photo-1525494337628-3341b4e3bf01',
    rating: 4.9,
    stock: 32,
    is_new: true,
    reviews: 95
  },
  {
    id: 5,
    name: 'Hybrid Sport Socks',
    description: 'Perfect for any activity',
    price: 26.99,
    sale_price: 21.99,
    category: 'hybrid',
    image_url: 'https://images.unsplash.com/photo-1661012004430-7ab4c7c4b926',
    rating: 4.6,
    stock: 52,
    is_new: false,
    reviews: 203
  },
  {
    id: 9,
    name: 'Merino Wool Winter Socks',
    description: 'Ultra-warm merino blend',
    price: 39.99,
    sale_price: 32.99,
    category: 'winter',
    image_url: 'https://images.unsplash.com/photo-1671794621043-1916a8d7a261',
    rating: 4.9,
    stock: 25,
    is_new: false,
    reviews: 245
  },
  {
    id: 13,
    name: 'Pro Golf Performance Socks',
    description: 'Tour-level comfort',
    price: 32.99,
    sale_price: 27.99,
    category: 'golf',
    image_url: 'https://images.unsplash.com/photo-1677174502880-39cadc0e4fdf',
    rating: 4.8,
    stock: 38,
    is_new: false,
    reviews: 156
  },
  {
    id: 3,
    name: 'Speed Performance Socks',
    description: 'Lightweight and breathable',
    price: 27.99,
    sale_price: 22.99,
    category: 'running',
    image_url: 'https://images.unsplash.com/photo-1587906443886-5f607ca9640c',
    rating: 4.7,
    stock: 3,
    is_new: true,
    reviews: 156
  },
  {
    id: 6,
    name: 'All-Day Comfort Hybrid',
    description: 'From gym to street',
    price: 28.99,
    sale_price: null,
    category: 'hybrid',
    image_url: 'https://images.unsplash.com/photo-1484071096222-7936a931e094',
    rating: 4.7,
    stock: 41,
    is_new: false,
    reviews: 174
  },
  {
    id: 10,
    name: 'Arctic Performance Socks',
    description: 'Extreme cold weather protection',
    price: 44.99,
    sale_price: null,
    category: 'winter',
    image_url: 'https://images.unsplash.com/photo-1616181579861-f73387e6c702',
    rating: 4.8,
    stock: 18,
    is_new: false,
    reviews: 167
  }
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(allProducts);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState('newest');
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'running', 'hybrid', 'winter', 'golf'];

  useEffect(() => {
    // Detect URL category param. If 'new-arrivals', enable new-arrivals filter.
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

    filterProducts();
  }, [selectedCategory, priceRange, sortBy, searchParams, showNewArrivals]);

  const filterProducts = () => {
    setLoading(true);
    let filtered = [...allProducts];

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
  };

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
              Tienda - Todos los productos
            </h1>
            <p className="text-sm text-black/70">
              Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
                  <Filter className="w-5 h-5 text-black" />
                  Filtros
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-black">Categoría</h4>
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
                  <h4 className="font-medium mb-3 text-black">Rango de precios</h4>
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
                  <h4 className="font-medium mb-3 text-black">Ordenar por</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none"
                  >
                    <option value="newest">Novedades</option>
                    <option value="price-low">Precio: menor a mayor</option>
                    <option value="price-high">Precio: mayor a menor</option>
                    <option value="rating">Mejor valorados</option>
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
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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