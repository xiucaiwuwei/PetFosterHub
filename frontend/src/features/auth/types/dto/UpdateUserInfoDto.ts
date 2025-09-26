import {BaseRequest, BaseResponse} from "@/types";

// 更新用户信息请求参数
export interface UpdateUserInfoRequest extends BaseRequest {
    userId: string;
    nickname: string;
    password: string;
}

// 更新用户信息响应数据结构
export interface UpdateUserInfoResponse extends BaseResponse {
}