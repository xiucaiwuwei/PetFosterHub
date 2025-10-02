import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Calendar, Clock, Video, MessageSquare, DollarSign, Info, Shield, ChevronRight, Loader } from 'lucide-react';
import { Veterinarian, TimeSlot } from '../../../types';
import { formatDateDisplay } from '../../../utils/validationUtils';

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
      <motion.div 
        className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Info className="w-10 h-10 text-orange-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-6">请先填写完整的预约信息</p>
        <motion.button
          onClick={onBack}
          className="py-3 px-6 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300 shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          返回修改
        </motion.button>
      </motion.div>
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

  // 渲染星级评分
  const renderRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg key={index} className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 预约详情卡片 */}
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            预约详情确认
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* 兽医信息 */}
          <motion.div 
            className="flex items-center space-x-4 pb-4 border-b border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-orange-100 overflow-hidden shadow-sm">
              <img 
                src={selectedVet.avatar || 'https://via.placeholder.com/100'} 
                alt={selectedVet.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-lg">{selectedVet.name}</h4>
              <p className="text-sm text-gray-500">{selectedVet.specialty}</p>
              <div className="flex items-center mt-1">
                {renderRating(selectedVet.rating)}
                <span className="text-sm text-gray-600 ml-1">{selectedVet.rating}</span>
              </div>
            </div>
          </motion.div>
          
          {/* 预约信息 */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-orange-400" />
              预约信息
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center text-orange-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">日期</span>
                </div>
                <span className="font-medium text-gray-900">{formatDateDisplay(selectedDate)}</span>
              </div>
              
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center text-orange-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">时间</span>
                </div>
                <span className="font-medium text-gray-900">{selectedTimeSlot.time}</span>
              </div>
              
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center text-orange-500">
                  {consultationType === 'video' ? <Video className="w-4 h-4 mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                  <span className="text-sm">问诊方式</span>
                </div>
                <span className="font-medium text-gray-900">{consultationType === 'video' ? '视频问诊' : '文字问诊'}</span>
              </div>
              
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center text-orange-500">
                  <span className="w-4 h-4 mr-2">🐾</span>
                  <span className="text-sm">宠物信息</span>
                </div>
                <span className="font-medium text-gray-900">{petName} ({getPetTypeLabel(petType)})，{petAge}岁</span>
              </div>
            </div>
          </motion.div>
          
          {/* 症状描述 */}
          <motion.div 
            className="pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h4 className="font-medium text-gray-700 text-sm mb-3 flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-orange-400" />
              症状描述
            </h4>
            <p className="font-medium text-gray-900 bg-white border border-gray-100 rounded-xl p-4 text-sm">{symptoms}</p>
          </motion.div>
          
          {/* 费用信息 */}
          <motion.div 
            className="mt-4 pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-1.5" />
                <span className="font-medium">问诊费用</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">¥{selectedVet.price}</span>
                <ChevronRight className="w-4 h-4 ml-1 text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* 预约须知 */}
      <motion.div 
        className="bg-orange-50 p-4 rounded-xl border border-orange-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-orange-800">预约须知</h4>
            <ul className="mt-2 text-sm text-orange-700 space-y-2">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>请在预约时间前10分钟准备好，保持网络畅通</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>视频问诊请确保光线充足，以便医生观察宠物状况</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>如需取消预约，请提前24小时操作</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>问诊时长约15-20分钟，请提前整理好问题</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* 操作按钮 */}
      <motion.div 
        className="flex space-x-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <motion.button 
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          上一步
        </motion.button>
        <motion.button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 focus:outline-none transition-all duration-300 flex items-center justify-center shadow-sm shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              提交中...
            </>
          ) : (
            "确认预约并支付"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookingConfirmation;