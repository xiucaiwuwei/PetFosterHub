import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface HeroSectionProps {
  // 如果需要任何props，可以在这里添加
}

export const HeroSection = ({}: HeroSectionProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-500/80"></div>
        <img
          src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%E5%BF%AB%E4%B9%90%E7%9A%84%E7%8B%97%E5%92%8C%E7%8C%AB%E5%9C%A8%E4%B8%80%E8%B5%B7%E7%8E%A9%E8%80%8D%EF%BC%8C%E5%8D%A1%E9%80%9A%E9%A3%8E%E6%A0%BC&sign=f44520432e0a584fc32e46e810f38d24"
          alt="快乐的宠物们"
          className="w-full h-full object-cover opacity-20 transform scale-105 animate-slow-zoom"
        />
        {/* 装饰元素 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-orange-300/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="relative max-w-3xl mx-auto md:mx-0 text-center md:text-left">
          {/* 装饰徽章 */}
          <div className="inline-block mb-6 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium tracking-wide animate-fade-in">
            宠物友好 · 专业寄养 · 爱心呵护
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight animate-slide-up">
            为您的爱宠找到<br className="md:hidden" />
            <span className="relative inline-block">
              温馨的临时家园
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-white/50 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-2xl animate-slide-up animation-delay-100">
            宠物寄养家连接宠物主人与爱心寄养人士，让您外出时无需担心爱宠无人照顾。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-up animation-delay-200">
            <Link
              to="/fosters"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent rounded-md shadow-lg text-base font-medium text-orange-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
            >
              寻找寄养服务
              <i className="fa-solid fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white border-opacity-30 rounded-md shadow-lg text-base font-medium text-white bg-orange-500 bg-opacity-30 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              aria-label={isAuthenticated ? "查看个人资料" : "注册成为供养者"}
            >
              {isAuthenticated ? "我的资料" : "成为供养者"}
              <i className={`fa-solid ${isAuthenticated ? 'fa-user' : 'fa-paw'} ml-2`}></i>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部波浪装饰 */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20 text-white fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,142.02,276.23,142.94,340.79,131.9,404.34,112.33Z"></path>
        </svg>
      </div>

      {/* 动画样式 */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slowZoom {
            0%, 100% { transform: scale(1.05); }
            50% { transform: scale(1); }
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
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animate-slow-zoom {
            animation: slowZoom 20s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};