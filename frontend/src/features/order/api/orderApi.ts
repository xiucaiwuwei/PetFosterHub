import axios from 'axios';
import { CreateOrderDto, GetOrderDto, UpdateOrderStatusDto } from '../types/dto';

const API_URL = '/api/orders';

// 获取订单列表
export const getOrders = async (page: number = 1, limit: number = 10, sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<{ data: GetOrderDto[]; total: number }> => {
  const response = await axios.get(API_URL, {
    params: { page, limit, sortBy, sortOrder }
  });
  return response.data;
};

// 获取订单详情
export const getOrderById = async (id: string): Promise<GetOrderDto> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// 创建新订单
export const createOrder = async (orderData: CreateOrderDto): Promise<GetOrderDto> => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

// 更新订单状态
export const updateOrderStatus = async (id: string, statusData: UpdateOrderStatusDto): Promise<GetOrderDto> => {
  const response = await axios.patch(`${API_URL}/${id}/status`, statusData);
  return response.data;
};

// 取消订单
export const cancelOrder = async (id: string, reason?: string): Promise<GetOrderDto> => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`, { reason });
  return response.data;
};