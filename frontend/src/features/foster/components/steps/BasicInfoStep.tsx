/**
 * 寄养申请表单基本信息步骤
 * 收集用户的姓名、联系方式等基本信息
 */
import React from 'react';
import ErrorDisplay from '@/components/forms/ErrorDisplay.tsx';

interface BasicInfoStepProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, errors, onChange }) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">基本信息</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入您的真实姓名"
          />
          <ErrorDisplay errors={errors} fieldName="name" />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">手机号码 <span className="text-red-500">*</span></label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入手机号码"
          />
          <ErrorDisplay errors={errors} fieldName="phone" />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">电子邮箱 <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入电子邮箱"
          />
          <ErrorDisplay errors={errors} fieldName="email" />
        </div>
        
        <div>
          <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">身份证号码 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="idCard"
            name="idCard"
            value={formData.idCard}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.idCard ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入身份证号码"
          />
          <ErrorDisplay errors={errors} fieldName="idCard" />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">详细地址 <span className="text-red-500">*</span></label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            rows={3}
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入详细地址，以便我们了解服务区域"
          />
          <ErrorDisplay errors={errors} fieldName="address" />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;