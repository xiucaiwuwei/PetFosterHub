import { UserInfo } from "./UserInfo";

// 本地存储的用户信息接口 - 定义在本地存储中保存的用户认证数据
export interface StoredUserInfo {
    // 用户信息 - 当前登录用户的详细信息
    user: UserInfo;
    // 访问令牌 - 用于API请求的身份验证
    token: string;
    // 刷新令牌 - 用于获取新的访问令牌
    refreshToken: string;
    // 令牌过期时间 - 访问令牌的过期时间戳
    tokenExpireTime: number;
    // 存储时间 - 数据在本地存储的时间戳
    storageTime: number;
}