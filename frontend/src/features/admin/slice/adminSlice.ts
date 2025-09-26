/**
 * 管理员模块Redux状态管理
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import adminService from '../services/adminService';
import { AdminState } from '../types/entity';
import { GetUsersDto, UpdateUserDto, GetOrdersDto, UpdateOrderDto } from '../types/dto';

// 初始状态
const initialState: AdminState = {
  loading: false,
  users: {
    data: [],
    total: 0,
    loading: false
  },
  orders: {
    data: [],
    total: 0,
    loading: false
  },
  products: {
    data: [],
    total: 0,
    loading: false
  },
  consultations: {
    data: [],
    total: 0,
    loading: false
  },
  selectedUser: null,
  selectedOrder: null,
  selectedProduct: null,
  selectedConsultation: null,
  stats: {
    totalUsers: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
    fosterServices: 0
  }
};

// 异步Thunk函数

/**
 * 获取用户列表
 */
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: GetUsersDto, { rejectWithValue }) => {
    try {
      const response = await adminService.user.getUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取用户列表失败');
    }
  }
);

/**
 * 更新用户信息
 */
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async (params: UpdateUserDto, { rejectWithValue }) => {
    try {
      const response = await adminService.user.updateUser(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '更新用户信息失败');
    }
  }
);

/**
 * 删除用户
 */
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await adminService.user.deleteUser(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '删除用户失败');
    }
  }
);

/**
 * 获取订单列表
 */
export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params: GetOrdersDto, { rejectWithValue }) => {
    try {
      const response = await adminService.order.getOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取订单列表失败');
    }
  }
);

/**
 * 更新订单信息
 */
export const updateOrder = createAsyncThunk(
  'admin/updateOrder',
  async (params: UpdateOrderDto, { rejectWithValue }) => {
    try {
      const response = await adminService.order.updateOrder(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '更新订单信息失败');
    }
  }
);

/**
 * 删除订单
 */
export const deleteOrder = createAsyncThunk(
  'admin/deleteOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await adminService.order.deleteOrder(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '删除订单失败');
    }
  }
);

/**
 * 获取统计数据
 */
export const fetchStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.stats.getStats();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取统计数据失败');
    }
  }
);

// 创建Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 设置选中的用户
    setSelectedUser: (state, action: PayloadAction<any | null>) => {
      state.selectedUser = action.payload;
    },
    
    // 设置选中的订单
    setSelectedOrder: (state, action: PayloadAction<any | null>) => {
      state.selectedOrder = action.payload;
    },
    
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    // 处理获取用户列表
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ data: any[]; total: number }>) => {
        state.users.data = action.payload.data;
        state.users.total = action.payload.total;
        state.users.loading = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.users.loading = false;
      })
      
    // 处理更新用户
    .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
      const updatedUser = action.payload;
      state.users.data = state.users.data.map((user: any) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
        state.selectedUser = updatedUser;
      }
    })
    
    // 处理删除用户
    .addCase(deleteUser.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
      state.users.data = state.users.data.filter((user: any) => user.id !== action.payload.id);
      state.users.total -= 1;
      if (state.selectedUser && state.selectedUser.id === action.payload.id) {
        state.selectedUser = null;
      }
    })
    
    // 处理获取订单列表
    .addCase(fetchOrders.pending, (state) => {
      state.orders.loading = true;
    })
    .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<{ data: any[]; total: number }>) => {
      state.orders.data = action.payload.data;
      state.orders.total = action.payload.total;
      state.orders.loading = false;
    })
    .addCase(fetchOrders.rejected, (state) => {
      state.orders.loading = false;
    })
    
    // 处理更新订单
    .addCase(updateOrder.fulfilled, (state, action: PayloadAction<any>) => {
      const updatedOrder = action.payload;
      state.orders.data = state.orders.data.map((order: any) =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
      if (state.selectedOrder && state.selectedOrder.id === updatedOrder.id) {
        state.selectedOrder = updatedOrder;
      }
    })
    
    // 处理删除订单
    .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
      state.orders.data = state.orders.data.filter((order: any) => order.id !== action.payload.id);
      state.orders.total -= 1;
      if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
        state.selectedOrder = null;
      }
    })
    
    // 处理获取统计数据
    .addCase(fetchStats.fulfilled, (state, action: PayloadAction<any>) => {
      state.stats = {
        totalUsers: action.payload.totalUsers,
        monthlyOrders: action.payload.monthlyOrders,
        monthlyRevenue: action.payload.monthlyRevenue,
        fosterServices: action.payload.fosterServices
      };
    });
  }
});

// 导出actions
export const { setSelectedUser, setSelectedOrder, setLoading } = adminSlice.actions;

// 导出reducer
export default adminSlice.reducer;