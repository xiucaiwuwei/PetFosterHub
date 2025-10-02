// Home模块的Redux状态管理
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import homeService from '../services/homeService';
import type { FosterService } from '../types';
import type { Testimonial } from '../types';

// 定义状态接口
interface HomeState {
  featuredFosters: FosterService[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: HomeState = {
  featuredFosters: [],
  testimonials: [],
  loading: false,
  error: null
};

// 异步Thunks

export const fetchTopThreeFosters = createAsyncThunk(
  'home/fetchTopThreeFosters',
  async (_, { rejectWithValue }) => {
    try {
      const data = await homeService.getTopThreeFosters();
      return data;
    } catch (error) {
      return rejectWithValue('获取最好的三个寄养服务数据失败');
    }
  }
);

export const fetchLatestThreeTestimonials = createAsyncThunk(
  'home/fetchLatestThreeTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const data = await homeService.getLatestThreeTestimonials();
      return data;
    } catch (error) {
      return rejectWithValue('获取三个用户最新的评价失败');
    }
  }
);

// 创建slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理fetchTopThreeFosters
    builder
      .addCase(fetchTopThreeFosters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopThreeFosters.fulfilled, (state, action: PayloadAction<FosterService[]>) => {
        state.loading = false;
        state.featuredFosters = action.payload;
      })
      .addCase(fetchTopThreeFosters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取最好的三个寄养服务数据失败';
      })

      // 处理fetchLatestThreeTestimonials
      .addCase(fetchLatestThreeTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestThreeTestimonials.fulfilled, (state, action: PayloadAction<Testimonial[]>) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchLatestThreeTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取三个用户最新的评价失败';
      });
  }
});

// 导出actions
export const { clearError } = homeSlice.actions;

// 导出reducer
export default homeSlice.reducer;