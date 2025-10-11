/**
 * 个人中心页面组件 - 左中右三栏布局版本
 */
import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks';
import { UserInfoSummary, ProfileContent } from '../components';
import ProfileLayout from '../components/ProfileLayout';
import { UserProfileForm } from '../components/UserProfileForm';
import { UserProfileResponse, UpdateUserInfoRequest } from '../types';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services/userService';
import { toast } from 'sonner';
import { Loader2, RefreshCw, User, Star, PawPrint, Calendar, ShoppingBag, HeartPulse, Award, Shield, Users } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [editedUserInfo, setEditedUserInfo] = useState<UserProfileResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 默认显示个人资料标签页
  
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

  // 取消编辑
  const cancelEdit = () => {
    setHookIsEditing(false);
    if (userInfo) {
      setEditedUserInfo({ ...userInfo });
    }
    toast.info('已取消编辑');
  };

  // 保存编辑后的用户资料
  const saveEdit = async (userData: UpdateUserInfoRequest) => {
    try {
      await updateUserInfo(userData);
      setHookIsEditing(false);
      await refreshUserInfo();
      toast.success('个人资料更新成功');
    } catch (err) {
      setHookIsEditing(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = (avatarUrl: string) => {
    if (editedUserInfo) {
      setEditedUserInfo({ ...editedUserInfo, avatar: avatarUrl });
    }
  };

  // 处理登出
  const onLogout = () => {
    handleLogout();
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

  // 用户数据统计卡片 - 精美的渐变卡片设计
  const renderUserStats = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* 我的宠物卡片 - 橙色渐变主题 */}
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-sm p-5 border border-orange-100 transition-all duration-500 hover:shadow-md hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-orange-700 transition-colors duration-300 group-hover:text-orange-800">我的宠物</h3>
            <div className="p-2 bg-orange-100 rounded-lg transition-all duration-300 group-hover:bg-orange-200 transform group-hover:scale-110">
              <PawPrint size={18} className="text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">3</p>
          <p className="text-xs text-green-500 mt-1 flex items-center transition-colors duration-300 group-hover:text-green-600">
            <Star size={12} className="mr-1 text-amber-400 fill-amber-400" />
            最近添加了1只宠物
          </p>
        </div>
        
        {/* 完成的预订卡片 - 蓝色渐变主题 */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm p-5 border border-blue-100 transition-all duration-500 hover:shadow-md hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-700 transition-colors duration-300 group-hover:text-blue-800">完成的预订</h3>
            <div className="p-2 bg-blue-100 rounded-lg transition-all duration-300 group-hover:bg-blue-200 transform group-hover:scale-110">
              <Calendar size={18} className="text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">8</p>
          <p className="text-xs text-green-500 mt-1 flex items-center transition-colors duration-300 group-hover:text-green-600">
            <Star size={12} className="mr-1 text-amber-400 fill-amber-400" />
            全部获得好评
          </p>
        </div>
        
        {/* 购买服务卡片 - 紫色渐变主题 */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-sm p-5 border border-purple-100 transition-all duration-500 hover:shadow-md hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-purple-700 transition-colors duration-300 group-hover:text-purple-800">购买服务</h3>
            <div className="p-2 bg-purple-100 rounded-lg transition-all duration-300 group-hover:bg-purple-200 transform group-hover:scale-110">
              <ShoppingBag size={18} className="text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">5</p>
          <p className="text-xs text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-600">最近购买: 2周前</p>
        </div>
        
        {/* 健康记录卡片 - 绿色渐变主题 */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-sm p-5 border border-green-100 transition-all duration-500 hover:shadow-md hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-700 transition-colors duration-300 group-hover:text-green-800">健康记录</h3>
            <div className="p-2 bg-green-100 rounded-lg transition-all duration-300 group-hover:bg-green-200 transform group-hover:scale-110">
              <HeartPulse size={18} className="text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">2</p>
          <p className="text-xs text-yellow-500 mt-1 transition-colors duration-300 group-hover:text-yellow-600">下次体检: 3个月后</p>
        </div>
      </div>
    );
  };

  // 获取用户信息摘要组件，用于右侧个人信息区域
  const renderUserInfoSummary = () => {
    // 确保userInfo不为null才渲染组件
    if (!userInfo) return null;
    
    return (
      <UserInfoSummary
        userInfo={userInfo}
        isEditing={isEditing}
        setIsEditing={setHookIsEditing}
        onLogout={onLogout}
        onAvatarUpdate={handleAvatarUpload}
      />
    );
  };

  return (
    <>
      {/* 加载状态 - 精美的骨架屏动画 */}
      {isLoading && (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
          <main className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
              {/* 左侧导航骨架屏 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 bg-gradient-to-r from-gray-100 to-gray-200"></div>
              </div>
              
              {/* 中间内容骨架屏 */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[500px] bg-gradient-to-r from-gray-100 to-gray-200"></div>
              </div>
              
              {/* 右侧个人信息骨架屏 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 bg-gradient-to-r from-gray-100 to-gray-200"></div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* 用户信息和相关记录 - 左中右三栏布局 - 固定高度防止滑动 */}
      {!isLoading && userInfo && (
        <>
          <div className="h-screen w-screen overflow-hidden">
          <ProfileLayout
          userInfo={userInfo}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userInfoSummary={renderUserInfoSummary()}
        >
          {/* 编辑表单 - 放在顶部 */}
          {isEditing && (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 p-5 transition-all duration-300 hover:shadow-md">
              <UserProfileForm
                userInfo={userInfo}
                editedUserInfo={editedUserInfo}
                setEditedUserInfo={setEditedUserInfo}
                onCancel={cancelEdit}
                onSubmit={saveEdit}
              />
            </div>
          )}
          
          {/* 内容区域 - 添加用户数据统计卡片 */}
          {activeTab === 'profile' && renderUserStats()}
          
          {/* 各标签页的具体内容 */}
          <ProfileContent
            userInfo={userInfo}
            isEditing={false}
            editedUserInfo={editedUserInfo}
            setEditedUserInfo={setEditedUserInfo}
            onCancelEdit={cancelEdit}
            onSaveEdit={saveEdit}
            activeTab={activeTab}
          />
        </ProfileLayout>
      </div>
      </>
      )}

      {/* 空状态 - 更精美的错误提示页面 */}
      {!isLoading && !userInfo && (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-500 hover:shadow-xl">
            {/* 图标区域 - 增强设计感 */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
              <User size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center tracking-tight">无法加载用户信息</h3>
            <p className="text-gray-500 text-center mb-8 leading-relaxed">
              我们无法获取您的个人信息，请稍后重试或重新登录
            </p>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:-translate-y-1"
            >
              {isRefreshing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              重新加载
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
