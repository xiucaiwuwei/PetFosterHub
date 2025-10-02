/**
 * 推荐寄养服务组件
 * 展示平台上评分最高的寄养服务提供商
 */
import FosterCard from '@/features/foster/components/fosters-list/FosterCard';
import { useTopRatedFosterItems, useHomeLoading } from '../hooks';

interface FeaturedFostersProps {
  // 如果需要任何props，可以在这里添加
}

export const FeaturedFosters = ({ }: FeaturedFostersProps) => {
  const featuredFosterItems = useTopRatedFosterItems();
  const loading = useHomeLoading();

  return (
    <section className="py-20 overflow-hidden relative bg-gradient-to-b from-orange-50 to-orange-50/90">
      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -mr-32 -mb-32"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-50 rounded-full filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up text-shadow">
            <span className="relative inline-block">
              优质寄养服务
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-orange-400 rounded-full shadow-glow"></span>
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            我们严格筛选评分最高的寄养家庭，为您的爱宠提供如家般的关爱与呵护
          </p>
        </div>

        {/* 卡片网格 */}
        {loading ? (
          // 加载状态 - 骨架屏
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse border border-orange-100">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFosterItems.map((serviceItem, index) => (
              <div
                key={serviceItem.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 transform transition-all duration-500 hover:-translate-y-3 hover:shadow-xl hover:border-orange-200 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <FosterCard foster={serviceItem} />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(255, 165, 0, 0.3);
        }
      `}</style>
    </section>
  );
};