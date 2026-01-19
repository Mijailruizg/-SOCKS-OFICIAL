import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminQuickLink from '@/components/AdminQuickLink';

const Footer = () => {
  return (
    <footer
      className="relative bg-black text-white pt-24 pb-12"
      style={{
        backgroundImage: "url('/galeria/fondo.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.55))',
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Logo centered */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/galeria/logo.png" alt="SOCKS OFICIAL" className="h-16 md:h-20 object-contain" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-6">
          {/* Newsletter (left) */}
          <div className="lg:col-span-1">
            <p className="text-gray-300 mb-4">Stay up to date and get exclusive deals by signing up for our newsletter.</p>
            <form className="flex max-w-md">
              <input type="email" placeholder="Your Email" className="flex-1 px-4 py-3 rounded-l-lg bg-black/60 placeholder-gray-400 text-white border border-white/10 focus:outline-none" />
              <button type="submit" className="px-6 py-3 bg-white text-black font-semibold rounded-r-lg">Sign Up</button>
            </form>
            <div className="mt-6 text-gray-300"><a href="mailto:socks.oficial@gmail.com" className="underline">socks.oficial@gmail.com</a></div>
          </div>

          {/* Empty center intentionally (keeps layout like example) */}
          <div className="hidden lg:block" />

          {/* Links (right) */}
          <div className="lg:col-span-1 flex gap-8">
            <div>
              <h4 className="font-bold mb-3">About</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/brand" className="hover:underline">Why Alpaca?</Link></li>
                <li><Link to="/shop" className="hover:underline">Shop All Socks</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
                <li><Link to="/" className="hover:underline">Store Locator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Help</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/magazine" className="hover:underline">Magazine</Link></li>
                <li><Link to="/orders" className="hover:underline">Orders</Link></li>
                <li><Link to="/returns" className="hover:underline">Returns</Link></li>
                <li><Link to="/" className="hover:underline">Military Discount</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Centered contact row with icons (under JOIN THE SQUAD) */}
        <div className="mt-6 mb-6 flex flex-col items-center gap-3">
          <div className="text-gray-300">Contact: <a href="mailto:socks.oficial@gmail.com" className="underline">socks.oficial@gmail.com</a></div>
          <div className="flex items-center gap-4">
            <a href="http://wa.me/+51974206791" target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black">
              <Phone className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/share/18AMAJ7RGC/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/socks.oficial?igsh=MXdsa3QyNTVpcTJnaw%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black">
              <Instagram className="w-5 h-5" />
            </a>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black" title="TikTok (próximamente)">
              <span className="text-xs font-bold">TT</span>
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 SOCKS OFICIAL. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
      {/* Admin quick link: small camouflaged dot placed over footer background */}
      <div className="relative max-w-7xl mx-auto px-6">
        <AdminQuickLink />
      </div>
    </footer>
  );
};

export default Footer;