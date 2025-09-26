import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store/store';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';
import { loadUserFromStorage } from '../slice/authSlice';

// 定义配置选项接口
export interface UserInfoCheckOptions {
  // 检查周期（毫秒），默认为只检查一次
  checkInterval?: number;
  
  // 信息不完整时的跳转路径
  redirectPath?: string;
  
  // 本地存储键名，用于保存重定向前的路径
  redirectStorageKey?: string;
  
  // 自定义检查逻辑
  customCheck?: (userInfo: any) => boolean;
}

/**
 * 自定义hook，用于在登录后检查用户信息是否完整
 * 如果用户信息不完整，则跳转到对应的初始化页面
 * @param options 配置选项，可自定义检查逻辑和行为
 * @returns null
 */
const useUserInfoCheck = (options?: UserInfoCheckOptions): null => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // 默认配置
  const defaultOptions: Required<UserInfoCheckOptions> = {
    checkInterval: 0, // 0表示只检查一次
    redirectPath: '/complete-profile',
    redirectStorageKey: 'redirectAfterCompleteProfile',
    customCheck: (userInfo) => {
      return userInfo?.user?.nickname && userInfo.user.nickname.trim() !== '';
    }
  };
  
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
      const checkUserInfo = async () => {
        try {
          // 使用Redux加载用户信息
          const userInfo = await dispatch(loadUserFromStorage()).unwrap();
          
          if (!userInfo || !userInfo.user) {
            return;
          }

          // 使用自定义检查逻辑或默认逻辑检查用户信息是否完整
          const isUserInfoComplete = mergedOptions.customCheck(userInfo);

          // 如果用户信息不完整，跳转到用户信息完善页面
          if (!isUserInfoComplete) {
            // 记录当前路径，以便完善信息后返回
            const currentPath = window.location.pathname;
            if (currentPath !== mergedOptions.redirectPath) {
              LocalStorageManager.setItem(mergedOptions.redirectStorageKey, currentPath);
            }
            
            // 跳转到用户信息完善页面
            navigate(mergedOptions.redirectPath, { replace: true });
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('检查用户信息时出错:', error);
          }
          // 发生错误时不阻止用户使用应用
        }
      };

      // 立即执行检查
      checkUserInfo();

      // 设置定期检查（如果配置了检查周期）
      let intervalId: NodeJS.Timeout | undefined;
      if (mergedOptions.checkInterval > 0) {
        intervalId = setInterval(checkUserInfo, mergedOptions.checkInterval);
      }

      // 清理函数
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [navigate, dispatch, mergedOptions]);

  return null;
};

export default useUserInfoCheck;