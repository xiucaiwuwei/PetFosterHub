// 外部依赖
import {getToken, setToken} from '@/lib/utils/TokenManager';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';

// 内部依赖
import authApi from '../api/authApi';
import { UserService } from '../../user/services/userService';

// 类型导入
import type {BaseResponse} from '@/types';
import type {UserRole} from '@/types';
import type {StoredUserInfo} from '../types/entity';
import type {
    GetUserInfoRequest,
    GetUserInfoResponse,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UpdateUserInfoRequest,
    UpdateUserInfoResponse,
    VerificationCodeRequest,
    VerificationCodeResponse,
    VerificationCodeVerifyRequest,
    VerificationCodeVerifyResponse
} from '../types/dto';

// 三天的毫秒数
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

// 认证服务
class AuthService {
    // 发送验证码
    async sendVerificationCode(params: VerificationCodeRequest): Promise<VerificationCodeResponse> {
        const { phone, role, type } = params;
        console.log('[AuthService] 开始发送验证码', { phone, role, type });
        try {
            const response = await authApi.sendVerificationCode(params);
            console.log('[AuthService] 发送验证码成功');
            return response;
        } catch (error) {
            console.error('[AuthService] 发送验证码失败', { error: error instanceof Error ? error.message : '未知错误', phone, type });
            throw error;
        }
    }

    // 验证验证码
    async verifyVerificationCode(params: VerificationCodeVerifyRequest): Promise<VerificationCodeVerifyResponse> {
        const { phone, type } = params;
        console.log('[AuthService] 开始验证验证码', { phone, type });
        try {
            const response = await authApi.verifyVerificationCode(params);
            console.log('[AuthService] 验证码验证结果', { success: response.success });
            return response;
        } catch (error) {
            console.error('[AuthService] 验证码验证失败', { error: error instanceof Error ? error.message : '未知错误', phone, type });
            throw error;
        }
    }

    // 登录并存储用户信息 - 支持密码和验证码登录
    async login(params: LoginRequest): Promise<LoginResponse> {
        const { phone, role, loginType } = params;
        console.log('[AuthService] 开始登录流程', { phone, role, loginType });
        try {
            const response = await authApi.login(params);
            console.log('[AuthService] 登录接口返回状态', { success: response.success });

            if (!response.success) {
                console.error('[AuthService] 登录失败: API返回失败状态', { message: response.message });
                throw new Error(response.message || '登录失败');
            }

            // 存储用户信息到本地，实现三天自动登录
            if (response.data?.accessToken) {
                console.log('[AuthService] 存储用户信息到本地存储');
                this.storeUserInfo(response.data);
                console.log('[AuthService] 登录流程完成，用户信息准备返回', { userId: response.data.userId });
                return response.data;
            } else {
                console.error('[AuthService] 登录失败：未获取到有效token');
                throw new Error('登录失败：未获取到有效token');
            }
        } catch (error) {
            console.error('[AuthService] 登录流程异常', { error: error instanceof Error ? error.message : '未知错误', phone, role });
            throw error;
        }
    }

    // 注册
    async register(params: RegisterRequest): Promise<RegisterResponse> {
        const { phone, role } = params;
        console.log('[AuthService] 开始注册流程', { phone, role, hasVerificationCode: !!params.verificationCode });
        try {
            const response = await authApi.register(params);
            console.log('[AuthService] 注册接口返回状态', { success: response.success });

            if (!response.success) {
                console.error('[AuthService] 注册失败: API返回失败状态', { message: response.message });
                
                // 处理并简化错误消息，提高用户体验
                let errorMessage = response.message || '注册失败';
                
                // 检测并提取关键错误信息
                if (errorMessage.includes('Column') && errorMessage.includes('cannot be null')) {
                    const columnMatch = errorMessage.match(/Column '([^']+)'/);
                    if (columnMatch && columnMatch[1]) {
                        const fieldName = columnMatch[1];
                        // 将字段名转换为用户友好的中文名称
                        const fieldMap: Record<string, string> = {
                            nickname: '昵称',
                            phone: '手机号',
                            password: '密码'
                        };
                        const friendlyField = fieldMap[fieldName] || fieldName;
                        if (fieldName === 'nickname') {
                            // 昵称可以为空，跳过错误
                            return response;
                        }
                        errorMessage = `请填写${friendlyField}`;
                    }
                } else if (errorMessage.includes('could not execute statement')) {
                    // 简化SQL相关错误
                    const causeMatch = errorMessage.match(/\[([^\]]+)]/);
                    if (causeMatch && causeMatch[1]) {
                        errorMessage = causeMatch[1];
                    } else {
                        errorMessage = '注册信息不完整，请检查后重试';
                    }
                }
                
                throw new Error(errorMessage);
            }

