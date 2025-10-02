import {useFosters} from '@/features/foster';
import FosterListHeader from '../components/fosters-list/FosterListHeader';
import FosterSearchFilter from '../components/fosters-list/FosterSearchFilter';
import FosterListContent from '../components/fosters-list/FosterListContent';

// 定义搜索和筛选函数接口
type SearchFunction = (keyword: string) => void;
type FiltersChangeFunction = (filters: { petType: string; serviceType: string }) => void;

export function FosterList() {
    const {fosters, loading, error, updateParams, refreshFosters} = useFosters({pageNum: 1, pageSize: 12});

    // 搜索函数
    const search: SearchFunction = (keyword: string) => {
        updateParams({keyword, pageNum: 1});
    };

    // 处理筛选条件变化的函数
    const handleFiltersChange: FiltersChangeFunction = (filters) => {
        // 合并筛选条件为一个关键字字符串
        const filterKeywords = [];
        if (filters.petType) filterKeywords.push(filters.petType);
        if (filters.serviceType) filterKeywords.push(filters.serviceType);
        
        const combinedKeyword = filterKeywords.join(' ');
        updateParams({keyword: combinedKeyword, pageNum: 1});
    };

    // 清除所有筛选条件的函数
    const clearAllFilters = () => {
        search('');
        // 触发一次空筛选，确保所有筛选条件都被清除
        handleFiltersChange({petType: '', serviceType: ''});
    };

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