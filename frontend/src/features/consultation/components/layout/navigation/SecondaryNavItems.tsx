import React from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

interface SecondaryNavItemsProps {
  secondaryNavItems: NavItem[];
  selectedNavItem: string;
  onNavItemChange: (id: string) => void;
}

const SecondaryNavItems: React.FC<SecondaryNavItemsProps> = ({
  secondaryNavItems,
  selectedNavItem,
  onNavItemChange
}) => {
  // 动画变体
  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="hidden md:flex space-x-2 ml-2">
      {secondaryNavItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => onNavItemChange(item.id)}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 flex items-center justify-center text-sm font-medium ${selectedNavItem === item.id
            ? 'bg-white text-orange-600 shadow-md border border-orange-200'
            : 'text-gray-700 hover:bg-white hover:text-orange-700 hover:shadow-sm'}`}
          whileHover={buttonVariants.hover}
          whileTap={buttonVariants.tap}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
};

export default SecondaryNavItems;