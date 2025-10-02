import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  backgroundGradient: string;
  imageUrl?: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

interface CarouselProps {
  slides?: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  minHeight?: string;
  maxHeight?: string;
  paddingClass?: string;
  controlButtonsBottomPosition?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  slides: customSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
  minHeight = '240px',
  maxHeight = '360px',
  paddingClass = 'py-6 md:py-10',
  controlButtonsBottomPosition = 'bottom-[-30px]'
}) => {
  // 默认轮播图数据
  const defaultSlides: CarouselSlide[] = [
    {
      id: 1,
      title: '宠物商店',
      description: '为您的爱宠挑选高品质的食品和用品',
      backgroundColor: 'bg-orange-500',
      backgroundGradient: 'from-orange-500 to-orange-600',
      stats: [
        { label: '优质商品', value: '300+' },
        { label: '品牌种类', value: '50+' },
        { label: '满意评价', value: '96%' },
        { label: '配送城市', value: '15+' }
      ]
    },
    {
      id: 2,
      title: '新品上市',
      description: '限时优惠，新品宠物零食8折起',
      backgroundColor: 'bg-blue-500',
      backgroundGradient: 'from-blue-500 to-blue-600',
      stats: [
        { label: '新品数量', value: '50+' },
        { label: '限时折扣', value: '8折起' },
        { label: '活动时间', value: '30天' },
        { label: '已购用户', value: '2000+' }
      ]
    },
    {
      id: 3,
      title: '会员专享',
      description: '加入会员享受更多专属福利和服务',
      backgroundColor: 'bg-purple-500',
      backgroundGradient: 'from-purple-500 to-purple-600',
      stats: [
        { label: '会员权益', value: '12项' },
        { label: '生日礼包', value: '¥50' },
        { label: '专属客服', value: '24h' },
        { label: '积分倍数', value: '1.5x' }
      ]
    }
  ];

  const slides = customSlides || defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // 自动播放效果
  useEffect(() => {
    if (!autoPlay || isHovering) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isHovering]);

  // 切换到下一张
  const goToNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // 切换到上一张
  const goToPrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // 切换到指定索引
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className={`relative bg-gradient-to-r ${currentSlide.backgroundGradient} text-white ${paddingClass} overflow-hidden`}
      style={{ minHeight, maxHeight }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        {/* 渐变叠加层增强文字可读性 */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        
        {/* 装饰图案 */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgNjBhMzAgMzAgMCAxIDEgMCA2MEgzMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] bg-repeat opacity-20"
        ></div>
        
        {/* 装饰圆点 */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* 轮播内容 */}
      <div className="relative z-10 px-2 sm:px-4">
        <div className="max-w-screen-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => setIsTransitioning(false)}
              className="flex flex-col h-full"
            >
              {/* 轮播图片（如果有） */}
              {currentSlide.imageUrl && (
                <motion.div 
                  className="absolute right-0 top-0 w-1/3 hidden lg:block"
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  <img 
                    src={currentSlide.imageUrl} 
                    alt={currentSlide.title} 
                    className="h-full object-contain drop-shadow-2xl"
                  />
                </motion.div>
              )}

              {/* 轮播文本内容 */}
              <div className="flex-grow flex flex-col justify-center lg:pr-1/3">
                <motion.div
                  className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  幻灯片 {currentIndex + 1}/{slides.length}
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="relative">
                    {currentSlide.title}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-1 bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    ></motion.span>
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-base md:text-xl text-white/90 max-w-2xl leading-relaxed mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {currentSlide.description}
                </motion.p>

                {/* 数据统计卡片 */}
                {currentSlide.stats && (
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.05 }}
                  >
                    {currentSlide.stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                        className="bg-white/15 backdrop-blur-md rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-white/20"
                      >
                        <p className="text-xs text-white/80 mb-1 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 轮播控制按钮 */}
          <div className={`absolute ${controlButtonsBottomPosition} left-1/2 transform -translate-x-1/2 flex space-x-2 z-20`}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ease-in-out ${index === currentIndex ? 'bg-white w-10' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                aria-label={`切换到第 ${index + 1} 张幻灯片`}
              />
            ))}
          </div>

          {/* 左右箭头 */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-white/20 hover:scale-110"
            aria-label="上一张"
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-white/20 hover:scale-110"
            aria-label="下一张"
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;