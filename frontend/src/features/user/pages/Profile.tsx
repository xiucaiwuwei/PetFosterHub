/**
 * 个人中心页面组件
 */
import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks';
import { UserInfoSummary, ProfileTabs, ProfileContent } from '../components';
import { GetUserInfoDto, UpdateUserInfoDto } from '../types';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services/userService';
import { toast } from 'sonner';
import { Loader2, RefreshCw, User } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [editedUserInfo, setEditedUserInfo] = useState<GetUserInfoDto | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 使用自定义hook管理用户个人资料
  const {
    userInfo,
    isLoading,
    isEditing,
    setIsEditing: setHookIsEditing,
    refreshUserInfo,
    updateUserInfo,
    handleLogout
  } = useUserProfile();

  // 当用户信息加载完成后，设置编辑状态的用户信息
  useEffect(() => {
    if (userInfo) {
      setEditedUserInfo({ ...userInfo });
    }
  }, [userInfo]);

  // 处理标签页切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // 切换标签页时取消编辑状态
    if (isEditing) {
      cancelEdit();
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setHookIsEditing(false);
    // 重置编辑状态的用户信息
    if (userInfo) {
      setEditedUserInfo({ ...userInfo });
    }
  };

  // 保存编辑后的用户资料
  const saveEdit = async (userData: UpdateUserInfoDto) => {
    try {
      await updateUserInfo(userData);
      setHookIsEditing(false);
      // 重新获取用户信息以更新UI
      await refreshUserInfo();
    } catch (err) {
      // 错误处理已在updateUserInfo中完成
    }
  };

  // 处理头像上传
  const handleAvatarUpload = (avatarUrl: string) => {
    // 更新编辑状态下的用户信息
    if (editedUserInfo) {
      setEditedUserInfo({ ...editedUserInfo, avatar: avatarUrl });
    }
  };

  // 处理登出
  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  // 手动刷新用户信息
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserInfo();
    } catch (error) {
      toast.error('刷新失败，请稍后重试');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* 页面头部 - 使用渐变色背景和阴影效果 */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 shadow-md relative overflow-hidden">
        {/* 装饰性元素 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">个人中心</h1>
            
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center gap-2 text-white transition-all duration-300"
            >
              {isRefreshing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              刷新信息
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 加载状态 - 添加骨架屏效果 */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-32"></div>
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-16">
                  <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                </div>
                <div className="mt-8 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 py-4">
                <div className="flex space-x-6 pl-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 用户信息概览 - 添加卡片动效和阴影层次 */}
        {!isLoading && userInfo && (
          <div className="space-y-8">
            <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
              <UserInfoSummary
                userInfo={userInfo}
                isEditing={isEditing}
                setIsEditing={setHookIsEditing}
                onLogout={onLogout}
                onAvatarUpdate={handleAvatarUpload}
              />
            </div>

            {/* 标签页导航和内容 - 添加卡片动效和过渡 */}
            <div className="bg-white shadow-lg overflow-hidden rounded-2xl transform transition-all duration-300 hover:shadow-xl">
              <ProfileTabs
                userInfo={userInfo}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />

              {/* 标签页内容 - 添加过渡动画 */}
              <div className="border-t border-gray-200">
                <ProfileContent
                  userInfo={userInfo}
                  activeTab={activeTab}
                  isEditing={isEditing}
                  editedUserInfo={editedUserInfo}
                  setEditedUserInfo={setEditedUserInfo}
                  onCancelEdit={cancelEdit}
                  onSaveEdit={saveEdit}
                />
              </div>
            </div>
          </div>
        )}

        {/* 空状态 - 当用户信息加载失败时显示 */}
        {!isLoading && !userInfo && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <User size={40} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">无法加载用户信息</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              我们无法获取您的个人信息，请稍后重试或重新登录
            </p>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors duration-300 flex items-center gap-2"
            >
              {isRefreshing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              重新加载
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
