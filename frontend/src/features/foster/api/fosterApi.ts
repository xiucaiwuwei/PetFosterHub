import type { BaseResponse } from '@/types';
import { post } from '@/lib/api';
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

/**
 * 寄养服务相关API接口
 */
const fosterApi = {
  /**
   * 获取寄养服务列表
   * @param params 查询参数，包含搜索关键词、筛选条件等
   * @returns 寄养服务列表数据
   */
  getFosterServiceList: async (params: FosterServiceListRequest): Promise<BaseResponse<FosterServiceListResponse>> => {
    return await post<BaseResponse<FosterServiceListResponse>>('/api/foster/list', params);
  },

  /**
   * 获取寄养服务详情
   * @param params 查询参数，包含寄养服务ID
   * @returns 寄养服务详情数据
   */
  getFosterServiceDetail: async (params: FosterServiceDetailRequest): Promise<BaseResponse<FosterServiceDetailResponse>> => {
    return await post<BaseResponse<FosterServiceDetailResponse>>('/api/foster/detail', params);
  },

  /**
   * 申请寄养服务
   * @param params 申请参数，包含服务ID、日期等信息
   * @returns 申请结果
   */
  applyFosterService: async (params: ApplyFosterRequest): Promise<BaseResponse<ApplyFosterResponse>> => {
    return await post<BaseResponse<ApplyFosterResponse>>('/api/foster/apply', params);
  },

  /**
   * 创建寄养订单
   * @param params 订单参数，包含服务ID、日期、宠物信息等
   * @returns 订单创建结果
   */
  createFosterOrder: async (params: FosterOrderRequest): Promise<BaseResponse<FosterOrderResponse>> => {
    return await post<BaseResponse<FosterOrderResponse>>('/api/foster/order/create', params);
  }
};

export default fosterApi;