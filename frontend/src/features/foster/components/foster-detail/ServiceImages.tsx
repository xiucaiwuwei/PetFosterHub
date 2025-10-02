/**
 * 服务图片展示组件
 * 展示寄养服务的图片集，支持点击放大查看
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FosterService } from '../../types';
import { cn } from '@/lib/utils';

interface ServiceImagesProps {
  service: FosterService;
}

export const ServiceImages = ({ service }: ServiceImagesProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="relative bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={service.images[selectedImage]}
            alt={service.title}
            className="w-full h-[300px] md:h-[400px] object-cover opacity-90"
          />
        </div>
        
        {/* 图片缩略图导航 */}
        {service.images.length > 1 && (
          <div className="flex justify-center mt-4 pb-4 space-x-2">
            {service.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200",
                  selectedImage === index
                    ? "border-orange-500 ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
                aria-label={`查看图片 ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`服务图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/fosters')}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        aria-label="返回"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  );
};