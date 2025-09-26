import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useProductDetail, useShoppingCart } from '../hooks';
import { formatPrice, calculateDiscountedPrice } from '../utils/validationUtils';

const FoodDetail: React.FC = () => {
  // 使用自定义Hook获取商品详情数据和操作函数
  const {
    productDetail,
    loading,
    error,
    quantity,
    setQuantity,
    addToCart,
    isInStock,
    formattedPrice,
    isLoadingAddToCart
  } = useProductDetail();

  // 使用购物车Hook
  const { getCartItemCount } = useShoppingCart();

  // 使用从API获取的数据
  const currentProduct = productDetail;
  const hasDiscount = currentProduct?.discount && currentProduct.discount > 0;
  const discountedPrice = hasDiscount ? calculateDiscountedPrice(currentProduct.price, currentProduct.discount) : currentProduct?.price;

  // 处理数量增减
  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 处理加入购物车
  const handleAddToCart = async () => {
    try {
      await addToCart();
      toast.success('商品已成功加入购物车！');
    } catch (error) {
      toast.error('加入购物车失败，请稍后重试。');
    }
  };

  // 处理收藏商品
  const handleToggleFavorite = () => {
    toast.info('收藏功能开发中...');
  };

  // 处理错误
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">获取商品详情失败</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/food" 
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors inline-block"
            >
              返回商店
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 处理加载状态
  if (loading || !currentProduct) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Link to="/food" className="inline-flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回商品列表
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="pt-8 space-y-4">
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <Link to="/food" className="inline-flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回商品列表
          </Link>
          
          {/* 商品详情主要内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 商品图片区域 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              
              {/* 缩略图导航（如果有多张图片） */}
              {currentProduct.images && currentProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {currentProduct.images.map((img, index) => (
                    <motion.div
                      key={index}
                      className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img
                        src={img}
                        alt={`${currentProduct.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 商品信息区域 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* 商品标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProduct.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">新品</span>
                )}
                {currentProduct.isPopular && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">热销</span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {currentProduct.discount}% OFF
                  </span>
                )}
              </div>
              
              {/* 商品名称 */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {currentProduct.name}
              </h1>
              
              {/* 评分 */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.floor(currentProduct.rating))}{'☆'.repeat(5 - Math.floor(currentProduct.rating))}
                </div>
                <span className="text-gray-600 ml-2">{currentProduct.rating.toFixed(1)} ({currentProduct.reviewsCount} 评价)</span>
              </div>
              
              {/* 价格 */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(discountedPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-400 text-lg line-through ml-3">
                      {formatPrice(currentProduct.price)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* 规格信息 */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">品牌：</span>
                  <span className="font-medium">{currentProduct.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">重量：</span>
                  <span className="font-medium">{currentProduct.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">库存：</span>
                  <span className="font-medium text-green-600">有货 ({currentProduct.stock} 件)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">分类：</span>
                  <span className="font-medium">{currentProduct.category}</span>
                </div>
              </div>
              
              {/* 主要成分 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">主要成分</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.ingredients.map((ingredient, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 数量选择器和操作按钮 */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={handleQuantityDecrease}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-12 text-center border-x border-gray-300"
                      min="1"
                      max={currentProduct.stock}
                    />
                    <button
                      onClick={handleQuantityIncrease}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= currentProduct.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="text-gray-600">
                    库存: {currentProduct.stock} 件
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <motion.button
                    className={`flex-grow py-3 rounded-md font-medium text-white transition-colors ${isInStock ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    whileHover={isInStock ? { scale: 1.02 } : {}}
                    whileTap={isInStock ? { scale: 0.98 } : {}}
                    onClick={handleAddToCart}
                    disabled={!isInStock || isLoadingAddToCart}
                  >
                    {isLoadingAddToCart ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        添加中...
                      </span>
                    ) : '加入购物车'}
                  </motion.button>
                  
                  <motion.button
                    className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleFavorite}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 详细介绍区域 */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">产品详情</h2>
            
            <div className="space-y-8">
              {/* 描述 */}
              <div>
                <h3 className="text-xl font-semibold mb-4">产品描述</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentProduct.description}
                </p>
              </div>
              
              {/* 营养成分 */}
              <div>
                <h3 className="text-xl font-semibold mb-4">营养成分分析</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(currentProduct.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-gray-500 text-sm capitalize mb-1">{key}</div>
                      <div className="text-2xl font-bold text-blue-600">{value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FoodDetail;