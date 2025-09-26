import React from 'react';
import { Link } from 'react-router-dom';
import { FosterCard } from '@/components/FosterCard.tsx';
import { useTopRatedFosters, useHomeLoading } from '../hooks';

interface FeaturedFostersProps {
  // 如果需要任何props，可以在这里添加
}

export const FeaturedFosters = ({}: FeaturedFostersProps) => {
  const featuredFosters = useTopRatedFosters();
  const loading = useHomeLoading();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -mr-32 -mb-32"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="inline-block">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">推荐寄养服务</h2>
            <p className="text-gray-500 max-w-xl">
              发现我们精心挑选的优质寄养服务，为您的爱宠提供温馨舒适的临时家园
            </p>
          </div>
          <Link
            to="/fosters"
            className="px-5 py-2.5 bg-orange-500 text-white rounded-full font-medium flex items-center hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 group"
          >
            查看全部
            <i className="fa-solid fa-chevron-right ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300"></i>
          </Link>
        </div>

        {loading ? (
          // 加载状态 - 骨架屏
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
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
            {featuredFosters.map((service, index) => (
              <div key={service.id} className="transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]
                style={{ animationDelay: `${index * 0.15}s` }}">
                <FosterCard service={service} />
              </div>
            ))}
          </div>
        )}

        {/* 底部装饰线 */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};