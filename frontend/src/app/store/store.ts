import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import authReducer from '../../features/auth/slice/authSlice';
import homeReducer from '../../features/home/slice/homeSlice';
import fosterReducer from '../../features/foster/slice/fosterSlice';
import messageReducer from '../../features/messages/slice/messageSlice';
import { ErrorHandler } from '@/lib/utils';

// Redux Persist 相关的常量
const PERSIST_ACTIONS = [
  'persist/PERSIST',
  'persist/REHYDRATE',
  'persist/FLUSH',
  'persist/PAUSE',
  'persist/PURGE',
  'persist/REGISTER'
] as const;

// 持久化配置
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'refreshToken'], // 持久化用户信息和token
};

// 自定义中间件：极简日志记录
const loggerMiddleware: Middleware = () => (next) => (action: any) => {
  if (process.env.NODE_ENV === 'development') {
    // 只记录非persist相关的action
    if (!action.type.startsWith('persist/')) {
      console.log(`Action: ${action.type}`);
    }
  }
  return next(action);
};

// 自定义中间件：错误处理
const errorMiddleware: Middleware = (_store) => (next) => (action: any) => {
  // 确保 action 和 action.messageType 存在再调用 endsWith 方法
  if (action && action.type && typeof action.type === 'string' && action.type.endsWith('/rejected')) {
    const errorMessage = ErrorHandler.normalizeError(action.payload, '操作失败');
    console.error('Redux Error:', errorMessage);
    
    // 可以在这里集成错误上报服务
    if (process.env.NODE_ENV === 'production') {
      // 例如：Sentry.captureException(action.payload);
    }
  }
  
  return next(action);
};

// 性能监控中间件
const PERFORMANCE_THRESHOLD = 16; // 超过一帧的时间（16ms）
const performanceMiddleware: Middleware = (_store) => (next) => (action: any) => {
  // 检查是否在浏览器环境中且有performance对象
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    const result = next(action);
    const end = performance.now();
    
    if (end - start > PERFORMANCE_THRESHOLD) {
      console.warn(`Slow Redux Action: ${action.type} took ${end - start}ms`);
    }
    
    return result;
  }
  
  // 在非浏览器环境中，直接传递action
  return next(action);
};

// 定义reducer映射
const reducers = {
  auth: persistReducer(authPersistConfig, authReducer),
  home: homeReducer,
  foster: fosterReducer,
  message: messageReducer,
} as const;

// 配置Store
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [...PERSIST_ACTIONS],
        ignoredPaths: ['auth.user'],
      },
    }).concat(
      loggerMiddleware,
      errorMiddleware,
      performanceMiddleware
    ),
  devTools: {
    name: 'PetFosterHub',
    trace: process.env.NODE_ENV !== 'production',
    traceLimit: 25,
  },
});

// 创建持久化store
export const persistor = persistStore(store);

// 设置监听器（用于RTK Query）
setupListeners(store.dispatch);

// 类型定义
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 从store中导出dispatch和selector hooks
export const useAppDispatch = () => store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Store工具函数
export const storeUtils = {
  /**
   * 重置整个store到初始状态
   */
  resetStore: () => {
    persistor.purge();
    store.dispatch({ type: 'RESET_STORE' });
  },

  /**
   * 获取当前store状态快照
   */
  getStateSnapshot: () => {
    return JSON.parse(JSON.stringify(store.getState()));
  },

  /**
   * 等待特定条件满足
   */
  waitForCondition: (condition: (state: RootState) => boolean, timeout = 5000) => {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
      
      const checkCondition = () => {
        if (condition(store.getState())) {
          resolve();
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error('Condition check timeout'));
          return;
        }
        
        setTimeout(checkCondition, 50);
      };
      
      checkCondition();
    });
  },
};

export default store;