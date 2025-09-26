import { BaseRequest, BaseResponse } from '@/types';
import type { UserRole, VerificationCodeType } from '../enums';

// 发送验证码请求参数
export interface VerificationCodeRequest extends BaseRequest {
  phone: string;
  role: UserRole;
  type: VerificationCodeType;
}
// 发送验证码响应数据结构
export interface VerificationCodeResponse extends BaseResponse {
}

// 验证码验证请求参数
export interface VerificationCodeVerifyRequest extends BaseRequest {
  phone: string;
  role: UserRole;
  code: string;
  type: VerificationCodeType;
}

// 验证码验证响应数据结构
export interface VerificationCodeVerifyResponse extends BaseResponse {
}
