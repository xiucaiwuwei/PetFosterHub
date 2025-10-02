import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Video, MessageSquare, DollarSign, Info, ArrowRight, PawPrint, Mail, PhoneCall } from 'lucide-react';
import { Veterinarian, TimeSlot } from '../../../types';
import { formatDateDisplay } from "../../../utils/validationUtils";

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
      <motion.div 
        className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Info className="w-10 h-10 text-orange-400 mx-auto mb-4" />
        <p className="text-gray-500">预约信息加载中...</p>
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
      className="text-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 成功图标和标题 */}
      <motion.div 
        className="mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative inline-block">
          {/* 外环动画 */}
          <motion.div 
            className="absolute -inset-4 rounded-full bg-green-100 opacity-30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
          />
          {/* 成功图标 */}
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-full inline-block shadow-lg shadow-green-200">
            <CheckCircle className="w-12 h-12" />
          </div>
        </div>
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold mb-2 text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        预约成功！
      </motion.h2>
      
      <motion.p 
        className="mb-4 text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        您的宠物问诊预约已提交成功
      </motion.p>
      
      <motion.div 
        className="flex items-center justify-center text-green-600 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Mail className="w-4 h-4 mr-1.5" />
        <p>我们将通过短信发送预约详情到您的手机</p>
      </motion.div>
      
      {/* 预约详情卡片 */}
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {/* 卡片头部 */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-100">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            预约详情
          </h3>
        </div>
        
        {/* 卡片内容 */}
        <div className="p-6">
          {/* 兽医信息 */}
          <motion.div 
            className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-green-100 overflow-hidden shadow-sm">
              <img 
                src={selectedVet.avatar || 'https://via.placeholder.com/100'} 
                alt={selectedVet.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{selectedVet.name}</h4>
              <div className="flex items-center mt-1">
                {renderRating(selectedVet.rating)}
                <span className="text-xs text-gray-600 ml-1">{selectedVet.rating}</span>
              </div>
            </div>
          </motion.div>
          
          {/* 预约信息列表 */}
          <motion.div 
            className="space-y-4 text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">日期时间</span>
              </div>
              <span className="font-medium text-gray-900 text-sm">
                {formatDateDisplay(selectedDate)} {selectedTimeSlot.time}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                {consultationType === 'video' ? <Video className="w-4 h-4 mr-2 text-green-500" /> : <MessageSquare className="w-4 h-4 mr-2 text-green-500" />}
                <span className="text-sm">问诊方式</span>
              </div>
              <span className="font-medium text-gray-900 text-sm">
                {consultationType === 'video' ? '视频问诊' : '文字问诊'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                <PawPrint className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">宠物信息</span>
              </div>
              <span className="font-medium text-gray-900 text-sm">
                {petName} ({getPetTypeLabel(petType)})，{petAge}岁
              </span>
            </div>
            
            {/* 费用信息 */}
            <div className="pt-4 border-t border-gray-100 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-medium">费用</span>
                </div>
                <span className="text-lg font-bold text-gray-900">¥{selectedVet.price}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* 操作按钮 */}
      <motion.div 
        className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        {/* 查看详情按钮 */}
        <motion.button 
          onClick={onViewDetails}
          className="py-3 px-6 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Info className="w-4 h-4 mr-1.5" />
          查看详情
        </motion.button>
        
        {/* 预约新问诊按钮 */}
        <motion.button 
          onClick={onBookNew}
          className="py-3 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center shadow-md shadow-orange-100"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          预约新问诊
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </motion.button>
      </motion.div>
      
      {/* 联系我们提示 */}
      <motion.div 
        className="mt-8 text-xs text-gray-500 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        <PhoneCall className="w-3 h-3 mr-1.5" />
        <span>如有疑问，请联系客服: 400-123-4567</span>
      </motion.div>
    </motion.div>
  );
};

export default SuccessPage;