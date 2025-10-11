/**
 * 用户服务类
 * 提供用户信息管理和操作的方法
 */
import { UserProfileResponse, UpdateUserInfoRequest } from '../types';
import { toast } from 'sonner';
import { getUserInfo, updateUserInfo, logout, uploadUserAvatar } from '../api/userApi';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';
import { removeToken } from '@/lib/utils/TokenManager';

/**
 * 用户信息服务
 */
export class UserService {
  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  static async getCurrentUserInfo(): Promise<UserProfileResponse> {
    try {
      const userInfo = await getUserInfo();
      return userInfo.data;
    } catch (error) {
      toast.error('获取用户信息失败，请稍后重试');
      throw error;
    }
  }

  /**
   * 更新当前用户信息
   * @param userData 要更新的用户数据
   * @returns 更新后的用户信息
   */
  static async updateCurrentUserInfo(userData: UpdateUserInfoRequest): Promise<UserProfileResponse> {
    try {
      const updatedUserInfo = await updateUserInfo(userData);
      toast.success('个人信息更新成功！');
      return updatedUserInfo.data;
    } catch (error) {
      toast.error('更新个人信息失败，请稍后重试');
      throw error;
    }
  }

  /**
   * 上传用户头像
   * @param file 头像文件
   * @returns 头像URL
   */
  static async uploadAvatar(file: File): Promise<string> {
    try {
      const avatarUrl = await uploadUserAvatar(file);
      toast.success('头像上传成功！');
      return avatarUrl;
    } catch (error) {
      toast.error('上传头像失败，请稍后重试');
      throw error;
    }
  }

  /**
   * 验证用户输入数据
   * @param userData 要验证的用户数据
   * @returns 验证结果和错误信息
   */
  static validateUserInput(userData: Partial<UpdateUserInfoRequest>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // 验证昵称
    if (userData.nickname && userData.nickname.trim().length === 0) {
      errors.nickname = '昵称不能为空';
    }

    // 验证真实姓名
    if (userData.fullName && userData.fullName.trim().length === 0) {
      errors.fullName = '真实姓名不能为空';
    }

    // 验证身份证号（简单验证）
    if (userData.idCard && !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(userData.idCard)) {
      errors.idCard = '请输入有效的身份证号码';
    }

    // 验证地址
    if (userData.address && userData.address.trim().length === 0) {
      errors.address = '地址不能为空';
    }

    // 验证个人简介长度
    if (userData.bio && userData.bio.length > 500) {
      errors.bio = '个人简介不能超过500个字符';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * 用户登出
   * @returns 登出结果
   */
  static async logout(): Promise<void> {
    try {
      const response = await logout();
      if (!response.success) {
        throw new Error(response.message || '登出失败');
      }
      toast.success('用户登出成功！');
    } catch (error) {
      toast.error('登出失败，请稍后重试');
      throw error;
    } finally {
      // 无论登出请求是否成功，都清除本地用户信息
      UserService.clearUserInfo();
    }
  }

  /**
   * 清除本地存储的用户信息
   */
  public static clearUserInfo(): void {
    LocalStorageManager.removeItem('userInfo');
    removeToken();
    console.log('[UserService] 本地存储的用户信息已清除');
  }
}