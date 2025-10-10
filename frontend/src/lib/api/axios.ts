/**
 * 自定义axios实例，用于处理API请求和响应
 * 包含全局配置、拦截器和错误处理
 */
import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { getToken, clearAuthInfo } from '@/lib/utils/TokenManager';
import { AuthState } from '@/features/auth/types/entity';

// 定义常量
const LOGIN_PATH = '/login';
const DEFAULT_BASE_URL = 'http://localhost:8080';

// 定义公开接口的正则表达式（这些接口不需要认证）
const PUBLIC_ENDPOINTS = [
  /\/api\/auth\/login/,
  /\/api\/auth\/register/,
  /\/api\/verification-code\/send/,
  /\/api\/auth\/forgot-password/,
  /\/api\/auth\/reset-password/,
  /\/api\/auth\/verify-email/,
  /\/api\/banners\/active/,
  /\/api\/home\/.*/, // 首页接口无需认证
];

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 允许跨域请求携带凭证(cookies等)
  maxRedirects: 0, // 禁用自动重定向跟随
  validateStatus: (status) => {
    // 包含302状态码，让我们可以在响应拦截器中处理重定向
    return status >= 200 && status < 500;
  },
});

// 开发环境下的请求和响应调试信息
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 避免记录认证相关的API请求，防止循环调用
      if (!config.url?.includes('/api/users/') && !config.url?.includes('/api/auth/')) {
        console.log('🚀 API请求:', config.method?.toUpperCase(), config.url);
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('❌ 请求错误:', error.message);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // 避免记录认证相关的API响应，防止循环调用
      if (!response.config.url?.includes('/api/users/') && !response.config.url?.includes('/api/auth/')) {
        console.log('✅ API响应:', response.status, response.config.url);
      }
      return response;
    },
    (error: AxiosError) => {
      console.error('❌ 响应错误:', error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
  );
}

// 确保所有请求始终包含正确的Content-Type
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果请求有数据且没有指定Content-Type，则设置为application/json
    if (config.data && !config.headers.get('Content-Type') && typeof config.data !== 'string') {
      config.headers.set('Content-Type', 'application/json');
      console.debug('设置Content-Type: application/json');
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 请求拦截器 - 统一处理认证
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 获取token的优化逻辑 - 避免在store初始化前访问
    let token: string | null = null;
    
    try {
      // 动态导入store以避免循环依赖
      const storeModule = await import('@/app/store/store');
      // 安全地尝试访问store
      const authState = storeModule.store?.getState?.()?.auth as AuthState;
      token = authState?.token || getToken();
    } catch (error) {
      // 如果store未初始化，直接从localStorage获取
      console.debug('Store未初始化，从localStorage获取token');
      token = getToken();
    }

    // 检查是否是不需要认证的公开接口
    const isPublicEndpoint = config.url && PUBLIC_ENDPOINTS.some(pattern => pattern.test(config.url!));
    // 详细记录token获取情况
    console.debug('Token获取状态:', {
      tokenExists: !!token,
      tokenLength: token ? token.length : 0,
      isPublicEndpoint,
      requestUrl: config.url
    });

    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
      console.log('添加认证头到请求:', config.url);
      // 对于auth相关接口，添加更详细的日志
      if (config.url?.includes('/api/auth/')) {
        console.log('Auth请求认证信息:', {
          url: config.url,
          hasAuthHeader: !!config.headers.get('Authorization'),
          withCredentials: config.withCredentials
        });
      }
    } else if (!isPublicEndpoint) {
      // 提升日志级别，更好地诊断token问题
      console.warn('需要认证的接口未找到token:', config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error.message);
    return Promise.reject(error);
  }
);

// 清理认证信息的工具函数
const clearAuthData = () => {
  // 清空本地存储
  clearAuthInfo();

  console.log('认证信息已清空，需要重新登录');
};

// 响应拦截器 - 处理认证错误和重定向
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对于成功的请求，返回完整的响应对象
    // 包含状态码和数据，以便前端可以根据不同状态码进行处理
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    
    console.error('❌ 响应错误:', status, error.config?.url);
    
    // 处理401未授权错误
    if (status === 401 && originalRequest) {
      console.log('检测到401错误，清理认证信息并重定向到登录页');
      clearAuthData();
      
      // 重定向到登录页
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== LOGIN_PATH) {
          window.location.href = LOGIN_PATH;
        }
      }
      
      return Promise.reject(error);
    }
    
    // 处理302重定向（如果后端返回重定向）
    if (status === 302 && originalRequest) {
      console.log('检测到302重定向');
      const location = error.response?.headers?.location;
      if (location && typeof window !== 'undefined') {
        window.location.href = location;
      }
      return Promise.reject(error);
    }
    
    // 统一错误处理
    // 安全地提取错误信息，确保即使在复杂嵌套结构中也能获取到正确的错误消息
    const errorData = error.response?.data as { message?: string; error?: string; msg?: string } | string | undefined;
    let errorMessage = '网络请求失败';
    
    if (errorData && typeof errorData === 'object') {
      // 尝试从不同可能的字段获取错误消息
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.msg) {
        errorMessage = errorData.msg;
      }
    } else if (errorData && typeof errorData === 'string') {
      errorMessage = errorData;
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// 导出HTTP方法 - 便捷使用
// 修复：确保返回response.data而不是完整的response对象
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
  apiClient.get(url, config).then(response => response.data);
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
  apiClient.post(url, data, config).then(response => response.data);
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
  apiClient.put(url, data, config).then(response => response.data);
export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
  apiClient.patch(url, data, config).then(response => response.data);
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
  apiClient.delete(url, config).then(response => response.data);

export default apiClient;