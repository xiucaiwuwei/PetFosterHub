// 寄养服务列表和详情相关的DTO类型定义

import { FosterServiceStatus } from '../enums';

// 获取寄养服务列表请求参数
export interface FosterServiceListRequest {
  keyword?: string; // 搜索关键词
  pageNum?: number; // 页码
  pageSize?: number; // 每页数量
  status?: FosterServiceStatus; // 服务状态
  sortBy?: string; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方式
}

// 寄养服务列表项
export interface FosterServiceItem {
  id: string; // 服务ID
  title: string; // 服务标题
  description: string; // 服务描述
  price: number; // 服务价格
  discountPrice?: number; // 折扣价格
  images: string[]; // 图片列表
  location: string; // 服务地点
  rating: number; // 评分
  reviewCount: number; // 评价数量
  tags: string[]; // 标签列表
  status: FosterServiceStatus; // 服务状态
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 获取寄养服务列表响应数据
export interface FosterServiceListResponse {
  list: FosterServiceItem[]; // 服务列表
  total: number; // 总数量
  pageNum: number; // 当前页码
  pageSize: number; // 每页数量
}

// 获取寄养服务详情请求参数
export interface FosterServiceDetailRequest {
  id: string; // 服务ID
}

// 寄养服务详情
export interface FosterServiceDetail {
  id: string; // 服务ID
  title: string; // 服务标题
  description: string; // 服务描述
  price: number; // 服务价格
  discountPrice?: number; // 折扣价格
  images: string[]; // 图片列表
  location: string; // 服务地点
  rating: number; // 评分
  reviewCount: number; // 评价数量
  tags: string[]; // 标签列表
  status: FosterServiceStatus; // 服务状态
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  providerInfo: { // 提供者信息
    id: string; // 提供者ID
    name: string; // 提供者名称
    avatar: string; // 头像
    rating: number; // 评分
    reviewCount: number; // 评价数量
  };
  details: { // 详细信息
    services: string[]; // 提供的服务
    facilities: string[]; // 设施
    workingHours: string; // 工作时间
    holidays: string[]; // 节假日
    notice: string; // 注意事项
  };
  availableSlots: { // 可用时段
    date: string; // 日期
    morning: boolean; // 上午是否可用
    afternoon: boolean; // 下午是否可用
    evening: boolean; // 晚上是否可用
  }[];
}

// 获取寄养服务详情响应数据
export interface FosterServiceDetailResponse extends FosterServiceDetail {}