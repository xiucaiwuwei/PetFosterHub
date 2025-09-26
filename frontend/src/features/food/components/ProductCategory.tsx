import React from 'react';
import { motion } from 'framer-motion';

interface CategoryItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface ProductCategoryProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  showIcons?: boolean;
  horizontal?: boolean;
  className?: string;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showIcons = false,
  horizontal = false,
  className = ''
}) => {
  const containerClassName = `
    ${className}
    ${horizontal ? 'flex overflow-x-auto pb-2' : 'flex flex-col'}
    gap-2
  `;

  const itemClassName = (
    categoryId: string
  ) => `
    cursor-pointer transition-all duration-300
    ${showIcons ? 'flex items-center gap-2' : 'text-center'}
    ${horizontal ? 'whitespace-nowrap px-4 py-2 rounded-full' : 'px-4 py-3 rounded-lg'}
    ${categoryId === selectedCategory
      ? 'bg-blue-500 text-white font-medium shadow-md'
      : 'bg-white text-gray-700 hover:bg-gray-50'}
  `;

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className={containerClassName}>
      {categories.map((category) => (
        <motion.div
          key={category.id}
          className={itemClassName(category.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleCategoryClick(category.id)}
          layout
        >
          {showIcons && category.icon && (
            <span>{category.icon}</span>
          )}
          <span>{category.name}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductCategory;