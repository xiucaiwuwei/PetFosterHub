/**
 * 网站介绍区域组件
 * 专注于展示网站的核心价值主张和概述信息
 */
export const HeroSection = () => {
    return (
        <section className="relative text-white overflow-hidden">
            {/* 动态背景装饰 */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-500/80"></div>
                <img
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%E5%BF%AB%E4%B9%90%E7%9A%84%E7%8B%97%E5%92%8C%E7%8C%AB%E5%9C%A8%E4%B8%80%E8%B5%B7%E7%8E%A9%E8%80%8D%EF%BC%8C%E5%8D%A1%E9%80%9A%E9%A3%8E%E6%A0%BC&sign=f44520432e0a584fc32e46e810f38d24"
                    alt="快乐的宠物们"
                    className="w-full h-full object-cover opacity-20 transform scale-105 animate-slow-zoom"
                />
                {/* 装饰元素 */}
                <div
                    className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div
                    className="absolute -bottom-48 -left-48 w-96 h-96 bg-orange-300/20 rounded-full filter blur-3xl animate-pulse"></div>
                <div
                    className="absolute top-1/2 left-1/3 w-40 h-40 bg-yellow-300/10 rounded-full filter blur-2xl animate-float"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative z-10">
                <div className="relative max-w-3xl md:ml-0">
                    {/* 装饰徽章 */}
                    <div
                        className="inline-block mb-8 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium tracking-wide animate-fade-in shadow-lg">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse"></span>
              宠物友好 · 专业寄养 · 爱心呵护
            </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight animate-slide-up text-shadow">
                        为您的爱宠找到<br/>
                        <span className="relative inline-block">
              温馨的临时家园
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-white/70 rounded-full shadow-glow"></span>
            </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-orange-100 mb-10 max-w-2xl animate-slide-up animation-delay-100 leading-relaxed">
                        宠物寄养家连接宠物主人与爱心寄养人士，
                        让您外出时无需担心爱宠无人照顾。
                    </p>

                    {/* 信任标识 */}
                    <div className="flex items-center space-x-6 mt-10 opacity-90 animate-slide-up animation-delay-200">
            <span className="text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-shield-alt text-white/80"></i>
              <span>安全保障</span>
            </span>
                        <span className="text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-user-check text-white/80"></i>
              <span>专业认证</span>
            </span>
                        <span className="text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-heart text-white/80"></i>
              <span>爱心服务</span>
            </span>
                    </div>
                </div>
            </div>

            {/* 底部波浪装饰 - 优化渐变衔接 */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20 text-orange-50 fill-current">
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
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.3; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
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
          .animate-pulse {
            animation: pulse 5s ease-in-out infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .text-shadow {
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .shadow-glow {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
          }
        `}
            </style>
        </section>
    );
};