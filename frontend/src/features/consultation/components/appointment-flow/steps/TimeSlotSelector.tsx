import React from 'react';
import { motion } from 'framer-motion';
import { TimeSlot } from '../types';
import { Clock as ClockIcon, CheckCircle } from 'lucide-react';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (slot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  timeSlots, 
  selectedTimeSlot, 
  onSelectTimeSlot 
}) => {
  // 检查是否为上午时段
  const isMorning = (timeString: string) => {
    const hour = parseInt(timeString.split(':')[0]);
    return hour < 12;
  };

  if (timeSlots.length === 0) {
    return (
      <motion.div 
        className="text-center py-12 border border-gray-100 rounded-xl bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-500 rounded-full mb-3">
          <ClockIcon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">暂无可用的时间段</h3>
        <p className="text-sm text-gray-500">请选择其他日期或稍后再试</p>
      </motion.div>
    );
  }

  // 按上午/下午分组
  const morningSlots = timeSlots.filter(slot => isMorning(slot.time));
  const afternoonSlots = timeSlots.filter(slot => !isMorning(slot.time));

  return (
    <div className="space-y-5">
      <div className="flex items-center text-sm font-medium text-gray-500">
        <ClockIcon className="w-4 h-4 mr-2 text-orange-400" />
        选择问诊时间
      </div>
      
      {/* 上午时间段 */}
      {morningSlots.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">上午</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {morningSlots.map((slot, index) => (
              <motion.button
                key={slot.id}
                className={`py-2.5 px-2 text-center rounded-xl border transition-all duration-300 shadow-sm relative overflow-hidden ${slot.available 
                  ? (selectedTimeSlot?.id === slot.id 
                    ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-400 text-white font-medium shadow-md' 
                    : 'border-gray-100 bg-white hover:border-orange-300 hover:bg-orange-50') 
                  : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                onClick={() => slot.available && onSelectTimeSlot(slot)}
                disabled={!slot.available}
                whileHover={slot.available ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
                whileTap={slot.available ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div className="text-sm font-medium">{slot.time}</div>
                
                {selectedTimeSlot?.id === slot.id && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      {/* 下午时间段 */}
      {afternoonSlots.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">下午</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {afternoonSlots.map((slot, index) => (
              <motion.button
                key={slot.id}
                className={`py-2.5 px-2 text-center rounded-xl border transition-all duration-300 shadow-sm relative overflow-hidden ${slot.available 
                  ? (selectedTimeSlot?.id === slot.id 
                    ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-400 text-white font-medium shadow-md' 
                    : 'border-gray-100 bg-white hover:border-orange-300 hover:bg-orange-50') 
                  : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                onClick={() => slot.available && onSelectTimeSlot(slot)}
                disabled={!slot.available}
                whileHover={slot.available ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
                whileTap={slot.available ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div className="text-sm font-medium">{slot.time}</div>
                
                {selectedTimeSlot?.id === slot.id && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;