// 外部依赖
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// 内部依赖
import authService from '@/features/auth/services/authService';

// 类型导入
import { LoginRequest, LoginResponse, RegisterRequest, UpdateUserInfoRequest, UpdateUserInfoResponse, VerificationCodeRequest, VerificationCodeResponse, VerificationCodeVerifyRequest, VerificationCodeVerifyResponse, ResetPasswordRequest, ResetPasswordResponse } from '../types/dto';
import type { AuthState, StoredUserInfo } from '../types/entity';
import { UserRole } from '../types/enums';
import { LocalStorageManager } from '@/lib/utils';

// 常量定义
export const THIRD_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
export const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 提前5分钟刷新token

// 初始化状态
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  refreshToken: null,
  tokenExpireTime: null,
  error: null,
};

// 辅助函数：安全地将string类型转换为UserRole类型
export const safeConvertToUserType = (role: string | undefined | null): UserRole => {
  return role && Object.values(UserRole).includes(role as UserRole) 
    ? role as UserRole 
    : UserRole.OWNER; // 默认值
};

// 辅助函数：创建标准的异步action错误处理
const handleAsyncError = (error: any, defaultMessage: string, context?: Record<string, any>): string => {
  // 优先使用error.message，因为在authService中我们已经提取了response.message
  // 然后才尝试从error.response.data.message获取（适用于直接抛出API错误的情况）
  const errorMessage = error?.message || error?.response?.data?.message || defaultMessage;
  
  // 生产环境不输出详细日志
  if (process.env.NODE_ENV !== 'production' && context) {
    console.error(`[AuthSlice] ${defaultMessage}:`, { errorMessage, ...context });
  }
  
  return errorMessage;
};

// 登录异步action
export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (params: LoginRequest, { rejectWithValue }) => {
    const { phone } = params;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始登录请求', { phone, hasVerificationCode: !!params.verificationCode });
      }
      
      const result = await authService.login(params);
      if (!result) {
        const errorMsg = '登录失败：未获取到响应数据';
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice]', errorMsg);
        }
        throw new Error(errorMsg);
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 登录请求成功，获取到用户数据', { userId: result.userId, phone: result.phone, role: result.role });
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '登录失败', { phone });
      return rejectWithValue(errorMessage);
    }
  }
);

// 注册异步action
export const register = createAsyncThunk<
  void,
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (params: RegisterRequest, { rejectWithValue }) => {
    const { phone, role } = params;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始注册请求', { phone, role, hasVerificationCode: !!params.verificationCode });
      }
      
      await authService.register(params);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 注册请求成功');
      }
      
      return;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '注册失败', { phone, role });
      return rejectWithValue(errorMessage);
    }
  }
);

// 登出异步action
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始登出请求');
      }
      
      await authService.logout();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 登出请求成功');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AuthSlice] 登出过程中发生错误:', error);
      }
      // 即使登出API调用失败，也继续清除本地状态
    }
  }
);

// 刷新token异步action
export const refreshToken = createAsyncThunk<
  { accessToken: string },
  string,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (refreshTokenValue: string, { rejectWithValue }) => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始刷新token请求');
      }
      
      const result = await authService.refreshToken({
        refreshToken: refreshTokenValue,
        operationType: 'REFRESH_TOKEN',
        operationContent: 'Refresh access token'
      });
      
      if (!result || !result.data?.accessToken) {
        const errorMsg = '刷新token失败：未获取到有效token';
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice]', errorMsg);
        }
        throw new Error(errorMsg);
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 刷新token请求成功，获取到新token');
      }
      
      return { accessToken: result.data.accessToken };
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '刷新token失败');
      return rejectWithValue(errorMessage);
    }
  }
);

// 从本地存储加载用户信息
export const loadUserFromStorage = createAsyncThunk<
  StoredUserInfo | null,
  void,
  { rejectValue: string }
