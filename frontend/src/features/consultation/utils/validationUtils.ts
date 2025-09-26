import { ConsultationRequestDTO } from '../types';

// 验证宠物名称
export const validatePetName = (name: string): string => {
  if (!name.trim()) {
    return '请输入宠物名称';
  }
  if (name.length > 20) {
    return '宠物名称不能超过20个字符';
  }
  return '';
};

// 验证宠物年龄
export const validatePetAge = (age: string): string => {
  if (!age.trim()) {
    return '请输入宠物年龄';
  }
  if (!/^\d+(\.\d+)?$/.test(age)) {
    return '请输入有效的年龄数字';
  }
  const numAge = parseFloat(age);
  if (numAge < 0.1 || numAge > 20) {
    return '宠物年龄应在0.1-20岁之间';
  }
  return '';
};

// 验证症状描述
export const validateSymptoms = (symptoms: string): string => {
  if (!symptoms.trim()) {
    return '请描述宠物的症状或咨询问题';
  }
  if (symptoms.length < 10) {
    return '症状描述至少需要10个字符';
  }
  if (symptoms.length > 500) {
    return '症状描述不能超过500个字符';
  }
  return '';
};

// 验证预约表单
export const validateConsultationForm = (formData: Partial<ConsultationRequestDTO>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // 验证宠物名称
  if (formData.petName !== undefined) {
    const nameError = validatePetName(formData.petName);
    if (nameError) {
      errors.petName = nameError;
    }
  }
  
  // 验证宠物年龄
  if (formData.petAge !== undefined) {
    const ageError = validatePetAge(formData.petAge);
    if (ageError) {
      errors.petAge = ageError;
    }
  }
  
  // 验证症状描述
  if (formData.symptoms !== undefined) {
    const symptomsError = validateSymptoms(formData.symptoms);
    if (symptomsError) {
      errors.symptoms = symptomsError;
    }
  }
  
  // 验证医生选择
  if (!formData.vetId) {
    errors.vetId = '请选择一位医生';
  }
  
  // 验证日期选择
  if (!formData.date) {
    errors.date = '请选择预约日期';
  }
  
  // 验证时间段选择
  if (!formData.timeSlotId) {
    errors.timeSlotId = '请选择预约时间段';
  }
  
  // 验证问诊方式选择
  if (!formData.consultationType) {
    errors.consultationType = '请选择问诊方式';
  }
  
  // 验证宠物类型选择
  if (!formData.petType) {
    errors.petType = '请选择宠物类型';
  }
  
  return errors;
};

// 格式化日期显示
export const formatDateDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    // 判断是否为今天
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}`;
    }
    
    // 判断是否为明天
    if (date.toDateString() === tomorrow.toDateString()) {
      return `明天 ${date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}`;
    }
    
    // 其他日期格式化为 星期几 MM/DD
    return `${date.toLocaleDateString('zh-CN', { weekday: 'short' })} ${date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};