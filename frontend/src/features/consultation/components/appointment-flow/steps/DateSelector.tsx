import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateSelectorProps {
  dateOptions: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dateOptions, selectedDate, onSelectDate }) => {
  // 格式化日期为更友好的显示格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return '明天';
    }
    
    const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    return `${dayOfWeek}`;
  };

  // 检查是否为周末
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // 检查是否为今天
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (dateOptions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">暂无可用的日期</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm font-medium text-gray-500">
        <CalendarIcon className="w-4 h-4 mr-2 text-orange-400" />
        选择问诊日期
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {dateOptions.map((date, index) => {
          const isSelected = selectedDate === date;
          const weekend = isWeekend(date);
          const today = isToday(date);
          
          return (
            <motion.button
              key={date}
              className={`py-3 px-2 text-center rounded-xl border transition-all duration-300 shadow-sm relative overflow-hidden ${isSelected 
                ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-400 text-white font-medium shadow-md' 
                : 'border-gray-100 bg-white hover:border-orange-300 hover:bg-orange-50'}`}
              onClick={() => onSelectDate(date)}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="text-sm font-medium">
                {formatDate(date)}
              </div>
              <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-white' : weekend ? 'text-red-500' : 'text-gray-500'}`}>
                {new Date(date).getDate()}日
              </div>
              
              {today && !isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full">
                  今天
                </div>
              )}
              
              {isSelected && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;