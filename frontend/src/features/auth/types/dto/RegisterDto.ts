import type {BaseRequest, BaseResponse ,UserRole} from '@/types';

// 注册请求参数
export interface RegisterRequest extends BaseRequest {
  // 手机号码
  phone: string;
  // 用户角色
  role: UserRole;
  // 验证码（可选）- 用于验证用户身份
  verificationCode?: string;
}

// 注册响应数据结构
export interface RegisterResponse extends BaseResponse {
}