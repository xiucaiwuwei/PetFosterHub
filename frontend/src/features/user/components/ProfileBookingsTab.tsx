/**
 * 预订记录标签页组件
 */
import React from 'react';
import { Booking } from '@/types';
import { Calendar, Filter, ChevronDown, ArrowRight, Search } from 'lucide-react';
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
    day: 'numeric'
  });
};

/**
 * 预订记录标签页组件
 */
export const ProfileBookingsTab: React.FC<ProfileBookingsTabProps> = ({
  bookings,
  onSearchService
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Calendar className="mr-2 text-orange-500" size={22} />
          我的预订
        </h3>
        <div className="relative w-full sm:w-auto">
          <select className="w-full sm:w-48 pl-10 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg appearance-none bg-white shadow-sm">
            <option value="all">所有预订</option>
            <option value="pending">待确认</option>
            <option value="confirmed">已确认</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Filter size={16} />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
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
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137"
                        alt="寄养提供者"
                        className="h-14 w-14 rounded-full object-cover border-2 border-orange-100"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">张明的温馨家庭式宠物寄养</h4>
                      <p className="text-sm text-gray-500">北京市朝阳区</p>
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
                      <p className="text-sm font-medium text-gray-900">豆豆 (金毛寻回犬)</p>
                    </div>
                  </div>
                </div>
                
                {booking.notes && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h5 className="text-xs font-medium text-gray-500 mb-2">特殊要求</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-4">
                  <Link to={`/profile/orders/${booking.id}`} className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300">
                    查看详情 <ArrowRight size={14} className="inline ml-1" />
                  </Link>
                  {booking.status === 'pending' && (
                    <button className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300">
                      取消预订
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-2xl text-orange-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">暂无预订记录</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            您还没有任何寄养预订记录，立即探索我们的寄养服务吧
          </p>
          <button 
            onClick={onSearchService}
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Search size={16} className="mr-2" />
            寻找寄养服务
          </button>
        </div>
      )}
    </div>
  );
};