import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/userService';
import { GetUserInfoDto, UpdateUserInfoDto } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/app/store/store';

interface UseUserProfileReturn {
  userInfo: GetUserInfoDto | null;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editedUserInfo: GetUserInfoDto | null;
  setEditedUserInfo: (userInfo: GetUserInfoDto | null) => void;
  refreshUserInfo: () => Promise<void>;
  updateUserInfo: (userData: UpdateUserInfoDto) => Promise<void>;
  handleLogout: () => void;
}

/**
 * 用于管理用户个人资料的自定义hook
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [userInfo, setUserInfo] = useState<GetUserInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState<GetUserInfoDto | null>(null);

  /**
   * 获取用户信息
   */
  const fetchUserInfo = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await UserService.getCurrentUserInfo();
      setUserInfo(data);
      setEditedUserInfo({ ...data });
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * 刷新用户信息
   */
  const refreshUserInfo = useCallback(async () => {
    await fetchUserInfo();
  }, [fetchUserInfo]);

  /**
   * 更新用户信息
   */
  const updateUserInfo = useCallback(async (userData: UpdateUserInfoDto) => {
    try {
      const updatedData = await UserService.updateCurrentUserInfo(userData);
      setUserInfo(updatedData);
      setEditedUserInfo({ ...updatedData });
      setIsEditing(false);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }, []);

  /**
   * 处理用户登出
   */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  // 初始加载和认证状态变化时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // 当用户信息变化时，同步更新编辑状态的用户信息
  useEffect(() => {
    if (userInfo && isEditing) {
      setEditedUserInfo({ ...userInfo });
    }
  }, [userInfo, isEditing]);

  return {
    userInfo,
    isLoading,
    isEditing,
    setIsEditing,
    editedUserInfo,
    setEditedUserInfo,
    refreshUserInfo,
    updateUserInfo,
    handleLogout
  };
};