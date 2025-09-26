import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice, calculateDiscountedPrice } from '../utils/validationUtils';

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  discount?: number;
  rating?: number;
  isNew?: boolean;
  isPopular?: boolean;
  onClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  price,
  discount,
  rating,
  isNew,
  isPopular,
  onClick
}) => {
  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount ? calculateDiscountedPrice(price, discount) : price;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="relative">
        {/* 商品图片 */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        
        {/* 标签 */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">新品</span>
          )}
          {isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">热销</span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
        
        {/* 快速操作按钮 */}
        <div className="absolute right-2 bottom-2">
          <motion.button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      <div className="p-4">
        {/* 商品名称 */}
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
          <Link to={`/food/detail/${id}`} className="hover:text-blue-600 transition-colors">
            {name}
          </Link>
        </h3>
        
        {/* 评分 */}
        {rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-gray-500 text-sm ml-1">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* 价格 */}
        <div className="flex items-center">
          <span className="text-lg font-bold text-red-600">{formatPrice(discountedPrice)}</span>
          {hasDiscount && (
            <span className="text-gray-400 text-sm line-through ml-2">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;