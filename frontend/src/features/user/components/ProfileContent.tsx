/**
 * 个人中心内容组件 - 美化增强版
 * 根据用户角色显示不同内容
 */
import React, { useEffect, useState } from 'react';
import { UserProfileResponse } from '../types';
import { UserRole } from '@/types/enums/UserRole';
import { usePets } from '../hooks/usePets';
import { useBookings } from '../hooks/useBookings';
import { useServices } from '../hooks/useServices';
import { toast } from 'sonner';
import { Loader2, Users, Shield, Settings, Store, Package, ShoppingCart, Stethoscope, FileText, Award, Plus, Calendar, ShoppingBag, MessageSquareHeart, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';

// 导入所需组件
import { ProfileInfoTab } from './ProfileInfoTab';
import { ProfilePetsTab } from './ProfilePetsTab';
import { ProfileServicesTab } from './ProfileServicesTab';
import { AddPetModal } from './AddPetModal';

interface ProfileContentProps {
  userInfo: UserProfileResponse | null;
  isEditing: boolean;
  editedUserInfo: UserProfileResponse | null;
  setEditedUserInfo: (userInfo: UserProfileResponse | null) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userData: any) => Promise<void>;
  activeTab?: string;
}

/**
 * 个人中心内容组件 - 美化增强版
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
  const { pets, isAddingPet, showAddPetModal, setShowAddPetModal, addPet } = usePets(userInfo?.id ? userInfo.id.toString() : null);
  const { bookings, isLoading: isBookingsLoading } = useBookings(userInfo?.id ? userInfo.id.toString() : null);
  // 注意：useServices hook目前未在组件中使用，已移除未使用的解构成员
  useServices();

  // 页面进入动画效果
  useEffect(() => {
    const timeout = setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
      });
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [activeTab]);

  /**
   * 处理创建服务
   * 注意：此函数目前只是一个占位符，实际应用中应该导航到服务创建页面
   */
  const handleCreateService = (): void => {
    // 在实际应用中，这里应该导航到服务创建页面或显示创建服务的模态框
    console.log('导航到服务创建页面');
    // 示例：navigate('/create-service');
    toast.info('即将导航到服务创建页面');
  };

  // 渲染状态卡片组件
  const StatusCard = ({ 
    title, 
    count, 
    icon: Icon, 
    colorClass = 'bg-blue-500' 
  }: { 
    title: string; 
    count: number; 
    icon: React.ElementType; 
    colorClass?: string; 
  }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass} text-white`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  // 渲染功能卡片组件
  const FeatureCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    colorClass = 'bg-gradient-to-r from-blue-500 to-indigo-600' 
  }: { 
    title: string; 
    description: string; 
    icon: React.ElementType; 
    onClick?: () => void; 
    colorClass?: string; 
  }) => (
    <div 
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer overflow-hidden relative`}
      onClick={onClick}
    >
      {/* 装饰背景 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gray-50 opacity-70"></div>
      
      {/* 图标区域 */}
      <div className="mb-4 relative z-10">
        <div className={`inline-flex items-center justify-center p-3 rounded-lg ${colorClass} text-white`}>
          <Icon size={22} />
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="relative z-10">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      
      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  // 根据状态返回图标组件
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case '已完成':
        return <CheckCircle size={16} className="mr-1" />;
      case 'pending':
      case '待处理':
        return <Clock size={16} className="mr-1" />;
      case 'cancelled':
      case '已取消':
        return <XCircle size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  // 根据订单状态返回不同的颜色类
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case '已完成':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case '待处理':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case '已取消':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(new Date(dateString));
  };

  // 渲染订单记录项
  const renderBookingItem = (booking: any) => {
    return (
      <li key={booking.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 transition-all duration-300 hover:bg-gray-50 p-3 -mx-3 rounded-lg transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-gray-900">订单 #{booking.id}</h3>
              {booking.isPremium && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-800">
                  金牌服务
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{formatDate(booking.createdAt)}</p>
          </div>
          <span className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColorClass(booking.status)} transition-all duration-300`}>
            {getStatusIcon(booking.status)}
            {booking.status}
          </span>
        </div>
        {booking.serviceName && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>服务: {booking.serviceName}</span>
            {booking.petName && <span className="ml-3">宠物: {booking.petName}</span>}
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <button className="flex items-center text-sm text-orange-500 hover:text-orange-600 transition-colors duration-300 transform hover:translate-x-1">
            查看详情
            <span className="ml-1">→</span>
          </button>
        </div>
      </li>
    );
  };

  // 渲染空状态组件 - 美化版
  const EmptyState = ({ 
    title, 
    description, 
    icon: Icon 
  }: { 
    title: string; 
    description: string; 
    icon: React.ElementType; 
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center relative overflow-hidden">
      {/* 装饰背景元素 */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-50 to-transparent opacity-70"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-50 to-transparent opacity-70"></div>
      
      {/* 动画装饰元素 */}
      <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-orange-100 opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-8 h-8 rounded-full bg-blue-100 opacity-40 animate-pulse delay-300"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-600/10 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <Icon size={32} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 mb-6 text-lg max-w-md mx-auto">{description}</p>
      </div>
    </div>
  );

  if (!userInfo) {
    return (
      <div className="p-16 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 my-4">
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
          <div className="space-y-6 fade-in opacity-0 translate-y-4 transition-all duration-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">我的宠物</h2>
                <p className="text-gray-500 text-sm">管理和查看您的宠物信息</p>
              </div>
              {userInfo.role === UserRole.OWNER && (
                <button
                  onClick={() => setShowAddPetModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Plus size={16} className="mr-2" />
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
          <div className="space-y-6 fade-in opacity-0 translate-y-4 transition-all duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">预订记录</h2>
              <p className="text-gray-500 text-sm">查看和管理您的所有预订</p>
            </div>
            
            {/* 数据概览卡片 - 美化版 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatusCard 
                title="总预订数" 
                count={bookings.length} 
                icon={Calendar} 
                colorClass="bg-gradient-to-r from-blue-500 to-blue-600" 
              />
              <StatusCard 
                title="待处理" 
                count={bookings.filter((b: any) => ['pending', '待处理'].includes(b.status.toLowerCase())).length} 
                icon={Clock} 
                colorClass="bg-gradient-to-r from-yellow-500 to-amber-600" 
              />
              <StatusCard 
                title="已完成" 
                count={bookings.filter((b: any) => ['completed', '已完成'].includes(b.status.toLowerCase())).length} 
                icon={CheckCircle} 
                colorClass="bg-gradient-to-r from-green-500 to-emerald-600" 
              />
            </div>
            
            {/* 筛选器 */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">预订记录</h3>
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300">
                  <Filter size={16} className="mr-2" />
                  筛选状态
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 overflow-hidden relative">
          {/* 装饰背景 */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-orange-50 opacity-70"></div>
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-blue-50 opacity-50"></div>
          
          {isBookingsLoading ? (
            <div className="animate-pulse space-y-6 relative z-10">
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="relative z-10">
              <EmptyState 
                title="暂无预订记录" 
                description="您还没有任何预订记录，去浏览寄养服务开始您的第一次预订吧！" 
                icon={Calendar} 
              />
              <div className="mt-4 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1">
                  寻找寄养服务
                </button>
              </div>
            </div>
              ) : (
                <ul className="space-y-6">
                  {bookings.map((booking: any) => renderBookingItem(booking))}
                </ul>
              )}
            </div>
          </div>
        );
        
      case 'purchases':
        return (
          <div className="space-y-6 fade-in opacity-0 translate-y-4 transition-all duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">购买记录</h2>
              <p className="text-gray-500 text-sm">查看您的所有购买历史</p>
            </div>
            <EmptyState 
              title="暂无购买记录" 
              description="您还没有任何购买记录，去商城逛逛吧！" 
              icon={ShoppingBag} 
            />
          </div>
        );
        
      case 'consultations':
        return (
          <div className="space-y-6 fade-in opacity-0 translate-y-4 transition-all duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">问诊记录</h2>
              <p className="text-gray-500 text-sm">查看您的宠物医疗咨询历史</p>
            </div>
            <EmptyState 
              title="暂无问诊记录" 
              description="您还没有任何问诊记录，需要兽医帮助吗？" 
              icon={MessageSquareHeart} 
            />
          </div>
        );
        
      case 'services':
        return (
          <div className="space-y-6 fade-in opacity-0 translate-y-4 transition-all duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">我的寄养服务</h2>
              <p className="text-gray-500 text-sm">管理和创建您的寄养服务</p>
            </div>
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
  if (userInfo.role === UserRole.ADMIN) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-500">
        {/* 头部背景 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h3 className="text-2xl font-bold text-white mb-2">管理中心</h3>
          <p className="text-indigo-100">欢迎管理员，您可以在这里管理整个系统</p>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="用户管理" 
              description="管理员用户列表和权限管理功能" 
              icon={Users} 
              colorClass="bg-gradient-to-r from-blue-500 to-indigo-600" 
            />
            <FeatureCard 
              title="服务审核" 
              description="寄养服务和宠物信息审核功能" 
              icon={Shield} 
              colorClass="bg-gradient-to-r from-green-500 to-teal-600" 
            />
            <FeatureCard 
              title="系统设置" 
              description="系统参数配置和日志查看功能" 
              icon={Settings} 
              colorClass="bg-gradient-to-r from-purple-500 to-pink-600" 
            />
          </div>
        </div>
      </div>
    );
  }

  // 商家角色显示商家中心内容
  if (userInfo.role === UserRole.BUSINESS) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-500">
        {/* 头部背景 */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8">
          <h3 className="text-2xl font-bold text-white mb-2">我的店铺</h3>
          <p className="text-amber-100">欢迎商家，管理您的店铺和商品</p>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="店铺信息" 
              description="商家店铺信息展示区域" 
              icon={Store} 
              colorClass="bg-gradient-to-r from-amber-500 to-orange-500" 
            />
            <FeatureCard 
              title="商品管理" 
              description="商家商品列表和管理功能" 
              icon={Package} 
              colorClass="bg-gradient-to-r from-red-500 to-orange-500" 
            />
            <FeatureCard 
              title="订单管理" 
              description="商家订单列表和处理功能" 
              icon={ShoppingCart} 
              colorClass="bg-gradient-to-r from-blue-500 to-cyan-500" 
            />
          </div>
        </div>
      </div>
    );
  }

  // 兽医角色显示兽医中心内容
  if (userInfo.role === UserRole.VETERINARIAN) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-500">
        {/* 头部背景 */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8">
          <h3 className="text-2xl font-bold text-white mb-2">医疗信息</h3>
          <p className="text-green-100">欢迎兽医，管理您的接诊记录和诊断报告</p>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="接诊记录" 
              description="兽医接诊历史记录" 
              icon={Stethoscope} 
              colorClass="bg-gradient-to-r from-green-500 to-emerald-500" 
            />
            <FeatureCard 
              title="诊断报告" 
              description="宠物诊断报告管理" 
              icon={FileText} 
              colorClass="bg-gradient-to-r from-blue-500 to-sky-500" 
            />
            <FeatureCard 
              title="专业资质" 
              description="兽医专业资质和认证" 
              icon={Award} 
              colorClass="bg-gradient-to-r from-amber-500 to-yellow-500" 
            />
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
      {userInfo.role === UserRole.OWNER && (
        <AddPetModal
          isOpen={showAddPetModal}
          onClose={() => setShowAddPetModal(false)}
          onAddPet={async (petData: any, imageFile: File | null) => {
            try {
              await addPet(petData, imageFile, userInfo.id.toString());
              setShowAddPetModal(false);
              toast.success('宠物添加成功！');
            } catch (error) {
              console.error('添加宠物失败:', error);
              toast.error('添加宠物失败，请稍后重试');
            }
          }}
          petsLength={pets.length}
          userId={userInfo.id.toString()}
          isSubmitting={isAddingPet}
        />
      )}
    </>
  );
};