import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOrder as createOrderAction } from '../slice/orderSlice';
import { CreateOrderDto } from '../types/dto';
import { OrderService } from '../services/orderService';
import { validateOrderDates } from '../utils/validationUtils';

interface UseOrderFormReturn {
  formData: Partial<CreateOrderDto>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (field: keyof CreateOrderDto, value: any) => void;
  handleSubmit: () => Promise<boolean>;
  validateForm: () => boolean;
  resetForm: () => void;
}

export const useOrderForm = (initialData: Partial<CreateOrderDto> = {}): UseOrderFormReturn => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Partial<CreateOrderDto>>({ ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 处理表单字段变化
  const handleChange = (field: keyof CreateOrderDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // 使用服务层的验证方法
    const validationResult = OrderService.validateOrderData(formData);
    if (!validationResult.valid && validationResult.message) {
      newErrors['general'] = validationResult.message;
    }

    // 验证日期范围
    if (formData.startDate && formData.endDate) {
      const dateValidation = validateOrderDates(new Date(formData.startDate), new Date(formData.endDate));
      if (!dateValidation.valid && dateValidation.message) {
        newErrors['dateRange'] = dateValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    
    try {
      // 创建订单
      const result = await dispatch(createOrderAction(formData as CreateOrderDto)).unwrap();
      
      // 重置表单
      resetForm();
      
      return true;
    } catch (error) {
      setErrors({ 'submit': error as string });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({ ...initialData });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateForm,
    resetForm
  };
};