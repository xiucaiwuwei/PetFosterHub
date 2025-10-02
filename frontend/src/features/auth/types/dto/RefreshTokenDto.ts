import { BaseRequest } from "@/types";

// 刷新令牌请求参数
export interface RefreshTokenRequest extends BaseRequest {
    // 刷新令牌，用于获取新的访问令牌
    refreshToken: string;
}

// 刷新令牌响应数据
export interface RefreshTokenResponse {
    // 新生成的访问令牌
    accessToken: string;
}