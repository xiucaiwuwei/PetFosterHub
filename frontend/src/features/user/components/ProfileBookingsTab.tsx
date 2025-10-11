/**
 * 预订记录标签页组件
 */
import React, { useState } from 'react';
import { Booking } from '@/types';
import { Calendar, Filter, ChevronDown, ArrowRight, Search, Clock, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileBookingsTabProps {
  bookings: Booking[];
  onSearchService: () => void;
}

/**
 * 格式化日期显示
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

/**
 * 获取状态对应的图标组件
 */
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock size={14} className="mr-1" />;
    case 'confirmed':
      return <CheckCircle size={14} className="mr-1" />;
    case 'completed':
      return <CheckCircle size={14} className="mr-1" />;
    case 'cancelled':
      return <XCircle size={14} className="mr-1" />;
    default:
      return null;
  }
};

/**
 * 预订记录标签页组件
 */
export const ProfileBookingsTab: React.FC<ProfileBookingsTabProps> = ({
  bookings,
  onSearchService
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);

  // 筛选预订记录
  React.useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === selectedStatus));
    }
  }, [bookings, selectedStatus]);

  // 模拟从预订数据中获取宠物信息
  const getPetInfo = (booking: Booking) => {
    // 实际应用中应该通过petId从API获取宠物信息
    // 这里根据petId提供不同的默认值，模拟多只宠物的情况
    const petInfoMap: Record<string, { name: string; type: string }> = {
      'p1': { name: '豆豆', type: '金毛寻回犬' },
      'p2': { name: '咪咪', type: '英国短毛猫' },
      'p3': { name: '旺旺', type: '泰迪犬' }
    };
    
    return petInfoMap[booking.petId] || {
      name: '我的宠物',
      type: '可爱宠物'
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="mr-2 text-orange-500" size={22} />
            我的预订
          </h3>
          <div className="relative w-full sm:w-auto group">
            <button 
              className="w-full sm:w-48 pl-10 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg bg-white shadow-sm flex items-center justify-between transition-all duration-300 hover:border-orange-200"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            >
              <span className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-500" />
                {selectedStatus === 'all' ? '所有预订' : 
                 selectedStatus === 'pending' ? '待确认' : 
                 selectedStatus === 'confirmed' ? '已确认' : 
                 selectedStatus === 'completed' ? '已完成' : '已取消'}
              </span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isFilterDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full sm:w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-gray-100 overflow-hidden transition-all duration-300 transform opacity-100 scale-100 origin-top-right">
                <div className="py-1">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      className={`block w-full text-left px-4 py-2 text-sm ${selectedStatus === status ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                      transition-colors duration-200`}
                      onClick={() => {
                        setSelectedStatus(status);
                        setIsFilterDropdownOpen(false);
                      }}
                    >
                      {status === 'all' ? '所有预订' : 
                       status === 'pending' ? '待确认' : 
                       status === 'confirmed' ? '已确认' : 
                       status === 'completed' ? '已完成' : '已取消'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      
      {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const petInfo = getPetInfo(booking);
              return (
                <div key={booking.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  {/* 头部状态栏 */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status === 'pending' ? '待确认' : booking.status === 'confirmed' ? '已确认' : booking.status === 'completed' ? '已完成' : '已取消'}
                      </span>
                      <span className="ml-4 text-sm text-gray-500">
                        预订编号: {booking.id}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      ¥{booking.totalPrice}
                    </span>
                  </div>
                  
                  {/* 主体内容 */}
                  <div className="p-6">
                    {/* 提供者信息和日期信息 */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 relative">
                          <img
                            src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137"
                            alt="寄养提供者"
                            className="h-14 w-14 rounded-full object-cover border-2 border-orange-100"
                          />
                          <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center">
                            张明的温馨家庭式宠物寄养
                            <span className="ml-2 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">金牌服务商</span>
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            北京市朝阳区
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="flex items-center">
                              <Shield size={12} className="mr-1 text-gray-400" />
                              已认证
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">寄养日期</h5>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">宠物</h5>
                          <p className="text-sm font-medium text-gray-900">{petInfo.name} ({petInfo.type})</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 特殊要求 */}
                    {booking.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">特殊要求</h5>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{booking.notes}</p>
                      </div>
                    )}
                    
                    {/* 操作按钮 */}
                    <div className="mt-6 flex justify-end space-x-4">
                      <Link to={`/profile/orders/${booking.id}`} className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-0.5">
                        查看详情 <ArrowRight size={14} className="inline ml-1" />
                      </Link>
                      {booking.status === 'pending' && (
                        <button className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:-translate-y-0.5">
                          取消预订
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-orange-50 to-transparent opacity-50"></div>
            <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-orange-100 opacity-10"></div>
            <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-orange-100 opacity-10"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Calendar className="text-3xl text-orange-500" size={36} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">暂无预订记录</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                您还没有任何寄养预订记录，立即探索我们的寄养服务吧
              </p>
              <button 
                onClick={onSearchService}
                className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Search size={16} className="mr-2" />
                寻找寄养服务
              </button>
            </div>
          </div>
        )}
    </div>
  );
};