import { post } from '@/lib/api';
import type { BaseResponse } from '@/types/baseType';
import type { ApplyServiceProviderRequest, ApplyServiceProviderResponse } from '../types/dto';

/**
 * 服务提供者相关API接口
 */
const serviceProviderApi = {
  /**
   * 提交服务提供者申请
   * @param params 申请参数，包含申请人基本信息、服务信息等
   * @returns 申请结果的Promise
   */
  applyServiceProvider: async (params: ApplyServiceProviderRequest): Promise<BaseResponse<ApplyServiceProviderResponse>> => {
    // 创建FormData对象来处理文件上传
    const formData = new FormData();
    
    // 添加非文件字段
    formData.append('name', params.name);
    formData.append('phone', params.phone);
    formData.append('email', params.email);
    formData.append('idCard', params.idCard);
    formData.append('address', params.address);
    formData.append('serviceType', params.serviceType);
    formData.append('hasExperience', String(params.hasExperience));
    if (params.experienceYears) formData.append('experienceYears', params.experienceYears);
    formData.append('serviceDesc', params.serviceDesc);
    formData.append('availableWeekdays', String(params.availableWeekdays));
    formData.append('availableWeekends', String(params.availableWeekends));
    formData.append('availableEvenings', String(params.availableEvenings));
    formData.append('basePrice', params.basePrice);
    if (params.additionalPrice) formData.append('additionalPrice', params.additionalPrice);
    formData.append('emergencyContactName', params.emergencyContactName);
    formData.append('emergencyContactPhone', params.emergencyContactPhone);
    if (params.additionalInfo) formData.append('additionalInfo', params.additionalInfo);
    
    // 添加文件字段
    if (params.idCardFront) formData.append('idCardFront', params.idCardFront);
    if (params.idCardBack) formData.append('idCardBack', params.idCardBack);
    if (params.servicePhotos && params.servicePhotos.length > 0) {
      params.servicePhotos.forEach((photo, index) => {
        formData.append(`servicePhotos[${index}]`, photo);
      });
    }
    
    return await post<BaseResponse<ApplyServiceProviderResponse>>('/api/service-provider/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * 查询服务提供者申请状态
   * @returns 申请状态的Promise
   */
  getApplicationStatus: async (): Promise<BaseResponse<ServiceProviderApplication>> => {
    return await post<BaseResponse<ServiceProviderApplication>>('/api/service-provider/application-status');
  }
};

export default serviceProviderApi;