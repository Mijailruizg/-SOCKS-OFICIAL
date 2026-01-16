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
    return products;
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
    return orders.filter(o => o.user_id === userId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }
};