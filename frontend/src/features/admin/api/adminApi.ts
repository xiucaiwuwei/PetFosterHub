/**
 * 管理员模块API调用函数
 */
import { GetUserDto, GetUsersDto, UpdateUserDto, GetOrdersDto, UpdateOrderDto } from '../types/dto';

// 模拟API请求延迟
const mockDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表数据
 */
export const getUsers = async (params: GetUsersDto): Promise<{ data: any[]; total: number }> => {
  try {
    await mockDelay();
    
    // 模拟API响应
    const { searchTerm, role, page = 1, pageSize = 10 } = params;
    
    // 在实际项目中，这里应该调用真实的API
    // const response = await fetch('/api/admin/users', { method: 'GET', ... });
    
    // 这里返回模拟数据，实际开发中应替换为真实API调用
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `1380013800${i % 10}`,
      address: `北京市海淀区示例路${i + 1}号`,
      role: i % 2 === 0 ? 'owner' : 'foster',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
      rating: 4 + Math.random(),
      reviewsCount: Math.floor(Math.random() * 50) + 1,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));
    
    // 筛选数据
    let filteredData = [...mockUsers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }
    
    if (role && role !== 'all') {
      filteredData = filteredData.filter(user => user.role === role);
    }
    
    // 分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: filteredData.length
    };
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个用户详情
 * @param params 用户ID参数
 * @returns 用户详情数据
 */
export const getUser = async (params: GetUserDto): Promise<any> => {
  try {
    await mockDelay();
    
    // 模拟API响应
    const { id } = params;
    
    // 在实际项目中，这里应该调用真实的API
    // const response = await fetch(`/api/admin/users/${id}`, { method: 'GET', ... });
    
    // 返回模拟数据
    return {
      id,
      name: `用户${id.split('-')[1]}`,
      email: `user${id.split('-')[1]}@example.com`,
      phone: `1380013800${id.split('-')[1] % 10}`,
      address: `北京市海淀区示例路${id.split('-')[1]}号`,
      role: parseInt(id.split('-')[1]) % 2 === 0 ? 'owner' : 'foster',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      rating: 4 + Math.random(),
      reviewsCount: Math.floor(Math.random() * 50) + 1,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    };
  } catch (error) {
    console.error('获取用户详情失败:', error);
    throw error;
  }
};

/**
 * 更新用户信息
 * @param params 用户更新参数
 * @returns 更新后的用户数据
 */
export const updateUser = async (params: UpdateUserDto): Promise<any> => {
  try {
    await mockDelay();
    
    // 在实际项目中，这里应该调用真实的API
    // const response = await fetch(`/api/admin/users/${params.id}`, { 
    //   method: 'PUT', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(params)
    // });
    
    // 返回模拟更新后的数据
    return {
      ...params,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

/**
 * 删除用户
 * @param id 用户ID
 * @returns 删除结果
 */
export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  try {
    await mockDelay();
    
    // 在实际项目中，这里应该调用真实的API
    // const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    
    // 返回模拟删除结果
    return { success: true };
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
};

/**
 * 获取订单列表
 * @param params 查询参数
 * @returns 订单列表数据
 */
export const getOrders = async (params: GetOrdersDto): Promise<{ data: any[]; total: number }> => {
  try {
    await mockDelay();
    
    // 模拟API响应
    const { searchTerm, status, page = 1, pageSize = 10 } = params;
    
    // 生成模拟订单数据
    const mockOrders = Array.from({ length: 100 }, (_, i) => {
      const orderStatus = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'paid', 'shipped'][i % 7];
      const amount = Math.floor(Math.random() * 1000) + 100;
      
      return {
        id: `ORD-${10000 + i}`,
        fosterServiceId: `service-${Math.floor(Math.random() * 50) + 1}`,
        petId: `pet-${Math.floor(Math.random() * 100) + 1}`,
        ownerId: `user-${Math.floor(Math.random() * 50) + 1}`,
        fosterId: `user-${Math.floor(Math.random() * 50) + 1}`,
        status: orderStatus,
        amount: amount,
        currency: 'CNY',
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 + 7 * 24 * 60 * 60 * 1000),
        notes: i % 3 === 0 ? '用户有特殊要求，请特别注意' : ''
      };
    });
    
    // 筛选数据
    let filteredData = [...mockOrders];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.fosterServiceId.toLowerCase().includes(term) ||
        order.petId.toLowerCase().includes(term)
      );
    }
    
    if (status && status !== 'all') {
      filteredData = filteredData.filter(order => order.status === status);
    }
    
    // 分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: filteredData.length
    };
  } catch (error) {
    console.error('获取订单列表失败:', error);
    throw error;
  }
};

/**
 * 更新订单信息
 * @param params 订单更新参数
 * @returns 更新后的订单数据
 */
export const updateOrder = async (params: UpdateOrderDto): Promise<any> => {
  try {
    await mockDelay();
    
    // 在实际项目中，这里应该调用真实的API
    // const response = await fetch(`/api/admin/orders/${params.id}`, { 
    //   method: 'PUT', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(params)
    // });
    
    // 返回模拟更新后的数据
    return {
      ...params,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('更新订单信息失败:', error);
    throw error;
  }
};

/**
 * 删除订单
 * @param id 订单ID
 * @returns 删除结果
 */
export const deleteOrder = async (id: string): Promise<{ success: boolean }> => {
  try {
    await mockDelay();
    
    // 在实际项目中，这里应该调用真实的API
    // const response = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
    
    // 返回模拟删除结果
    return { success: true };
  } catch (error) {
    console.error('删除订单失败:', error);
    throw error;
  }
};

/**
 * 获取统计数据
 * @returns 统计数据
 */
export const getStats = async (): Promise<any> => {
  try {
    await mockDelay();
    
    // 模拟API响应
    return {
      totalUsers: 2458,
      monthlyOrders: 873,
      monthlyRevenue: 128450,
      fosterServices: 156,
      userTypes: [
        { name: '宠物主人', value: 65 },
        { name: '寄养提供者', value: 35 }
      ],
      trendData: [
        { name: '1月', 寄养订单: 40, 商品订单: 24, 收入: 14000 },
        { name: '2月', 寄养订单: 30, 商品订单: 43, 收入: 18000 },
        { name: '3月', 寄养订单: 50, 商品订单: 22, 收入: 16000 },
        { name: '4月', 寄养订单: 78, 商品订单: 39, 收入: 25000 },
        { name: '5月', 寄养订单: 48, 商品订单: 49, 收入: 22000 },
        { name: '6月', 寄养订单: 68, 商品订单: 38, 收入: 28000 }
      ]
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    throw error;
  }
};