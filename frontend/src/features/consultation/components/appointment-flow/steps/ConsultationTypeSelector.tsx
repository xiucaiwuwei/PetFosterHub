import React from 'react';
import { motion } from 'framer-motion';
import { Video, MessageCircle } from 'lucide-react';

interface ConsultationTypeSelectorProps {
  consultationType: 'video' | 'text';
  onTypeChange: (type: 'video' | 'text') => void;
  errors?: Record<string, string>;
}

const ConsultationTypeSelector: React.FC<ConsultationTypeSelectorProps> = ({ consultationType, onTypeChange, errors }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm font-medium text-gray-500">
        <MessageCircle className="w-4 h-4 mr-2 text-orange-400" />
        选择问诊方式
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          type="button"
          className={`py-4 px-5 border rounded-xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${consultationType === 'video' 
            ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-md' 
            : 'border-gray-100 bg-white hover:border-orange-300 hover:bg-orange-50'}`}
          onClick={() => onTypeChange('video')}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${consultationType === 'video' ? 'bg-white/20' : 'bg-orange-100 text-orange-500'}`}
            whileHover={{ scale: 1.1 }}
          >
            <Video className="w-6 h-6" />
          </motion.div>
          <div className="text-base font-medium">视频问诊</div>
          <div className="text-xs mt-1 opacity-90">实时面对面交流</div>
        </motion.button>
        
        <motion.button
          type="button"
          className={`py-4 px-5 border rounded-xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${consultationType === 'text' 
            ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-md' 
            : 'border-gray-100 bg-white hover:border-orange-300 hover:bg-orange-50'}`}
          onClick={() => onTypeChange('text')}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${consultationType === 'text' ? 'bg-white/20' : 'bg-orange-100 text-orange-500'}`}
            whileHover={{ scale: 1.1 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
          <div className="text-base font-medium">文字问诊</div>
          <div className="text-xs mt-1 opacity-90">随时随地咨询</div>
        </motion.button>
      </div>
      
      {errors?.consultationType && (
        <motion.p 
          className="mt-2 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {errors.consultationType}
        </motion.p>
      )}
    </div>
  );
};

export default ConsultationTypeSelector;