import { createAsyncThunk } from '@reduxjs/toolkit';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../slices/cartSlice';

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity = 1 }, { rejectWithValue, dispatch }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch(addToCart({ product, quantity }));
      
      return { product, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch(removeFromCart(productId));
      
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }, { rejectWithValue, dispatch }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch(updateQuantity({ id, quantity }));
      
      return { id, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch(clearCart());
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