>(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始从本地存储加载用户信息');
      }
      
      // 检查是否已登录
      const isLoggedIn = authService.isLoggedIn();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 登录状态检查结果:', { isLoggedIn });
      }
      
      if (!isLoggedIn) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 用户未登录，跳过加载用户信息');
        }
        return null;
      }

      const userInfo = authService.getUserInfoFromStorage();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 从本地存储获取用户信息结果:', { hasUserInfo: !!userInfo });
      }
      
      if (!userInfo) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 未获取到用户信息，返回null');
        }
        return null;
      }

      // 检查是否需要刷新token
      const now = Date.now();
      const tokenExpireTime = userInfo.tokenExpireTime;
      
      if (tokenExpireTime && now > tokenExpireTime - REFRESH_BUFFER_MS) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] Token即将过期，尝试刷新');
        }
        
        try {
          if (userInfo.refreshToken) {
            if (process.env.NODE_ENV !== 'production') {
              console.log('[AuthSlice] 使用refreshToken刷新accessToken');
            }
            
            // 使用新的token更新本地存储和状态
            const refreshResponse = await authService.refreshToken({
              refreshToken: userInfo.refreshToken,
              operationType: 'REFRESH_TOKEN',
              operationContent: 'Refresh access token during auto-login'
            });
            
            if (refreshResponse && refreshResponse.data?.accessToken) {
              if (process.env.NODE_ENV !== 'production') {
                console.log('[AuthSlice] Token刷新成功，返回更新后的用户信息');
              }
              
              return {
                ...userInfo,
                token: refreshResponse.data.accessToken,
                // 保留原有的tokenExpireTime
                tokenExpireTime: userInfo.tokenExpireTime,
              };
            }
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[AuthSlice] 刷新token失败，继续使用原有token:', error instanceof Error ? error.message : '未知错误');
          }
          // 刷新失败不阻止加载用户信息
        }
      }

      // 返回用户信息
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 加载用户信息成功，准备返回', { userId: userInfo.user?.userId, role: userInfo.user?.role });
      }
      
      return userInfo;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '加载用户信息失败');
      return rejectWithValue(errorMessage);
    }
  }
);

// 验证验证码异步action
export const verifyVerificationCode = createAsyncThunk<
  VerificationCodeVerifyResponse,
  VerificationCodeVerifyRequest,
  { rejectValue: string }
>(
  'auth/verifyVerificationCode',
  async (params: VerificationCodeVerifyRequest, { rejectWithValue }) => {
    const { phone, role, code, type } = params;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始验证验证码请求', { phone, role, type });
      }
      
      const result = await authService.verifyVerificationCode({
        phone,
        role,
        code,
        type,
        operationType: 'VERIFY_VERIFICATION_CODE',
        operationContent: '验证验证码',
      });
      
      if (result && result.success) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 验证验证码请求成功');
        }
        return result;
      } else {
        const errorMessage = result?.message || '验证验证码失败';
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice] 验证验证码错误:', { errorMessage, phone, role });
        }
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '验证验证码失败，请稍后重试', { phone, role });
      return rejectWithValue(errorMessage);
    }
  }
);

// 发送验证码异步action
export const sendVerificationCode = createAsyncThunk<
  VerificationCodeResponse,
  VerificationCodeRequest,
  { rejectValue: string }
>(
  'auth/sendVerificationCode',
  async (params: VerificationCodeRequest, { rejectWithValue }) => {
    const { phone, role, type } = params;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始发送验证码请求', { phone, role, type });
      }
      
      const result = await authService.sendVerificationCode({
        phone,
        role,
        type,
        operationType: 'SEND_VERIFICATION_CODE',
        operationContent: '发送验证码',
      });
      
      if (result && result.success) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 发送验证码请求成功');
        }
        return result;
      } else {
        const errorMessage = result?.message || '发送验证码失败';
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice] 发送验证码错误:', { errorMessage, phone, role });
        }
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '发送验证码失败，请稍后重试', { phone, role });
      return rejectWithValue(errorMessage);
    }
  }
);

// 重置密码异步action
export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordRequest,
  { rejectValue: string }
>(
  'auth/resetPassword',
  async (params: ResetPasswordRequest, { rejectWithValue }) => {
    const { phone, role } = params;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始重置密码请求', { phone, role });
      }
      
      const result = await authService.resetPassword({
        ...params,
        operationType: 'RESET_PASSWORD',
        operationContent: '重置密码',
      });
      
      if (result && result.success) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 重置密码请求成功');
        }
        return result;
      } else {
        const errorMessage = result?.message || '重置密码失败';
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice] 重置密码错误:', { errorMessage, phone, role });
        }
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '重置密码失败，请稍后重试', { phone, role });
      return rejectWithValue(errorMessage);
    }
  }
);

