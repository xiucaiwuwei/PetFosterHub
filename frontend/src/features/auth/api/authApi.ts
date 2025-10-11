import { post } from '@/lib/api';
import type { BaseResponse } from '@/types/dto/baseDto';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    VerificationCodeRequest,
    GetUserInfoRequest,
    GetUserInfoResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    UpdateUserInfoRequest,
    VerificationCodeResponse,
    VerificationCodeVerifyRequest,
    VerificationCodeVerifyResponse,
    ResetPasswordResponse,
    ResetPasswordRequest,
    RegisterResponse,
    UpdateUserInfoResponse
} from '../types/dto';

/**
 * 认证相关API接口
 */
const authApi = {
    /**
     * 用户登录
     * @param params 登录请求参数，包含用户名、密码等信息
     * @returns 登录结果的Promise，包含用户信息和令牌
     */
    login: async (params: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
        return await post<BaseResponse<LoginResponse>>('/api/auth/login', params);
    },

    /**
     * 刷新令牌
     * @param params 刷新令牌请求参数，通常包含刷新令牌
     * @returns 新的访问令牌及相关信息
     */
    refreshToken: async (params: RefreshTokenRequest): Promise<BaseResponse<RefreshTokenResponse>> => {
        return await post<BaseResponse<RefreshTokenResponse>>('/api/auth/refresh', params);
    },

    /**
     * 用户注册
     * @param params 注册请求参数，包括手机号、验证码、密码等
     * @returns 注册结果的Promise，包含成功状态和消息
     */
    register: async (params: RegisterRequest): Promise<RegisterResponse> => {
        return await post<RegisterResponse>('/api/auth/register', params);
    },

    /**
     * 更新用户信息
     * @param params 用户信息更新请求参数，如昵称、头像等
     * @returns 更新结果的Promise，包含成功状态和消息
     */
    updateUserInfo: async (params: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> => {
        return await post<UpdateUserInfoResponse>('/api/auth/update-info', params);
    },

    /**
     * 重置用户密码
     * @param params 重置密码请求参数，包含手机号、验证码、新密码等
     * @returns 重置结果的Promise，包含成功状态和消息
     */
    resetPassword: async (params: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        return await post<ResetPasswordResponse>('/api/auth/reset-password', params);
    },

    /**
     * 发送验证码
     * @param params 验证码请求参数，例如手机号和用途类型
     * @returns 发送结果的Promise，包含成功状态和消息
     */
    sendVerificationCode: async (params: VerificationCodeRequest): Promise<VerificationCodeResponse> => {
        return await post<VerificationCodeResponse>('/api/verification-code/send', params);
    },

    /**
     * 验证验证码
     * @param params 验证码验证请求参数，包含手机号和输入的验证码
     * @returns 验证结果的Promise，包含是否验证成功的信息
     */
    verifyVerificationCode: async (params: VerificationCodeVerifyRequest): Promise<VerificationCodeVerifyResponse> => {
        return await post<VerificationCodeVerifyResponse>('/api/verification-code/verify', params);
    },

    /**
     * 根据ID或手机号+角色组合查询用户信息
     * @param params 查询参数，包含用户的id或phone和role字段
     * @returns 用户信息的Promise对象
     */
    getUserInfo: async (params: GetUserInfoRequest): Promise<BaseResponse<GetUserInfoResponse>> => {
        return await post<BaseResponse<GetUserInfoResponse>>('/api/auth/get-user-info', params);
    },

};

export default authApi;
