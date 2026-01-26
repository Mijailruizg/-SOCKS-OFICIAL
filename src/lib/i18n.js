const translations = {
  es: {
    nav: {
      shop: 'TIENDA',
      brand: 'MARCA',
      magazine: 'REVISTA',
      new_in: 'NOVEDADES',
      about: 'SOBRE NOSOTROS',
      contact: 'CONTACTO'
    },
    header: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      my_account: 'Mi cuenta',
      orders: 'Pedidos',
      wishlist: 'Favoritos',
      logout: 'Cerrar sesión',
      search: 'Buscar...',
      language: 'Idioma'
    },
    hero: {
      welcome: 'Bienvenido a SOCKS OFICIAL',
      subtitle: 'Calcetines de calidad premium para tu estilo',
      cta: 'COMPRA AHORA',
      discover: 'DESCUBRE MÁS'
    },
    shop: {
      title: 'Tienda - SOCKS OFICIAL',
      showing: 'Mostrando',
      filters: 'Filtros',
      category: 'Categoría',
      price_range: 'Rango de precios',
      sort_by: 'Ordenar por',
      price_low: 'Precio: menor a mayor',
      price_high: 'Precio: mayor a menor',
      newest: 'Novedades',
      no_products: 'No hay productos en esta categoría'
    },
    home: {
      subscribe: 'SUSCRIBIRSE',
      join: 'ÚNETE AL SQUAD',
      newsletter: 'Suscríbete a nuestro newsletter',
      email: 'Tu email',
      description: 'Recibe las últimas colecciones y ofertas exclusivas'
    },
    cart: {
      empty: 'Tu carrito está vacío',
      start_shopping: 'COMENZAR A COMPRAR',
      order_summary: 'Resumen de la orden',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      tax: 'Impuesto',
      total: 'Total',
      checkout: 'Pagar',
      continue_shopping: 'Continuar comprando',
      remove: 'Eliminar'
    },
    product: {
      add_to_cart: 'Añadir al carrito',
      key_features: 'Características principales',
      you_may_also_like: 'También te puede interesar',
      price: 'Precio',
      quantity: 'Cantidad',
      in_stock: 'En stock',
      out_of_stock: 'Agotado'
    },
    footer: {
      about_us: 'Sobre Nosotros',
      contact: 'Contacto',
      privacy: 'Privacidad',
      terms: 'Términos',
      follow_us: 'Síguenos',
      rights: 'Todos los derechos reservados'
    },
    admin: {
      dashboard: 'Panel de Control',
      gallery: 'Galería',
      products: 'Productos',
      orders: 'Pedidos',
      settings: 'Configuración',
      add_image: '➕ Agregar Imagen',
      edit: '✏️ Editar',
      delete: '🗑️ Eliminar',
      update: '✅ Actualizar Producto',
      save: 'Guardar',
      cancel: 'Cancelar',
      success: 'Operación completada',
      error: 'Error en la operación'
    }
  },
  en: {
    nav: {
      shop: 'SHOP',
      brand: 'BRAND',
      magazine: 'MAGAZINE',
      new_in: 'NEW IN',
      about: 'ABOUT US',
      contact: 'CONTACT'
    },
    header: {
      login: 'Sign In',
      register: 'Sign Up',
      my_account: 'My Account',
      orders: 'Orders',
      wishlist: 'Wishlist',
      logout: 'Log Out',
      search: 'Search...',
      language: 'Language'
    },
    hero: {
      welcome: 'Welcome to SOCKS OFICIAL',
      subtitle: 'Premium quality socks for your style',
      cta: 'SHOP NOW',
      discover: 'DISCOVER MORE'
    },
    shop: {
      title: 'Shop - SOCKS OFICIAL',
      showing: 'Showing',
      filters: 'Filters',
      category: 'Category',
      price_range: 'Price Range',
      sort_by: 'Sort by',
      price_low: 'Price: Low to High',
      price_high: 'Price: High to Low',
      newest: 'Newest',
      no_products: 'No products in this category'
    },
    home: {
      subscribe: 'SUBSCRIBE',
      join: 'JOIN THE SQUAD',
      newsletter: 'Subscribe to our newsletter',
      email: 'Your email',
      description: 'Get the latest collections and exclusive offers'
    },
    cart: {
      empty: 'Your cart is empty',
      start_shopping: 'START SHOPPING',
      order_summary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Checkout',
      continue_shopping: 'Continue Shopping',
      remove: 'Remove'
    },
    product: {
      add_to_cart: 'Add to Cart',
      key_features: 'Key Features',
      you_may_also_like: 'You may also like',
      price: 'Price',
      quantity: 'Quantity',
      in_stock: 'In Stock',
      out_of_stock: 'Out of Stock'
    },
    footer: {
      about_us: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      follow_us: 'Follow Us',
      rights: 'All rights reserved'
    },
    admin: {
      dashboard: 'Dashboard',
      gallery: 'Gallery',
      products: 'Products',
      orders: 'Orders',
      settings: 'Settings',
      add_image: '➕ Add Image',
      edit: '✏️ Edit',
      delete: '🗑️ Delete',
      update: '✅ Update Product',
      save: 'Save',
      cancel: 'Cancel',
      success: 'Operation completed',
      error: 'Operation failed'
    }
  }
};

let current = localStorage.getItem('app_locale') || 'es';

export function t(path) {
  const parts = path.split('.');
  let node = translations[current];
  for (const p of parts) {
    if (!node) return path;
    node = node[p];
  }
  return node ?? path;
}

export function setLocale(locale) {
  if (translations[locale]) {
    current = locale;
    localStorage.setItem('app_locale', locale);
    // Disparar evento para actualizar toda la app
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { locale } }));
  }
}

export function getLocale() {
  return current;
}

export default { t, setLocale, getLocale };
