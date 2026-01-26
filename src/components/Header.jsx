import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, LogOut, Package, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black shadow-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0"
            onClick={(e) => {
              // If user presses Ctrl+Shift and clicks the title, open admin login instead
              if (e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                // navigate programmatically to admin login
                // use window.location to ensure full navigation
                window.location.href = '/admin/login';
              }
            }}
          >
            <span className="text-2xl font-black text-white italic tracking-tighter">
              SOCKS OFICIAL
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-bold text-white hover:text-gray-300 transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Trigger (Desktop) */}
            <form onSubmit={handleSearch} className="hidden lg:block relative">
              <input
               type="text"
               placeholder="Search..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-3 pr-8 py-1 rounded-full border border-gray-700 bg-black text-white text-sm focus:outline-none focus:border-white w-40 transition-all focus:w-60 placeholder-gray-500"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-gray-800 hover:text-white">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black border-gray-800 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem onClick={() => navigate('/orders')} className="focus:bg-gray-800 focus:text-white">
                    <Package className="mr-2 h-4 w-4" /> Orders
                  </DropdownMenuItem>
                   <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                    <Heart className="mr-2 h-4 w-4" /> Favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-gray-800 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" className="font-medium text-white hover:bg-gray-800 hover:text-white">Sign In</Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 group">
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-gray-300 transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white hover:text-gray-300">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                    placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </form>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-white hover:text-gray-300"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-gray-800">
                {user ? (
                   <div className="space-y-3">
                     <p className="font-medium text-gray-400">Signed in as {user.full_name || user.email}</p>
                    <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800 hover:text-white" onClick={() => {navigate('/orders'); setMobileMenuOpen(false);}}>
                       <Package className="mr-2 h-4 w-4" /> Orders
                     </Button>
                     <Button variant="destructive" className="w-full justify-start" onClick={() => {handleLogout(); setMobileMenuOpen(false);}}>
                       <LogOut className="mr-2 h-4 w-4" /> Sign Out
                     </Button>
                   </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-white text-black hover:bg-gray-200">Registrarse</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;