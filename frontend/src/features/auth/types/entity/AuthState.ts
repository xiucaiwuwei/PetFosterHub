import {UserInfo} from "./AuthUserInfo";

// 认证状态接口 - 存储用户认证相关的状态信息
export interface AuthState {
    // 是否已认证 - 表示用户是否已登录
    isAuthenticated: boolean;
    // 是否正在加载 - 表示认证状态是否正在加载中
    isLoading: boolean;
    // 用户信息 - 当前登录用户的详细信息
    user: UserInfo | null;
    // 访问令牌 - 用于API请求的身份验证
    token: string | null;
    // 刷新令牌 - 用于获取新的访问令牌
    refreshToken: string | null;
    // 令牌过期时间 - 访问令牌的过期时间戳
    tokenExpireTime: number | null;
    // 错误信息 - 认证过程中可能出现的错误信息
    error: string | null;
}