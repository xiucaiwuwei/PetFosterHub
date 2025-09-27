import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import { useShoppingCart } from '../hooks/useShoppingCart';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const PetStoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetail(id);
  const { addToCart } = useShoppingCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= 100) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} 已成功加入购物车`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      // 这里可以跳转到购物车页面或者结算页面
      toast.info('已添加到购物车，请前往购物车结算');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-500">加载商品信息中...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div 
        className="flex flex-col justify-center items-center py-24 text-center bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 animate-shake max-w-3xl mx-auto"
        role="alert"
      >
        <strong className="font-bold">错误：</strong>
        <span className="block sm:inline">商品信息加载失败</span>
        <button
          onClick={() => window.location.reload()}
          className="ml-4 mt-4 text-sm font-medium text-orange-600 hover:text-orange-800 underline"
        >
          重试
        </button>
      </div>
    );
  }

  const images = [
    product.mainImage,
    ...(product.secondaryImages || [])
  ].filter(Boolean);

  return (
    <div className="pet-store-detail-container">
      {/* 顶部导航面包屑 */}
      <div className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-gray-500">
            <a href="/pet-store" className="hover:text-orange-500 transition-colors">宠物商店</a> &gt; {product.name}
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="product-images">
              {images.length > 0 ? (
                <motion.div 
                  className="product-image-carousel bg-white rounded-xl overflow-hidden shadow-md mb-4 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {images.map((image, index) => (
                    <motion.div 
                      key={index} 
                      className={`image-slide ${currentImageIndex === index ? 'block' : 'hidden'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - 图片 ${index + 1}`} 
                        className="product-image w-full h-[400px] object-contain p-4"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="no-image flex items-center justify-center h-[400px] bg-white rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-400">暂无图片</p>
                </div>
              )}
              {images.length > 1 && (
                <div className="thumbnails flex space-x-3">
                  {images.map((image, index) => (
                    <motion.div 
                      key={index} 
                      className={`thumbnail cursor-pointer transition-all border-2 rounded-md overflow-hidden ${currentImageIndex === index ? 'border-orange-500' : 'border-gray-200'}`}
                      onClick={() => setCurrentImageIndex(index)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={image} alt={`缩略图 ${index + 1}`} className="thumbnail-image w-20 h-20 object-cover" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
        
        <motion.div 
          className="product-details"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="product-header mb-6">
            <h1 className="product-name text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <div className="product-tags flex flex-wrap gap-2">
              <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-0.5 rounded-full">{product.category}</span>
              {product.isNew && <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">新品</span>}
              {product.isBestseller && <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-0.5 rounded-full">热销</span>}
            </div>
          </div>
          
          <div className="product-price mb-4">
            <span className="current-price text-orange-500 text-2xl font-bold">¥{product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price text-gray-400 line-through ml-2">¥{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          <div className="product-stock mb-6">
            <span className="text-gray-600">库存: </span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `有货(${product.stock})` : '缺货'}
            </span>
          </div>
          
          <div className="product-description mb-6">
            <h3 className="text-lg font-semibold mb-2">商品描述</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
          
          {product.specifications && (
            <div className="product-specifications mb-8">
              <h3 className="text-lg font-semibold mb-2">规格参数</h3>
              <ul className="space-y-1">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex">
                    <span className="spec-name text-gray-600 w-24">{spec.name}: </span>
                    <span className="spec-value text-gray-800">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="product-actions">
            <div className="quantity-selector flex items-center mb-4">
            <button
              className={`w-10 h-10 flex items-center justify-center rounded border ${quantity <= 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-value w-12 text-center text-lg font-medium">{quantity}</span>
            <button
              className={`w-10 h-10 flex items-center justify-center rounded border ${(quantity >= 100 || quantity >= product.stock) ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 100 || quantity >= product.stock}
            >
              +
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button
              className={`flex-1 py-3 px-4 rounded-md border transition-all ${product.stock <= 0 ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-orange-600 border-orange-600 hover:bg-orange-50'}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
              whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
            >
              加入购物车
            </motion.button>
            <motion.button
              className={`flex-1 py-3 px-4 rounded-md transition-all ${product.stock <= 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
              whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
            >
              立即购买
            </motion.button>
          </div>
          </div>
        </motion.div>
      </div>
      </div>
    </section>
    
    {/* 详细介绍区域 */}
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="product-details-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-6 text-gray-800">详细介绍</h2>
          <div className="detail-content bg-white p-8 rounded-xl shadow-md">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.detailDescription}</p>
            {/* 这里可以添加更多详细内容，如图文详情等 */}
          </div>
        </motion.div>
      </div>
    </section>
  </div>
  );
};

export default PetStoreDetail;