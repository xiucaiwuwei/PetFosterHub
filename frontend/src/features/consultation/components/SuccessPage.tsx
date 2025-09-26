import React from 'react';
import { Veterinarian, TimeSlot } from '../types';
import { formatDateDisplay } from '../utils/validationUtils';

interface SuccessPageProps {
  selectedVet: Veterinarian | null;
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  consultationType: 'video' | 'text';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  onViewDetails: () => void;
  onBookNew: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  selectedVet,
  selectedDate,
  selectedTimeSlot,
  consultationType,
  petName,
  petType,
  petAge,
  onViewDetails,
  onBookNew
}) => {
  // 确保所有必要数据都存在
  if (!selectedVet || !selectedTimeSlot) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">预约信息加载中...</p>
      </div>
    );
  }

  // 获取宠物类型的中文名称
  const getPetTypeLabel = (type: string): string => {
    switch (type) {
      case 'dog':
        return '狗狗';
      case 'cat':
        return '猫咪';
      default:
        return '其他宠物';
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="bg-green-500 text-white p-6 rounded-full inline-block mb-6">
        <i className="fa-solid fa-check text-3xl"></i>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">预约成功！</h2>
      <p className="mb-4">您的宠物问诊预约已提交成功</p>
      <p className="text-green-600 mb-8">我们将通过短信发送预约详情到您的手机</p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3">预约详情</h3>
        <div className="space-y-2 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-gray-500">医生</span>
            <span className="font-medium text-gray-900">{selectedVet.name} ({selectedVet.specialty})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">日期时间</span>
            <span className="font-medium text-gray-900">
              {formatDateDisplay(selectedDate)} {selectedTimeSlot.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">问诊方式</span>
            <span className="font-medium text-gray-900">
              {consultationType === 'video' ? '视频问诊' : '文字问诊'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">宠物信息</span>
            <span className="font-medium text-gray-900">
              {petName} ({getPetTypeLabel(petType)})，{petAge}岁
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
            <span className="font-medium text-gray-900">费用</span>
            <span className="font-bold text-gray-900">¥{selectedVet.price}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
        <button 
          onClick={onViewDetails}
          className="py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          查看详情
        </button>
        <button 
          onClick={onBookNew}
          className="py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition duration-150 ease-in-out"
        >
          预约新问诊
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;