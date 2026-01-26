import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Load product via API (respects admin edits in localStorage)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const p = await api.getProductById(id);
      if (mounted && p) {
        setProduct(p);
        if (p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
        if (p.colors && p.colors.length > 0) setSelectedColor(p.colors[0]);
        window.scrollTo(0, 0);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const relatedProducts = [
    {
      id: 6,
      name: 'SOCKS OFICIAL 1',
      price: 30.00,
      sale_price: null,
      category: 'hybrid',
      image_url: '/galeria/producto 1/1.jpeg',
      rating: 4.8,
      stock: 45,
      reviews: 256,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 7,
      name: 'SOCKS OFICIAL 2',
      price: 30.00,
      sale_price: null,
      category: 'hybrid',
      image_url: '/galeria/producto 1/2.jpeg',
      rating: 4.7,
      stock: 38,
      reviews: 198,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 8,
      name: 'SOCKS OFICIAL 3',
      price: 30.00,
      sale_price: null,
      category: 'hybrid',
      image_url: '/galeria/producto 1/3.jpeg',
      rating: 4.6,
      stock: 42,
      reviews: 142,
      sizes: ['S', 'M', 'L', 'XL']
    }
  ];

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, size: selectedSize, color: selectedColor }, quantity);
    }
  };

  const handleWishlist = () => {
    toast({
      title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  const handleShare = () => {
    toast({
      title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  if (!product) {
    return <div className="p-12 text-center">Loading product...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - SOCKSPORT</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-purple-600">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                  -{discountPercentage}% DE DESCUENTO
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {product.is_new && (
                <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
                  NEW
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">COLORES DISPONIBLES</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-2 rounded-xl font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={() => setSelectedColor('White')}
                      className={`px-6 py-2 rounded-xl font-medium transition-all ${
                        selectedColor === 'White'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                      }`}
                    >
                      White
                    </button>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">TALLAS DISPONIBLES</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <>
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-xl font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center hover:border-purple-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center hover:border-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-xl shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlist}
                  variant="outline"
                  className="w-14 h-14 rounded-xl"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-14 h-14 rounded-xl"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;