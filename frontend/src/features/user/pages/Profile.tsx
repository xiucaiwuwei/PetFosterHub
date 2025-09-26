import React, { useState } from 'react';
import { useUserProfile } from '../hooks';
import { UserInfoSummary, ProfileTabs, ProfileContent } from '../components';
import { GetUserInfoDto } from '../types';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState<GetUserInfoDto | null>(null);
  
  // 使用自定义hook管理用户个人资料
  const {
    userInfo,
    loading,
    error,
    fetchUserInfo,
    updateUserInfo,
    uploadUserAvatar,
    handleLogout
  } = useUserProfile();

  // 当用户信息加载完成后，设置编辑状态的用户信息
  React.useEffect(() => {
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

  // 开始编辑个人资料
  const startEdit = () => {
    setIsEditing(true);
  };

  // 取消编辑
  const cancelEdit = () => {
    setIsEditing(false);
    // 重置编辑状态的用户信息
    setEditedUserInfo({ ...userInfo });
  };

  // 保存编辑后的用户资料
  const saveEdit = async (userData: any) => {
    try {
      await updateUserInfo(userData);
      setIsEditing(false);
      // 重新获取用户信息以更新UI
      await fetchUserInfo();
    } catch (err) {
      // 错误处理已在updateUserInfo中完成
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (file: File) => {
    try {
      const newAvatarUrl = await uploadUserAvatar(file);
      // 更新编辑状态下的用户信息
      if (editedUserInfo) {
        setEditedUserInfo({ ...editedUserInfo, avatar: newAvatarUrl });
      }
    } catch (err) {
      // 错误处理已在uploadUserAvatar中完成
    }
  };

  // 处理登出
  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 用户信息概览 */}
        <UserInfoSummary
          userInfo={userInfo}
          loading={loading}
          onEdit={startEdit}
          onLogout={onLogout}
          onAvatarUpload={handleAvatarUpload}
          isEditing={isEditing}
        />

        {/* 标签页导航 */}
        <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
          <ProfileTabs
            userInfo={userInfo}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* 标签页内容 */}
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
      </main>
    </div>
  );
};

export default Profile;
