/**
 * 管理员模块服务层
 */
import * as adminApi from '../api/adminApi';
import { GetUserDto, GetUsersDto, UpdateUserDto, GetOrdersDto, UpdateOrderDto } from '../types/dto';
import { validateUser, validateOrder } from '../utils/validationUtils';

/**
 * 用户管理服务
 */
export const userService = {
  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表数据
   */
  async getUsers(params: GetUsersDto): Promise<{ data: any[]; total: number }> {
    try {
      const response = await adminApi.getUsers(params);
      return response;
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取单个用户详情
   * @param params 用户ID参数
   * @returns 用户详情数据
   */
  async getUser(params: GetUserDto): Promise<any> {
    try {
      const response = await adminApi.getUser(params);
      return response;
    } catch (error) {
      console.error('获取用户详情失败:', error);
      throw error;
    }
  },

  /**
   * 更新用户信息
   * @param params 用户更新参数
   * @returns 更新后的用户数据
   */
  async updateUser(params: UpdateUserDto): Promise<any> {
    try {
      // 验证用户数据
      const validationResult = validateUser(params);
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join('; '));
      }
      
      const response = await adminApi.updateUser(params);
      return response;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  async deleteUser(id: string): Promise<{ success: boolean }> {
    try {
      const response = await adminApi.deleteUser(id);
      return response;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  }
};

/**
 * 订单管理服务
 */
export const orderService = {
  /**
   * 获取订单列表
   * @param params 查询参数
   * @returns 订单列表数据
   */
  async getOrders(params: GetOrdersDto): Promise<{ data: any[]; total: number }> {
    try {
      const response = await adminApi.getOrders(params);
      return response;
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  },

  /**
   * 更新订单信息
   * @param params 订单更新参数
   * @returns 更新后的订单数据
   */
  async updateOrder(params: UpdateOrderDto): Promise<any> {
    try {
      // 验证订单数据
      const validationResult = validateOrder(params);
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join('; '));
      }
      
      const response = await adminApi.updateOrder(params);
      return response;
    } catch (error) {
      console.error('更新订单信息失败:', error);
      throw error;
    }
  },

  /**
   * 删除订单
   * @param id 订单ID
   * @returns 删除结果
   */
  async deleteOrder(id: string): Promise<{ success: boolean }> {
    try {
      const response = await adminApi.deleteOrder(id);
      return response;
    } catch (error) {
      console.error('删除订单失败:', error);
      throw error;
    }
  }
};

/**
 * 统计服务
 */
export const statsService = {
  /**
   * 获取统计数据
   * @returns 统计数据
   */
  async getStats(): Promise<any> {
    try {
      const response = await adminApi.getStats();
      return response;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      throw error;
    }
  }
};

/**
 * 导出所有服务
 */
export default {
  user: userService,
  order: orderService,
  stats: statsService
};