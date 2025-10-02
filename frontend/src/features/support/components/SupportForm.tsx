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
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-6">提交支持请求</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <i className="fa-solid fa-paw text-orange-500 mr-2"></i>
            服务类型
          </label>
          <div className="relative">
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.serviceType ? 'border-red-500' : 'border-gray-300'} bg-white shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200 appearance-none`}
            >
              <option value="">请选择服务类型</option>
              <option value="foster">寄养服务</option>
              <option value="boarding">住宿服务</option>
              <option value="grooming">美容服务</option>
              <option value="training">训练服务</option>
              <option value="medical">医疗服务</option>
              <option value="other">其他服务</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>
          {errors.serviceType && (
            <div className="mt-1 flex items-start">
              <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5 mr-2"></i>
              <p className="text-sm text-red-600">{errors.serviceType}</p>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <i className="fa-solid fa-comment text-orange-500 mr-2"></i>
            问题描述
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} bg-white shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200 resize-none`}
            placeholder="请详细描述您的问题或建议..."
          />
          {errors.message && (
            <div className="mt-1 flex items-start">
              <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5 mr-2"></i>
              <p className="text-sm text-red-600">{errors.message}</p>
            </div>
          )}
          <p className={`mt-2 text-xs font-medium ${formData.message.length > 450 ? 'text-orange-500' : formData.message.length >= 500 ? 'text-red-500' : 'text-gray-500'}`}>
            {formData.message.length}/500 字符
          </p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed hover:translate-y-0' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                提交中...
              </div>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane mr-2"></i>
                提交支持请求
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportForm;