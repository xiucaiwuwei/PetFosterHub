import { motion } from 'framer-motion';

interface PetStoreHeaderProps {
  title?: string;
  description?: string;
}

const PetStoreHeader: React.FC<PetStoreHeaderProps> = ({ 
  title = '宠物商店',
  description = '为您的爱宠挑选高品质的食品和用品'
}) => {
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

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight animate-fadeIn"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.p 
          className="text-base md:text-lg text-orange-100 max-w-2xl leading-relaxed mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>

        {/* 数据统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">优质商品</p>
            <p className="text-2xl font-bold">300+</p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">品牌种类</p>
            <p className="text-2xl font-bold">50+</p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">满意评价</p>
            <p className="text-2xl font-bold">96%</p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-xs text-orange-100 mb-1">配送城市</p>
            <p className="text-2xl font-bold">15+</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetStoreHeader;