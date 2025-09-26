import React from 'react';
import { Veterinarian, TimeSlot } from '../types';
import { formatDateDisplay } from '../utils/validationUtils';

interface BookingConfirmationProps {
  selectedVet: Veterinarian | null;
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  consultationType: 'video' | 'text';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  symptoms: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  selectedVet,
  selectedDate,
  selectedTimeSlot,
  consultationType,
  petName,
  petType,
  petAge,
  symptoms,
  isSubmitting,
  onSubmit,
  onBack
}) => {
  // 确保所有必要数据都存在
  if (!selectedVet || !selectedTimeSlot || !selectedDate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">请先填写完整的预约信息</p>
        <button
          onClick={onBack}
          className="mt-4 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          返回修改
        </button>
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
    <div className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">预约详情</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">医生</span>
            <span className="font-medium text-gray-900">{selectedVet.name} ({selectedVet.specialty})</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">日期</span>
            <span className="font-medium text-gray-900">{formatDateDisplay(selectedDate)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">时间</span>
            <span className="font-medium text-gray-900">{selectedTimeSlot.time}</span>
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
          
          <div>
            <span className="text-gray-500 block mb-1">症状描述</span>
            <p className="font-medium text-gray-900 bg-white p-3 rounded border border-gray-200 text-sm">
              {symptoms}
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">问诊费用</span>
            <span className="text-xl font-bold text-gray-900">¥{selectedVet.price}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-start">
          <i className="fa-solid fa-info-circle text-orange-500 mt-0.5 mr-3"></i>
          <div>
            <h4 className="font-medium text-orange-800">预约须知</h4>
            <ul className="mt-2 text-sm text-orange-700 space-y-1">
              <li>• 请在预约时间前10分钟准备好，保持网络畅通</li>
              <li>• 视频问诊请确保光线充足，以便医生观察宠物状况</li>
              <li>• 如需取消预约，请提前24小时操作</li>
              <li>• 问诊时长约15-20分钟，请提前整理好问题</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
        >
          上一步
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              提交中...
            </>
          ) : (
            "确认预约并支付"
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;