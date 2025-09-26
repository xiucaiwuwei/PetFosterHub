import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { ProductCard, ProductSearch, ProductCategory } from '../components';
import { useProductList, useShoppingCart } from '../hooks';
import { ProductSortOption } from '../types/enums';

const FoodStore: React.FC = () => {
  // 使用自定义Hook获取商品列表数据和操作函数
  const {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    searchTerm,
    sortOption,
    currentPage,
    totalPages,
    onCategoryChange,
    onSearch,
    onSortChange,
    onPageChange,
    refreshProducts
  } = useProductList();

  // 使用购物车Hook
  const { addToCart: addToCartHandler } = useShoppingCart();

  // 使用从API获取的数据
  const displayProducts = products?.items || [];

  // 处理加入购物车
  const handleAddToCart = (productId: string) => {
    try {
      addToCartHandler(productId);
      toast.success('商品已加入购物车！');
    } catch (error) {
      toast.error('加入购物车失败，请稍后重试。');
    }
  };

  // 渲染骨架屏加载状态
  const renderSkeletonCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
        </div>
      </motion.div>
    ));
  };

  // 处理错误
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">发生错误</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={refreshProducts} 
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
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
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">宠物食品商店</h1>
          <p className="text-gray-600">为您的宠物提供健康、美味的食品和零食</p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8 max-w-2xl mx-auto">
          <ProductSearch 
            initialValue={searchTerm}
            onSearch={onSearch}
            placeholder="搜索宠物食品、零食、保健品..."
            autoFocus={false}
          />
        </div>

        {/* 分类导航和排序 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">商品分类</h2>
            {/* 排序选择器 */}
            {!loading && displayProducts.length > 0 && (
              <div className="mt-2 md:mt-0">
                <label htmlFor="sort-select" className="text-gray-600 mr-2">排序方式：</label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
                  className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProductSortOption.DEFAULT}>默认排序</option>
                  <option value={ProductSortOption.PRICE_ASC}>价格从低到高</option>
                  <option value={ProductSortOption.PRICE_DESC}>价格从高到低</option>
                  <option value={ProductSortOption.RATING_DESC}>评分从高到低</option>
                  <option value={ProductSortOption.NEWEST}>最新上架</option>
                </select>
              </div>
            )}
          </div>
          {categories ? (
            <ProductCategory 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              horizontal={true}
              showIcons={false}
            />
          ) : (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {Array(6).fill(0).map((_, index) => (
                <div key={`category-skeleton-${index}`} className="bg-white px-4 py-2 rounded-full bg-gray-200 animate-pulse h-10 min-w-24"></div>
              ))}
            </div>
          )}
        </div>

        {/* 商品列表 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">商品列表</h2>
            {!loading && displayProducts.length > 0 && (
              <p className="text-gray-600 text-sm">找到 {products?.totalItems} 件商品</p>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {renderSkeletonCards()}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {displayProducts.length > 0 ? (
                displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    price={product.price}
                    discount={product.discount}
                    rating={product.rating}
                    isNew={product.isNew}
                    isPopular={product.isPopular}
                    onClick={handleAddToCart}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">未找到商品</h3>
                  <p className="text-gray-500 mb-4">尝试使用不同的搜索关键词或浏览其他分类</p>
                  <button 
                    onClick={() => {
                      onSearch('');
                      onCategoryChange('all');
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    查看全部商品
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* 分页控件 */}
          {!loading && displayProducts.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">上一页</span>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // 简单的分页逻辑，显示当前页及其前后2页
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === pageNum ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">下一页</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FoodStore;