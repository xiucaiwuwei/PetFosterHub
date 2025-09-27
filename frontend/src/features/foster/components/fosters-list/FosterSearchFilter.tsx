import React, { useState } from 'react';

interface FosterSearchFilterProps {
  onSearch: (keyword: string) => void;
  onFiltersChange: (filters: { petType: string; serviceType: string }) => void;
  initialSearchTerm?: string;
}

/**
 * 整合搜索和筛选功能的组件
 */
export function FosterSearchFilter({
  onSearch,
  onFiltersChange,
  initialSearchTerm = ''
}: FosterSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({ petType: '', serviceType: '' });
  const [selectedPetType, setSelectedPetType] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleApplyFilters = () => {
    const filters = { petType: selectedPetType, serviceType: selectedServiceType };
    setCurrentFilters(filters);
    onFiltersChange(filters);
    setIsFilterModalOpen(false);
  };
  
  const handleReset = () => {
    setSelectedPetType('');
    setSelectedServiceType('');
  };
  
  // 当模态框打开时，同步当前筛选条件
  React.useEffect(() => {
    if (isFilterModalOpen) {
      setSelectedPetType(currentFilters.petType);
      setSelectedServiceType(currentFilters.serviceType);
    }
  }, [isFilterModalOpen, currentFilters]);
  
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="transform transition-all duration-500 hover:-translate-y-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 p-5">
              <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-search text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300"></i>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索寄养服务、位置或关键词..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all duration-300"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(true)}
                  className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 whitespace-nowrap"
                >
                  <i className="fa-solid fa-filter mr-2"></i>筛选
                </button>
                
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 whitespace-nowrap transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fa-solid fa-search mr-2"></i>搜索
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* 筛选模态框 - 解决被遮挡问题：使用更高的z-index */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 animate-fadeIn">
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">筛选条件</h3>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <i className="fa-solid fa-times text-lg"></i>
                </button>
              </div>
              
              {/* 宠物类型筛选 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">宠物类型</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPetType('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${selectedPetType === ''
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    全部
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPetType('dog')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${selectedPetType === 'dog'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    <i className="fa-solid fa-dog mr-2"></i>狗狗
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPetType('cat')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${selectedPetType === 'cat'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    <i className="fa-solid fa-cat mr-2"></i>猫咪
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPetType('other')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${selectedPetType === 'other'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    <i className="fa-solid fa-paw mr-2"></i>其他
                  </button>
                </div>
              </div>

              {/* 服务类型筛选 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">服务类型</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedServiceType === ''
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    全部
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('individual')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedServiceType === 'individual'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    个体寄养
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedServiceType('store')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedServiceType === 'store'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    `}
                  >
                    专业店铺
                  </button>
                </div>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                重置
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                应用筛选
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FosterSearchFilter;