import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [], total: 0 };
  }
};

const saveCartToStorage = (items, total) => {
  try {
    localStorage.setItem('cart', JSON.stringify({ items, total }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
  ...loadCartFromStorage(),
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    
    calculateTotal: (state) => {
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      saveCartToStorage(state.items, state.total);
    },
    
    cartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    cartSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    
    cartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  cartStart,
  cartSuccess,
  cartFailure
} = cartSlice.actions;

export default cartSlice.reducer;
