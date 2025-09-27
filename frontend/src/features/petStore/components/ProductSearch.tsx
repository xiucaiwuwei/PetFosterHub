import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductSearchProps {
  onSearch: (value: string) => void;
  variant?: 'default' | 'secondaryNav';
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch, variant = 'default' }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 根据不同的变体设置不同的样式
  const getInputClassName = () => {
    if (variant === 'secondaryNav') {
      return "pl-10 pr-12 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition-all duration-300 shadow-sm placeholder-gray-400 bg-white w-full";
    }
    return "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all duration-300";
  };

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

  const searchVariants = {
    focus: {
      width: '240px',
      transition: { duration: 0.3 }
    },
    blur: {
      width: '192px',
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`product-search ${variant === 'secondaryNav' ? 'flex items-center w-full' : 'transform transition-all duration-500 hover:-translate-y-1'}`}>
      {variant === 'secondaryNav' ? (
        <>
          <div className="relative flex-grow max-w-md">
            <motion.input
              type="text"
              placeholder="搜索商品..."
              value={searchValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => {}}
              onBlur={() => {}}
              className={getInputClassName()}
              initial="blur"
              whileFocus="focus"
              animate="blur"
              variants={searchVariants}
            />
            <i className="fa-solid fa-search absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <motion.button
            whileHover={buttonVariants.hover}
            whileTap={buttonVariants.tap}
            onClick={handleSearch}
            className="ml-2 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow whitespace-nowrap"
          >
            <i className="fa-solid fa-magnifying-glass mr-1.5"></i>搜索
          </motion.button>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300"></i>
            </div>
            <input
              type="text"
              placeholder="搜索宠物商品..."
              value={searchValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={getInputClassName()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;