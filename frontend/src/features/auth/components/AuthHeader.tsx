import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * 认证页面（登录/注册）通用头部导航组件
 * 提供返回首页链接和应用标题动画
 */
export default function AuthHeader() {

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md shadow-sm border-b border-orange-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-all duration-300 group"
            >
              <motion.i
                className="fa-solid fa-arrow-left text-lg"
                initial={{ x: -5 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ x: -2 }}
              ></motion.i>
              <span className="font-medium group-hover:underline decoration-2 decoration-orange-300 underline-offset-4">返回首页</span>
            </Link>
          </div>

          <motion.div
              className="flex items-center space-x-2 text-sm font-semibold text-orange-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-2xl text-orange-500"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <i className="fa-solid fa-paw"></i>
              </motion.div>
              <span className="tracking-wide">宠物寄养之家</span>
            </motion.div>
        </div>
      </div>
    </motion.header>
  );
}