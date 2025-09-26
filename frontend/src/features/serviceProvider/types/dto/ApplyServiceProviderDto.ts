import type { BaseRequest, BaseResponse } from '@/types';
import type { ServiceType } from '../enums';

/**
 * 申请服务提供者请求参数
 */
export interface ApplyServiceProviderRequest extends BaseRequest {
  // 基本信息
  name: string;
  phone: string;
  email: string;
  idCard: string;
  address: string;
  
  // 服务信息
  serviceType: ServiceType;
  hasExperience: boolean;
  experienceYears?: string;
  serviceDesc: string;
  
  // 服务时间
  availableWeekdays: boolean;
  availableWeekends: boolean;
  availableEvenings: boolean;
  
  // 定价信息
  basePrice: string;
  additionalPrice?: string;
  
  // 文件上传（在前端处理，后端可能需要处理为文件ID）
  idCardFront?: File | null;
  idCardBack?: File | null;
  servicePhotos?: File[];
  
  // 其他信息
  emergencyContactName: string;
  emergencyContactPhone: string;
  additionalInfo?: string;
}

/**
 * 申请服务提供者响应参数
 */
export interface ApplyServiceProviderResponse extends BaseResponse {
  data?: {
    applicationId: string;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
  };
}