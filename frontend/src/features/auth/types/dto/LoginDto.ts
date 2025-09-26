import { BaseRequest, BaseResponse } from '@/types';
import { LoginType, UserRole } from '../enums';

// 登录请求参数
export interface LoginRequest extends BaseRequest {
  phone: string;
  password?: string;
  verificationCode?: string;
  role: UserRole;
  loginType: LoginType;
}

// 登录响应参数
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  phone: string;
  role: UserRole;
  nickname: string;
  avatar: string;
}

// 登出响应参数
export interface LogoutResponse  extends BaseResponse{
}