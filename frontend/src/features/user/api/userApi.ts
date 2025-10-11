/**
 * 用户API模块
 * 提供用户相关的API调用，包括获取用户信息、更新用户信息、上传用户头像等
 */
import { get, put, post } from '@/lib/api/axios';
import { UserProfileResponse, UpdateUserInfoRequest } from '../types';
import type { BaseResponse } from '@/types/dto/baseDto';
import { uploadImage } from '@/features/uploads/api/uploadApi';
import { ImageUploadRequest } from '@/features/uploads/types';
import { FileTypes } from '@/features/uploads/types/enums/FileTypes';
/**
 * 获取当前登录用户信息
 */
export const getUserInfo = async (): Promise<BaseResponse<UserProfileResponse>> => {
  try {
    const response = await get<BaseResponse<UserProfileResponse>>(`api/users/profile`);

    if (!response.success) {
      throw new Error(response.message || '获取用户信息失败');
    }
    return response;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

/**
 * 更新用户信息
 * @param userData 要更新的用户数据
 */
export const updateUserInfo = async (userData: UpdateUserInfoRequest): Promise<BaseResponse<UserProfileResponse>> => {
  try {
    // 发送请求并获取响应
    const response = await put<BaseResponse<UserProfileResponse>>(`api/users/profile`, userData);
    // 检查响应是否成功
    if (!response.success) {
      throw new Error(response.message || '更新用户信息失败');
    }
    // 返回响应中的数据
    return response;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

/**
 * 用户登出
 * 清除用户的认证信息
 * @returns 登出结果响应
 */
export const logout = async (): Promise<BaseResponse> => {
  try {
    return await post<BaseResponse>('api/users/logout');
  } catch (error) {
    console.error('用户登出失败:', error);
    throw error;
  }
};

/**
 * 上传用户头像
 * @param file 头像文件
 * @returns 头像URL
 */
export const uploadUserAvatar = async (file: File): Promise<string> => {
  try {
    // 构建图片上传请求
    const uploadRequest: ImageUploadRequest = {
      file: file,
      fileType: FileTypes.Image,
      title: '用户头像',
      description: '用户个人头像',
      context: {
        usage: 'avatar',
        entityType: 'user'
      },
      generateThumbnail: true,
      thumbnailWidth: 200,
      thumbnailHeight: 200,
      operationType: 'UPLOAD_AVATAR',
      operationContent: '上传用户头像'
    };
    
    // 使用uploads模块的上传功能
    const response = await uploadImage(uploadRequest);
    
    // 检查响应是否成功
    if (!response.success) {
      throw new Error(response.message || '上传头像失败');
    }
    
    // 返回上传后的图片URL
    return response.data.url;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};