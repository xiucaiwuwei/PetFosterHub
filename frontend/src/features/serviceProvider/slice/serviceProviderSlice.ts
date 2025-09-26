import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { serviceProviderService } from '../services/serviceProviderService';
import { ApplyServiceProviderRequest, ApplyServiceProviderResponse, ServiceProviderApplication } from '../types';

// 定义服务提供者状态接口
export interface ServiceProviderState {
  application: ServiceProviderApplication | null;
  applicationStatus: 'idle' | 'submitting' | 'success' | 'error';
  statusCheckStatus: 'idle' | 'checking' | 'success' | 'error';
  error: string | null;
}

// 初始状态
const initialState: ServiceProviderState = {
  application: null,
  applicationStatus: 'idle',
  statusCheckStatus: 'idle',
  error: null
};

// 提交服务提供者申请的异步thunk
export const submitServiceProviderApplication = createAsyncThunk(
  'serviceProvider/submitApplication',
  async (formData: ApplyServiceProviderRequest, { rejectWithValue }) => {
    try {
      const response = await serviceProviderService.submitApplication(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '提交申请失败，请稍后重试'
      );
    }
  }
);

// 查询服务提供者申请状态的异步thunk
export const checkApplicationStatus = createAsyncThunk(
  'serviceProvider/checkStatus',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const status = await serviceProviderService.getApplicationStatus(applicationId);
      return status;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '查询申请状态失败，请稍后重试'
      );
    }
  }
);

// 创建服务提供者slice
export const serviceProviderSlice = createSlice({
  name: 'serviceProvider',
  initialState,
  reducers: {
    // 重置申请状态
    resetApplication: (state) => {
      state.application = null;
      state.applicationStatus = 'idle';
      state.error = null;
    },
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 提交申请的状态处理
    builder
      .addCase(submitServiceProviderApplication.pending, (state) => {
        state.applicationStatus = 'submitting';
        state.error = null;
      })
      .addCase(submitServiceProviderApplication.fulfilled, (state, action: PayloadAction<ApplyServiceProviderResponse>) => {
        state.applicationStatus = 'success';
        // 如果返回了完整的申请信息，更新状态
        if (action.payload.application) {
          state.application = action.payload.application;
        }
      })
      .addCase(submitServiceProviderApplication.rejected, (state, action) => {
        state.applicationStatus = 'error';
        state.error = action.payload as string || '提交申请失败';
      })
      
    // 查询状态的处理
    builder
      .addCase(checkApplicationStatus.pending, (state) => {
        state.statusCheckStatus = 'checking';
      })
      .addCase(checkApplicationStatus.fulfilled, (state, action: PayloadAction<ServiceProviderApplication>) => {
        state.statusCheckStatus = 'success';
        state.application = action.payload;
      })
      .addCase(checkApplicationStatus.rejected, (state, action) => {
        state.statusCheckStatus = 'error';
        state.error = action.payload as string || '查询申请状态失败';
      });
  }
});

// 导出action creators
export const { resetApplication, clearError } = serviceProviderSlice.actions;

// 导出reducer
export default serviceProviderSlice.reducer;