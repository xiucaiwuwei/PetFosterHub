import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../services/productService';
import type { PetProduct } from '@/features/petStore/types';
import type { ProductCategory } from '@/features/petStore/types';
import type { ProductSortOption } from '@/features/petStore/types';

// 定义状态接口
interface ProductState {
  products: PetProduct[];
  selectedProduct: PetProduct | null;
  loading: boolean;
  productLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  selectedCategory: ProductCategory | 'all';
  sortBy: ProductSortOption;
  cart: Array<{
    product: PetProduct;
    quantity: number;
  }>;
}

// 初始状态
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  productLoading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 12,
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: ProductSortOption.PRICE_LOW_TO_HIGH,
  cart: []
};

// 异步thunks

// 获取商品列表
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (
    params: {
      page: number;
      pageSize: number;
      searchTerm?: string;
      category?: ProductCategory;
      sortBy?: ProductSortOption;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue('获取商品列表失败');
    }
  }
);

// 获取商品详情
export const fetchProductDetail = createAsyncThunk(
  'product/fetchProductDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const product = await productService.getProductDetail(id);
      return product;
    } catch (error) {
      return rejectWithValue('获取商品详情失败');
    }
  }
);

// 添加到购物车
export const addToCart = createAsyncThunk(
  'product/addToCart',
  async (
    { product, quantity }: { product: PetProduct; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      await productService.addToCart(product.id, quantity);
      return { product, quantity };
    } catch (error) {
      return rejectWithValue('添加到购物车失败');
    }
  }
);

// 创建订单
export const createOrder = createAsyncThunk(
  'product/createOrder',
  async (
    items: Array<{
      productId: string;
      quantity: number;
    }>,
    { rejectWithValue }
  ) => {
    try {
      const orderId = await productService.createOrder(
        items.map(item => item.productId),
        items.map(item => item.quantity)
      );
      return orderId;
    } catch (error) {
      return rejectWithValue('创建订单失败');
    }
  }
);

// 创建slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedCategory: (state, action: PayloadAction<ProductCategory | 'all'>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<ProductSortOption>) => {
      state.sortBy = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const cartItemIndex = state.cart.findIndex(item => item.product.id === productId);
      
      if (cartItemIndex >= 0) {
        if (quantity <= 0) {
          state.cart.splice(cartItemIndex, 1);
        } else {
          state.cart[cartItemIndex].quantity = quantity;
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // 处理获取商品列表
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取商品列表失败';
      })
      
      // 处理获取商品详情
      .addCase(fetchProductDetail.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload as string || '获取商品详情失败';
      })
      
      // 处理添加到购物车
      .addCase(addToCart.fulfilled, (state, action) => {
        const { product, quantity } = action.payload;
        const existingItemIndex = state.cart.findIndex(item => item.product.id === product.id);
        
        if (existingItemIndex >= 0) {
          state.cart[existingItemIndex].quantity += quantity;
        } else {
          state.cart.push({ product, quantity });
        }
      })
      
      // 处理创建订单
      .addCase(createOrder.fulfilled, (state) => {
        // 创建订单成功后清空购物车
        state.cart = [];
      });
  }
});

// 导出actions
export const { 
  setSearchTerm, 
  setSelectedCategory, 
  setSortBy, 
  setCurrentPage, 
  clearSelectedProduct, 
  clearError,
  updateCartItemQuantity,
  removeFromCart,
  clearCart 
} = productSlice.actions;

// 导出reducer
export default productSlice.reducer;