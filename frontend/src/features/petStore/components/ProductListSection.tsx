import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '@/features/petStore/types';

interface ProductListSectionProps {
  products: Product[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
  onClearFilters: () => void;
}

const ProductListSection: React.FC<ProductListSectionProps> = ({
  products,
  total,
  page,
  loading,
  error,
  onPageChange,
  onClearFilters
}) => {
  // 每页显示12个商品
  const pageSize = 12;

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="loading-container flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-500">加载中...</span>
          </div>
        ) : error ? (
          <div 
            className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 animate-shake"
            role="alert"
          >
            <strong className="font-bold">错误：</strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => onPageChange(1)}
              className="ml-4 text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              重试
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-container flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">🔍</div>
            <p className="text-gray-500">没有找到相关商品</p>
            <button
              onClick={onClearFilters}
              className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
            >
              清除所有筛选条件
            </button>
          </div>
        ) : (
          <>
            {/* 结果统计 */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                找到 <span className="text-orange-500 font-bold">{total}</span> 个商品
              </h2>
              <div className="text-sm text-gray-500">
                显示第 {page * pageSize - pageSize + 1} - {Math.min(page * pageSize, total)} 个
              </div>
            </div>

            {/* 商品卡片网格 */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group animate-fadeInUp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {!loading && products.length > 0 && (
          <motion.div 
            className="pet-store-pagination mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-center">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className={`px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${page === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
              >
                <i className="fa-solid fa-chevron-left mr-1"></i> 上一页
              </button>
              <button
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => onPageChange(page + 1)}
                className={`px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${page >= Math.ceil(total / pageSize) ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
              >
                下一页 <i className="fa-solid fa-chevron-right ml-1"></i>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductListSection;