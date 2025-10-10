import { BaseRequest, BaseResponse, UserRole } from "@/types";

// 重置密码请求参数
export interface ResetPasswordRequest extends BaseRequest {
    // 手机号码
    phone: string;
    // 用户角色
    role: UserRole;
    // 验证码
    verificationCode: string;
    // 新密码
    newPassword: string;
}

// 重置密码响应数据
export interface ResetPasswordResponse extends BaseResponse {
}