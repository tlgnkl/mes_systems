import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase('auth/loginUser/pending', (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase('auth/loginUser/fulfilled', (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase('auth/loginUser/rejected', (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Register user
      .addCase('auth/registerUser/pending', (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase('auth/registerUser/fulfilled', (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase('auth/registerUser/rejected', (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  }
});

export const { 
  logout, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;
