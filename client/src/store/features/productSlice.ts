import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { type ProductType } from '@/types';
import { axiosInstance } from '@/lib/axios';

interface ProductState {
  products: ProductType[];
  adminProducts: ProductType[];
  isFetchingProducts: boolean;
  isFetchingAdminProducts: boolean;
  isAddingProduct: boolean;
  isEditingProduct: boolean;
  isDeletingProduct: boolean;
  isTogglingStatus: boolean;
  error: string | null;
}

interface ApiError {
  message: string;
}

const initialState: ProductState = {
  products: [],
  adminProducts: [],
  isFetchingProducts: false,
  isFetchingAdminProducts: false,
  isAddingProduct: false,
  isEditingProduct: false,
  isDeletingProduct: false,
  isTogglingStatus: false,
  error: null,
};

interface FetchProductsParams {
  category?: string;
  search?: string;
  sortBy?: string;
}

export const fetchProducts = createAsyncThunk<ProductType[], FetchProductsParams, { rejectValue: ApiError }>(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/products', { params });
      return res.data.products || [];
    } catch (error) {
      let errorMessage = 'Failed to fetch products';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface FetchAdminProductsParams {
  status?: string;
  category?: string;
  search?: string;
}

export const fetchAdminProducts = createAsyncThunk<ProductType[], FetchAdminProductsParams, { rejectValue: ApiError }>(
  'product/fetchAdminProducts',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/products/admin/all', { params });
      return res.data.products;
    } catch (error) {
      let errorMessage = 'Failed to fetch admin products';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface AddProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image?: string;
}

export const addProduct = createAsyncThunk<ProductType, AddProductData, { rejectValue: ApiError }>(
  'product/addProduct',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/products', data);
      toast.success(res.data.message);
      return res.data.product;
    } catch (error) {
      let errorMessage = 'Error adding product';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface EditProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image?: string;
}

export const editProduct = createAsyncThunk<ProductType, { id: string; data: EditProductData }, { rejectValue: ApiError }>(
  'product/editProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/products/${id}`, data);
      toast.success(res.data.message);
      return res.data.product;
    } catch (error) {
      let errorMessage = 'Error updating product';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const deleteProduct = createAsyncThunk<string, string, { rejectValue: ApiError }>(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/products/${id}`);
      toast.success(res.data.message);
      return id;
    } catch (error) {
      let errorMessage = 'Error deleting product';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const toggleProductStatus = createAsyncThunk<ProductType, { id: string; isActive: boolean }, { rejectValue: ApiError }>(
  'product/toggleProductStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/products/${id}/status`, { isActive });
      toast.success(res.data.message);
      return res.data.product;
    } catch (error) {
      let errorMessage = 'Error toggling status';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isFetchingProducts = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isFetchingProducts = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isFetchingProducts = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(fetchAdminProducts.pending, (state) => { state.isFetchingAdminProducts = true; state.error = null; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.isFetchingAdminProducts = false;
        state.adminProducts = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.isFetchingAdminProducts = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(addProduct.pending, (state) => { state.isAddingProduct = true; state.error = null; })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isAddingProduct = false;
        state.adminProducts.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isAddingProduct = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(editProduct.pending, (state) => { state.isEditingProduct = true; state.error = null; })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isEditingProduct = false;
        const index = state.adminProducts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.adminProducts[index] = action.payload;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isEditingProduct = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(deleteProduct.pending, (state) => { state.isDeletingProduct = true; state.error = null; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeletingProduct = false;
        const index = state.adminProducts.findIndex(p => p._id === action.payload);
        if (index !== -1) state.adminProducts[index].isActive = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeletingProduct = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(toggleProductStatus.pending, (state) => { state.isTogglingStatus = true; state.error = null; })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        state.isTogglingStatus = false;
        const index = state.adminProducts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.adminProducts[index] = action.payload;
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.isTogglingStatus = false;
        state.error = action.payload?.message || 'Error';
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;