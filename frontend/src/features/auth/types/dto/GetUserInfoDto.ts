import { BaseRequest } from "@/types";
import {UserRole} from "@/types";

// 查询用户信息请求参数
export interface GetUserInfoRequest extends BaseRequest {
    // 手机号码（可选）- 用于根据手机号查询用户信息
    phone?: string;
    // 用户角色（可选）- 用于根据角色筛选用户
    role?: UserRole;
}

// 查询用户信息响应数据结构
export interface GetUserInfoResponse {
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