import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    search: '',
    sortBy: 'name'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0
  }
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.products;
      state.pagination.totalItems = action.payload.totalCount;
      state.error = null;
    },
    
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    
    deleteProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setFilters,
  setPage,
  addProduct,
  updateProduct,
  deleteProduct
} = productsSlice.actions;

export default productsSlice.reducer;
