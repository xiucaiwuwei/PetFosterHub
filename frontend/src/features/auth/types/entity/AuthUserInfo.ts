import {UserRole} from "@/types";

// 用户信息接口，包含用户基本信息
export interface UserInfo {
    // 用户ID
    userId: string;
    // 手机号码
    phone: string;
    // 用户角色
    role: UserRole;
    // 用户昵称
    nickname: string;
    // 用户头像URL
    avatar: string;
}