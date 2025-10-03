/**
 * 服务详情组件集合
 * 包含服务描述、提供者信息、设施列表和可用日期等组件
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FosterService } from '@/types';
import { formatDate } from '@/features/foster/utils/formatUtils';

/**
 * 服务提供者信息展示组件
 * 显示寄养服务提供者的相关信息
 */
export const ProviderInfo = ({ service }: { service: FosterService }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center">
        <img
          src={service.providerAvatar}
          alt={service.providerName}
          className="w-14 h-14 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{service.providerName}</h3>
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa-solid fa-star ${i < Math.floor(service.rating) ? 'text-yellow-400' : i < service.rating ? 'text-yellow-400 opacity-50' : 'text-gray-300'}`}
                ></i>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {service.rating.toFixed(1)} ({service.reviewsCount}条评价)
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/messages')}
          className="ml-auto px-4 py-2 border border-orange-500 text-orange-500 bg-white rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
        >
          <i className="fa-solid fa-comment mr-1"></i> 联系提供者
        </button>
      </div>
    </div>
  );
};

/**
 * 设施与服务列表组件
 * 用于展示寄养服务提供的各种设施和服务
 */
export const AmenitiesList = ({ service }: { service: FosterService }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">提供的设施与服务</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {service.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center text-gray-700">
            <i className="fa-solid fa-check text-green-500 mr-2"></i>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 可用日期展示组件
 * 用于显示寄养服务的可预订日期范围
 */
export const AvailableDates = ({ service }: { service: FosterService }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">可用日期</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">可预订从</p>
            <p className="text-gray-900 font-medium">{formatDate(service.availableFrom)}</p>
          </div>
          <div className="hidden md:block text-gray-400">
            <i className="fa-solid fa-arrow-right"></i>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-gray-500 mb-1">至</p>
            <p className="text-gray-900 font-medium">{formatDate(service.availableTo)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 服务描述展示组件
 * 显示寄养服务的标题和详细描述信息
 */
export const ServiceDescription = ({ service }: { service: FosterService }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
      <p className="text-gray-500 mb-4">{service.location}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {service.petTypes.map((type) => (
          <span
            key={type}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
          >
            {type === 'dog' && <i className="fa-solid fa-dog mr-1.5"></i>}
            {type === 'cat' && <i className="fa-solid fa-cat mr-1.5"></i>}
            {type === 'other' && <i className="fa-solid fa-paw mr-1.5"></i>}
            {type === 'dog' ? '狗狗' : type === 'cat' ? '猫咪' : '其他宠物'}
          </span>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">服务介绍</h2>
        <div className="prose prose-sm text-gray-600 max-w-none">
          {service.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};