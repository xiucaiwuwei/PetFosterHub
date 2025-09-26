import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FosterService } from '@/types';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';

/**
 * 服务管理页面
 */
const Services: React.FC = () => {
  // 状态管理
  const [services, setServices] = useState<FosterService[]>([]);
  const [filteredServices, setFilteredServices] = useState<FosterService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<FosterService | null>(null);
  const [editedService, setEditedService] = useState<Partial<FosterService>>({});

  // 获取服务数据
  useEffect(() => {
    // 模拟API加载延迟
    const timer = setTimeout(() => {
      // 生成模拟服务数据
      const mockServices: FosterService[] = Array.from({ length: 30 }, (_, index) => ({
        id: `SVC-${100 + index}`,
        title: [
          '专业狗狗寄养服务', '猫咪寄养照顾', '宠物日常训练',
          '老年宠物特别护理', '宠物美容套餐', '宠物行为矫正',
          '假期宠物托管', '宠物健康检查', '狗狗户外活动'
        ][index % 9],
        description: '提供专业的宠物寄养服务，包含日常照料、喂食、遛弯、玩耍等，让您外出无忧。',
        providerId: `PROV-${Math.floor(Math.random() * 50) + 1}`,
        providerName: `寄养中心${Math.floor(Math.random() * 20) + 1}`,
        location: ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区'][Math.floor(Math.random() * 5)],
        price: Math.floor(Math.random() * 300) + 100,
        duration: Math.floor(Math.random() * 7) + 1,
        category: ['寄养', '训练', '美容', '医疗', '其他'][Math.floor(Math.random() * 5)],
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        rating: 3 + Math.random() * 2,
        reviewsCount: Math.floor(Math.random() * 200) + 10,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        images: ['https://placehold.co/600x400/e2e8f0/64748b?text=宠物服务'],
        amenities: ['专业人员看护', '定时喂食', '日常清洁', '户外活动空间'][Math.floor(Math.random() * 4)],
        capacity: Math.floor(Math.random() * 10) + 1,
        availableSpots: Math.floor(Math.random() * 5) + 1,
        isFeatured: index % 5 === 0
      }));
      
      setServices(mockServices);
      setFilteredServices(mockServices);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 搜索和筛选服务
  useEffect(() => {
    let result = [...services];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(service => 
        service.title.toLowerCase().includes(term) || 
        service.description.toLowerCase().includes(term) ||
        service.location.toLowerCase().includes(term) ||
        service.providerName.toLowerCase().includes(term)
      );
    }
    
    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(service => service.status === statusFilter);
    }
    
    // 分类筛选
    if (categoryFilter !== 'all') {
      result = result.filter(service => service.category === categoryFilter);
    }
    
    setFilteredServices(result);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, statusFilter, categoryFilter, services]);

  // 分页逻辑
  const totalItems = filteredServices.length;
  const indexOfLastItem = currentPage * servicesPerPage;
  const indexOfFirstItem = indexOfLastItem - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  // 处理添加服务
  const handleAddService = () => {
    setEditedService({});
    setIsAddModalOpen(true);
  };

  // 处理编辑服务
  const handleEditService = (service: FosterService) => {
    setSelectedService(service);
    setEditedService({...service});
    setIsEditModalOpen(true);
  };

  // 处理删除服务
  const handleDeleteService = (service: FosterService) => {
    if (window.confirm(`确定要删除服务 "${service.title}" 吗？`)) {
      // 模拟删除API调用
      setIsLoading(true);
      setTimeout(() => {
        setServices(prev => prev.filter(s => s.id !== service.id));
        setIsLoading(false);
        toast.success(`服务 "${service.title}" 已删除`);
      }, 600);
    }
  };

  // 保存服务添加
  const saveAddService = () => {
    if (!editedService.title || !editedService.price) return;
    
    // 模拟保存API调用
    setIsLoading(true);
    setTimeout(() => {
      const newService: FosterService = {
        id: `SVC-${Date.now()}`,
        title: editedService.title,
        description: editedService.description || '',
        providerId: editedService.providerId || 'PROV-0',
        providerName: editedService.providerName || '系统添加',
        location: editedService.location || '',
        price: editedService.price,
        duration: editedService.duration || 1,
        category: editedService.category || '寄养',
        status: editedService.status || 'active',
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: editedService.images || [],
        amenities: editedService.amenities || '',
        capacity: editedService.capacity || 1,
        availableSpots: editedService.availableSpots || 1,
        isFeatured: editedService.isFeatured || false
      };
      
      setServices(prev => [newService, ...prev]);
      setIsAddModalOpen(false);
      setIsLoading(false);
      toast.success(`服务 "${editedService.title}" 已添加`);
    }, 600);
  };

  // 保存服务编辑
  const saveEditService = () => {
    if (!selectedService || !editedService.title || !editedService.price) return;
    
    // 模拟保存API调用
    setIsLoading(true);
    setTimeout(() => {
      setServices(prev => 
        prev.map(service => service.id === selectedService.id ? {...service, ...editedService, updatedAt: new Date()} : service)
      );
      setIsEditModalOpen(false);
      setIsLoading(false);
      toast.success(`服务 "${editedService.title}" 已更新`);
    }, 600);
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedService(prev => ({...prev, [name]: value}));
  };

  // 处理布尔字段变化
  const handleBooleanChange = (name: string, checked: boolean) => {
    setEditedService(prev => ({...prev, [name]: checked}));
  };

  // 格式化日期显示
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载服务数据中...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">服务管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有服务项目</p>
        </div>
        <button
          onClick={handleAddService}
          className="mt-4 md:mt-0 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center"
        >
          <i className="fa-solid fa-plus mr-2"></i> 添加服务
        </button>
      </div>
      
      {/* 搜索和筛选 */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[
          {
            label: '服务状态',
            value: statusFilter,
            setValue: setStatusFilter,
            options: [
              { label: '全部', value: 'all' },
              { label: '活跃', value: 'active' },
              { label: '非活跃', value: 'inactive' },
              { label: '待审核', value: 'pending' }
            ]
          },
          {
            label: '服务分类',
            value: categoryFilter,
            setValue: setCategoryFilter,
            options: [
              { label: '全部', value: 'all' },
              { label: '寄养', value: '寄养' },
              { label: '训练', value: '训练' },
              { label: '美容', value: '美容' },
              { label: '医疗', value: '医疗' },
              { label: '其他', value: '其他' }
            ]
          }
        ]}
      />
      
      {/* 服务列表 */}
      <div className="mt-6">
        {currentServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {currentServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{service.title}</h3>
                        {service.isFeatured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            精选
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <i className="fa-solid fa-location-dot text-orange-500 mr-1"></i>
                          {service.location}
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-building text-orange-500 mr-1"></i>
                          {service.providerName}
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-calendar text-orange-500 mr-1"></i>
                          时长: {service.duration}天
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <div className="text-2xl font-bold text-gray-900">¥{service.price}</div>
                      <div className="mt-2 flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            ></i>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          ({service.reviewsCount})
                        </span>
                      </div>
                      <StatusBadge
                        status={service.status}
                        type={service.status === 'active' ? 'success' : service.status === 'pending' ? 'warning' : 'danger'}
                        size="sm"
                        className="mt-3"
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service)}
                      className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <i className="fa-solid fa-search text-3xl mb-2 text-gray-300"></i>
            <p className="text-gray-500">未找到匹配的服务</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-4 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
      
      {/* 分页 */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={servicesPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* 添加服务模态框 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">添加服务</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    服务名称 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedService.title || ''}
                    onChange={handleEditChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入服务名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    服务描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedService.description || ''}
                    onChange={handleEditChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入服务描述"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      价格 (¥) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={editedService.price || ''}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      时长 (天)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={editedService.duration || 1}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      服务分类
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={editedService.category || '寄养'}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="寄养">寄养</option>
                      <option value="训练">训练</option>
                      <option value="美容">美容</option>
                      <option value="医疗">医疗</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      服务状态
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={editedService.status || 'active'}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="active">活跃</option>
                      <option value="inactive">非活跃</option>
                      <option value="pending">待审核</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      服务地点
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editedService.location || ''}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="输入服务地点"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 mb-1">
                      服务提供商
                    </label>
                    <input
                      type="text"
                      id="providerName"
                      name="providerName"
                      value={editedService.providerName || ''}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="输入服务提供商名称"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      最大容量
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={editedService.capacity || 1}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700 mb-1">
                      可用名额
                    </label>
                    <input
                      type="number"
                      id="availableSpots"
                      name="availableSpots"
                      value={editedService.availableSpots || 1}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
                    服务设施
                  </label>
                  <input
                    type="text"
                    id="amenities"
                    name="amenities"
                    value={editedService.amenities || ''}
                    onChange={handleEditChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入服务设施"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={editedService.isFeatured || false}
                    onChange={(e) => handleBooleanChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                    设为精选服务
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                取消
              </button>
              <button
                onClick={saveAddService}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={!editedService.title || !editedService.price}
              >
                添加服务
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 编辑服务模态框 */}
      {isEditModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">编辑服务</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                    服务名称 *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    value={editedService.title || ''}
                    onChange={handleEditChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入服务名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    服务描述
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editedService.description || ''}
                    onChange={handleEditChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入服务描述"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                      价格 (¥) *
                    </label>
                    <input
                      type="number"
                      id="edit-price"
                      name="price"
                      value={editedService.price || ''}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700 mb-1">
                      时长 (天)
                    </label>
                    <input
                      type="number"
                      id="edit-duration"
                      name="duration"
                      value={editedService.duration || 1}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                      服务分类
                    </label>
                    <select
                      id="edit-category"
                      name="category"
                      value={editedService.category || '寄养'}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="寄养">寄养</option>
                      <option value="训练">训练</option>
                      <option value="美容">美容</option>
                      <option value="医疗">医疗</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                      服务状态
                    </label>
                    <select
                      id="edit-status"
                      name="status"
                      value={editedService.status || 'active'}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="active">活跃</option>
                      <option value="inactive">非活跃</option>
                      <option value="pending">待审核</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">
                      服务地点
                    </label>
                    <input
                      type="text"
                      id="edit-location"
                      name="location"
                      value={editedService.location || ''}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="输入服务地点"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-providerName" className="block text-sm font-medium text-gray-700 mb-1">
                      服务提供商
                    </label>
                    <input
                      type="text"
                      id="edit-providerName"
                      name="providerName"
                      value={editedService.providerName || ''}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="输入服务提供商名称"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      最大容量
                    </label>
                    <input
                      type="number"
                      id="edit-capacity"
                      name="capacity"
                      value={editedService.capacity || 1}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-availableSpots" className="block text-sm font-medium text-gray-700 mb-1">
                      可用名额
                    </label>
                    <input
                      type="number"
                      id="edit-availableSpots"
                      name="availableSpots"
                      value={editedService.availableSpots || 1}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-amenities" className="block text-sm font-medium text-gray-700 mb-1">
                    服务设施
                  </label>
                  <input
                    type="text"
                    id="edit-amenities"
                    name="amenities"
                    value={editedService.amenities || ''}
                    onChange={handleEditChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="输入服务设施"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isFeatured"
                    name="isFeatured"
                    checked={editedService.isFeatured || false}
                    onChange={(e) => handleBooleanChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-isFeatured" className="ml-2 block text-sm text-gray-700">
                    设为精选服务
                  </label>
                </div>
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
                onClick={saveEditService}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={!editedService.title || !editedService.price}
              >
                保存更改
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Services;