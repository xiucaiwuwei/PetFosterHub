import { Link } from 'react-router-dom';

interface UserMenuProps {
  isAuthenticated: boolean;
  userInfo: any;
}

export function UserMenu({ isAuthenticated, userInfo }: UserMenuProps) {
  if (isAuthenticated) {
    // 用户已登录状态
    return (
      <div className="relative group ml-4">
        <Link
          to="/profile"
          className="flex items-center p-1 rounded-full text-gray-500 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
          aria-label="用户中心"
        >
          <div className="relative group">
            <img
              src={userInfo?.user?.avatar || "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E8%BF%90%E5%8A%A8%E9%A3%8E%E6%A0%BC%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=66572c72fe2bc067c919e7742c2a81e6"}
              alt="用户头像"
              className="w-9 h-9 rounded-full mr-2 object-cover border-2 border-transparent group-hover:border-orange-500 transition-all duration-300 transform group-hover:scale-110 shadow-sm group-hover:shadow-md"
            />
            {/* 添加头像悬停辉光效果 */}
            <span className="absolute inset-0 rounded-full border-2 border-orange-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-ping"></span>
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300">
            {userInfo?.user?.nickname || '用户'}
            <span className="ml-1 text-xs text-gray-500 group-hover:text-orange-500 transition-colors duration-300">
              ({userInfo?.user?.role === 'PROVIDER' ? '寄养家长' :
                userInfo?.user?.role === 'OWNER' ? '宠物主人' :
                  userInfo?.user?.role === 'BUSINESS' ? '商城店家' :
                    userInfo?.user?.role === 'VETERINARIAN' ? '宠物医生' :
                      userInfo?.user?.role === 'ADMIN' ? '管理员' : '普通用户'})
            </span>
          </span>
        </Link>
      </div>
    );
  }

  // 用户未登录状态
  return (
    <div className="flex items-center space-x-3 ml-4">
      <Link
        to="/login"
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md relative overflow-hidden group"
        aria-label="登录"
      >
        <span className="relative z-10 group-hover:text-gray-800 transition-colors duration-300">登录</span>
        <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-orange-500 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md relative overflow-hidden group"
        aria-label="注册"
      >
        <span className="relative z-10 transition-colors duration-300">注册</span>
        <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Link>
    </div>
  );
}