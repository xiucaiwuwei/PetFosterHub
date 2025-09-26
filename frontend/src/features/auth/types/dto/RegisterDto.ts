import type {BaseRequest, BaseResponse} from '@/types';
import type {UserRole} from '../enums';

// 注册请求参数
export interface RegisterRequest extends BaseRequest {
  phone: string;
  role: UserRole;
  verificationCode?: string;
}

// 注册响应数据结构
export interface RegisterResponse extends BaseResponse {
}