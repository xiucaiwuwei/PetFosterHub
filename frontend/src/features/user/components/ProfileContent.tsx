/**
 * 个人中心内容组件
 * 包含用户信息、宠物列表、服务记录、预订记录等标签页
 */
import React, { useState, useEffect } from 'react';
import { GetUserInfoDto } from '../types';
import { Pet, Booking, FosterService } from '@/types';
import { User } from 'lucide-react';
import { usePets } from '../hooks/usePets';
import { useBookings } from '../hooks/useBookings';
import { useServices } from '../hooks/useServices';
import { toast } from 'sonner';

// 导入拆分的组件
import { ProfileInfoTab } from './ProfileInfoTab';
import { ProfilePetsTab } from './ProfilePetsTab';
import { ProfileServicesTab } from './ProfileServicesTab';
import { ProfileBookingsTab } from './ProfileBookingsTab';
import { AddPetModal } from './AddPetModal';

interface ProfileContentProps {
  userInfo: GetUserInfoDto | null;
  activeTab: string;
  isEditing: boolean;
  editedUserInfo: GetUserInfoDto | null;
  setEditedUserInfo: (userInfo: GetUserInfoDto | null) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userData: any) => Promise<void>;
};

/**
 * 个人中心内容组件
 */
export const ProfileContent: React.FC<ProfileContentProps> = ({
  userInfo,
  activeTab,
  isEditing,
  editedUserInfo,
  setEditedUserInfo,
  onCancelEdit,
  onSaveEdit
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

  return (
    <div className="p-6">
      {/* 个人资料内容 */}
      {activeTab === 'info' && (
        <ProfileInfoTab
          userInfo={userInfo}
          isEditing={isEditing}
          editedUserInfo={editedUserInfo}
          setEditedUserInfo={setEditedUserInfo}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
        />
      )}
      
      {/* 我的宠物标签页内容 */}
      {activeTab === 'pets' && userInfo.role === 'owner' && (
        <>
          <ProfilePetsTab
            pets={pets}
            onAddPet={() => setShowAddPetModal(true)}
          />
          
          {/* 添加宠物模态框 */}
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
        </>
      )}
      
      {/* 我的寄养服务标签页内容 */}
      {activeTab === 'services' && userInfo.role === 'foster' && (
        <ProfileServicesTab
          onCreateService={handleCreateService}
        />
      )}
      
      {/* 预订记录标签页内容 */}
      {activeTab === 'bookings' && (
        <ProfileBookingsTab
          bookings={bookings}
          onSearchService={handleSearchService}
        />
      )}
    </div>
  );
};