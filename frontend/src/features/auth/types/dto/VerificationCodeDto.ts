import { BaseRequest, BaseResponse } from '@/types';
import type { UserRole, VerificationCodeType } from '../enums';

// 发送验证码请求参数
export interface VerificationCodeRequest extends BaseRequest {
  // 手机号码 - 接收验证码的手机号
  phone: string;
  // 用户角色 - 请求验证码的用户角色
  role: UserRole;
  // 验证码类型 - 指定验证码的用途（登录、注册或重置密码）
  type: VerificationCodeType;
}

// 发送验证码响应数据结构
export interface VerificationCodeResponse extends BaseResponse {
}

// 验证码验证请求参数
export interface VerificationCodeVerifyRequest extends BaseRequest {
  // 手机号码 - 提交验证码的手机号
  phone: string;
  // 用户角色 - 提交验证码的用户角色
  role: UserRole;
  // 验证码 - 用户输入的验证码
  code: string;
  // 验证码类型 - 验证码的用途类型
  type: VerificationCodeType;
}

// 验证码验证响应数据结构
export interface VerificationCodeVerifyResponse extends BaseResponse {
}
