import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getBookingsByOwnerId } from '@/mocks/bookings.ts';
import { getFosterServiceById } from '@/mocks/fosters.ts';
import { getPetById } from '@/mocks/pets.ts';
import { Booking, FosterService, Pet } from '@/types';
import { OrderList } from '../components/OrderList';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';

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

export default function Orders() {
  // 状态管理
  const [orders, setOrders] = useState<Booking[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    service?: FosterService;
    pet?: Pet;
  }>({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取订单数据
  useEffect(() => {
    // 模拟API加载延迟
    const timer = setTimeout(() => {
      // 获取所有预订数据（模拟获取所有用户的订单）
      const allBookings = [
        ...getBookingsByOwnerId('u4'),
        ...getBookingsByOwnerId('u1'),
        ...getBookingsByOwnerId('u2'),
        ...getBookingsByOwnerId('u3')
      ];
      
      setOrders(allBookings);
      setFilteredOrders(allBookings);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // 获取订单详情
  useEffect(() => {
    if (!selectedOrder) return;
    
    // 获取关联的服务和宠物信息
    const service = getFosterServiceById(selectedOrder.fosterServiceId);
    const pet = getPetById(selectedOrder.petId);
    
    // 使用类型断言确保符合可选属性类型
    setOrderDetails({ service, pet } as { service?: FosterService; pet?: Pet });
  }, [selectedOrder]);

  // 搜索和筛选订单
  useEffect(() => {
    let result = [...orders];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.fosterServiceId.toLowerCase().includes(term) ||
        order.petId.toLowerCase().includes(term)
      );
    }
    
    // 状态筛选
    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, selectedStatus, orders]);

  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // 查看订单详情
  const handleViewOrder = (order: Booking) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // 编辑订单
  const handleEditOrder = (order: Booking) => {
    setSelectedOrder(order);
    setEditedOrder({...order});
    setIsEditModalOpen(true);
  };

  // 删除订单
  const handleDeleteOrder = (order: Booking) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  // 确认删除订单
  const confirmDeleteOrder = () => {
    if (!selectedOrder) return;
    
    // 模拟删除API调用
    setIsLoading(true);
    setTimeout(() => {
      setOrders(prev => prev.filter(order => order.id !== selectedOrder.id));
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      toast.success(`订单 ${selectedOrder.id} 已删除`);
    }, 600);
  };

  // 保存订单编辑
  const saveOrderEdit = () => {
    if (!editedOrder) return;
    
    // 模拟保存API调用
    setIsLoading(true);
    setTimeout(() => {
      setOrders(prev => 
        prev.map(order => order.id === editedOrder.id ? editedOrder : order)
      );
      setIsEditModalOpen(false);
      setIsLoading(false);
      toast.success(`订单 ${editedOrder.id} 已更新`);
    }, 600);
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editedOrder) return;
    
    const { name, value } = e.target;
    setEditedOrder(prev => prev ? {...prev, [name]: value} : null);
  };



  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载订单数据中...</p>
      </div>
    );
  }

  // 计算分页信息
  const totalItems = filteredOrders.length;
  const indexOfLastItem = currentPage * ordersPerPage;
  const indexOfFirstItem = indexOfLastItem - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有订单信息</p>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[
          {
            label: '订单状态',
            value: selectedStatus,
            setValue: setSelectedStatus,
            options: [
              { label: '所有状态', value: 'all' },
              { label: '待确认', value: 'pending' },
              { label: '已确认', value: 'confirmed' },
              { label: '已完成', value: 'completed' },
              { label: '已取消', value: 'cancelled' }
            ]
          }
        ]}
      />
      
      {/* 订单列表 */}
      <OrderList
        orders={currentOrders}
        onView={handleViewOrder}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        emptyMessage="未找到匹配的订单"
      />
      
      {/* 分页 */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={ordersPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* 订单详情模态框 */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">订单详情</h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">订单编号</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedOrder.id}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">订单状态</h4>
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      selectedOrder.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : selectedOrder.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : selectedOrder.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.status === 'pending' ? '待确认' : 
                       selectedOrder.status === 'confirmed' ? '已确认' :
                       selectedOrder.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">创建时间</h4>
                    <p className="text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">订单金额</h4>
                  <p className="text-2xl font-bold text-gray-900">¥{selectedOrder.totalPrice}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">支付状态</h4>
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      已支付
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">寄养信息</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-2">服务信息</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">
                        {orderDetails.service ? orderDetails.service.title : selectedOrder.fosterServiceId}
                      </div>
                      {orderDetails.service && (
                        <div className="text-sm text-gray-500 mt-1">
                          {orderDetails.service.providerName} · {orderDetails.service.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-2">宠物信息</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {orderDetails.pet ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{orderDetails.pet.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {orderDetails.pet.breed} · {orderDetails.pet.age}岁 · {
                              orderDetails.pet.size === 'small' ? '小型' : 
                              orderDetails.pet.size === 'medium' ? '中型' : '大型'
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{selectedOrder.petId}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">日期信息</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-1">入住日期</h5>
                    <p className="text-gray-900">{formatDate(selectedOrder.startDate)}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-1">离店日期</h5>
                    <p className="text-gray-900">{formatDate(selectedOrder.endDate)}</p>
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">特殊要求</h4>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 编辑订单模态框 */}
      {isEditModalOpen && editedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">编辑订单状态</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">订单编号</h4>
                <p className="text-lg font-semibold text-gray-900">{editedOrder.id}</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  订单状态
                </label>
                <select
                  id="status"
                  name="status"
                  value={editedOrder.status}
                  onChange={handleEditChange}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="pending">待确认</option>
                  <option value="confirmed">已确认</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">日期范围</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">入住</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(editedOrder.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">离店</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(editedOrder.endDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">订单金额</h4>
                <p className="text-lg font-semibold text-gray-900">¥{editedOrder.totalPrice}</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                取消
              </button>
              <button
                onClick={saveOrderEdit}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                保存更改
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {isDeleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">确认删除订单</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fa-solid fa-exclamation-circle text-red-500 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">确定要删除此订单吗？</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    此操作不可撤销。删除订单后，相关的所有数据将被永久移除。
                  </p>
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">订单编号: {selectedOrder.id}</p>
                    <p className="text-sm text-gray-500 mt-1">创建时间: {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
