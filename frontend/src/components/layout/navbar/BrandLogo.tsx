import { Link } from 'react-router-dom';

export function BrandLogo() {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center group relative overflow-hidden rounded-md p-1 hover:bg-orange-50 transition-all duration-300">
      <div className="relative">
        <i className="fa-solid fa-paw text-2xl text-orange-500 mr-2 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow"></i>
        {/* 添加爪印动画效果 */}
        <span className="absolute inset-0 bg-orange-200 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform origin-center group-hover:scale-125"></span>
      </div>
      <span className="font-bold text-xl text-gray-800 group-hover:text-orange-600 transition-colors duration-300 relative z-10">宠物寄养之家</span>
      {/* 添加底部下划线动画 */}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
    </Link>
  );
}