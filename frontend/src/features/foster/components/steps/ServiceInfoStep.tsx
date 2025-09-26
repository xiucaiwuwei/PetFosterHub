import React from 'react';
import ErrorDisplay from './ErrorDisplay';

interface ServiceInfoStepProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ServiceInfoStep: React.FC<ServiceInfoStepProps> = ({ formData, errors, onChange }) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">服务信息</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="dailyPrice" className="block text-sm font-medium text-gray-700 mb-1">
            每日寄养价格（元） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="dailyPrice"
            name="dailyPrice"
            value={formData.dailyPrice}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.dailyPrice ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入每日寄养价格"
            min="0"
            step="0.01"
          />
          <ErrorDisplay errors={errors} fieldName="dailyPrice" />
        </div>
        
        <div>
          <label htmlFor="maxDays" className="block text-sm font-medium text-gray-700 mb-1">
            最长可寄养天数 <span className="text-red-500">*</span>
          </label>
          <select
            id="maxDays"
            name="maxDays"
            value={formData.maxDays}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.maxDays ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          >
            <option value="">请选择</option>
            <option value="7">1周以内</option>
            <option value="14">2周以内</option>
            <option value="30">1个月以内</option>
            <option value="60">2个月以内</option>
            <option value="unlimited">不限</option>
          </select>
          <ErrorDisplay errors={errors} fieldName="maxDays" />
        </div>
        
        <div>
          <label htmlFor="serviceDesc" className="block text-sm font-medium text-gray-700 mb-1">
            服务特色描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="serviceDesc"
            name="serviceDesc"
            value={formData.serviceDesc}
            onChange={onChange}
            rows={4}
            className={`w-full px-3 py-2 border ${errors.serviceDesc ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请描述您能提供的服务特色，如遛狗、喂食、陪玩等"
          />
          <ErrorDisplay errors={errors} fieldName="serviceDesc" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">紧急联系人</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                联系人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={onChange}
                className={`w-full px-3 py-2 border ${errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="请输入紧急联系人姓名"
              />
              <ErrorDisplay errors={errors} fieldName="emergencyContactName" />
            </div>
            
            <div>
              <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={onChange}
                className={`w-full px-3 py-2 border ${errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="请输入紧急联系人电话"
              />
              <ErrorDisplay errors={errors} fieldName="emergencyContactPhone" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoStep;