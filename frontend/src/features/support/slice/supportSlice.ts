import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SupportRequestDto, SupportResponseDto, SupportStatus } from '../types';
import * as supportApi from '../api/supportApi';

// 定义状态接口
interface SupportState {
  requests: SupportResponseDto[];
  selectedRequest: SupportResponseDto | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

// 初始状态
const initialState: SupportState = {
  requests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
  isSubmitting: false
};

// 异步thunks

export const fetchSupportRequests = createAsyncThunk(
  'support/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await supportApi.getSupportRequests();
    } catch (error) {
      return rejectWithValue('获取支持请求失败');
    }
  }
);

export const fetchSupportRequestById = createAsyncThunk(
  'support/fetchRequestById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await supportApi.getSupportRequestById(id);
    } catch (error) {
      return rejectWithValue('获取支持请求详情失败');
    }
  }
);

export const createSupportRequest = createAsyncThunk(
  'support/createRequest',
  async (request: SupportRequestDto, { rejectWithValue }) => {
    try {
      return await supportApi.createSupportRequest(request);
    } catch (error) {
      return rejectWithValue('创建支持请求失败');
    }
  }
);

export const updateSupportRequest = createAsyncThunk(
  'support/updateRequest',
  async (
    { id, request }: { id: string; request: Partial<SupportRequestDto> },
    { rejectWithValue }
  ) => {
    try {
      return await supportApi.updateSupportRequest(id, request);
    } catch (error) {
      return rejectWithValue('更新支持请求失败');
    }
  }
);

export const deleteSupportRequest = createAsyncThunk(
  'support/deleteRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await supportApi.deleteSupportRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue('删除支持请求失败');
    }
  }
);

// 创建slice
const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    resetSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchSupportRequests
      .addCase(fetchSupportRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportRequests.fulfilled, (state, action: PayloadAction<SupportResponseDto[]>) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchSupportRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchSupportRequestById
      .addCase(fetchSupportRequestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportRequestById.fulfilled, (state, action: PayloadAction<SupportResponseDto>) => {
        state.isLoading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchSupportRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // createSupportRequest
      .addCase(createSupportRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createSupportRequest.fulfilled, (state, action: PayloadAction<SupportResponseDto>) => {
        state.isSubmitting = false;
        state.requests.push(action.payload);
      })
      .addCase(createSupportRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // updateSupportRequest
      .addCase(updateSupportRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateSupportRequest.fulfilled, (state, action: PayloadAction<SupportResponseDto>) => {
        state.isSubmitting = false;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.selectedRequest && state.selectedRequest.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
      })
      .addCase(updateSupportRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // deleteSupportRequest
      .addCase(deleteSupportRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteSupportRequest.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.requests = state.requests.filter(req => req.id !== action.payload);
        if (state.selectedRequest && state.selectedRequest.id === action.payload) {
          state.selectedRequest = null;
        }
      })
      .addCase(deleteSupportRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  }
});

// 导出actions和reducer
export const { resetSelectedRequest, clearError } = supportSlice.actions;
export default supportSlice.reducer;