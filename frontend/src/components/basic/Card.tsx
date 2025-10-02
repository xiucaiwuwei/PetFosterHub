import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = 'md',
  rounded = 'lg'
}) => {
  const baseClasses = 'bg-white border border-gray-200';

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    none: 'shadow-none'
  };

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  return (
    <div className={cn(baseClasses, shadowClasses[shadow], roundedClasses[rounded], className)}>
      {children}
    </div>
  );
};

export default Card;