// 更新用户信息异步action
export const updateUserProfile = createAsyncThunk<
  UpdateUserInfoResponse,
  UpdateUserInfoRequest,
  { rejectValue: string }
>(
  'auth/updateUserProfile',
  async (params: UpdateUserInfoRequest, { rejectWithValue }) => {
    const { nickname, userId } = params;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始更新用户信息请求', { userId, nickname });
      }
      
      const result = await authService.updateUserInfo(params);
      
      if (!result) {
        const errorMsg = '更新用户信息失败：未获取到响应数据';
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice]', errorMsg);
        }
        throw new Error(errorMsg);
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 更新用户信息请求成功', { success: result.success, message: result.message });
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = handleAsyncError(error, '更新用户信息失败', { userId });
      return rejectWithValue(errorMessage);
    }
  }
);

// 创建auth切片
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置认证状态
    setAuthState: (
      state,
      action: PayloadAction<Partial<AuthState>>
    ) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 手动设置认证状态', { updatedFields: Object.keys(action.payload) });
      }
      
      return {
        ...state,
        ...action.payload,
      };
    },
    
    // 清除认证状态
    clearAuthState: (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 清除所有认证状态');
      }
      
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpireTime = null;
      state.error = null;
    },
    
    // 清除错误信息
    clearError: (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 清除错误信息');
      }
      
      state.error = null;
    },
    
    // 更新用户信息
    updateUserInfo: (
      state,
      action: PayloadAction<Partial<StoredUserInfo['user']>>
    ) => {
      if (state.user) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 更新用户信息', { updatedFields: Object.keys(action.payload) });
        }
        
        state.user = {
          ...state.user,
          ...action.payload,
        };
        
        if (process.env.NODE_ENV !== 'production' && action.payload.nickname) {
          console.log('[AuthSlice] 用户信息更新结果', { userId: state.user.userId, updatedNickname: state.user.nickname });
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[AuthSlice] 尝试更新用户信息，但用户状态为null');
        }
      }
    },
  },
  extraReducers: (builder) => {
    // 登录
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 登录成功，更新认证状态', { 
            userId: action.payload.userId, 
            phone: action.payload.phone, 
            role: action.payload.role 
          });
        }
        
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        
        // 使用辅助函数安全转换role类型
        const userRole = safeConvertToUserType(action.payload.role);
        
        state.user = {
            userId: action.payload.userId ? action.payload.userId.toString() : '0',
            phone: action.payload.phone || '',
            role: userRole,
            nickname: action.payload.nickname || '',
            avatar: action.payload.avatar || '',
        };
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpireTime = Date.now() + THIRD_DAYS_IN_MS; // 三天有效期
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 认证状态更新完成，Token有效期至:', new Date(state.tokenExpireTime).toLocaleString());
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || '登录失败';
      });

    // 注册
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 注册成功，更新状态');
        }
        
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 注册失败，更新状态', { error: action.payload });
        }
        
        state.isLoading = false;
        state.error = action.payload || '注册失败';
      });

    // 登出
    builder.addCase(logout.fulfilled, (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 登出成功，清除所有认证状态');
      }
      
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpireTime = null;
      state.error = null;
    });

    // 刷新token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload && action.payload.accessToken) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[AuthSlice] Token刷新成功，更新accessToken');
          }
          
          state.token = action.payload.accessToken;
          state.error = null;
          // 保留现有的refreshToken和tokenExpireTime
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice] Token刷新失败，用户可能需要重新登录', { error: action.payload });
        }
        
        state.error = action.payload || '刷新token失败';
      });

    // 从本地存储加载用户信息
    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 开始从本地存储加载用户信息（Redux状态更新）');
        }
        
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 从本地存储加载用户信息完成', { hasPayload: !!action.payload });
        }
        
        state.isLoading = false;
        
        if (action.payload) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[AuthSlice] 加载到用户信息，更新认证状态');
          }
          
          state.isAuthenticated = true;
          
          // 确保user对象存在且role字段类型正确
          if (action.payload.user) {
            // 使用辅助函数安全转换role类型
            const userRole = safeConvertToUserType(action.payload.user.role);
            
            state.user = {
                userId: action.payload.user.userId ? action.payload.user.userId.toString() : '0',
                phone: action.payload.user.phone || '',
                role: userRole,
                nickname: action.payload.user.nickname || '',
                avatar: action.payload.user.avatar || '',
            };
            
            if (process.env.NODE_ENV !== 'production') {
              console.log('[AuthSlice] 用户信息更新完成', { userId: state.user.userId, role: state.user.role });
            }
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.log('[AuthSlice] 未加载到用户详细信息');
            }
            
            state.user = null;
          }
          
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.tokenExpireTime = action.payload.tokenExpireTime;
          
          if (process.env.NODE_ENV !== 'production' && state.tokenExpireTime) {
            console.log('[AuthSlice] 认证凭证更新完成，Token有效期至:', new Date(state.tokenExpireTime).toLocaleString());
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[AuthSlice] 未加载到任何用户信息，保持当前状态');
          }
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice] 加载用户信息失败，将保持未登录状态', { error: action.payload });
        }
        
        state.isLoading = false;
        state.error = action.payload || '加载用户信息失败';
      });
      
    // 更新用户信息
    builder
      .addCase(updateUserProfile.pending, (state) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 开始更新用户信息（Redux状态更新）');
        }
        
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[AuthSlice] 更新用户信息成功', { success: action.payload.success, message: action.payload.message });
        }
        
        state.isLoading = false;
        state.error = null;
        
        // 如果用户已登录且有用户信息，更新本地状态中的昵称
        if (state.user && action.meta.arg.nickname) {
          state.user.nickname = action.meta.arg.nickname;
          
          if (process.env.NODE_ENV !== 'production') {
            console.log('[AuthSlice] 本地用户信息已更新，新昵称:', state.user.nickname);
          }
          
          // 同时更新本地存储中的用户信息
          try {
            const currentUserInfo = authService.getUserInfoFromStorage();
            if (currentUserInfo && currentUserInfo.user) {
              currentUserInfo.user.nickname = action.meta.arg.nickname;
              LocalStorageManager.setItem('userInfo', currentUserInfo);
              
              if (process.env.NODE_ENV !== 'production') {
                console.log('[AuthSlice] 本地存储中的用户信息已更新');
              }
            }
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('[AuthSlice] 更新本地存储用户信息失败', error);
            }
          }
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AuthSlice] 更新用户信息失败', { error: action.payload });
        }
        
        state.isLoading = false;
        state.error = action.payload || '更新用户信息失败';
      })
    
    // 发送验证码
    .addCase(sendVerificationCode.pending, (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始发送验证码请求（Redux状态更新）');
      }
      
      state.isLoading = true;
      state.error = null;
    })
    .addCase(sendVerificationCode.fulfilled, (state, action) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 发送验证码请求成功（Redux状态更新）', { success: action.payload.success });
      }
      
      state.isLoading = false;
      state.error = null;
    })
    .addCase(sendVerificationCode.rejected, (state, action) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AuthSlice] 发送验证码失败（Redux状态更新）', { error: action.payload });
      }
      
      state.isLoading = false;
      state.error = action.payload || '发送验证码失败';
    })
    
    // 验证验证码
    .addCase(verifyVerificationCode.pending, (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始验证验证码请求（Redux状态更新）');
      }
      
      state.isLoading = true;
      state.error = null;
    })
    .addCase(verifyVerificationCode.fulfilled, (state, action) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 验证验证码请求成功（Redux状态更新）', { success: action.payload.success });
      }
      
      state.isLoading = false;
      state.error = null;
    })
    .addCase(verifyVerificationCode.rejected, (state, action) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AuthSlice] 验证验证码失败（Redux状态更新）', { error: action.payload });
      }
      
      state.isLoading = false;
      state.error = action.payload || '验证验证码失败';
    })
    
    // 重置密码
    .addCase(resetPassword.pending, (state) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 开始重置密码请求（Redux状态更新）');
      }
      
      state.isLoading = true;
      state.error = null;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthSlice] 重置密码请求成功（Redux状态更新）', { success: action.payload.success });
      }
      
      state.isLoading = false;
      state.error = null;
    })
    .addCase(resetPassword.rejected, (state, action) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AuthSlice] 重置密码失败（Redux状态更新）', { error: action.payload });
      }
      
      state.isLoading = false;
      state.error = action.payload || '重置密码失败';
    });
  },
});

// 导出同步actions
export const { setAuthState, clearAuthState, clearError, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;