import * as orderApi from '../api/orderApi';
import { CreateOrderDto, GetOrderDto, UpdateOrderStatusDto } from '../types/dto';
import { OrderSortOption } from '../types/enums';

// 订单服务类
export class OrderService {
  // 获取订单列表
  static async getOrders(
    page: number = 1,
    limit: number = 10,
    sortOption: OrderSortOption = OrderSortOption.DEFAULT
  ): Promise<{ data: GetOrderDto[]; total: number }> {
    let sortBy = 'createdAt';
    let sortOrder: 'asc' | 'desc' = 'desc';

    switch (sortOption) {
      case OrderSortOption.DATE_ASC:
        sortOrder = 'asc';
        break;
      case OrderSortOption.PRICE_ASC:
        sortBy = 'totalPrice';
        sortOrder = 'asc';
        break;
      case OrderSortOption.PRICE_DESC:
        sortBy = 'totalPrice';
        break;
      case OrderSortOption.STATUS:
        sortBy = 'status';
        break;
      default:
        // 使用默认排序（创建时间降序）
        break;
    }

    try {
      return await orderApi.getOrders(page, limit, sortBy, sortOrder);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw new Error('获取订单列表失败，请稍后重试');
    }
  }

  // 获取订单详情
  static async getOrderDetail(id: string): Promise<GetOrderDto> {
    try {
      return await orderApi.getOrderById(id);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw new Error('获取订单详情失败，请稍后重试');
    }
  }

  // 创建新订单
  static async createNewOrder(orderData: CreateOrderDto): Promise<GetOrderDto> {
    try {
      return await orderApi.createOrder(orderData);
    } catch (error) {
      console.error('创建订单失败:', error);
      throw new Error('创建订单失败，请稍后重试');
    }
  }

  // 更新订单状态
  static async changeOrderStatus(id: string, statusData: UpdateOrderStatusDto): Promise<GetOrderDto> {
    try {
      return await orderApi.updateOrderStatus(id, statusData);
    } catch (error) {
      console.error('更新订单状态失败:', error);
      throw new Error('更新订单状态失败，请稍后重试');
    }
  }

  // 取消订单
  static async cancelUserOrder(id: string, reason?: string): Promise<GetOrderDto> {
    try {
      return await orderApi.cancelOrder(id, reason);
    } catch (error) {
      console.error('取消订单失败:', error);
      throw new Error('取消订单失败，请稍后重试');
    }
  }

  // 验证订单数据
  static validateOrderData(orderData: Partial<CreateOrderDto>): { valid: boolean; message?: string } {
    // 验证必要字段
    if (!orderData.fosterServiceId) {
      return { valid: false, message: '请选择寄养服务' };
    }
    
    if (!orderData.petId) {
      return { valid: false, message: '请选择宠物' };
    }
    
    if (!orderData.startDate || !orderData.endDate) {
      return { valid: false, message: '请选择寄养日期' };
    }
    
    if (orderData.totalPrice === undefined || orderData.totalPrice <= 0) {
      return { valid: false, message: '订单金额必须大于0' };
    }
    
    // 验证日期范围
    const startDate = new Date(orderData.startDate);
    const endDate = new Date(orderData.endDate);
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (startDate < now) {
      return { valid: false, message: '开始日期不能早于今天' };
    }
    
    if (endDate <= startDate) {
      return { valid: false, message: '结束日期必须晚于开始日期' };
    }
    
    return { valid: true };
  }
}