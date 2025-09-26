import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProductSearchProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  debounceDelay?: number;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  initialValue = '',
  onSearch,
  placeholder = '搜索商品...',
  className = '',
  autoFocus = false,
  debounceDelay = 300
}) => {
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // 防抖处理搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch, debounceDelay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`flex items-center rounded-full border transition-all duration-300 ${isFocused ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
        layout
      >
        <div className="absolute left-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full py-2 pl-10 pr-10 text-gray-700 bg-white rounded-full focus:outline-none"
        />
        
        {searchValue && (
          <motion.button
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default ProductSearch;