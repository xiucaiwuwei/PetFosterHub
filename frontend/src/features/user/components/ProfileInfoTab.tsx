/**
 * 个人资料标签页组件
 */
import React from 'react';
import { GetUserInfoDto } from '../types';
import { UserProfileForm } from './UserProfileForm';
import { CheckCircle, User } from 'lucide-react';

interface ProfileInfoTabProps {
  userInfo: GetUserInfoDto;
  isEditing: boolean;
  editedUserInfo: GetUserInfoDto | null;
  setEditedUserInfo: (userInfo: GetUserInfoDto | null) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userData: any) => Promise<void>;
}

/**
 * 个人资料标签页组件
 */
export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  userInfo,
  isEditing,
  editedUserInfo,
  setEditedUserInfo,
  onCancelEdit,
  onSaveEdit
}) => {
  return (
    <div className="space-y-8">
      {isEditing ? (
        <UserProfileForm
          userInfo={userInfo}
          editedUserInfo={editedUserInfo}
          setEditedUserInfo={setEditedUserInfo}
          onCancel={onCancelEdit}
          onSubmit={onSaveEdit}
        />
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User size={18} className="mr-2 text-orange-500" />
              关于我
            </h3>
            <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
              {userInfo.bio || '暂无个人简介'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">联系信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">邮箱</div>
                <div className="text-sm text-gray-900 font-medium">{userInfo.email}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">电话</div>
                <div className="text-sm text-gray-900 font-medium">{userInfo.phone || '未填写'}</div>
              </div>
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">地址</div>
                <div className="text-sm text-gray-900 font-medium">{userInfo.address || '未填写'}</div>
              </div>
            </div>
          </div>
          
          {userInfo.role === 'foster' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">寄养服务资质</h3>
              <ul className="space-y-3">
                <li className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <CheckCircle size={18} className="mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">宠物护理专业培训证书</span>
                </li>
                <li className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <CheckCircle size={18} className="mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">宠物急救技能认证</span>
                </li>
                <li className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <CheckCircle size={18} className="mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">无犯罪记录证明</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};