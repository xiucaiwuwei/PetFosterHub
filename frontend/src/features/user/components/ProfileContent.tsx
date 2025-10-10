/**
 * 个人中心内容组件
 * 根据用户角色显示不同内容
 */
import React, { useState } from 'react';
import { GetUserInfoDto } from '../types';
import { User, CheckCircle } from 'lucide-react';
import { usePets } from '../hooks/usePets';
import { useBookings } from '../hooks/useBookings';
import { useServices } from '../hooks/useServices';
import { toast } from 'sonner';

// 导入所需组件
import { ProfileInfoTab } from './ProfileInfoTab';
import { ProfilePetsTab } from './ProfilePetsTab';
import { ProfileServicesTab } from './ProfileServicesTab';
import { AddPetModal } from './AddPetModal';

interface ProfileContentProps {
  userInfo: GetUserInfoDto | null;
  isEditing: boolean;
  editedUserInfo: GetUserInfoDto | null;
  setEditedUserInfo: (userInfo: GetUserInfoDto | null) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userData: any) => Promise<void>;
  activeTab?: string;
};

/**
 * 个人中心内容组件
 */
export const ProfileContent: React.FC<ProfileContentProps> = ({
  userInfo,
  isEditing,
  editedUserInfo,
  setEditedUserInfo,
  onCancelEdit,
  onSaveEdit,
  activeTab = 'profile'
}) => {
  // 使用自定义hooks处理数据逻辑
  const { pets, isLoading: isPetsLoading, isAddingPet, showAddPetModal, setShowAddPetModal, addPet } = usePets(userInfo?.id || null);
  const { bookings, isLoading: isBookingsLoading, searchService } = useBookings(userInfo?.id || null);
  // 注意：useServices hook目前未在组件中使用，已移除未使用的解构成员
  useServices();

  /**
   * 处理创建服务
   * 注意：此函数目前只是一个占位符，实际应用中应该导航到服务创建页面
   */
  const handleCreateService = (): void => {
    // 在实际应用中，这里应该导航到服务创建页面或显示创建服务的模态框
    console.log('导航到服务创建页面');
    // 示例：navigate('/create-service');
  };

  /**
   * 处理搜索服务
   */
  const handleSearchService = (): void => {
    // 这里可以添加导航到服务搜索页面的逻辑
  };

  if (!userInfo) {
    return (
      <div className="p-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl my-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-500 mb-4"></div>
        <span className="text-gray-500">正在加载您的个人信息...</span>
      </div>
    );
  }

  // 渲染不同的标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInfoTab
            userInfo={userInfo}
            isEditing={isEditing}
            editedUserInfo={editedUserInfo}
            setEditedUserInfo={setEditedUserInfo}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
          />
        );
        
      case 'pets':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">我的宠物</h2>
              {userInfo.role === 'owner' && (
                <button
                  onClick={() => setShowAddPetModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  添加宠物
                </button>
              )}
            </div>
            <ProfilePetsTab 
              pets={pets}
              onAddPet={() => setShowAddPetModal(true)}
            />
          </div>
        );
        
      case 'bookings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">预订记录</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              {isBookingsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无预订记录</p>
              ) : (
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li key={booking.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">订单 #{booking.id}</h3>
                          <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
        
      case 'purchases':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">购买记录</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-gray-500 text-center py-8">暂无购买记录</p>
            </div>
          </div>
        );
        
      case 'consultations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">问诊记录</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-gray-500 text-center py-8">暂无问诊记录</p>
            </div>
          </div>
        );
        
      case 'services':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">我的寄养服务</h2>
            <ProfileServicesTab onCreateService={handleCreateService} />
          </div>
        );
        
      default:
        return (
          <ProfileInfoTab
            userInfo={userInfo}
            isEditing={isEditing}
            editedUserInfo={editedUserInfo}
            setEditedUserInfo={setEditedUserInfo}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
          />
        );
    }
  };

  // 管理员角色显示管理中心内容
  if (userInfo.role === 'admin') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">管理中心</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">用户管理</h4>
            <p className="text-gray-500">管理员用户列表和权限管理功能</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">服务审核</h4>
            <p className="text-gray-500">寄养服务和宠物信息审核功能</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">系统设置</h4>
            <p className="text-gray-500">系统参数配置和日志查看功能</p>
          </div>
        </div>
      </div>
    );
  }

  // 商家角色显示商家中心内容
  if (typeof userInfo.role === 'string' && userInfo.role === 'business') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">我的店铺</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">店铺信息</h4>
            <p className="text-gray-500">商家店铺信息展示区域</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">商品管理</h4>
            <p className="text-gray-500">商家商品列表和管理功能</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">订单管理</h4>
            <p className="text-gray-500">商家订单列表和处理功能</p>
          </div>
        </div>
      </div>
    );
  }

  // 兽医角色显示兽医中心内容
  if (typeof userInfo.role === 'string' && userInfo.role === 'veterinarian') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">医疗信息</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">接诊记录</h4>
            <p className="text-gray-500">兽医接诊历史记录</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">诊断报告</h4>
            <p className="text-gray-500">宠物诊断报告管理</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 mb-2">专业资质</h4>
            <p className="text-gray-500">兽医专业资质和认证</p>
          </div>
        </div>
      </div>
    );
  }

  // 其他角色显示标签页内容
  return (
    <>
      {renderTabContent()}
      
      {/* 添加宠物模态框 - 仅对宠物主人显示，使用类型安全的条件渲染 */}
      {typeof userInfo.role === 'string' && userInfo.role === 'owner' && (
        <AddPetModal
          isOpen={showAddPetModal}
          onClose={() => setShowAddPetModal(false)}
          onAddPet={async (petData: any, imageFile: File | null) => {
            try {
              await addPet(petData, imageFile, userInfo.id);
              setShowAddPetModal(false);
            } catch (error) {
              console.error('添加宠物失败:', error);
            }
          }}
          petsLength={pets.length}
          userId={userInfo.id}
          isSubmitting={isAddingPet}
        />
      )}
    </>
  );
};