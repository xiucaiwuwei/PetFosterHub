/**
 * 用户操作相关的数据传输对象
 */
import { BaseRequest } from "@/types";

/** 屏蔽用户的请求数据传输对象 */
export interface BlockUserRequest extends BaseRequest {
  userId: string; // 当前用户ID
  targetUserId: string; // 目标用户ID
}

/** 取消屏蔽用户的请求数据传输对象 */
export interface UnblockUserRequest extends BaseRequest {
  userId: string; // 当前用户ID
  targetUserId: string; // 目标用户ID
}