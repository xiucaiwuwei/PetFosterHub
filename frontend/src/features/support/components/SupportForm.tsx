import React, { useState } from 'react';
import { toast } from 'sonner';
import { SupportRequestDto } from '../types';
import { validateSupportMessage, validateServiceType } from '../utils/validationUtils';

interface SupportFormProps {
  onSubmit: (request: SupportRequestDto) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Partial<SupportRequestDto>;
}

const SupportForm: React.FC<SupportFormProps> = ({ 
  onSubmit, 
  isSubmitting = false,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<SupportRequestDto>({
    userId: initialData.userId || '',
    serviceType: initialData.serviceType || '',
    message: initialData.message || '',
    status: initialData.status || 'pending'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const messageValidation = validateSupportMessage(formData.message);
    const serviceTypeValidation = validateServiceType(formData.serviceType);
    
    const newErrors: Record<string, string> = {};
    if (!messageValidation.isValid) {
      newErrors.message = messageValidation.error!;
    }
    if (!serviceTypeValidation.isValid) {
      newErrors.serviceType = serviceTypeValidation.error!;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(formData);
      toast.success('支持请求提交成功');
      setFormData(prev => ({
        ...prev,
        message: '',
        serviceType: ''
      }));
    } catch (error) {
      toast.error('提交失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
          服务类型
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 px-3 py-2 border ${errors.serviceType ? 'border-red-500' : ''}`}
        >
          <option value="">请选择服务类型</option>
          <option value="foster">寄养服务</option>
          <option value="boarding">住宿服务</option>
          <option value="grooming">美容服务</option>
          <option value="training">训练服务</option>
          <option value="medical">医疗服务</option>
          <option value="other">其他服务</option>
        </select>
        {errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          问题描述
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 px-3 py-2 border resize-none ${errors.message ? 'border-red-500' : ''}`}
          placeholder="请详细描述您的问题或建议..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.message.length}/500 字符
        </p>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              提交中...
            </div>
          ) : (
            '提交支持请求'
          )}
        </button>
      </div>
    </form>
  );
};

export default SupportForm;