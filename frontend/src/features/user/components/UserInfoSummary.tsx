/**
 * 用户信息摘要组件 - 美化增强版
 */
import React from 'react';
import { UserProfileResponse } from '../types';
import { Phone, MapPin, LogOut, RefreshCw, Edit, PawPrint, HeartPulse, Calendar, Star, Award, Shield, Users, MessageSquare, ShoppingBag } from 'lucide-react';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { UserRole } from '@/types';

interface UserInfoSummaryProps {
  userInfo: UserProfileResponse;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onLogout: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
}

/**
 * 用户信息摘要组件 - 美化增强版
 */
export const UserInfoSummary: React.FC<UserInfoSummaryProps> = ({
  userInfo,
  isEditing,
  setIsEditing,
  onLogout,
  onAvatarUpdate
}) => {
  // 使用自定义hook处理头像上传逻辑
  const { 
    showAvatarModal, 
    avatarPreview, 
    isUploading, 
    handleAvatarChange, 
    confirmAvatarUpload, 
    cancelAvatarUpload 
  } = useAvatarUpload(onAvatarUpdate);

  // 根据用户角色选择对应的图标
  const getUserRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return <PawPrint size={16} className="text-orange-500 mr-1" />;
      case UserRole.PROVIDER:
        return <Award size={16} className="text-orange-500 mr-1" />;
      case UserRole.ADMIN:
        return <Shield size={16} className="text-orange-500 mr-1" />;
      case UserRole.BUSINESS:
        return <ShoppingBag size={16} className="text-orange-500 mr-1" />;
      case UserRole.VETERINARIAN:
        return <HeartPulse size={16} className="text-orange-500 mr-1" />;
      default:
        return <Users size={16} className="text-orange-500 mr-1" />;
    }
  };

  // 获取用户角色显示文本
  const getUserRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER: return '宠物主人';
      case UserRole.PROVIDER: return '寄养人士';
      case UserRole.ADMIN: return '管理员';
      case UserRole.BUSINESS: return '商家';
      case UserRole.VETERINARIAN: return '兽医';
      default: return '用户';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-20 border border-gray-100 transform transition-all duration-500 hover:shadow-xl">
      {/* 渐变背景添加动态装饰元素 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-40 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-5 right-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-5 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="px-6 pb-8">
        {/* 头像区域 - 精美的悬停效果和动画 */}
        <div className="flex justify-center -mt-20">
          <div className="relative group">
            {/* 头像光环动画 - 更加精美的渐变效果 */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-all duration-1000 group-hover:duration-300 animate-pulse"></div>
            <div className="relative">
              <img
                src={userInfo.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137'}
                alt={userInfo.nickname}
                className="w-40 h-40 rounded-full border-4 border-white object-cover transition-all duration-500 group-hover:scale-105 shadow-md"
              />
              {/* 在线状态指示器 - 添加装饰效果 */}
              <div className="absolute bottom-3 right-3 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <div className="w-3 h-3 bg-white rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-3 h-3 bg-white rounded-full relative"></div>
              </div>
            </div>
            {/* 相机图标按钮 - 更精致的悬停动画 */}
            <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg text-orange-500 hover:text-orange-600 transition-all duration-300 transform hover:scale-110 hover:shadow-xl cursor-pointer">
              <Edit size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 头像上传模态框 - 美化增强设计 */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scaleIn">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">更换头像</h3>

                {/* 头像预览 */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                    <img
                      src={avatarPreview}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 操作按钮 - 增强视觉效果 */}
                <div className="flex gap-4">
                  <button
                    onClick={cancelAvatarUpload}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                    disabled={isUploading}
                  >
                    取消
                  </button>

                  <button
                    onClick={confirmAvatarUpload}
                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:shadow-lg"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : null}
                    确认上传
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 用户信息展示区域 */}
        <div className="mt-8 space-y-6">
          {/* 用户名和角色 - 增强设计 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight transition-colors duration-300">{userInfo.nickname || '用户'}</h2>
            <div className="flex items-center justify-center text-sm text-orange-500 font-medium">
              {getUserRoleIcon(userInfo.role)}
              {getUserRoleText(userInfo.role)}
            </div>
            
            {/* 会员等级徽章 */}
            <div className="mt-3 flex justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                <Star size={14} className="mr-1 text-amber-500 fill-amber-500" />
                高级会员
              </div>
            </div>
          </div>

          {/* 用户统计信息卡片 - 精美的渐变卡片样式 */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-center mb-1">
                <PawPrint size={16} className="text-orange-500 mr-1" />
                <span className="text-lg font-bold text-gray-900 transition-transform duration-300 hover:scale-110">3</span>
              </div>
              <p className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-700">宠物数量</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-center mb-1">
                <HeartPulse size={16} className="text-green-500 mr-1" />
                <span className="text-lg font-bold text-gray-900 transition-transform duration-300 hover:scale-110">8</span>
              </div>
              <p className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-700">健康记录</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-center mb-1">
                <Calendar size={16} className="text-blue-500 mr-1" />
                <span className="text-lg font-bold text-gray-900 transition-transform duration-300 hover:scale-110">5</span>
              </div>
              <p className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-700">预订次数</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-center mb-1">
                <Star size={16} className="text-purple-500 mr-1" />
                <span className="text-lg font-bold text-gray-900 transition-transform duration-300 hover:scale-110">4.9</span>
              </div>
              <p className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-700">平均评分</p>
            </div>
          </div>

          {/* 联系信息 - 优化样式 */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            {userInfo.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-orange-400 flex-shrink-0" />
                <span className="font-medium">{userInfo.phone}</span>
              </div>
            )}
            {userInfo.address && (
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{userInfo.address}</span>
              </div>
            )}
          </div>

          {/* 快速链接 - 新增功能 */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <div className="flex items-center">
                <Users size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">我的好友</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">12</span>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <div className="flex items-center">
                <MessageSquare size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">消息通知</span>
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">3 条新消息</span>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <div className="flex items-center">
                <ShoppingBag size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">我的收藏</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">7</span>
            </div>
          </div>

          {/* 操作按钮 - 增强视觉效果 */}
          <div className="space-y-3 mt-6">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Edit size={16} />
              {isEditing ? '取消编辑' : '编辑个人资料'}
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};