/**
 * 模拟API请求工具函数
 */

import type { BaseResponse } from '@/types/dto/baseDto';

/**
 * 模拟API延迟
 * @param ms 延迟毫秒数，默认为100-500ms随机值
 * @returns Promise
 */
export const mockDelay = (ms?: number): Promise<void> => {
  const delayTime = ms || Math.floor(Math.random() * 400) + 100; // 100-500ms随机延迟
  return new Promise(resolve => setTimeout(resolve, delayTime));
};

/**
 * 创建模拟成功响应
 * @param data 响应数据
 * @param message 响应消息，默认为"操作成功"
 * @returns 模拟的成功响应对象
 */
export const createMockSuccessResponse = <T>(data: T, message: string = '操作成功'): BaseResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * 创建模拟失败响应
 * @param message 错误消息
 * @returns 模拟的失败响应对象
 */
export const createMockErrorResponse = <T = null>(message: string = '操作失败'): BaseResponse<T> => {
  return {
    success: false,
    message,
    data: null as unknown as T,
    timestamp: new Date().toISOString()
  };
};

/**
 * 生成随机ID
 * @param prefix ID前缀
 * @returns 随机生成的ID字符串
 */
export const generateMockId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 生成随机评分（1-5分，保留一位小数）
 * @returns 随机评分
 */
export const generateRandomRating = (): number => {
  return Math.round((Math.random() * 1 + 4) * 10) / 10; // 4.0-5.0分
};

/**
 * 生成随机评论数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机评论数
 */
export const generateRandomReviewCount = (min: number = 10, max: number = 200): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 从数组中随机选择一个元素
 * @param array 源数组
 * @returns 随机选择的元素或undefined
 */
export const pickRandom = <T>(array: T[]): T | undefined => {
  if (!array || array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 随机生成boolean值
 * @param probability 为true的概率（0-1之间）
 * @returns 随机boolean值
 */
export const randomBoolean = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};

/**
 * 序列化对象中的Date对象为ISO字符串
 * 确保所有日期值在存储到Redux前为可序列化格式
 * @param obj 要序列化的对象
 * @returns 序列化后的对象
 */
export const serializeDates = (obj: any): any => {
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
  
  // 其他类型直接返回
  return obj;
};