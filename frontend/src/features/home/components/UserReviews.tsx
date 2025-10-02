/**
 * 用户评价区域组件
 * 展示用户对服务的真实评价和反馈
 */
import { useUserReviews } from '@/features/home/hooks';

export const UserReviews = () => {
    const { testimonials, loading, error, renderRatingStars } = useUserReviews();

    // 处理加载状态
    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            </section>
        );
    }

    // 处理错误状态
    if (error) {
        return (
            <section className="py-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-gray-600">加载用户评价失败，请稍后再试</p>
                </div>
            </section>
        );
    }

    // 处理空状态
    if (!testimonials || testimonials.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-gray-600">暂无用户评价</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-24 bg-gradient-to-b from-orange-50 to-white overflow-hidden relative">
                {/* 优化后的装饰元素 - 更自然的分布 */}
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-30 -mr-32 animate-pulse"></div>
                <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-30 -ml-32 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up text-shadow">
                            <span className="relative inline-block">
                                用户的真实评价
                                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-orange-400 rounded-full shadow-glow"></span>
                            </span>
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 animate-slide-up animation-delay-100">
                            看看其他宠物主人如何评价我们的寄养服务
                        </p>
                    </div>

                    <div className="relative">
                        {/* 移动端横向滚动容器 */}
                        <div className="overflow-x-auto pb-4 scrollbar-hide md:hidden">
                            <div className="flex space-x-6 min-w-max">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={testimonial.id}
                                        className="bg-white p-8 rounded-2xl shadow-md w-[85vw] max-w-xs flex-shrink-0 transition-all duration-300 hover:shadow-lg animate-slide-up"
                                        style={{ animationDelay: `${index * 0.2}s` }}
                                    >
                                        <div className="flex items-center mb-4">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-orange-100"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                                                <div className="flex text-yellow-400 mt-1">
                                                    {renderRatingStars(testimonial.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <i className="fa-solid fa-quote-left text-orange-100 text-4xl absolute -top-6 -left-2 opacity-50"></i>
                                            <p className="text-gray-600 italic relative z-10">
                                                "{testimonial.content}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 桌面端网格布局 */}
                        <div className="hidden md:grid md:grid-cols-3 md:gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-white p-8 rounded-2xl shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-slide-up"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-100"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                                            <div className="flex text-yellow-400 mt-1">
                                                {renderRatingStars(testimonial.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <i className="fa-solid fa-quote-left text-orange-100 text-5xl absolute -top-6 -left-2 opacity-50"></i>
                                        <p className="text-gray-600 italic leading-relaxed relative z-10">
                                            "{testimonial.content}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 0.1; }
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
                  animation: pulse 8s ease-in-out infinite;
                }
              `}</style>
        </>
    );
};