import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceProviderService from '../services/serviceProviderService';
import type { ApplyServiceProviderRequest, ApplyServiceProviderResponse } from '../types/dto';
import { ServiceType } from '../types/enums';

/**
 * 自定义hook，用于处理服务提供者申请的状态和逻辑
 */
const useApplyServiceProvider = () => {
  const navigate = useNavigate();
  
  // 表单状态管理
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ApplyServiceProviderRequest>>({
    // 基本信息
    name: '',
    phone: '',
    email: '',
    idCard: '',
    address: '',
    // 服务信息
    serviceType: ServiceType.PET_SITTING,
    hasExperience: false,
    experienceYears: '',
    serviceDesc: '',
    // 服务时间
    availableWeekdays: false,
    availableWeekends: false,
    availableEvenings: false,
    // 定价信息
    basePrice: '',
    additionalPrice: '',
    // 上传图片
    idCardFront: null,
    idCardBack: null,
    servicePhotos: [],
    // 其他信息
    emergencyContactName: '',
    emergencyContactPhone: '',
    additionalInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误信息
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (!files?.length) return;
    
    if (name === 'servicePhotos') {
      setFormData(prev => ({
        ...prev,
        servicePhotos: [...(prev.servicePhotos || []), ...Array.from(files)]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
    
    // 清除对应字段的错误信息
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // 移除上传的图片
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      servicePhotos: (prev.servicePhotos || []).filter((_, i) => i !== index)
    }));
    
    // 如果移除的是当前显示的图片，更新显示索引
    if (index === activeImageIndex) {
      setActiveImageIndex(0);
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    const validationResult = serviceProviderService.validateApplicationForm(formData);
    setFormErrors(validationResult.errors);
    return validationResult.isValid;
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 模拟API提交（在实际项目中这里会调用service方法）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 实际环境中调用以下代码
      // const result = await serviceProviderService.submitApplication(formData as ApplyServiceProviderRequest);
      
      setSubmitSuccess(true);
      
      // 重置表单
      setFormData({
        name: '',
        phone: '',
        email: '',
        idCard: '',
        address: '',
        serviceType: ServiceType.PET_SITTING,
        hasExperience: false,
        experienceYears: '',
        serviceDesc: '',
        availableWeekdays: false,
        availableWeekends: false,
        availableEvenings: false,
        basePrice: '',
        additionalPrice: '',
        idCardFront: null,
        idCardBack: null,
        servicePhotos: [],
        emergencyContactName: '',
        emergencyContactPhone: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('提交申请失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 处理步骤导航
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 返回首页
  const returnToHome = () => {
    navigate('/', { replace: true });
  };
  
  return {
    currentStep,
    formData,
    isSubmitting,
    submitSuccess,
    formErrors,
    activeImageIndex,
    handleChange,
    handleFileUpload,
    removeImage,
    handleSubmit,
    goToStep,
    returnToHome,
    setSubmitSuccess
  };
};

export default useApplyServiceProvider;