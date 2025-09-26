import { UserInfo } from "./UserInfo";

// 本地存储的用户信息
export interface StoredUserInfo {
    user: UserInfo;
    token: string;
    refreshToken: string;
    tokenExpireTime: number;
    storageTime: number;
}