            return response;
        } catch (error) {
            console.error('[AuthService] 注册流程异常', { error: error instanceof Error ? error.message : '未知错误', phone, role });
            throw error;
        }
    }

    // 根据用户ID或手机号+角色组合获取用户信息
    async getUserInfoByIdOrPhone(params: GetUserInfoRequest): Promise<BaseResponse<GetUserInfoResponse>> {
        const { phone, role } = params;
        console.log('[AuthService] 开始获取用户信息', { phone, role });
        try {
            const response = await authApi.getUserInfo(params);
            console.log('[AuthService] 获取用户信息接口返回状态', { success: response.success });

            if (!response.success) {
                console.error('[AuthService] 获取用户信息失败: API返回失败状态', { message: response.message });
                throw new Error(response.message || '获取用户信息失败');
            }

            return response;
        } catch (error) {
            console.error('[AuthService] 获取用户信息异常', { error: error instanceof Error ? error.message : '未知错误', phone, role });
            throw error;
        }
    }

    // 更新用户信息
    async updateUserInfo(params: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> {
        const updateFields = Object.keys(params).filter(key => params[key as keyof typeof params] !== undefined);
        console.log('[AuthService] 开始更新用户信息', { updateFields });
        try {
            // 从本地存储获取当前用户信息
            const currentUserInfo = this.getUserInfoFromStorage();
            
            // 增强的用户信息验证逻辑
            if (!currentUserInfo || !currentUserInfo.user || !currentUserInfo.user.userId) {
                console.error('[AuthService] 更新用户信息失败：用户未登录或信息不完整');
                throw new Error('用户未登录或登录信息无效');
            }

            const updateParams: UpdateUserInfoRequest = {
                userId: String(currentUserInfo.user.userId),
                nickname: params.nickname,
                password: params.password,
                operationType: params.operationType,
                operationContent: params.operationContent
            };
            
            const response = await authApi.updateUserInfo(updateParams);
            console.log('[AuthService] 更新用户信息接口返回状态', { success: response.success });

            if (!response.success) {
                console.error('[AuthService] 更新用户信息失败: API返回失败状态', { message: response.message });
                throw new Error(response.message || '更新用户信息失败');
            }

            return response;
        } catch (error) {
            console.error('[AuthService] 更新用户信息异常', { error: error instanceof Error ? error.message : '未知错误', updateFields });
            throw error;
        }
    }

    // 检查用户是否已登录
    isLoggedIn(): boolean {
        console.log('[AuthService] 检查用户登录状态');
        const token = getToken();
        const userInfo = this.getUserInfoFromStorage();

        if (!token || !userInfo) {
            console.log('[AuthService] 用户未登录：token或userInfo缺失', { hasToken: !!token, hasUserInfo: !!userInfo });
            return false;
        }

        // 检查token是否过期（考虑三天有效期）
        const now = Date.now();
        const storageTime = userInfo.storageTime;
        const isExpired = now - storageTime > THREE_DAYS;

        if (isExpired) {
            console.log('[AuthService] 用户登录信息已过期，清除登录信息');
            // 超过三天，清除信息并返回未登录
            UserService.clearUserInfo();
            return false;
        }

        console.log('[AuthService] 用户已登录，登录信息有效');
        return true;
    }

    // 从本地存储获取用户信息
    getUserInfoFromStorage(): StoredUserInfo | null {
        try {
            const userInfo = LocalStorageManager.getItem<StoredUserInfo>('userInfo') || null;
            console.log('[AuthService] 本地存储用户信息获取结果', { hasUserInfo: !!userInfo });
            return userInfo;
        } catch (error) {
            console.error('[AuthService] 从本地存储获取用户信息异常', { error: error instanceof Error ? error.message : '未知错误' });
            return null;
        }
    }

    // 刷新token
    async refreshToken(params: RefreshTokenRequest): Promise<BaseResponse<RefreshTokenResponse>> {
        console.log('[AuthService] 开始刷新token流程');
        try {
            const response = await authApi.refreshToken(params);
            
            if (!response.success || !response.data?.accessToken) {
                console.error('[AuthService] 刷新token失败: 响应状态为false或data为空', {
                    success: response.success,
                    hasData: !!response.data
                });
                throw new Error('刷新token失败');
            }

            // 更新token
            setToken(response.data.accessToken);

            // 更新本地存储中的token
            const userInfo = this.getUserInfoFromStorage();
            if (userInfo) {
                userInfo.token = response.data.accessToken;
                LocalStorageManager.setItem('userInfo', userInfo);
            } else {
                console.warn('[AuthService] 未找到用户信息，仅更新内存中的token');
            }

            console.log('[AuthService] token刷新流程完成');
            return response;
        } catch (error) {
            console.error('[AuthService] 刷新token异常', { error: error instanceof Error ? error.message : '未知错误' });
            throw error;
        }
    }

    // 重置密码
    async resetPassword(params: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        const { phone } = params;
        console.log('[AuthService] 开始重置密码流程', { phone });
        try {
            const response = await authApi.resetPassword(params);

            if (!response.success) {
                console.error('[AuthService] 密码重置失败:', { message: response.message });
                throw new Error(response.message || '密码重置失败');
            }

            console.log('[AuthService] 密码重置流程完成');
            return response;
        } catch (error) {
            console.error('[AuthService] 重置密码异常', { error: error instanceof Error ? error.message : '未知错误', phone });
            throw error;
        }
    }

    // 存储用户信息到本地
    private storeUserInfo(loginResponse: LoginResponse): void {
        const { userId, accessToken, refreshToken } = loginResponse;
        console.log('[AuthService] 开始存储用户信息到本地', { userId });

        const userInfo: StoredUserInfo = {
            user: {
                userId: userId ? userId.toString() : '0',
                phone: loginResponse.phone || '',
                role: loginResponse.role as UserRole,
                nickname: loginResponse.nickname || '',
                avatar: loginResponse.avatar || '',
            },
            token: accessToken,
            refreshToken: refreshToken || '',
            tokenExpireTime: Date.now() + THREE_DAYS,
            storageTime: Date.now()
        };

        LocalStorageManager.setItem('userInfo', userInfo);
        setToken(accessToken);

        console.log('[AuthService] 用户信息存储完成，有效期至:', new Date(userInfo.tokenExpireTime).toISOString());
    }

    // 清除本地存储的用户信息
    // 注意：清除用户信息功能已迁移到UserService
    // private clearUserInfo(): void {
    //     LocalStorageManager.removeItem('userInfo');
    //     removeToken();
    //     console.log('[AuthService] 本地存储的用户信息已清除');
    // }
}

export default new AuthService();