import { useState, useCallback } from 'react';
import fosterService from '../services/fosterService';
import type { ApplyFosterRequest } from '../types/dto';

// 定义表单数据类型
export interface FosterApplyFormData {
  name: string;
  phone: string;
  email: string;
  idCard: string;
  address: string;
  hasYard: boolean;
  livingSpace: string;
  petExperience: string;
  acceptDog: boolean;
  acceptCat: boolean;
  acceptSmallPet: boolean;
  acceptOther: boolean;
  otherPetType?: string;
  dailyPrice: string;
  maxDays: string;
  serviceDesc: string;
  idCardFront: File | null;
  idCardBack: File | null;
  livingEnvPhotos: File[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  additionalInfo: string;
}

// 定义表单错误类型
export interface FosterApplyFormErrors {
  [key: string]: string;
}

// 自定义Hook：处理寄养申请表单
export const useFosterApply = () => {
  // 表单数据状态
  const [formData, setFormData] = useState<FosterApplyFormData>({
    name: '',
    phone: '',
    email: '',
    idCard: '',
    address: '',
    hasYard: false,
    livingSpace: '',
    petExperience: '',
    acceptDog: false,
    acceptCat: false,
    acceptSmallPet: false,
    acceptOther: false,
    otherPetType: '',
    dailyPrice: '',
    maxDays: '',
    serviceDesc: '',
    idCardFront: null,
    idCardBack: null,
    livingEnvPhotos: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    additionalInfo: ''
  });

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<FosterApplyFormErrors>({});

  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState(1);

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 提交成功状态
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 处理表单输入变化
  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除对应字段的错误
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  // 处理文件上传
  const handleFileUpload = useCallback((field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  }, []);

  // 处理多文件上传
  const handleMultipleFileUpload = useCallback((field: string, files: File[]) => {
    setFormData(prev => {
      const currentFiles = prev[field] as File[] || [];
      return {
        ...prev,
        [field]: [...currentFiles, ...files]
      };
    });
  }, []);

  // 移除图片
  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      livingEnvPhotos: prev.livingEnvPhotos.filter((_, i) => i !== index)
    }));
  }, []);

  // 验证表单
  const validateForm = useCallback(() => {
    const errors: FosterApplyFormErrors = {};

    // 第一步：基本信息验证
    if (currentStep === 1 || currentStep === 4) {
      if (!formData.name.trim()) errors.name = '请输入姓名';
      if (!formData.phone.trim()) {
        errors.phone = '请输入手机号码';
      } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        errors.phone = '请输入有效的手机号码';
      }
      if (!formData.email.trim()) {
        errors.email = '请输入电子邮箱';
      } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)) {
        errors.email = '请输入有效的电子邮箱';
      }
      if (!formData.idCard.trim()) {
        errors.idCard = '请输入身份证号码';
      } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(formData.idCard)) {
        errors.idCard = '请输入有效的身份证号码';
      }
      if (!formData.address.trim()) errors.address = '请输入详细地址';
      if (!formData.idCardFront) errors.idCardFront = '请上传身份证正面照片';
      if (!formData.idCardBack) errors.idCardBack = '请上传身份证反面照片';
    }

    // 第二步：居住环境验证
    if (currentStep === 2 || currentStep === 4) {
      if (!formData.livingSpace) errors.livingSpace = '请选择居住空间大小';
      if (!formData.petExperience) errors.petExperience = '请选择宠物饲养经验';
      if (formData.livingEnvPhotos.length === 0) {
        errors.livingEnvPhotos = '请至少上传一张居住环境照片';
      }
    }

    // 第三步：可接受宠物类型验证
    if (currentStep === 3 || currentStep === 4) {
      if (!(formData.acceptDog || formData.acceptCat || formData.acceptSmallPet || formData.acceptOther)) {
        errors.acceptDog = '请至少选择一种可接受的宠物类型';
      }
      if (formData.acceptOther && !formData.otherPetType?.trim()) {
        errors.otherPetType = '请输入其他宠物类型';
      }
      if (!formData.dailyPrice.trim()) {
        errors.dailyPrice = '请输入每日寄养价格';
      } else if (isNaN(Number(formData.dailyPrice)) || Number(formData.dailyPrice) <= 0) {
        errors.dailyPrice = '请输入有效的每日寄养价格';
      }
      if (!formData.maxDays.trim()) {
        errors.maxDays = '请输入最长可寄养天数';
      } else if (isNaN(Number(formData.maxDays)) || Number(formData.maxDays) <= 0) {
        errors.maxDays = '请输入有效的最长可寄养天数';
      }
      if (!formData.serviceDesc.trim()) {
        errors.serviceDesc = '请输入服务特色描述';
      } else if (formData.serviceDesc.length < 10) {
        errors.serviceDesc = '服务特色描述至少需要10个字符';
      }
    }

    // 第四步：紧急联系人验证
    if (currentStep === 4) {
      if (!formData.emergencyContactName.trim()) errors.emergencyContactName = '请输入紧急联系人姓名';
      if (!formData.emergencyContactPhone.trim()) {
        errors.emergencyContactPhone = '请输入紧急联系人电话';
      } else if (!/^1[3-9]\d{9}$/.test(formData.emergencyContactPhone)) {
        errors.emergencyContactPhone = '请输入有效的紧急联系人电话';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, currentStep]);

  // 处理步骤导航
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 处理表单提交
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      // 滚动到第一个错误字段
      const firstErrorField = document.querySelector('[name="' + Object.keys(formErrors)[0] + '"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 构建API请求参数
      const requestParams: ApplyFosterRequest = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        idCard: formData.idCard,
        address: formData.address,
        hasYard: formData.hasYard,
        livingSpace: formData.livingSpace,
        petExperience: formData.petExperience,
        acceptDog: formData.acceptDog,
        acceptCat: formData.acceptCat,
        acceptSmallPet: formData.acceptSmallPet,
        acceptOther: formData.acceptOther,
        otherPetType: formData.otherPetType,
        dailyPrice: Number(formData.dailyPrice),
        maxDays: Number(formData.maxDays),
        serviceDesc: formData.serviceDesc,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        additionalInfo: formData.additionalInfo
      };
      
      // 上传文件（实际项目中可能需要单独处理文件上传）
      // 这里简化处理，实际项目中可能需要FormData
      
      // 调用API提交申请
      await fosterService.applyFosterService(requestParams);
      
      setSubmitSuccess(true);
      
      // 重置表单
      setFormData({
        name: '',
        phone: '',
        email: '',
        idCard: '',
        address: '',
        hasYard: false,
        livingSpace: '',
        petExperience: '',
        acceptDog: false,
        acceptCat: false,
        acceptSmallPet: false,
        acceptOther: false,
        otherPetType: '',
        dailyPrice: '',
        maxDays: '',
        serviceDesc: '',
        idCardFront: null,
        idCardBack: null,
        livingEnvPhotos: [],
        emergencyContactName: '',
        emergencyContactPhone: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('申请寄养服务失败:', error);
      setFormErrors({ submit: error instanceof Error ? error.message : '申请提交失败，请稍后重试' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, formErrors, validateForm]);

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      idCard: '',
      address: '',
      hasYard: false,
      livingSpace: '',
      petExperience: '',
      acceptDog: false,
      acceptCat: false,
      acceptSmallPet: false,
      acceptOther: false,
      otherPetType: '',
      dailyPrice: '',
      maxDays: '',
      serviceDesc: '',
      idCardFront: null,
      idCardBack: null,
      livingEnvPhotos: [],
      emergencyContactName: '',
      emergencyContactPhone: '',
      additionalInfo: ''
    });
    setFormErrors({});
    setCurrentStep(1);
    setSubmitSuccess(false);
  }, []);

  // 返回提交成功后重置
  const resetAfterSuccess = useCallback(() => {
    setSubmitSuccess(false);
    resetForm();
  }, [resetForm]);

  // 导航到首页
  const navigateToHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  return {
    formData,
    formErrors,
    currentStep,
    isSubmitting,
    submitSuccess,
    handleChange,
    handleFileUpload,
    handleMultipleFileUpload,
    removeImage,
    validateForm,
    goToStep,
    handleSubmit,
    resetForm,
    resetAfterSuccess,
    navigateToHome
  };
};

export default useFosterApply;