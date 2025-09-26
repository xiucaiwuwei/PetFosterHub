// Home模块的Redux状态管理
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { homeService, ServiceFeature, Testimonial } from '../services/homeService';
import { FosterService } from '@/types';

// 定义状态接口
interface HomeState {
  featuredFosters: FosterService[];
  serviceFeatures: ServiceFeature[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: HomeState = {
  featuredFosters: [],
  serviceFeatures: [],
  testimonials: [],
  loading: false,
  error: null
};

// 异步Thunks

export const fetchFeaturedFosters = createAsyncThunk(
  'home/fetchFeaturedFosters',
  async (_, { rejectWithValue }) => {
    try {
      const data = await homeService.getFeaturedFosters();
      return data;
    } catch (error) {
      return rejectWithValue('获取推荐寄养服务失败');
    }
  }
);

export const fetchServiceFeatures = createAsyncThunk(
  'home/fetchServiceFeatures',
  async (_, { rejectWithValue }) => {
    try {
      const data = await homeService.getServiceFeatures();
      return data;
    } catch (error) {
      return rejectWithValue('获取服务特点失败');
    }
  }
);

export const fetchTestimonials = createAsyncThunk(
  'home/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const data = await homeService.getTestimonials();
      return data;
    } catch (error) {
      return rejectWithValue('获取用户评价失败');
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
    // 处理fetchFeaturedFosters
    builder
      .addCase(fetchFeaturedFosters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedFosters.fulfilled, (state, action: PayloadAction<FosterService[]>) => {
        state.loading = false;
        state.featuredFosters = action.payload;
      })
      .addCase(fetchFeaturedFosters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取推荐寄养服务失败';
      })

      // 处理fetchServiceFeatures
      .addCase(fetchServiceFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceFeatures.fulfilled, (state, action: PayloadAction<ServiceFeature[]>) => {
        state.loading = false;
        state.serviceFeatures = action.payload;
      })
      .addCase(fetchServiceFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取服务特点失败';
      })

      // 处理fetchTestimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action: PayloadAction<Testimonial[]>) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '获取用户评价失败';
      });
  }
});

// 导出actions
export const { clearError } = homeSlice.actions;

// 导出reducer
export default homeSlice.reducer;