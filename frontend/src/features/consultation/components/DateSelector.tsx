import React from 'react';

interface DateSelectorProps {
  dateOptions: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  dateOptions, 
  selectedDate, 
  onSelectDate 
}) => {
  if (dateOptions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">暂无可用的日期</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {dateOptions.map((date) => (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={`flex flex-col items-center justify-center w-20 h-24 border rounded-lg p-2 transition-colors ${
              selectedDate === date
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <span className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' })}
            </span>
            <span className={`text-xl font-bold mt-1 ${
              selectedDate === date ? "text-orange-500" : "text-gray-900"
            }`}>
              {new Date(date).getDate()}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(date).toLocaleDateString('zh-CN', { month: 'short' })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;