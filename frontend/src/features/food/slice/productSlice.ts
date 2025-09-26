/**
 * 商品相关的Redux状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as productService from '../services';
import { PaginatedProductResponseDto, ProductDetailDto, AddToCartRequestDto } from '../types';

// 定义商品状态接口
interface ProductState {
  products: PaginatedProductResponseDto | null;
  productDetail: ProductDetailDto | null;
  categories: Array<{ id: string; name: string }> | null;
  cartItems: Array<{ productId: string; quantity: number }>;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: ProductState = {
  products: null,
  productDetail: null,
  categories: null,
  cartItems: [],
  loading: false,
  error: null
};

// 异步操作：获取商品列表
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步操作：获取商品详情
export const fetchProductDetail = createAsyncThunk(
  'product/fetchProductDetail',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductDetail(productId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步操作：获取商品分类
export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProductCategories();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步操作：添加商品到购物车
export const addToCart = createAsyncThunk(
  'product/addToCart',
  async (data: AddToCartRequestDto, { rejectWithValue }) => {
    try {
      const response = await productService.addToCart(data);
      return { ...data, success: response.success };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 创建商品slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // 清空商品详情
    clearProductDetail: (state) => {
      state.productDetail = null;
    },
    // 清空错误信息
    clearError: (state) => {
      state.error = null;
    },
    // 从购物车移除商品
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
    },
    // 更新购物车商品数量
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity = Math.max(1, quantity); // 确保数量至少为1
      }
    },
    // 清空购物车
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
  extraReducers: (builder) => {
    // 处理获取商品列表
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PaginatedProductResponseDto>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取商品列表失败';
      })
    
    // 处理获取商品详情
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action: PayloadAction<ProductDetailDto>) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取商品详情失败';
      })
    
    // 处理获取商品分类
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Array<{ id: string; name: string }>>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取商品分类失败';
      })
    
    // 处理添加到购物车
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<AddToCartRequestDto & { success: boolean }>) => {
        state.loading = false;
        if (action.payload.success) {
          const { productId, quantity } = action.payload;
          const existingItem = state.cartItems.find(item => item.productId === productId);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.cartItems.push({ productId, quantity });
          }
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '添加到购物车失败';
      });
  }
});

// 导出actions
export const { 
  clearProductDetail, 
  clearError, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} = productSlice.actions;

// 导出reducer
export default productSlice.reducer;