/**
 * 寄养服务列表页面
 * 展示所有可提供的寄养服务，并提供搜索和筛选功能
 */
import { useFosterListData } from '../hooks/useFosterListData';
import FosterListHeader from '../components/fosters-list/FosterListHeader';
import FosterSearchFilter from '../components/fosters-list/FosterSearchFilter';
import FosterListContent from '../components/fosters-list/FosterListContent';

export function FosterList() {
    // 使用自定义hook处理所有数据逻辑
    const {
        fosters,
        loading,
        error,
        refreshFosters,
        updateParams,
        search,
        handleFiltersChange,
        clearAllFilters
    } = useFosterListData({ pageNum: 1, pageSize: 12 });

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* 页面标题区域 */}
                <FosterListHeader />
                
                {/* 搜索和筛选区域 */}
                <FosterSearchFilter 
                    onSearch={search} 
                    onFiltersChange={handleFiltersChange}
                />
                
                {/* 寄养服务列表 */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <FosterListContent 
                            fosters={fosters} 
                            loading={loading} 
                            error={error}
                            refreshFosters={refreshFosters}
                            updateParams={updateParams}
                            onClearAllFilters={clearAllFilters}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

export default FosterList;