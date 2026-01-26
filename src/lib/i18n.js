const translations = {
  es: {
    nav: {
      shop: 'TIENDA',
      brand: 'MARCA',
      magazine: 'REVISTA',
      new_in: 'NOVEDADES'
    },
    header: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      my_account: 'Mi cuenta',
      orders: 'Pedidos',
      wishlist: 'Favoritos',
      logout: 'Cerrar sesión'
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
      newest: 'Novedades'
    },
    home: {
      subscribe: 'SUSCRIBIRSE',
      join: 'ÚNETE AL SQUAD'
    },
    cart: {
      empty: 'Tu carrito está vacío',
      start_shopping: 'COMENZAR A COMPRAR',
      order_summary: 'Resumen de la orden',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      tax: 'Impuesto',
      total: 'Total',
      checkout: 'Pagar'
    },
    product: {
      add_to_cart: 'Añadir al carrito',
      key_features: 'Características principales',
      you_may_also_like: 'También te puede interesar'
    }
  }
};

let current = 'es';

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
  if (translations[locale]) current = locale;
}

export default { t, setLocale };
