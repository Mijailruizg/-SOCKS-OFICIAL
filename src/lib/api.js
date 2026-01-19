import { products } from '@/data/products';

// Mock API service using localStorage for persistence
// In a real app, this would use Supabase client

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate UUID v4 compatible ID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const api = {
  // Products
  getProducts: async () => {
    await delay(500); // Simulate network latency
    
    // Get admin-added/edited products from localStorage
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const editedProductIds = JSON.parse(localStorage.getItem('edited_product_ids') || '[]');
    
    // Combine original products with edits
    let allProducts = [...products];
    
    // Reemplazar productos editados
    allProducts = allProducts.map(product => {
      const editedProduct = adminProducts.find(ap => ap.id === product.id);
      return editedProduct || product;
    });
    
    // Agregar productos completamente nuevos (que no existan en originales)
    const newProducts = adminProducts.filter(ap => !products.find(p => p.id === ap.id));
    
    return [...allProducts, ...newProducts];
  },

  getProductById: async (id) => {
    await delay(300);
    return products.find(p => p.id === id);
  },

  // Auth (Mock)
  login: async (email, password) => {
    await delay(800);
    // Simple mock validation
    if (!email || !password) throw new Error("Email and password required");
    
    // Simulate finding user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const sessionUser = { ...user };
      delete sessionUser.password;
      return { user: sessionUser, error: null };
    }
    
    // For demo purposes, allow test login if no user found but formatted correctly
    if (email.includes('@')) {
        const mockUser = { id: 'test-user-id', email, full_name: 'Demo User' };
        return { user: mockUser, error: null };
    }

    return { user: null, error: { message: "Invalid credentials" } };
  },

  register: async (email, password, fullName) => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { user: null, error: { message: "User already exists" } };
    }

    const newUser = { 
      id: generateId(), 
      email, 
      password, // In real app, never store plain text
      full_name: fullName,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    
    return { user: sessionUser, error: null };
  },

  // Cart (Mock)
  getCart: async (userId) => {
    await delay(200);
    const carts = JSON.parse(localStorage.getItem('carts') || '{}');
    return carts[userId] || [];
  },

  updateCart: async (userId, items) => {
    await delay(200);
    const carts = JSON.parse(localStorage.getItem('carts') || '{}');
    carts[userId] = items;
    localStorage.setItem('carts', JSON.stringify(carts));
    return items;
  },

  // Orders
  createOrder: async (userId, orderData) => {
    try {
      await delay(800); // Simulate processing
      
      // Validate required data
      if (!userId) {
        throw new Error('User ID is required');
      }
      if (!orderData) {
        throw new Error('Order data is required');
      }
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: generateId(),
        user_id: userId,
        total_amount: orderData.total_amount || 0,
        subtotal: orderData.subtotal || 0,
        shipping: orderData.shipping || 0,
        tax: orderData.tax || 0,
        items: orderData.items || [],
        status: orderData.status || 'pending',
        payment_method: orderData.payment_method || 'whatsapp',
        shipping_address: orderData.shipping_address || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      console.log('Order created:', newOrder);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrders: async (userId) => {
    await delay(500);
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // If no userId, return all orders (for admin)
    if (!userId) {
      return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return orders.filter(o => o.user_id === userId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Admin Functions
  addProduct: async (productData) => {
    try {
      await delay(300);
      
      // Get current products from localStorage
      const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      
      const newProduct = {
        id: productData.id || generateId(),
        ...productData,
        sizes: productData.sizes || [],
        created_at: new Date().toISOString()
      };
      
      adminProducts.push(newProduct);
      localStorage.setItem('admin_products', JSON.stringify(adminProducts));
      
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      await delay(300);
      
      let adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      
      // Buscar si el producto ya está en la lista de administración
      let index = adminProducts.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        // Actualizar producto que ya existe en admin_products
        adminProducts[index] = {
          ...adminProducts[index],
          ...productData,
          sizes: productData.sizes || adminProducts[index].sizes || [],
          updated_at: new Date().toISOString()
        };
      } else {
        // Es un producto original, agregarlo a admin_products como versión editada
        const originalProduct = products.find(p => p.id === productId);
        if (originalProduct) {
          adminProducts.push({
            ...originalProduct,
            ...productData,
            sizes: productData.sizes || [],
            updated_at: new Date().toISOString()
          });
        } else {
          throw new Error('Product not found');
        }
      }
      
      localStorage.setItem('admin_products', JSON.stringify(adminProducts));
      
      // Guardar el ID como editado (para referencias futuras)
      let editedIds = JSON.parse(localStorage.getItem('edited_product_ids') || '[]');
      if (!editedIds.includes(productId)) {
        editedIds.push(productId);
        localStorage.setItem('edited_product_ids', JSON.stringify(editedIds));
      }
      
      return adminProducts[index !== -1 ? index : adminProducts.length - 1];
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      await delay(300);
      
      let adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      adminProducts = adminProducts.filter(p => p.id !== productId);
      localStorage.setItem('admin_products', JSON.stringify(adminProducts));
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await delay(300);
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const index = orders.findIndex(o => o.id === orderId);
      
      if (index === -1) {
        throw new Error('Order not found');
      }
      
      orders[index] = {
        ...orders[index],
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('orders', JSON.stringify(orders));
      return orders[index];
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Content Management Functions
  getContentSections: async () => {
    await delay(300);
    const sections = JSON.parse(localStorage.getItem('content_sections') || '[]');
    return sections.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  addContentSection: async (sectionData) => {
    try {
      await delay(300);
      
      const sections = JSON.parse(localStorage.getItem('content_sections') || '[]');
      
      const newSection = {
        ...sectionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      sections.push(newSection);
      localStorage.setItem('content_sections', JSON.stringify(sections));
      
      return newSection;
    } catch (error) {
      console.error('Error adding content section:', error);
      throw error;
    }
  },

  updateContentSection: async (sectionId, sectionData) => {
    try {
      await delay(300);
      
      let sections = JSON.parse(localStorage.getItem('content_sections') || '[]');
      const index = sections.findIndex(s => s.id === sectionId);
      
      if (index === -1) {
        throw new Error('Section not found');
      }
      
      sections[index] = {
        ...sections[index],
        ...sectionData,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('content_sections', JSON.stringify(sections));
      return sections[index];
    } catch (error) {
      console.error('Error updating content section:', error);
      throw error;
    }
  },

  deleteContentSection: async (sectionId) => {
    try {
      await delay(300);
      
      let sections = JSON.parse(localStorage.getItem('content_sections') || '[]');
      sections = sections.filter(s => s.id !== sectionId);
      localStorage.setItem('content_sections', JSON.stringify(sections));
      
      return true;
    } catch (error) {
      console.error('Error deleting content section:', error);
      throw error;
    }
  }
};