/**
 * 寄养服务卡片组件
 * 用于展示寄养服务的基本信息，包括图片、标题、价格、评分、提供者信息等
 */
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {FosterService} from '@/types';
import type {FosterServiceItem} from '@/features/foster/types/dto';
import {cn} from '@/lib/utils';
import { useFosterFavorites } from './favorites/FosterFavoritesContext';

interface FosterCardProps {
    service: FosterService | FosterServiceItem;
}

export function FosterCard({service}: FosterCardProps) {
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

    // 使用收藏hook
    const { isFavorited, addItem, removeItem } = useFosterFavorites();
    const isServiceFavorite = isFavorited(service.id);

    // 切换收藏状态
    const handleToggleFavorite = () => {
      if (isServiceFavorite) {
        removeItem(service.id);
      } else {
        // 确保service类型兼容
        addItem(service as FosterService);
      }
    };

    return (
        <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            whileHover={{y: -5}}
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
                <div
                    className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-sm font-medium text-gray-800 flex items-center">
                    <i className="fa-solid fa-star text-yellow-400 mr-1"></i>
                    {service.rating} ({service.reviewsCount})
                </div>
                {/* 收藏按钮 */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2 left-2 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200"
                    aria-label={isServiceFavorite ? "取消收藏" : "添加收藏"}
                >
                    <i 
                        className={`fa-solid ${isServiceFavorite ? 'fa-heart text-red-500' : 'fa-heart text-gray-400'}`}
                    ></i>
                </button>
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
                    {(service as FosterService).petTypes?.map((type) => (
                        <span
                            key={type}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
              {type === 'dog' && <i className="fa-solid fa-dog mr-1"></i>}
                            {type === 'cat' && <i className="fa-solid fa-cat mr-1"></i>}
                            {type === 'other' && <i className="fa-solid fa-paw mr-1"></i>}
                            {type === 'dog' ? '狗狗' : type === 'cat' ? '猫咪' : '其他宠物'}
            </span>
                    )) || (service as FosterServiceItem).tags?.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
              {tag}
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