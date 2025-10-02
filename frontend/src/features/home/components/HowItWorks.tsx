/**
 * 服务流程说明组件
 * 展示用户如何使用平台服务的三个简单步骤
 */
export const HowItWorks = () => {
  return (
    <>
      <section className="py-24 overflow-hidden relative bg-gradient-to-b from-orange-50 to-orange-100/30">
        {/* 装饰元素 - 更自然分布的背景装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-40 -mr-48 -mt-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-40 -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-50 to-transparent rounded-full filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up text-shadow">
              <span className="relative inline-block">
                如何使用我们的服务
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-orange-400 rounded-full shadow-glow"></span>
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed animate-slide-up animation-delay-100">
              只需简单三步，为您的爱宠找到合适的寄养服务，让您安心出行
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* 连接线 - 仅在中等以上屏幕显示 */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-orange-100 -translate-y-1/2 z-0"></div>
            
            {/* 步骤卡片1 */}
            <div className="text-center group relative z-10">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto transform group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <i className="fa-solid fa-search text-white text-4xl"></i>
                </div>

              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6 transform transition-transform duration-300 group-hover:-translate-y-1">搜索寄养服务</h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto text-base">
                根据您的宠物类型、出行日期和位置，筛选合适的寄养服务，查看详细介绍和用户评价。
              </p>
              <div className="w-16 h-1 bg-orange-400 mx-auto mt-6 rounded-full transform transition-all duration-500 scale-x-0 group-hover:scale-x-100 origin-left"></div>
            </div>

            {/* 步骤卡片2 */}
            <div className="text-center group relative z-10">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto transform group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <i className="fa-solid fa-calendar-check text-white text-4xl"></i>
                </div>

              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6 transform transition-transform duration-300 group-hover:-translate-y-1">在线预订</h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto text-base">
                直接在线预订寄养服务，与寄养者沟通宠物的特殊需求，确认细节后完成支付。
              </p>
              <div className="w-16 h-1 bg-orange-400 mx-auto mt-6 rounded-full transform transition-all duration-500 scale-x-0 group-hover:scale-x-100 origin-left"></div>
            </div>

            {/* 步骤卡片3 */}
            <div className="text-center group relative z-10">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto transform group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <i className="fa-solid fa-heart text-white text-4xl"></i>
                </div>

              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6 transform transition-transform duration-300 group-hover:-translate-y-1">安心出行</h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto text-base">
                您可以安心出行，随时通过平台查看宠物的实时状态和照片，寄养结束后分享您的体验。
              </p>
              <div className="w-16 h-1 bg-orange-400 mx-auto mt-6 rounded-full transform transition-all duration-500 scale-x-0 group-hover:scale-x-100 origin-left"></div>
            </div>
          </div>

          {/* 底部行动按钮 - 更现代化的按钮设计 */}
          <div className="mt-24 text-center">
            <a
              href="/fosters"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              立即开始寻找寄养服务
              <i className="fa-solid fa-arrow-right ml-3 text-lg transform group-hover:translate-x-1 transition-transform duration-300"></i>
            </a>
          </div>
        </div>
      </section>
      
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
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.2; }
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
        .animate-pulse {
          animation: pulse 10s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};