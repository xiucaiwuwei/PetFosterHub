// 通用请求基类
export interface BaseRequest {
  operationType: string;
  operationContent: string;
}

// 通用响应基类
export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}