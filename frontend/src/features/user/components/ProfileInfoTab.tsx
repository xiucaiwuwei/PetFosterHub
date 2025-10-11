/**
 * 个人资料标签页组件
 */
import React from 'react';
import { UserProfileResponse } from '../types';
import { UserProfileForm } from './UserProfileForm';
import { CheckCircle, User, Phone, MapPin, Award, Shield, Heart, Star, BadgeCheck } from 'lucide-react';
import { UserRole } from '@/types/enums/UserRole';

interface ProfileInfoTabProps {
  userInfo: UserProfileResponse;
  isEditing: boolean;
  editedUserInfo: UserProfileResponse | null;
  setEditedUserInfo: (userInfo: UserProfileResponse | null) => void;
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
        <div className="space-y-8 animate-fade-in opacity-100 translate-y-0 transition-all duration-500">
          {/* 关于我 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 overflow-hidden relative transition-all duration-300 hover:shadow-lg">
            {/* 装饰背景 */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-50 opacity-50"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white mr-3">
                  <User size={18} />
                </div>
                关于我
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-orange-50 p-5 rounded-lg border border-gray-100 transition-all duration-300 hover:border-orange-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {userInfo.bio || '暂无个人简介'}
                </p>
              </div>
            </div>
          </div>
          
          {/* 联系信息 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 overflow-hidden relative transition-all duration-300 hover:shadow-lg">
            {/* 装饰背景 */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-50 opacity-50"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                  <Phone size={18} />
                </div>
                联系信息
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-lg border border-gray-100 transition-all duration-300 hover:border-blue-100 transform hover:-translate-y-1">
                  <div className="flex items-center mb-2">
                    <Phone size={16} className="text-blue-500 mr-2" />
                    <div className="text-sm font-medium text-gray-500">电话</div>
                  </div>
                  <div className="text-base text-gray-900 font-medium">{userInfo.phone || '未填写'}</div>
                </div>
                
                <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-lg border border-gray-100 transition-all duration-300 hover:border-blue-100 transform hover:-translate-y-1">
                  <div className="flex items-center mb-2">
                    <MapPin size={16} className="text-blue-500 mr-2" />
                    <div className="text-sm font-medium text-gray-500">地址</div>
                  </div>
                  <div className="text-base text-gray-900 font-medium">{userInfo.address || '未填写'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 寄养服务资质 */}
          {userInfo.role === UserRole.PROVIDER && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 overflow-hidden relative transition-all duration-300 hover:shadow-lg">
              {/* 装饰背景 */}
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-green-50 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mr-3">
                      <Award size={18} />
                    </div>
                    寄养服务资质
                  </h3>
                  
                  {/* 认证标识 */}
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <BadgeCheck size={14} className="text-green-600 mr-1.5" />
                    <span className="text-sm font-medium text-green-800">官方认证</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-green-50 p-4 rounded-lg border border-gray-100 transition-all duration-300 hover:border-green-100 transform hover:-translate-y-1">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3 mt-0.5">
                        <Shield size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">宠物护理专业培训证书</h4>
                        <div className="flex items-center text-amber-500 mt-1">
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-green-50 p-4 rounded-lg border border-gray-100 transition-all duration-300 hover:border-green-100 transform hover:-translate-y-1">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3 mt-0.5">
                        <Heart size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">宠物急救技能认证</h4>
                        <div className="flex items-center text-amber-500 mt-1">
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-green-50 p-4 rounded-lg border border-gray-100 transition-all duration-300 hover:border-green-100 transform hover:-translate-y-1">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3 mt-0.5">
                        <CheckCircle size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">无犯罪记录证明</h4>
                        <div className="flex items-center text-amber-500 mt-1">
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};