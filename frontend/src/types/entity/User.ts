/**
 * 用户实体 - 表示系统中的用户
 */
import { UserRole } from "../enums/UserRole";

export interface User {
    id: number; // 用户ID
    phone: string; // 手机号 (必填)
    password: string; // 密码 (必填)
    role: UserRole; // 用户角色
    nickname?: string; // 昵称
    avatar?: string; // 头像URL
    idCard?: string; // 身份证号
    fullName?: string; // 姓名
    address?: string; // 地址
    bio?: string; // 个人简介
    rating?: number; // 评分
    reviewCount?: number; // 评价数量
    deleted?: number; // 逻辑删除标记
    createdAt?: string; // 创建时间
    updatedAt?: string; // 更新时间
}