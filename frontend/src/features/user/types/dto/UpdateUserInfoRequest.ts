/**
 * 更新用户信息的数据传输对象
 */
import { BaseRequest } from '@/types';


// 更新用户信息请求参数
export interface UpdateUserInfoRequest extends BaseRequest {
  nickname?: string; // 昵称
  fullName?: string; // 姓名
  phone?: string; // 手机号
  address?: string; // 地址
  bio?: string; // 个人简介
  idCard?: string; // 身份证号
}