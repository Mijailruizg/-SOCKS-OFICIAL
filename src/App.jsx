import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

// Pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import OrdersPage from '@/pages/OrdersPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import BrandPage from '@/pages/BrandPage';
import MagazinePage from '@/pages/MagazinePage';
import BlogPostPage from '@/pages/BlogPostPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ImpactPage from '@/pages/ImpactPage';

// Admin Pages
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminProductsPage from '@/pages/AdminProductsPage';
import AdminOrdersPage from '@/pages/AdminOrdersPage';
import AdminContentPage from '@/pages/AdminContentPage';
import AdminGalleryPage from '@/pages/AdminGalleryPage';

// Layout Wrapper to conditionally show header/footer
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Restore scroll position on Home when returning from a detail page
  React.useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('shop_state') || '{}');
      if (location.pathname === '/' && s && typeof s.scrollY === 'number') {
        // Small delay to allow layout to render
        setTimeout(() => window.scrollTo(0, s.scrollY), 50);
      }
    } catch (err) {}
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <>
          <Banner />
          <Header />
        </>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {!isAdminRoute && (
        <Footer />
      )}
      
      <Toaster />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Admin Routes - PRIMERO para evitar conflictos */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
      </Route>
      <Route path="/admin/products" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminProductsPage />} />
      </Route>
      <Route path="/admin/orders" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminOrdersPage />} />
      </Route>
      <Route path="/admin/content" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminContentPage />} />
      </Route>
      <Route path="/admin/gallery" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminGalleryPage />} />
      </Route>

      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/magazine" element={<MagazinePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/blog/:id" element={<BlogPostPage />} />
      
      {/* Protected Routes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/order-confirmation/:id" element={
        <ProtectedRoute>
          <OrderConfirmationPage />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <LayoutWrapper>
              <AppRoutes />
            </LayoutWrapper>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;