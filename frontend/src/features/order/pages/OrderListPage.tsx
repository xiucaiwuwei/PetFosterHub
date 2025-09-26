import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OrderCard, OrderFilter } from '../components';
import { useOrderList } from '../hooks';
import { OrderStatus, OrderSortOption } from '../types/enums';
import { OrderSummary } from '../types/entity';

// 渲染骨架屏加载状态
const renderSkeletonCards = () => {
  return Array.from({ length: 6 }).map((_, index) => (
    <motion.div
      key={`skeleton-${index}`}
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="mt-6 flex justify-end">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
    </motion.div>
  ));
};

const OrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  
  // 使用自定义Hook获取订单列表数据和操作函数
  const {
    orders,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    sortOption,
    onPageChange,
    onSortChange,
    refreshOrders
  } = useOrderList({ initialPage: 1, initialLimit: 10 });

  // 过滤订单
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  // 转换为订单摘要格式
  const orderSummaries: OrderSummary[] = filteredOrders.map(order => ({
    id: order.id,
    status: order.status,
    totalPrice: order.totalPrice,
    startDate: order.startDate,
    endDate: order.endDate,
    fosterServiceTitle: order.fosterService?.title || '未知服务',
    petName: order.pet?.name || '未知宠物',
    createdAt: order.createdAt
  }));

  // 处理订单点击
  const handleOrderClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  // 处理状态变更
  const handleStatusChange = (status: OrderStatus | 'all') => {
    setSelectedStatus(status);
  };

  // 处理排序变更
  const handleSortChange = (newSortOption: OrderSortOption) => {
    onSortChange(newSortOption);
  };

  // 处理错误
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">获取订单列表失败</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={refreshOrders} 
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">我的订单</h1>
            <p className="text-gray-600">查看和管理您的所有寄养订单</p>
          </div>

          {/* 筛选和排序 */}
          <OrderFilter
            selectedStatus={selectedStatus}
            selectedSortOption={sortOption}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
          />

          {/* 订单列表 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">订单列表</h2>
              {!loading && (
                <p className="text-gray-600 text-sm">找到 {filteredOrders.length} 个订单</p>
              )}
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {renderSkeletonCards()}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {orderSummaries.length > 0 ? (
                  orderSummaries.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onClick={handleOrderClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">暂无订单</h3>
                    <p className="text-gray-500 mb-4">您当前没有任何订单记录</p>
                    <button 
                      onClick={() => navigate('/')} 
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      浏览寄养服务
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderListPage;