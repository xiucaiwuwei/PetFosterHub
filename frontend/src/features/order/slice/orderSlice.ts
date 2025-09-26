import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrderState } from '../types/entity';
import { OrderService } from '../services/orderService';
import { CreateOrderDto, UpdateOrderStatusDto, GetOrderDto } from '../types/dto';
import { OrderSortOption } from '../types/enums';

// 初始状态
const initialState: OrderState = {
  orders: {
    items: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10
  },
  currentOrder: {
    data: null,
    loading: false,
    error: null
  }
};

// 获取订单列表
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page, limit, sortOption }: { page: number; limit: number; sortOption: OrderSortOption }, { rejectWithValue }) => {
    try {
      const response = await OrderService.getOrders(page, limit, sortOption);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 获取订单详情
export const fetchOrderDetail = createAsyncThunk(
  'order/fetchOrderDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await OrderService.getOrderDetail(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 创建订单
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: CreateOrderDto, { rejectWithValue }) => {
    try {
      const response = await OrderService.createNewOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 更新订单状态
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, statusData }: { id: string; statusData: UpdateOrderStatusDto }, { rejectWithValue }) => {
    try {
      const response = await OrderService.changeOrderStatus(id, statusData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 取消订单
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async ({ id, reason }: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await OrderService.cancelUserOrder(id, reason);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 订单Slice
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // 清除当前订单
    clearCurrentOrder: (state) => {
      state.currentOrder = initialState.currentOrder;
    },
    // 清除订单列表错误
    clearOrdersError: (state) => {
      state.orders.error = null;
    }
  },
  extraReducers: (builder) => {
    // 获取订单列表
    builder.addCase(fetchOrders.pending, (state) => {
      state.orders.loading = true;
      state.orders.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders.loading = false;
      state.orders.items = action.payload.data;
      state.orders.total = action.payload.total;
      state.orders.page = action.meta.arg.page;
      state.orders.limit = action.meta.arg.limit;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.orders.loading = false;
      state.orders.error = action.payload as string;
    });

    // 获取订单详情
    builder.addCase(fetchOrderDetail.pending, (state) => {
      state.currentOrder.loading = true;
      state.currentOrder.error = null;
    });
    builder.addCase(fetchOrderDetail.fulfilled, (state, action) => {
      state.currentOrder.loading = false;
      state.currentOrder.data = action.payload;
    });
    builder.addCase(fetchOrderDetail.rejected, (state, action) => {
      state.currentOrder.loading = false;
      state.currentOrder.error = action.payload as string;
    });

    // 创建订单
    builder.addCase(createOrder.fulfilled, (state, action) => {
      // 添加到订单列表开头
      state.orders.items.unshift(action.payload);
      state.orders.total += 1;
      state.currentOrder.data = action.payload;
    });

    // 更新订单状态
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      // 更新当前订单
      if (state.currentOrder.data?.id === action.payload.id) {
        state.currentOrder.data = action.payload;
      }
      
      // 更新订单列表中的订单
      const index = state.orders.items.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders.items[index] = action.payload;
      }
    });

    // 取消订单
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      // 更新当前订单
      if (state.currentOrder.data?.id === action.payload.id) {
        state.currentOrder.data = action.payload;
      }
      
      // 更新订单列表中的订单
      const index = state.orders.items.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders.items[index] = action.payload;
      }
    });
  }
});

// 导出actions
export const { clearCurrentOrder, clearOrdersError } = orderSlice.actions;

// 导出reducer
export default orderSlice.reducer;