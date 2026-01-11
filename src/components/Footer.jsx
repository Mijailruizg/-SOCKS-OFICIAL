import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="block">
                <span className="text-2xl font-black italic tracking-tighter text-white">
                SOCKS OFICIAL
                </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Premium performance socks engineered for athletes who demand the best. Designed in New York, worn worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Shop</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/shop?category=new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?category=hybrid" className="hover:text-white transition-colors">Hybrid Collection</Link></li>
              <li><Link to="/shop?category=winter" className="hover:text-white transition-colors">Winter Series</Link></li>
              <li><Link to="/shop?category=golf" className="hover:text-white transition-colors">Pro Golf</Link></li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/brand" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/magazine" className="hover:text-white transition-colors">Magazine</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
             <h4 className="font-bold text-lg mb-6 text-white">Get in Touch</h4>
             <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <span>123 Athletic Way,<br/>New York, NY 10012</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-white shrink-0" />
                    <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-white shrink-0" />
                    <span>hello@socks-oficial.com</span>
                </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
      <p>© 2026 SOCKS OFICIAL. All rights reserved.</p>
            <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;