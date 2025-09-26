import axios from 'axios';
import { GetUserInfoDto, UpdateUserInfoDto } from '../types';

const API_URL = '/api/user';

/**
 * 获取当前登录用户信息
 */
export const getUserInfo = async (): Promise<GetUserInfoDto> => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
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
    const response = await axios.put(`${API_URL}/profile`, userData);
    return response.data;
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
    formData.append('avatar', file);
    
    const response = await axios.post(`${API_URL}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.avatarUrl;
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
    const response = await axios.get(`${API_URL}/role`);
    return response.data.role;
  } catch (error) {
    console.error('获取用户角色失败:', error);
    throw error;
  }
};