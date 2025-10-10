/**
 * 用户API模块
 * 提供用户相关的API调用，包括获取用户信息、更新用户信息、上传用户头像等
 */
import { get, put, post } from '@/lib/api/axios';
import { GetUserInfoDto, UpdateUserInfoDto } from '../types';
import { UserRole } from '@/types';

/**
 * 获取当前登录用户信息
 */
export const getUserInfo = async (): Promise<GetUserInfoDto> => {
  try {
    const response = await get<{
      success: boolean;
      message: string;
      data: GetUserInfoDto;
      timestamp: string;
    }>(`/api/users/profile`);
    
    if (!response.success) {
      throw new Error(response.message || '获取用户信息失败');
    }
    
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

/**
 * 更新用户信息
 * @param userData 要更新的用户数据
 */
export const updateUserInfo = async (userData: UpdateUserInfoDto): Promise<GetUserInfoDto> => {
  try {
    return await put<GetUserInfoDto>(`/api/users/profile`, userData);
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

/**
 * 上传用户头像
 * @param file 头像文件
 */
export const uploadUserAvatar = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    return await post<string>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

/**
 * 获取用户角色
 */
export const getUserRole = async (): Promise<string> => {
  try {
    const result = await get<{ role: UserRole }>(`/api/users/role`);
    return result.role;
  } catch (error) {
    console.error('获取用户角色失败:', error);
    throw error;
  }
};