import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { Footer } from '@/features/home/components/Footer.tsx';
import { getBookingsByOwnerId } from '@/mocks/bookings';
import { getFosterServiceById } from '@/mocks/fosters';
import { getPetById } from '@/mocks/pets';
import { Booking, FosterService, Pet } from '@/types';

// 格式化日期显示
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Booking | null>(null);
  const [fosterService, setFosterService] = useState<FosterService | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/profile?tab=bookings');
      return;
    }

    // 获取订单详情
    const fetchOrderDetails = () => {
      try {
        setLoading(true);
        
        // 从mock数据中获取订单信息
        const allBookings = getBookingsByOwnerId('u4'); // 当前用户ID
        const foundOrder = allBookings.find(booking => booking.id === id);
        
        if (!foundOrder) {
          setError('未找到订单信息');
          return;
        }
        
        setOrder(foundOrder);
        
        // 获取寄养服务信息
        const service = getFosterServiceById(foundOrder.fosterServiceId);
        setFosterService(service);
        
        // 获取宠物信息
        const petInfo = getPetById(foundOrder.petId);
        setPet(petInfo);
        
      } catch (err) {
        console.error('获取订单详情失败:', err);
        setError('获取订单详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">加载订单详情中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order || !fosterService || !pet) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">订单不存在</h2>
            <p className="text-gray-500 mb-6">{error || '无法找到此订单的详细信息'}</p>
            <button
              onClick={() => navigate('/profile?tab=bookings')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              返回订单列表
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 计算订单天数
  const calculateDays = () => {
    if (!order) return 0;
    const diffTime = order.endDate.getTime() - order.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/profile?tab=bookings')}
            className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-arrow-left mr-1"></i>
            返回订单列表
          </button>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* 订单头部信息 */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">订单详情</h1>
                  <p className="text-gray-500 mt-1">订单编号: {order.id}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : order.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'pending' 
                      ? '待确认' 
                      : order.status === 'confirmed'
                        ? '已确认'
                        : order.status === 'completed'
                          ? '已完成'
                          : '已取消'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* 订单信息概览 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">寄养服务</h3>
                  <p className="text-gray-900">{fosterService.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">寄养日期</h3>
                  <p className="text-gray-900">
                    {formatDate(order.startDate)} 至 {formatDate(order.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">订单金额</h3>
                  <p className="text-gray-900 font-bold">¥{order.totalPrice}</p>
                </div>
              </div>
              
              {/* 寄养服务提供者信息 */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">寄养服务提供者</h2>
                <div className="flex items-start">
                  <img
                    src={fosterService.providerAvatar}
                    alt={fosterService.providerName}
                    className="w-12 h-12 rounded-full object-cover mr-4 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{fosterService.providerName}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-solid fa-star ${
                              i < Math.floor(fosterService.rating)
                                ? 'text-yellow-400'
                                : i < fosterService.rating
                                ? 'text-yellow-400 opacity-50'
                                : 'text-gray-300'
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {fosterService.rating.toFixed(1)} ({fosterService.reviewsCount}条评价)
                      </span>
                    </div>
                    <button className="mt-2 text-sm text-orange-500 hover:text-orange-600 font-medium">
                      <i className="fa-solid fa-comment mr-1"></i> 联系提供者
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 宠物信息 */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">宠物信息</h2>
                <div className="flex items-start">
                  <img
                    src={pet.imageUrls[0]}
                    alt={pet.name}
                    className="w-16 h-16 rounded-lg object-cover mr-4 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{pet.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{pet.breed} · {pet.age}岁 · {pet.size === 'small' ? '小型' : pet.size === 'medium' ? '中型' : '大型'}</p>
                    {pet.specialNeeds && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-gray-500">特殊需求:</h4>
                        <p className="text-sm text-gray-600">{pet.specialNeeds}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 订单详情 */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">订单详情</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">寄养服务 ({calculateDays()}天)</span>
                    <span className="text-gray-900">¥{fosterService.pricePerDay} × {calculateDays()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">服务费用</span>
                    <span className="text-gray-900">¥{Math.round(order.totalPrice - fosterService.pricePerDay * calculateDays())}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
                    <span className="font-bold text-gray-900">订单总计</span>
                    <span className="font-bold text-gray-900">¥{order.totalPrice}</span>
                  </div>
                </div>
              </div>
              
              {/* 特殊要求 */}
              {order.notes && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">特殊要求</h2>
                  <p className="text-gray-600 whitespace-pre-line">{order.notes}</p>
                </div>
              )}
              
              {/* 操作按钮 */}
              <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                {order.status === 'pending' && (
                  <button className="px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    取消订单
                  </button>
                )}
                <button className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  <i className="fa-solid fa-download mr-1"></i> 下载订单凭证
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}