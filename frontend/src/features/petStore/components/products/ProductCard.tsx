import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PetProduct } from '@/features/petStore/types/entity/PetProduct';
import { useFavorites } from '@/lib/contexts/favoritesContext';

interface ProductCardProps {
  product: PetProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorited, addItem, removeItem } = useFavorites();
  const isFavorite = isFavorited(product.id);
  const getStatusStyle = () => {
    if (product.stock === 0) return 'bg-red-100 text-red-800';
    if (product.isNew) return 'bg-green-100 text-green-800';
    if (product.isBestseller) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const statusText = (): string => {
    if (product.stock === 0) return '缺货';
    if (product.isNew) return '新品';
    if (product.isBestseller) return '热销';
    return '有货';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 实际项目中这里会调用添加购物车的API
    console.log('添加商品到购物车:', product.name);
    alert(`已将"${product.name}"添加到购物车！`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeItem(product.id);
      console.log('取消收藏商品:', product.name);
      alert(`已取消收藏"${product.name}"`);
    } else {
      addItem(product);
      console.log('收藏商品:', product.name);
      alert(`已收藏"${product.name}"`);
    }
  };

  const handleGoToStore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 实际项目中这里会根据店铺ID跳转到店铺页面
    console.log('进入店铺:', product.storeName || '店铺');
    alert(`即将进入${product.storeName || '店铺'}页面！`);
    // 在实际项目中，这里会使用下面的代码进行跳转
    // window.location.href = `/store/${product.storeId}`;
  };

  return (
    <motion.div 
      className="product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="product-image-container relative overflow-hidden">
        <motion.img 
          alt={product.name} 
          src={product.mainImage || "https://via.placeholder.com/300x300?text=No+Image"} 
          className="product-image w-full h-36 object-cover transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
        />
        {product.discount && product.discount > 0 && (
          <div className="discount-badge absolute top-2 left-2 bg-orange-500 text-white text-sm px-2 py-1 rounded font-medium">
            {product.discount}折
          </div>
        )}
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${getStatusStyle()}`}>
          {statusText()}
        </div>
      </div>
      
      <div className="p-3 relative">
          <h3 className="product-name text-base font-semibold text-gray-800 mb-2 truncate group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          
          <div className="product-price mb-3">
            <span className="current-price text-orange-500 font-bold text-lg">
              ¥{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price text-gray-400 line-through ml-2">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="border-t border-gray-100 my-3 pt-3 pb-1">
            <div className="product-info text-sm">
              <div className="product-category text-gray-500 mb-1">
                {product.category}
              </div>
              {product.rating && (
                <div className="product-rating flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="rating-stars text-orange-400 mr-1">{'★'.repeat(Math.floor(product.rating))}</span>
                    <span className="text-gray-500">({product.rating.toFixed(1)})</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={handleGoToStore}
                      title="进入店铺"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </button>
                    <button 
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={handleAddToCart}
                      title="添加到购物车"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                    <button 
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-100' : 'bg-gray-100'} ${isFavorite ? 'hover:bg-red-200' : 'hover:bg-gray-200'}`}
                      onClick={handleToggleFavorite}
                      title={isFavorite ? "取消收藏" : "收藏"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;