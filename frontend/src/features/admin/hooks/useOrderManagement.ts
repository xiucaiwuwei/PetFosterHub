/**
 * 订单管理自定义Hook
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { 
  fetchOrders, 
  updateOrder, 
  deleteOrder, 
  setSelectedOrder 
} from '../slice/adminSlice';
import { GetOrdersDto, UpdateOrderDto } from '../types/dto';
import adminService from '../services/adminService';
import { OrderStatus } from '../types/enums';

/**
 * 订单管理Hook
 */
export const useOrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, selectedOrder, loading } = useSelector((state: RootState) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<{ service?: any; pet?: any }>({});

  // 获取订单列表
  const loadOrders = (params?: Partial<GetOrdersDto>) => {
    const queryParams: GetOrdersDto = {
      searchTerm: params?.searchTerm || searchTerm,
      status: params?.status || selectedStatus,
      page: params?.page || currentPage,
      pageSize: params?.pageSize || ordersPerPage
    };
    dispatch(fetchOrders(queryParams));
  };

  // 初始化加载
  useEffect(() => {
    loadOrders();
  }, []);

  // 搜索和筛选变化时重新加载
  useEffect(() => {
    setCurrentPage(1); // 重置到第一页
    loadOrders({
      searchTerm,
      status: selectedStatus,
      page: 1
    });
  }, [searchTerm, selectedStatus]);

  // 分页变化时重新加载
  useEffect(() => {
    loadOrders({
      page: currentPage
    });
  }, [currentPage]);

  // 当选中订单变化时，获取订单详情
  useEffect(() => {
    if (selectedOrder) {
      // 模拟获取关联数据
      const mockService = {
        id: selectedOrder.fosterServiceId,
        name: '宠物寄养服务',
        description: '提供专业的宠物寄养服务，包括日常照料、健康监测等',
        price: 300,
        duration: 7
      };
      
      const mockPet = {
        id: selectedOrder.petId,
        name: '宠物名称',
        type: '狗',
        breed: '拉布拉多',
        age: 2
      };
      
      setOrderDetails({ service: mockService, pet: mockPet });
    }
  }, [selectedOrder]);

  // 处理查看订单详情
  const handleViewOrder = (order: any) => {
    dispatch(setSelectedOrder(order));
    setIsDetailModalOpen(true);
  };

  // 处理编辑订单
  const handleEditOrder = (order: any) => {
    dispatch(setSelectedOrder(order));
    setEditedOrder({ ...order });
    setEditErrors([]);
    setIsEditModalOpen(true);
  };

  // 处理删除订单
  const handleDeleteOrder = (order: any) => {
    dispatch(setSelectedOrder(order));
    setIsDeleteModalOpen(true);
  };

  // 确认删除订单
  const confirmDeleteOrder = () => {
    if (!selectedOrder) return;
    
    dispatch(deleteOrder(selectedOrder.id))
      .unwrap()
      .then(() => {
        setIsDeleteModalOpen(false);
        // 可以在这里添加toast提示
      })
      .catch((error) => {
        console.error('删除订单失败:', error);
        // 可以在这里添加错误提示
      });
  };

  // 保存订单编辑
  const saveOrderEdit = async () => {
    if (!editedOrder) return;
    
    try {
      // 验证订单数据
      const result = await adminService.order.updateOrder(editedOrder);
      
      // 调用Redux action更新状态
      dispatch(updateOrder(result));
      
      setIsEditModalOpen(false);
      setEditErrors([]);
      // 可以在这里添加toast提示
    } catch (error) {
      console.error('更新订单失败:', error);
      setEditErrors([error instanceof Error ? error.message : '更新订单失败']);
      // 可以在这里添加错误提示
    }
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (!editedOrder) return;
    
    const { name, value } = e.target;
    setEditedOrder(prev => prev ? { ...prev, [name]: value } : null);
  };

  // 清除筛选条件
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // 获取订单状态显示名称
  const getStatusDisplayName = (status: string): string => {
    const statusMap: Record<string, string> = {
      [OrderStatus.PENDING]: '待确认',
      [OrderStatus.CONFIRMED]: '已确认',
      [OrderStatus.IN_PROGRESS]: '进行中',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELLED]: '已取消',
      [OrderStatus.PAID]: '已支付',
      [OrderStatus.SHIPPED]: '已发货'
    };
    return statusMap[status] || status;
  };

  // 获取订单状态样式类
  const getStatusClassName = (status: string): string => {
    const statusClassMap: Record<string, string> = {
      [OrderStatus.PENDING]: 'bg-gray-100 text-gray-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [OrderStatus.PAID]: 'bg-purple-100 text-purple-800',
      [OrderStatus.SHIPPED]: 'bg-indigo-100 text-indigo-800'
    };
    return statusClassMap[status] || 'bg-gray-100 text-gray-800';
  };

  return {
    orders: orders.data,
    totalOrders: orders.total,
    selectedOrder,
    orderDetails,
    isLoading: orders.loading || loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    ordersPerPage,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    editedOrder,
    editErrors,
    handleViewOrder,
    handleEditOrder,
    handleDeleteOrder,
    confirmDeleteOrder,
    saveOrderEdit,
    handleEditChange,
    clearFilters,
    getStatusDisplayName,
    getStatusClassName,
    totalPages: Math.ceil(orders.total / ordersPerPage)
  };
};