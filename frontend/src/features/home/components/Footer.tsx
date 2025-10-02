import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * 网站页脚组件
 * 包含导航链接、联系信息和版权声明
 */
export const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // 监听滚动事件，控制返回顶部按钮显示
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 平滑滚动到顶部
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <footer className="bg-white border-t border-gray-100 pt-16 pb-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* 品牌标志和简介 */}
                        <div className="md:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                    <i className="fa-solid fa-paw text-white text-2xl"></i>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">宠物寄养家</span>
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                连接爱宠人士与专业寄养者，让您的宠物在您外出时也能得到细心呵护。
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors duration-200">
                                    <i className="fa-brands fa-weixin"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors duration-200">
                                    <i className="fa-brands fa-weibo"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors duration-200">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            </div>
                        </div>

                        {/* 快速导航 */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">快速导航</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">首页</Link>
                                </li>
                                <li>
                                    <Link to="/fosters" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">寻找寄养</Link>
                                </li>
                                <li>
                                    <Link to="/become-foster" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">成为寄养者</Link>
                                </li>
                                <li>
                                    <Link to="/stories" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">宠物故事</Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">常见问题</Link>
                                </li>
                            </ul>
                        </div>

                        {/* 帮助中心 */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">帮助中心</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/how-it-works" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">服务流程</Link>
                                </li>
                                <li>
                                    <Link to="/safety" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">安全保障</Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">服务条款</Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">隐私政策</Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200">联系我们</Link>
                                </li>
                            </ul>
                        </div>

                        {/* 联系信息 */}
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
            </footer>

            {/* 返回顶部按钮 */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 bg-orange-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 transform ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                aria-label="返回顶部"
            >
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </>
    );
};