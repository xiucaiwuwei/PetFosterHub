import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function Footer() {
  const [, setShowBackToTop] = useState(false);

  // 监听滚动事件，控制返回顶部按钮显示
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <i className="fa-solid fa-paw text-2xl text-orange-500 mr-2"></i>
                <h3 className="text-xl font-bold text-gray-800">宠物寄养之家</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                宠物寄养之家是专业的宠物临时寄养服务平台，致力于为宠物主人提供可靠、安全的寄养选择，让您外出无忧。
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">微信公众号</span>
                  <i className="fa-brands fa-weixin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">微博</span>
                  <i className="fa-brands fa-weibo text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">抖音</span>
                  <i className="fa-brands fa-tiktok text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">快速链接</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-home w-4 mr-2 text-gray-400"></i>
                    首页
                  </Link>
                </li>
                <li>
                  <Link to="/fosters" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-paw w-4 mr-2 text-gray-400"></i>
                    寄养服务
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-heart w-4 mr-2 text-gray-400"></i>
                    成为寄养提供者
                  </Link>
                </li>
                <li>
                  <Link to="/food-store" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-shopping-bag w-4 mr-2 text-gray-400"></i>
                    宠物商店
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">帮助中心</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-question-circle w-4 mr-2 text-gray-400"></i>
                    常见问题
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-file-contract w-4 mr-2 text-gray-400"></i>
                    服务条款
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-user-shield w-4 mr-2 text-gray-400"></i>
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-book w-4 mr-2 text-gray-400"></i>
                    用户指南
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">联系我们</h3>
              <ul className="space-y-3">
                <li className="text-sm text-gray-500 flex items-center hover:text-orange-500 transition-colors duration-200">
                  <i className="fa-solid fa-phone w-5 mr-3 text-gray-400"></i>
                  400-123-4567
                </li>
                <li className="text-sm text-gray-500 flex items-center hover:text-orange-500 transition-colors duration-200">
                  <i className="fa-solid fa-envelope w-5 mr-3 text-gray-400"></i>
                  contact@petfoster.com
                </li>
                <li className="text-sm text-gray-500 flex items-center hover:text-orange-500 transition-colors duration-200">
                  <i className="fa-solid fa-map-marker-alt w-5 mr-3 text-gray-400"></i>
                  北京市朝阳区建国路88号
                </li>
                <li className="text-sm text-gray-500 flex items-center hover:text-orange-500 transition-colors duration-200">
                  <i className="fa-solid fa-clock w-5 mr-3 text-gray-400"></i>
                  周一至周日 9:00-21:00
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} 宠物寄养之家. 保留所有权利.
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <p className="text-xs text-gray-400 mr-4">支持的支付方式：</p>
              <div className="flex space-x-3">
                <div className="h-8 w-12 bg-white rounded-md border border-gray-200 flex items-center justify-center hover:border-orange-300 transition-colors duration-200">
                  <i className="fa-brands fa-alipay text-blue-500"></i>
                </div>
                <div className="h-8 w-12 bg-white rounded-md border border-gray-200 flex items-center justify-center hover:border-orange-300 transition-colors duration-200">
                  <i className="fa-brands fa-weixin text-green-600"></i>
                </div>
                <div className="h-8 w-12 bg-white rounded-md border border-gray-200 flex items-center justify-center hover:border-orange-300 transition-colors duration-200">
                  <i className="fa-brands fa-cc-visa text-blue-800"></i>
                </div>
                <div className="h-8 w-12 bg-white rounded-md border border-gray-200 flex items-center justify-center hover:border-orange-300 transition-colors duration-200">
                  <i className="fa-brands fa-cc-mastercard text-red-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}