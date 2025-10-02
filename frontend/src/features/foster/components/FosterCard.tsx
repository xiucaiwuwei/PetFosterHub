import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FosterService } from '@/types';
import { cn } from '@/lib/utils';

interface FosterCardProps {
  service: FosterService;
}

export function FosterCard({ service }: FosterCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  
  // 格式化价格显示
  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}/天`;
  };
  
  // 处理图片轮播
  const nextImage = () => {
    if (service.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % service.images.length);
    }
  };
  
  // 自动轮播图片
  useEffect(() => {
    if (service.images.length > 1) {
      const interval = setInterval(nextImage, 3000);
      return () => clearInterval(interval);
    }
    // 当图片数量不大于1时，返回undefined（或者不返回任何值）
    return undefined;
  }, [service.images.length]);
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 bg-gray-200">
        <img
          src={service.images[imageIndex]}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        {service.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {service.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-200",
                  idx === imageIndex ? "bg-white" : "bg-gray-400 bg-opacity-50"
                )}
                aria-label={`查看图片 ${idx + 1}`}
              />
            ))}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-sm font-medium text-gray-800 flex items-center">
          <i className="fa-solid fa-star text-yellow-400 mr-1"></i>
          {service.rating} ({service.reviewsCount})
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img
            src={service.providerAvatar}
            alt={service.providerName}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <span className="text-sm font-medium text-gray-700">{service.providerName}</span>
        </div>
        
        <Link to={`/fosters/${service.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-orange-500 transition-colors">
            {service.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {service.petTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              {type === 'dog' && <i className="fa-solid fa-dog mr-1"></i>}
              {type === 'cat' && <i className="fa-solid fa-cat mr-1"></i>}
              {type === 'other' && <i className="fa-solid fa-paw mr-1"></i>}
              {type === 'dog' ? '狗狗' : type === 'cat' ? '猫咪' : '其他宠物'}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(service.pricePerDay, service.currency)}
          </span>
          <Link
            to={`/fosters/${service.id}`}
            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            查看详情
          </Link>
        </div>
      </div>
    </motion.div>
  );
}