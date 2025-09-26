import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

/**
 * 统计数据卡片组件
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconColor,
  iconBgColor
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              <i className={`fa-solid ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          <i className={`fa-solid ${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};