interface UserReviewsProps {
  // 如果需要任何props，可以在这里添加
}

export const UserReviews = ({}: UserReviewsProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
      {/* 装饰元素 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-40 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-40 -ml-32 -mb-32"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">用户的真实评价</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            看看其他宠物主人如何评价我们的寄养服务
          </p>
        </div>

        <div className="relative">
          {/* 移动端横向滚动容器 */}
          <div className="overflow-x-auto pb-4 scrollbar-hide md:hidden">
            <div className="flex space-x-6 min-w-max">
              <div className="bg-white p-8 rounded-2xl shadow-md w-[85vw] max-w-xs flex-shrink-0 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=b87cce25b9f1eaaa6b7debda0fd4a08f"
                    alt="用户头像"
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-orange-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">陈女士</h4>
                    <div className="flex text-yellow-400 mt-1">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-quote-left text-orange-100 text-4xl absolute -top-6 -left-2 opacity-50"></i>
                  <p className="text-gray-600 italic relative z-10">
                    "第一次使用宠物寄养服务，体验非常好！张阿姨把我的金毛照顾得无微不至，每天都会发照片和视频，让我在国外出差也能放心。"
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md w-[85vw] max-w-xs flex-shrink-0 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=6d9ca878f17dbd077ab5cd1e02bc9622"
                    alt="用户头像"
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-orange-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">李先生</h4>
                    <div className="flex text-yellow-400 mt-1">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star-half-stroke"></i>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-quote-left text-orange-100 text-4xl absolute -top-6 -left-2 opacity-50"></i>
                  <p className="text-gray-600 italic relative z-10">
                    "我的猫咪很胆小，平时不喜欢陌生人，但李华很有耐心，花了很多时间让猫咪适应。回来后感觉猫咪比以前更活泼了，非常感谢！"
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md w-[85vw] max-w-xs flex-shrink-0 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=869374c81be2f8d46618b87813b86dfb"
                    alt="用户头像"
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-orange-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">王女士</h4>
                    <div className="flex text-yellow-400 mt-1">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-quote-left text-orange-100 text-4xl absolute -top-6 -left-2 opacity-50"></i>
                  <p className="text-gray-600 italic relative z-10">
                    "作为寄养提供者，我通过这个平台认识了很多可爱的宠物和负责任的主人。平台流程简单清晰，支付也很方便，推荐给大家！"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 桌面端网格布局 */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=b87cce25b9f1eaaa6b7debda0fd4a08f"
                  alt="用户头像"
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">陈女士</h4>
                  <div className="flex text-yellow-400 mt-1">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
              <div className="relative">
                <i className="fa-solid fa-quote-left text-orange-100 text-5xl absolute -top-6 -left-2 opacity-50"></i>
                <p className="text-gray-600 italic leading-relaxed relative z-10">
                  "第一次使用宠物寄养服务，体验非常好！张阿姨把我的金毛照顾得无微不至，每天都会发照片和视频，让我在国外出差也能放心。"
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=6d9ca878f17dbd077ab5cd1e02bc9622"
                  alt="用户头像"
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">李先生</h4>
                  <div className="flex text-yellow-400 mt-1">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star-half-stroke"></i>
                  </div>
                </div>
              </div>
              <div className="relative">
                <i className="fa-solid fa-quote-left text-orange-100 text-5xl absolute -top-6 -left-2 opacity-50"></i>
                <p className="text-gray-600 italic leading-relaxed relative z-10">
                  "我的猫咪很胆小，平时不喜欢陌生人，但李华很有耐心，花了很多时间让猫咪适应。回来后感觉猫咪比以前更活泼了，非常感谢！"
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=869374c81be2f8d46618b87813b86dfb"
                  alt="用户头像"
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">王女士</h4>
                  <div className="flex text-yellow-400 mt-1">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
              <div className="relative">
                <i className="fa-solid fa-quote-left text-orange-100 text-5xl absolute -top-6 -left-2 opacity-50"></i>
                <p className="text-gray-600 italic leading-relaxed relative z-10">
                  "作为寄养提供者，我通过这个平台认识了很多可爱的宠物和负责任的主人。平台流程简单清晰，支付也很方便，推荐给大家！"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部统计数据 */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
            <p className="text-gray-600">用户满意度</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-orange-500 mb-2">5000+</div>
            <p className="text-gray-600">成功寄养案例</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
            <p className="text-gray-600">全天候客服支持</p>
          </div>
        </div>
      </div>
    </section>
  );
};