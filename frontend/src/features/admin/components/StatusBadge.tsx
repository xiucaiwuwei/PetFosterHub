import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 状态标签组件
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'default',
  size = 'md'
}) => {
  const getTypeStyles = () => {
    const typeStyles: Record<StatusBadgeProps['type'], string> = {
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-purple-100 text-purple-800',
      secondary: 'bg-gray-100 text-gray-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return typeStyles[type];
  };

  const getSizeStyles = () => {
    const sizeStyles: Record<StatusBadgeProps['size'], string> = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-0.5',
      lg: 'text-base px-3 py-1'
    };
    return sizeStyles[size];
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${getTypeStyles()} ${getSizeStyles()}`}
    >
      {status}
    </span>
  );
};