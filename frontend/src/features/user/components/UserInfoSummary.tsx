/**
 * 用户信息摘要组件
 */
import React from 'react';
import { GetUserInfoDto } from '../types';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, LogOut, RefreshCw, Edit, X } from 'lucide-react';
import { useAvatarUpload } from '../hooks/useAvatarUpload';

interface UserInfoSummaryProps {
  userInfo: GetUserInfoDto;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onLogout: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
}

/**
 * 用户信息摘要组件
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-20 border border-gray-100">
      {/* 渐变背景添加装饰元素 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-40 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-5 right-20 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute top-5 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
      </div>

      <div className="px-6 pb-8">
        {/* 头像区域 - 添加悬停效果和动画 */}
        <div className="flex justify-center -mt-20">
          <div className="relative group">
            {/* 头像光环动画 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <img
                src={userInfo.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137'}
                alt={userInfo.name}
                className="w-40 h-40 rounded-full border-4 border-white object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* 相机图标按钮 */}
            <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg text-orange-500 hover:text-orange-600 transition-all duration-300 transform hover:scale-110 cursor-pointer">
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

        {/* 头像上传模态框 - 美化设计 */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">更换头像</h3>

                {/* 头像预览 */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
                    <img
                      src={avatarPreview}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-4">
                  <button
                    onClick={cancelAvatarUpload}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-300"
                    disabled={isUploading}
                  >
                    取消
                  </button>

                  <button
                    onClick={confirmAvatarUpload}
                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
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
          {/* 用户名和角色 */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900">{userInfo.nickname || '用户'}</h2>
            <div className="text-sm text-orange-500 font-medium">
              {userInfo.role === 'OWNER' && '宠物主人'}
              {userInfo.role === 'FOSTER' && '寄养人士'}
              {userInfo.role === 'ADMIN' && '管理员'}
              {userInfo.role === 'BUSINESS' && '商家'}
              {userInfo.role === 'VETERINARIAN' && '兽医'}
            </div>
          </div>

          {/* 联系信息 */}
          <div className="space-y-3">
            {userInfo.email && (
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-orange-400" />
                <span>{userInfo.email}</span>
              </div>
            )}
            {userInfo.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-orange-400" />
                <span>{userInfo.phone}</span>
              </div>
            )}
            {userInfo.address && (
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="text-orange-400 mt-0.5" />
                <span className="text-sm">{userInfo.address}</span>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <Edit size={16} />
              {isEditing ? '取消编辑' : '编辑个人资料'}
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-300"
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