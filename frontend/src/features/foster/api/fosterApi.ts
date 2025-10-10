/**
 * 寄养服务相关API接口
 */
import type {BaseResponse} from '@/types/dto/baseDto';
import {post} from '@/lib/api';
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
import {
    mockFosterServiceListResponse,
    getMockFosterServiceDetail
} from '../mocks/mockFosterServices';
import {mockFosterOrderResponses} from '../mocks/mockFosterOrders';
import {mockDelay, createMockSuccessResponse} from '../mocks/mockUtils';


const fosterApi = {
    /**
     * 获取寄养服务列表
     * @param params 查询参数，包含搜索关键词、筛选条件等
     * @returns 寄养服务列表数据
     */
    getFosterServiceList: async (params: FosterServiceListRequest): Promise<BaseResponse<FosterServiceListResponse>> => {
        try {
            const response = await post<BaseResponse<FosterServiceListResponse>>('/api/foster/list', params);
            // 如果后端返回成功并且有数据，直接返回
            if (response.success && response.data) {
                return response;
            }
            // 否则使用模拟数据
            console.warn('[FosterAPI] 后端返回数据为空或失败，使用模拟数据');
            await mockDelay();
            return createMockSuccessResponse(mockFosterServiceListResponse);
        } catch (error) {
            console.error('[FosterAPI] 获取寄养服务列表失败，使用模拟数据:', error);
            await mockDelay();
            return createMockSuccessResponse(mockFosterServiceListResponse);
        }
    },

    /**
     * 获取寄养服务详情
     * @param params 查询参数，包含寄养服务ID
     * @returns 寄养服务详情数据
     */
    getFosterServiceDetail: async (params: FosterServiceDetailRequest): Promise<BaseResponse<FosterServiceDetailResponse>> => {
        try {
            const response = await post<BaseResponse<FosterServiceDetailResponse>>('/api/foster/detail', params);
            // 如果后端返回成功并且有数据，直接返回
            if (response.success && response.data) {
                return response;
            }
            // 否则使用模拟数据
            console.warn('[FosterAPI] 后端返回数据为空或失败，使用模拟数据');
            await mockDelay();
            return createMockSuccessResponse(getMockFosterServiceDetail(params.id));
        } catch (error) {
            console.error('[FosterAPI] 获取寄养服务详情失败，使用模拟数据:', error);
            await mockDelay();
            return createMockSuccessResponse(getMockFosterServiceDetail(params.id));
        }
    },

    /**
     * 申请寄养服务
     * @param params 申请参数，包含服务ID、日期等信息
     * @returns 申请结果
     */
    applyFosterService: async (params: ApplyFosterRequest): Promise<BaseResponse<ApplyFosterResponse>> => {
        try {
            const response = await post<BaseResponse<ApplyFosterResponse>>('/api/foster/apply', params);
            // 如果后端返回成功，直接返回
            if (response.success) {
                return response;
            }
            // 否则使用模拟数据
            console.warn('[FosterAPI] 后端返回失败，使用模拟数据');
            await mockDelay();
            return createMockSuccessResponse({
                orderId: `order-${Date.now()}`,
                status: 'PENDING',
                message: '申请提交成功，等待审核'
            });
        } catch (error) {
            console.error('[FosterAPI] 申请寄养服务失败，使用模拟数据:', error);
            await mockDelay();
            return createMockSuccessResponse({
                orderId: `order-${Date.now()}`,
                status: 'PENDING',
                message: '申请提交成功，等待审核'
            });
        }
    },

    /**
     * 创建寄养订单
     * @param params 订单参数，包含服务ID、日期、宠物信息等
     * @returns 订单创建结果
     */
    createFosterOrder: async (params: FosterOrderRequest): Promise<BaseResponse<FosterOrderResponse>> => {
        try {
            const response = await post<BaseResponse<FosterOrderResponse>>('/api/foster/order/create', params);
            // 如果后端返回成功，直接返回
            if (response.success) {
                return response;
            }
            // 否则使用模拟数据
            console.warn('[FosterAPI] 后端返回失败，使用模拟数据');
            await mockDelay();
            return createMockSuccessResponse(mockFosterOrderResponses[0]);
        } catch (error) {
            console.error('[FosterAPI] 创建寄养订单失败，使用模拟数据:', error);
            await mockDelay();
            return createMockSuccessResponse(mockFosterOrderResponses[0]);
        }
    }
};

export default fosterApi;