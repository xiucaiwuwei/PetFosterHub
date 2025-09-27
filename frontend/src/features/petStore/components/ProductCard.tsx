import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PetProduct } from '@/features/petStore/types';

interface ProductCardProps {
  product: PetProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  return (
    <motion.div 
      className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="product-image-container relative overflow-hidden">
        <motion.img 
          alt={product.name} 
          src={product.mainImage} 
          fallback="https://via.placeholder.com/300x300?text=No+Image" 
          className="product-image w-full h-48 object-cover transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
        />
        {product.discount > 0 && (
          <div className="discount-badge absolute top-2 left-2 bg-orange-500 text-white text-sm px-2 py-1 rounded font-medium">
            {product.discount}折
          </div>
        )}
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${getStatusStyle()}`}>
          {statusText()}
        </div>
      </div>
      
      <div className="p-5">
        <Link to={`/pet-store/${product.id}`} className="product-link block group">
          <h3 className="product-name text-lg font-semibold text-gray-800 mb-2 truncate group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          
          <div className="product-price mb-3">
            <span className="current-price text-orange-500 font-bold text-xl">
              ¥{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price text-gray-400 line-through ml-2">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="border-t border-gray-100 my-3 pt-3">
            <div className="product-info text-sm">
              <div className="product-category text-gray-500 mb-1">
                {product.category}
              </div>
              {product.rating && (
                <div className="product-rating flex items-center">
                  <span className="rating-stars text-orange-400 mr-1">{'★'.repeat(Math.floor(product.rating))}</span>
                  <span className="text-gray-500">({product.rating.toFixed(1)})</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;