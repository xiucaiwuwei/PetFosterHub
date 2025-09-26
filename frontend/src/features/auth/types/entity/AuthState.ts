import {UserInfo} from "./UserInfo";

// 认证状态接口
export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserInfo | null;
    token: string | null;
    refreshToken: string | null;
    tokenExpireTime: number | null;
    error: string | null;
}