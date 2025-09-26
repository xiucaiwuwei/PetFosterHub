import React from 'react';
import { Link } from 'react-router-dom';
import type { FosterServiceItem } from '../types/dto';

interface FosterCardProps {
  foster: FosterServiceItem;
}

const FosterCard: React.FC<FosterCardProps> = ({ foster }) => {
  const { id, title, description, price, discountPrice, images, location, rating, reviewCount, tags } = foster;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 bg-gray-100">
        {images && images.length > 0 ? (
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">无图片</span>
          </div>
        )}
        {discountPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            优惠
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex items-center text-amber-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-500' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{reviewCount} 评价</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {discountPrice ? (
              <>
                <span className="text-red-500 font-bold text-lg">¥{discountPrice}</span>
                <span className="text-gray-400 text-sm line-through ml-1">¥{price}</span>
              </>
            ) : (
              <span className="text-gray-800 font-bold text-lg">¥{price}</span>
            )}
            <span className="text-gray-500 text-xs ml-1">/天</span>
          </div>
          
          <Link 
            to={`/foster/detail/${id}`} 
            className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FosterCard;