/**
 * Home模块的API接口定义
 */
import { get } from '@/lib/api';
import type { FosterService } from '../types';
import type { Testimonial } from '../types';
import type { BaseResponse } from '@/types/dto/baseDto';
import { mockFosterServices } from '../mocks/mockFosterServices';
import { mockTestimonials } from '../mocks/mockTestimonials';

/**
 * 序列化对象中的Date对象为ISO字符串
 * @param obj 要序列化的对象
 * @returns 序列化后的对象
 */
function serializeDates(obj: any): any {
  // 处理null或undefined
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // 如果是Date对象，转换为ISO字符串
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // 特殊处理：如果是字符串但可以解析为有效日期，也转换为ISO字符串
  if (typeof obj === 'string') {
    const date = new Date(obj);
    // 检查是否是有效的日期（不是Invalid Date）
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    return obj;
  }
  
  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => serializeDates(item));
  }
  
  // 如果是对象，递归处理每个属性
  if (typeof obj === 'object') {
    const serializedObj: any = {};
    for (const key in obj) {
      // 确保是对象自有属性
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        serializedObj[key] = serializeDates(obj[key]);
      }
    }
    return serializedObj;
  }
  
  // 基本类型直接返回
  return obj;
}

/**
 * 通用API请求处理函数
 * @template T - 返回数据的类型
 * @param endpoint - API端点路径
 * @param mockData - 模拟数据，当API请求失败时使用
 * @param errorMessage - 错误消息前缀
 * @returns 请求的数据或模拟数据
 */
async function fetchData<T>(
  endpoint: string,
  mockData: T[],
  errorMessage: string
): Promise<T[]> {
  try {
    const response = await get<BaseResponse<T[]>>(endpoint);
    
    // 检查响应是否有效
    if (!response) {
      console.error(`${errorMessage}: 响应为空`);
      return mockData;
    }
    
    // 检查请求是否成功
    if (!response.success) {
      console.error(`${errorMessage}:`, response.message);
      return mockData;
    }
    
    // 提取并检查数据
    const data = response.data || [];
    if (!data || data.length === 0) {
      console.warn(`${errorMessage}: 返回数据为空，使用模拟数据`);
      return mockData;
    }
    
    // 序列化数据中的Date对象为ISO字符串，确保Redux存储可序列化的值
    const serializedData = serializeDates(data);
    return serializedData;
  } catch (error) {
    console.error(`${errorMessage}:`, error instanceof Error ? error.message : '未知错误');
    console.warn('使用模拟数据');
    return mockData;
  }
}

const homeApi = {
  /**
   * 获取最好的三个寄养服务数据
   * @returns 评分最高的三个寄养服务列表的Promise
   */
  getTopThreeFosters: async (): Promise<FosterService[]> => {
    return fetchData<FosterService>(
      '/api/home/top-three-fosters',
      mockFosterServices,
      '获取寄养服务数据失败'
    );
  },

  /**
   * 获取三个用户最新的评价
   * @returns 最新的三个用户评价列表的Promise
   */
  getLatestThreeTestimonials: async (): Promise<Testimonial[]> => {
    return fetchData<Testimonial>(
      '/api/home/latest-three-testimonials',
      mockTestimonials,
      '获取评价数据失败'
    );
  }
};

export default homeApi;
