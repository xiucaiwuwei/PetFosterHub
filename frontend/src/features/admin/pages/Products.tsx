import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getPetProducts, PetProduct } from '@/mocks/petProducts.ts';
import { cn } from '@/lib/utils/utils';

// 格式化价格显示
const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

export default function Products() {
  // 状态管理
  const [products, setProducts] = useState<PetProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PetProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<PetProduct | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<PetProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取商品分类
  const categories = [
    { id: 'all', name: '所有分类' },
    { id: 'food', name: '宠物食品' },
    { id: 'toys', name: '宠物玩具' },
    { id: 'clothing', name: '宠物服饰' },
    { id: 'supplies', name: '宠物用品' },
    { id: 'health', name: '健康护理' },
  ];

  // 获取商品数据
  useEffect(() => {
    // 模拟API加载延迟
    const timer = setTimeout(() => {
      const allProducts = getPetProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // 搜索和筛选商品
  useEffect(() => {
    let result = [...products];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.brand.toLowerCase().includes(term) ||
        product.shortDescription.toLowerCase().includes(term)
      );
    }
    
    // 分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, selectedCategory, products]);

  // 分页逻辑
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 处理商品详情查看
  const handleViewProduct = (product: PetProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // 处理商品编辑
  const handleEditProduct = (product: PetProduct) => {
    setSelectedProduct(product);
    setEditedProduct({...product});
    setIsEditModalOpen(true);
  };

  // 处理商品删除
  const handleDeleteProduct = (product: PetProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // 确认删除商品
  const confirmDeleteProduct = () => {
    if (!selectedProduct) return;
    
    // 模拟删除API调用
    setIsLoading(true);
    setTimeout(() => {
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      toast.success(`商品 ${selectedProduct.name} 已删除`);
    }, 600);
  };

  // 保存商品编辑
  const saveProductEdit = () => {
    if (!editedProduct) return;
    
    // 模拟保存API调用
    setIsLoading(true);
    setTimeout(() => {
      setProducts(prev => 
        prev.map(product => product.id === editedProduct.id ? editedProduct : product)
      );
      setIsEditModalOpen(false);
      setIsLoading(false);
      toast.success(`商品 ${editedProduct.name} 已更新`);
    }, 600);
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedProduct) return;
    
    const { name, value } = e.target;
    setEditedProduct(prev => prev ? {...prev, [name]: value} : null);
  };

  // 渲染分页控件
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            // 只显示当前页附近的页码
            if (
              i === 0 || 
              i === totalPages - 1 || 
              Math.abs(i + 1 - currentPage) <= 1
            ) {
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === i + 1
                      ? 'z-10 bg-orange-500 border-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              );
            } else if (
              (i === 1 && currentPage > 3) || 
              (i === totalPages - 2 && currentPage < totalPages - 2)
            ) {
              return (
                <span key={i} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              );
            }
            return null;
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    );
  };

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载商品数据中...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有商品信息</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 商品列表卡片 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品信息
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  价格
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  库存
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded object-cover" 
                            src={product.imageUrl} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(product.price * (1 - product.discount / 100))}
                          </span>
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="ml-2 text-xs font-semibold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                            {product.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.inventory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inventory > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inventory > 0 ? '有货' : '缺货'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-500 hover:text-blue-600 mr-3"
                      >
                        查看
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-orange-500 hover:text-orange-600 mr-3"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-500 hover:text-red-600"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="fa-solid fa-search text-3xl mb-2 text-gray-300"></i>
                      <p>未找到匹配的商品</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="mt-2 text-orange-500 hover:text-orange-600 text-sm"
                      >
                        清除筛选条件
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {renderPagination()}
      </div>
    </div>
  );
}
