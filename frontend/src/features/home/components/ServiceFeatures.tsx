interface ServiceFeaturesProps {
  // 如果需要任何props，可以在这里添加
}

export const ServiceFeatures = ({ }: ServiceFeaturesProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50 overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 -ml-32 -mb-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 inline-block">
            为什么选择宠物寄养家
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            我们提供安全、可靠的宠物寄养服务，让您的爱宠在您外出时得到悉心照料
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 特点卡片1 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl transform group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-home"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">家庭式寄养</h3>
            <p className="text-gray-600 leading-relaxed">
              不同于冰冷的宠物酒店，我们的寄养提供者提供温馨的家庭环境，让您的宠物感受家的温暖。
            </p>
          </div>

          {/* 特点卡片2 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl transform group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">严格筛选寄养者</h3>
            <p className="text-gray-600 leading-relaxed">
              所有寄养提供者都经过严格筛选和背景调查，确保您的宠物得到专业、负责任的照顾。
            </p>
          </div>

          {/* 特点卡片3 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl transform group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-video"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">实时查看宠物状态</h3>
            <p className="text-gray-600 leading-relaxed">
              寄养期间，您可以通过我们的平台接收宠物的照片和视频，随时了解爱宠的情况。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};