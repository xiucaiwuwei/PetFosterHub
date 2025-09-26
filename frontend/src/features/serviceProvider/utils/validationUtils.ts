import { ApplyServiceProviderRequest } from '../types';

/**
 * 验证手机号码格式
 * @param phone 手机号码
 * @returns 是否为有效手机号码
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证电子邮箱格式
 * @param email 电子邮箱
 * @returns 是否为有效电子邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证身份证号码格式
 * @param idCard 身份证号码
 * @returns 是否为有效身份证号码
 */
export const isValidIdCard = (idCard: string): boolean => {
  // 简单验证，实际应用中可能需要更复杂的验证逻辑
  const idCardRegex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
};

/**
 * 验证价格格式
 * @param price 价格
 * @returns 是否为有效价格
 */
export const isValidPrice = (price: string): boolean => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * 验证文件大小
 * @param file 文件对象
 * @param maxSize 最大文件大小（MB）
 * @returns 文件是否符合大小要求
 */
export const isValidFileSize = (file: File, maxSize: number = 10): boolean => {
  return file.size <= maxSize * 1024 * 1024; // 转换为字节
};

/**
 * 验证文件类型
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型数组
 * @returns 文件类型是否被允许
 */
export const isValidFileType = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png']): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * 验证服务提供者申请表单数据
 * @param formData 表单数据
 * @returns 验证结果对象，包含错误信息
 */
export const validateServiceProviderForm = (formData: ApplyServiceProviderRequest): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // 基本信息验证
  if (!formData.name?.trim()) {
    errors.name = '请输入您的姓名';
  }
  
  if (!formData.phone?.trim()) {
    errors.phone = '请输入手机号码';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = '请输入有效的手机号码';
  }
  
  if (!formData.email?.trim()) {
    errors.email = '请输入邮箱地址';
  } else if (!isValidEmail(formData.email)) {
    errors.email = '请输入有效的邮箱地址';
  }
  
  if (!formData.idCard?.trim()) {
    errors.idCard = '请输入身份证号码';
  } else if (!isValidIdCard(formData.idCard)) {
    errors.idCard = '请输入有效的身份证号码';
  }
  
  if (!formData.address?.trim()) {
    errors.address = '请输入详细地址';
  }
  
  // 服务信息验证
  if (!formData.serviceType) {
    errors.serviceType = '请选择服务类型';
  }
  
  if (!formData.serviceDesc?.trim()) {
    errors.serviceDesc = '请描述您的服务特色';
  } else if (formData.serviceDesc.length < 20) {
    errors.serviceDesc = '描述至少20个字符';
  }
  
  // 服务时间验证
  if (!formData.availableWeekdays && !formData.availableWeekends) {
    errors.availability = '请至少选择一种可用时间段';
  }
  
  // 定价信息验证
  if (!formData.basePrice) {
    errors.basePrice = '请输入基础服务价格';
  } else if (!isValidPrice(formData.basePrice)) {
    errors.basePrice = '请输入有效的价格';
  }
  
  // 紧急联系人验证
  if (!formData.emergencyContactName?.trim()) {
    errors.emergencyContactName = '请输入紧急联系人姓名';
  }
  
  if (!formData.emergencyContactPhone?.trim()) {
    errors.emergencyContactPhone = '请输入紧急联系人电话';
  } else if (!isValidPhone(formData.emergencyContactPhone)) {
    errors.emergencyContactPhone = '请输入有效的紧急联系人电话';
  }
  
  // 文件验证
  if (!formData.idCardFront) {
    errors.idCardFront = '请上传身份证正面照片';
  } else if (!isValidFileSize(formData.idCardFront) || !isValidFileType(formData.idCardFront)) {
    errors.idCardFront = '身份证照片应为PNG、JPG格式，且大小不超过10MB';
  }
  
  if (!formData.idCardBack) {
    errors.idCardBack = '请上传身份证反面照片';
  } else if (!isValidFileSize(formData.idCardBack) || !isValidFileType(formData.idCardBack)) {
    errors.idCardBack = '身份证照片应为PNG、JPG格式，且大小不超过10MB';
  }
  
  if (!formData.servicePhotos || formData.servicePhotos.length < 2) {
    errors.servicePhotos = '请至少上传2张服务相关照片';
  } else {
    // 验证每张服务照片
    for (let i = 0; i < formData.servicePhotos.length; i++) {
      const photo = formData.servicePhotos[i];
      if (!isValidFileSize(photo) || !isValidFileType(photo)) {
        errors.servicePhotos = '服务照片应为PNG、JPG格式，且大小不超过10MB';
        break;
      }
    }
    
    // 验证照片数量上限
    if (formData.servicePhotos.length > 10) {
      errors.servicePhotos = '服务照片最多上传10张';
    }
  }
  
  return errors;
};