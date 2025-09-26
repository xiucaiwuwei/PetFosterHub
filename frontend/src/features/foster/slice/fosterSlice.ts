import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fosterService from '../services/fosterService';
import type {
  FosterServiceListRequest,
  FosterServiceListResponse,
  FosterServiceDetailRequest,
  FosterServiceDetailResponse,
  ApplyFosterRequest,
  ApplyFosterResponse,
  FosterOrderRequest,
  FosterOrderResponse
} from '../types/dto';
import type { RootState } from '@/app/store/store';

// 定义状态类型
interface FosterState {
  fosterList: FosterServiceListResponse | null;
  selectedFoster: FosterServiceDetailResponse | null;
  currentOrder: FosterOrderResponse | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// 初始状态
const initialState: FosterState = {
  fosterList: null,
  selectedFoster: null,
  currentOrder: null,
  loading: false,
  error: null,
  success: false
};

// 获取寄养服务列表的异步action
export const fetchFosterList = createAsyncThunk(
  'foster/fetchFosterList',
  async (params: FosterServiceListRequest, { rejectWithValue }) => {
    try {
      const data = await fosterService.getFosterServiceList(params);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取寄养服务列表失败');
    }
  }
);

// 获取寄养服务详情的异步action
export const fetchFosterDetail = createAsyncThunk(
  'foster/fetchFosterDetail',
  async (params: FosterServiceDetailRequest, { rejectWithValue }) => {
    try {
      const data = await fosterService.getFosterServiceDetail(params);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取寄养服务详情失败');
    }
  }
);

// 申请寄养服务的异步action
export const applyFoster = createAsyncThunk(
  'foster/applyFoster',
  async (params: ApplyFosterRequest, { rejectWithValue }) => {
    try {
      const data = await fosterService.applyFosterService(params);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '申请寄养服务失败');
    }
  }
);

// 创建寄养订单的异步action
export const createFosterOrder = createAsyncThunk(
  'foster/createFosterOrder',
  async (params: FosterOrderRequest, { rejectWithValue }) => {
    try {
      const data = await fosterService.createFosterOrder(params);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '创建寄养订单失败');
    }
  }
);

// 创建slice
const fosterSlice = createSlice({
  name: 'foster',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedFoster: (state) => {
      state.selectedFoster = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取寄养服务列表
      .addCase(fetchFosterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFosterList.fulfilled, (state, action) => {
        state.loading = false;
        state.fosterList = action.payload;
      })
      .addCase(fetchFosterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取寄养服务详情
      .addCase(fetchFosterDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFosterDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFoster = action.payload;
      })
      .addCase(fetchFosterDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 申请寄养服务
      .addCase(applyFoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyFoster.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(applyFoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 创建寄养订单
      .addCase(createFosterOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFosterOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
      })
      .addCase(createFosterOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// 导出actions
export const { reset, clearSelectedFoster, clearCurrentOrder } = fosterSlice.actions;

// 导出selectors
export const selectFosterState = (state: RootState) => state.foster;

export default fosterSlice.reducer;