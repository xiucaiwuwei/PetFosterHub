// 外部依赖
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// 内部依赖
import { UserService } from '../services/userService';

// 类型导入
import type { UserProfileResponse, UpdateUserInfoRequest } from '../types';
import type { UserInfoState } from '../types/entity/UserInfoState';
import type { UserRole } from '@/types';

// 初始化状态
const initialState: UserInfoState = {
  userInfo: null,
  isLoading: false,
  error: null,
};

// 辅助函数：创建标准的异步action错误处理
const handleAsyncError = (error: any, defaultMessage: string): string => {
  const errorMessage = error?.message || error?.response?.data?.message || defaultMessage;
  return errorMessage;
};

// 获取用户信息异步action
export const fetchUserInfo = createAsyncThunk<
  UserProfileResponse,
  void,
  { rejectValue: string }
>(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const userInfo = await UserService.getCurrentUserInfo();
      return userInfo;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '获取用户信息失败');
      return rejectWithValue(errorMessage);
    }
  }
);

// 更新用户信息异步action
export const updateUserProfile = createAsyncThunk<
  UserProfileResponse,
  UpdateUserInfoRequest,
  { rejectValue: string }
>(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // 转换类型并处理可能的null值
      const sanitizedUserData: UpdateUserInfoRequest = {
        ...(userData.nickname && { nickname: userData.nickname }),
        ...(userData.address && { address: userData.address }),
        ...(userData.bio && { bio: userData.bio }),
        ...(userData.fullName && { fullName: userData.fullName }),
        ...(userData.idCard && { idCard: userData.idCard }),
        operationType: 'UPDATE',
        operationContent: '更新用户信息'
      };

      const updatedUserInfo = await UserService.updateCurrentUserInfo(sanitizedUserData);
      return updatedUserInfo;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '更新用户信息失败');
      return rejectWithValue(errorMessage);
    }
  }
);

// 登出异步action
export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    try {
      await UserService.logout();
    } catch (error) {
      throw error;
    }
  }
);

// 上传头像异步action
export const uploadUserAvatar = createAsyncThunk<
  string,
  File,
  { rejectValue: string }
>(
  'user/uploadUserAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const avatarUrl = await UserService.uploadAvatar(file);
      return avatarUrl;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '上传头像失败');
      return rejectWithValue(errorMessage);
    }
  }
);

// 创建user切片
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (
      state,
      action: PayloadAction<UserProfileResponse | null>
    ) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[UserSlice] 手动设置用户信息');
      }

      state.userInfo = action.payload;
    },

    // 清除用户信息
    clearUserInfo: (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[UserSlice] 清除用户信息');
      }

      state.userInfo = null;
      state.error = null;
    },

    // 清除错误信息
    clearError: (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[UserSlice] 清除错误信息');
      }

      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取用户信息
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserProfileResponse>) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[UserSlice] 获取用户信息成功');
        }

        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || '获取用户信息失败';
      });

    // 更新用户信息
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfileResponse>) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[UserSlice] 更新用户信息成功');
        }

        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || '更新用户信息失败';
      });

    // 登出
    builder.addCase(logout.fulfilled, (state) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[UserSlice] 登出成功，清除用户信息');
        }

        state.userInfo = null;
        state.isLoading = false;
        state.error = null;
      });

      // 上传头像
      builder
        .addCase(uploadUserAvatar.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(uploadUserAvatar.fulfilled, (state, action: PayloadAction<string>) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[UserSlice] 上传头像成功');
          }
          
          state.isLoading = false;
          if (state.userInfo) {
            state.userInfo.avatar = action.payload;
          }
        })
        .addCase(uploadUserAvatar.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload || '上传头像失败';
        });
  },
});

export const { setUserInfo, clearUserInfo, clearError } = userSlice.actions;

export default userSlice.reducer;