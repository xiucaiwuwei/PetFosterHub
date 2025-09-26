import { BaseRequest } from "@/types";
import { UserRole } from "../enums";

// 查询用户信息请求参数
export interface GetUserInfoRequest extends BaseRequest {
    phone?: string;
    role?: UserRole;
}

// 查询用户信息响应数据结构
export interface GetUserInfoResponse {
    userId: string;
    phone: string;
    role: UserRole;
    nickname: string;
    avatar: string;
}