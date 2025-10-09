/**
 * 用户服务类
 * 提供用户信息管理和操作的方法
 */
import { GetUserInfoDto, UpdateUserInfoDto } from '../types';
import { toast } from 'sonner';
import { getUserInfo, updateUserInfo, uploadUserAvatar } from '../api/userApi';

/**
 * 用户信息服务
 */
export class UserService {
  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  static async getCurrentUserInfo(): Promise<GetUserInfoDto> {
    try {
      const userInfo = await getUserInfo();
      return userInfo;
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
  static async updateCurrentUserInfo(userData: UpdateUserInfoDto): Promise<GetUserInfoDto> {
    try {
      const updatedUserInfo = await updateUserInfo(userData);
      toast.success('个人信息更新成功！');
      return updatedUserInfo;
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
  static validateUserInput(userData: Partial<UpdateUserInfoDto>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // 验证姓名
    if (userData.name && userData.name.trim().length === 0) {
      errors.name = '姓名不能为空';
    }

    // 验证电话格式（简单验证）
    if (userData.phone && !/^1[3-9]\d{9}$/.test(userData.phone)) {
      errors.phone = '请输入有效的手机号码';
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
}