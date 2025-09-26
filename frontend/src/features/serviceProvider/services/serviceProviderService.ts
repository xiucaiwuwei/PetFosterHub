import { toast } from 'sonner';
import serviceProviderApi from '../api/serviceProviderApi';
import type { ApplyServiceProviderRequest, ApplyServiceProviderResponse } from '../types/dto';
import type { ServiceProviderApplication } from '../types/entity';
import { validateServiceProviderForm } from '../utils/validationUtils';
import {
  submitServiceProviderApplication as submitApplicationThunk,
  checkApplicationStatus as checkStatusThunk
} from '../slice/serviceProviderSlice';

/**
 * 服务提供者相关服务
 */
export const serviceProviderService = {
  /**
   * 提交服务提供者申请
   * @param params 申请参数
   * @returns 申请结果
   */
  async submitApplication(params: ApplyServiceProviderRequest): Promise<ApplyServiceProviderResponse> {
    try {
      console.log('[ServiceProviderService] 开始提交服务提供者申请');
      
      // 创建FormData对象用于文件上传
      const formDataToSend = new FormData();
      
      // 添加非文件字段
      formDataToSend.append('name', params.name);
      formDataToSend.append('phone', params.phone);
      formDataToSend.append('email', params.email);
      formDataToSend.append('idCard', params.idCard);
      formDataToSend.append('address', params.address);
      formDataToSend.append('serviceType', params.serviceType);
      if (params.hasExperience !== undefined) {
        formDataToSend.append('hasExperience', params.hasExperience.toString());
      }
      if (params.experienceYears) {
        formDataToSend.append('experienceYears', params.experienceYears);
      }
      formDataToSend.append('serviceDesc', params.serviceDesc);
      if (params.availableWeekdays !== undefined) {
        formDataToSend.append('availableWeekdays', params.availableWeekdays.toString());
      }
      if (params.availableWeekends !== undefined) {
        formDataToSend.append('availableWeekends', params.availableWeekends.toString());
      }
      if (params.availableEvenings !== undefined) {
        formDataToSend.append('availableEvenings', params.availableEvenings.toString());
      }
      formDataToSend.append('basePrice', params.basePrice);
      if (params.additionalPrice) {
        formDataToSend.append('additionalPrice', params.additionalPrice);
      }
      formDataToSend.append('emergencyContactName', params.emergencyContactName);
      formDataToSend.append('emergencyContactPhone', params.emergencyContactPhone);
      if (params.additionalInfo) {
        formDataToSend.append('additionalInfo', params.additionalInfo);
      }
      
      // 添加文件字段
      if (params.idCardFront) {
        formDataToSend.append('idCardFront', params.idCardFront);
      }
      if (params.idCardBack) {
        formDataToSend.append('idCardBack', params.idCardBack);
      }
      
      // 添加多张服务照片
      if (params.servicePhotos && params.servicePhotos.length > 0) {
        params.servicePhotos.forEach((photo) => {
          if (photo) {
            formDataToSend.append('servicePhotos', photo);
          }
        });
      }
      
      const response = await serviceProviderApi.applyServiceProvider(formDataToSend);
      
      if (!response.success) {
        console.error('[ServiceProviderService] 申请提交失败:', response.message);
        throw new Error(response.message || '申请提交失败，请稍后重试');
      }
      
      console.log('[ServiceProviderService] 申请提交成功');
      toast.success('申请提交成功！');
      return response.data;
    } catch (error) {
      console.error('[ServiceProviderService] 提交申请过程中发生错误:', error);
      const errorMessage = error instanceof Error ? error.message : '申请提交失败，请稍后重试';
      toast.error(errorMessage);
      throw error;
    }
  },
  
  /**
   * 查询服务提供者申请状态
   * @param applicationId 申请ID
   * @returns 申请状态信息
   */
  async getApplicationStatus(applicationId?: string): Promise<ServiceProviderApplication> {
    try {
      console.log('[ServiceProviderService] 查询服务提供者申请状态');
      const response = await serviceProviderApi.getApplicationStatus(applicationId);
      
      if (!response.success) {
        console.error('[ServiceProviderService] 查询状态失败:', response.message);
        throw new Error(response.message || '查询申请状态失败');
      }
      
      console.log('[ServiceProviderService] 查询状态成功');
      return response.data;
    } catch (error) {
      console.error('[ServiceProviderService] 查询状态过程中发生错误:', error);
      throw error;
    }
  },
  
  /**
   * 验证服务提供者申请表单
   * @param formData 表单数据
   * @returns 验证结果 {isValid: boolean, errors: {}} 及错误信息
   */
  validateApplicationForm(formData: any): { isValid: boolean; errors: Record<string, string> } {
    // 使用独立的验证工具函数
    const errors = validateServiceProviderForm(formData);
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  /**
   * 获取Redux thunk actions
   */
  getThunks: () => ({
    submitApplication: submitApplicationThunk,
    checkApplicationStatus: checkStatusThunk
  })
};

export default serviceProviderService;