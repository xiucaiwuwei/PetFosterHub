interface HowItWorksProps {
  // 如果需要任何props，可以在这里添加
}

export const HowItWorks = ({}: HowItWorksProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
      {/* 装饰元素 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -ml-32 -mb-32"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded-full mb-4">简单三步流程</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">如何使用我们的服务</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            只需简单三步，为您的爱宠找到合适的寄养服务，让您安心出行
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* 步骤卡片1 */}
          <div className="text-center group">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <i className="fa-solid fa-search text-white text-3xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-orange-500">1</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">搜索寄养服务</h3>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              根据您的宠物类型、出行日期和位置，筛选合适的寄养服务，查看详细介绍和用户评价。
            </p>
          </div>

          {/* 步骤卡片2 */}
          <div className="text-center group">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <i className="fa-solid fa-calendar-check text-white text-3xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-orange-500">2</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">在线预订</h3>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              直接在线预订寄养服务，与寄养者沟通宠物的特殊需求，确认细节后完成支付。
            </p>
          </div>

          {/* 步骤卡片3 */}
          <div className="text-center group">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <i className="fa-solid fa-heart text-white text-3xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-orange-500">3</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">安心出行</h3>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              您可以安心出行，随时通过平台查看宠物的实时状态和照片，寄养结束后分享您的体验。
            </p>
          </div>
        </div>

        {/* 底部行动按钮 */}
        <div className="mt-16 text-center">
          <a 
            href="/fosters" 
            className="inline-flex items-center px-8 py-3 bg-orange-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            立即开始寻找寄养服务
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
};