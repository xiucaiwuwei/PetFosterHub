/**
 * 用户信息状态类型
 */
import { UserInfo } from './UserInfo';

export interface UserInfoState {
  userInfo: UserInfo | null; // 用户信息
  isLoading: boolean; // 是否加载中
  error: string | null; // 错误信息
}