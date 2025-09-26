import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/SearchBar';
import { FosterCard } from '../components/FosterCard';
import { useFosters } from '../hooks/useFosters';

export default function FosterList() {
  const { fosters, loading, error, updateParams } = useFosters({ pageNum: 1, pageSize: 12 });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
         {/* 页面标题 */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">宠物寄养服务</h1>
            <p className="text-lg text-orange-100 max-w-2xl">
              为您的爱宠找到合适的临时家园
            </p>
          </div>
        </section>
        
        {/* 搜索和筛选 */}
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar 
              onSearch={(keyword) => updateParams({ keyword, pageNum: 1 })} 
              onPetTypeFilter={(petType) => updateParams({ petType, pageNum: 1 })} 
            />
          </div>
        </section>
        
        {/* 分类筛选 */}
        <section className="py-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParams({ providerType: '', pageNum: 1 })}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-orange-500 text-white"
              >
                全部
              </button>
              <button
                onClick={() => updateParams({ providerType: 'individual', pageNum: 1 })}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                个体
              </button>
              <button
                onClick={() => updateParams({ providerType: 'store', pageNum: 1 })}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                店铺
              </button>
            </div>
          </div>
        </section>
        
        {/* 寄养服务列表 */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">错误：</strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {loading ? (
              // 加载状态 - 骨架屏
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : fosters?.list && fosters.list.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fosters.list.map((service) => (<FosterCard key={service.id} foster={service} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-search text-2xl text-orange-500"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的寄养服务</h3>
                <p className="text-gray-500 mb-6">请尝试调整搜索条件或宠物类型</p>
                <button
                  onClick={() => {
                    search('');
                    filterByPetType('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  清除筛选条件
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}