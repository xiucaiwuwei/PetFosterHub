import {BaseRequest, BaseResponse} from "@/types";

// 更新用户信息请求参数
export interface UpdateUserInfoRequest extends BaseRequest {
    // 用户ID - 要更新信息的用户标识
    userId: string;
    // 用户昵称 - 新的用户昵称
    nickname: string;
    // 密码 - 新的用户密码
    password: string;
}

// 更新用户信息响应数据结构
export interface UpdateUserInfoResponse extends BaseResponse {
}