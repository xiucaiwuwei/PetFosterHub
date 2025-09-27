import React from 'react';

/**
 * 支持页面的标题和介绍部分组件，与FosterListHeader保持一致的风格
 */
const SupportPageHeader: React.FC = () => {
  return (
    <section
      className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgNjBhMzAgMzAgMCAxIDEgMCA2MEgzMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] bg-repeat opacity-30"
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight animate-fadeIn">
          成为 <span className="relative inline-block">
                <span className="relative z-10">宠物供养服务提供者</span>
                <span
                  className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 opacity-30 rounded-lg -rotate-1"
                ></span>
              </span>
        </h1>
        <p className="text-base md:text-lg text-orange-100 max-w-2xl leading-relaxed mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          加入我们的平台，成为宠物服务商家，为宠物主人提供优质商品和服务，同时获得稳定收益
        </p>

        {/* 数据统计卡片 - 与FosterListHeader风格保持一致 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">商家数量</p>
            <p className="text-2xl font-bold">120+</p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">服务类型</p>
            <p className="text-2xl font-bold">30+</p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">月交易量</p>
            <p className="text-2xl font-bold">500+</p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">覆盖城市</p>
            <p className="text-2xl font-bold">15+</p>
          </div>
        </div>
      </div>

      {/* 动画样式定义 */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default SupportPageHeader;