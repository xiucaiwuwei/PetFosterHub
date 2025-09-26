import React, { useState } from 'react';
import { GetUserInfoDto } from '../types';
import { UserService } from '../services/userService';
import { toast } from 'sonner';

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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * 处理头像文件选择
   */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型是否为图片
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件');
        return;
      }

      // 检查文件大小（不超过5MB）
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片文件不能超过5MB');
        return;
      }

      setSelectedAvatarFile(file);
      
      // 创建图片预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setShowAvatarModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 确认上传头像
   */
  const confirmAvatarUpload = async () => {
    if (!selectedAvatarFile) return;

    setIsUploading(true);
    try {
      const avatarUrl = await UserService.uploadAvatar(selectedAvatarFile);
      onAvatarUpdate(avatarUrl);
      setShowAvatarModal(false);
      setSelectedAvatarFile(null);
    } catch (error) {
      console.error('上传头像失败:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-20">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-32"></div>
      
      <div className="px-6 pb-6">
        <div className="flex justify-center -mt-16">
          <div className="relative">
            <img
              src={userInfo.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137'}
              alt={userInfo.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
              <i className="fa-solid fa-camera"></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
          <p className="text-gray-500 mt-1">
            {userInfo.role === 'owner' ? '宠物主人' : userInfo.role === 'foster' ? '寄养人士' : '管理员'}
          </p>
          
          <div className="mt-4 flex justify-center space-x-2">
            {userInfo.role === 'foster' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fa-solid fa-check-circle mr-1"></i>
                已认证寄养人士
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <i className="fa-solid fa-star mr-1"></i>
              {userInfo.rating ? userInfo.rating.toFixed(1) : '暂无评分'}
            </span>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-orange-500">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">邮箱</p>
                <p className="text-sm font-medium text-gray-900">{userInfo.email}</p>
              </div>
            </div>
            
            {userInfo.phone && (
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-orange-500">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">电话</p>
                  <p className="text-sm font-medium text-gray-900">{userInfo.phone}</p>
                </div>
              </div>
            )}
            
            {userInfo.address && (
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-orange-500">
                  <i className="fa-solid fa-map-marker-alt"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">地址</p>
                  <p className="text-sm font-medium text-gray-900">{userInfo.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
          >
            {isEditing ? '取消编辑' : '编辑个人资料'}
          </button>
          
          <button
            onClick={onLogout}
            className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
          >
            <i className="fa-solid fa-sign-out-alt mr-1"></i>
            退出登录
          </button>
        </div>
      </div>

      {/* 头像上传确认模态框 */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">确认头像</h3>
            <div className="flex justify-center mb-4">
              <img 
                src={avatarPreview} 
                alt="预览头像" 
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowAvatarModal(false);
                  setSelectedAvatarFile(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={confirmAvatarUpload} 
                disabled={isUploading}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
              >
                {isUploading ? (
                  <span className="inline-flex items-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    上传中...
                  </span>
                ) : (
                  '确认上传'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};