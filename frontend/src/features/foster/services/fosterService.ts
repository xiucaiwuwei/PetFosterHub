import type {
  FosterServiceListRequest,
  FosterServiceListResponse,
  FosterServiceDetailRequest,
  FosterServiceDetailResponse,
  ApplyFosterRequest,
  ApplyFosterResponse,
  FosterOrderRequest,
  FosterOrderResponse
} from '../types/dto';
import type { BaseResponse } from '@/types/baseType';
import fosterApi from '../api/fosterApi';

// 寄养服务
export class FosterService {
  // 获取寄养服务列表
  async getFosterServiceList(params: FosterServiceListRequest): Promise<FosterServiceListResponse> {
    console.log('[FosterService] 开始获取寄养服务列表', { params });
    try {
      const response = await fosterApi.getFosterServiceList(params);
      console.log('[FosterService] 获取寄养服务列表成功', { total: response.data?.total });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || '获取寄养服务列表失败');
      }
      
      return response.data;
    } catch (error) {
      console.error('[FosterService] 获取寄养服务列表失败', { error: error instanceof Error ? error.message : '未知错误' });
      throw error;
    }
  }

  // 获取寄养服务详情
  async getFosterServiceDetail(params: FosterServiceDetailRequest): Promise<FosterServiceDetailResponse> {
    console.log('[FosterService] 开始获取寄养服务详情', { id: params.id });
    try {
      const response = await fosterApi.getFosterServiceDetail(params);
      console.log('[FosterService] 获取寄养服务详情成功', { id: params.id });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || '获取寄养服务详情失败');
      }
      
      return response.data;
    } catch (error) {
      console.error('[FosterService] 获取寄养服务详情失败', { error: error instanceof Error ? error.message : '未知错误', id: params.id });
      throw error;
    }
  }

  // 申请寄养服务
  async applyFosterService(params: ApplyFosterRequest): Promise<ApplyFosterResponse> {
    console.log('[FosterService] 开始申请寄养服务', { fosterServiceId: params.fosterServiceId });
    try {
      const response = await fosterApi.applyFosterService(params);
      console.log('[FosterService] 申请寄养服务接口返回状态', { success: response.success });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || '申请寄养服务失败');
      }
      
      console.log('[FosterService] 申请寄养服务成功', { orderId: response.data.orderId });
      return response.data;
    } catch (error) {
      console.error('[FosterService] 申请寄养服务失败', { error: error instanceof Error ? error.message : '未知错误', fosterServiceId: params.fosterServiceId });
      throw error;
    }
  }

  // 创建寄养订单
  async createFosterOrder(params: FosterOrderRequest): Promise<FosterOrderResponse> {
    console.log('[FosterService] 开始创建寄养订单', { fosterServiceId: params.fosterServiceId });
    try {
      const response = await fosterApi.createFosterOrder(params);
      console.log('[FosterService] 创建寄养订单接口返回状态', { success: response.success });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || '创建寄养订单失败');
      }
      
      console.log('[FosterService] 创建寄养订单成功', { orderId: response.data.orderId });
      return response.data;
    } catch (error) {
      console.error('[FosterService] 创建寄养订单失败', { error: error instanceof Error ? error.message : '未知错误', fosterServiceId: params.fosterServiceId });
      throw error;
    }
  }
}

// 导出单例
export default new FosterService();