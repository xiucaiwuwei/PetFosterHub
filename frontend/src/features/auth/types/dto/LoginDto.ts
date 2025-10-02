import { BaseRequest, BaseResponse } from '@/types';
import { LoginType, UserRole } from '../enums';

// 登录请求参数
export interface LoginRequest extends BaseRequest {
  // 手机号码
  phone: string;
  // 密码（可选）- 密码登录方式时使用
  password?: string;
  // 验证码（可选）- 验证码登录方式时使用
  verificationCode?: string;
  // 用户角色
  role: UserRole;
  // 登录类型 - 密码登录或验证码登录
  loginType: LoginType;
}

// 登录响应参数
export interface LoginResponse {
  // 访问令牌
  accessToken: string;
  // 刷新令牌
  refreshToken: string;
  // 用户ID
  userId: number;
  // 手机号码
  phone: string;
  // 用户角色
  role: UserRole;
  // 用户昵称
  nickname: string;
  // 用户头像URL
  avatar: string;
}

// 登出响应参数
export interface LogoutResponse extends BaseResponse {
}