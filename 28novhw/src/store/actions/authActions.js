import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockLogin, mockRegister } from '../../api/mockApi';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const userData = await mockLogin(credentials);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const newUser = await mockRegister(userData);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = () => (dispatch) => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Dispatch the fulfilled action directly to set user state
      dispatch({ type: 'auth/loginUser/fulfilled', payload: userData });
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: 'auth/logout' });
  localStorage.removeItem('user');
};
