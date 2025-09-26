import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/features/auth/slice/authSlice';
import { useCart } from '@/lib/contexts/cartContext';
import { cn } from '@/lib/utils';
import { AppDispatch, RootState } from '@/app/store/store';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';

export function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { toggleCart, itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("北京市");
  const cities = [
    { id: 1, name: "北京市" },
    { id: 2, name: "上海市" },
    { id: 3, name: "广州市" },
    { id: 4, name: "深圳市" },
    { id: 5, name: "成都市" },
    { id: 6, name: "杭州市" }
  ];
  const [unreadCount] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);

  // 从本地存储加载用户信息
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const storedUserInfo = LocalStorageManager.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(storedUserInfo);
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
      }
    };

    // 如果用户已登录，加载用户信息
    if (isAuthenticated) {
      loadUserInfo();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 获取当前用户角色
  const userRole = userInfo?.user?.role || '';

  // 判断用户是否有权限查看特定链接的函数
  const canViewLink = (roles: string[]) => {
    // 如果没有指定角色，则所有用户都可以查看
    if (!roles || roles.length === 0) {
      return true;
    }
    // 如果用户已登录且角色匹配，则可以查看
    return isAuthenticated && roles.includes(userRole);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-20 top-0 left-0 transition-all duration-300">
       <div className="w-full">
         <div className="flex justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <i className="fa-solid fa-paw text-2xl text-orange-500 mr-2 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="font-bold text-xl text-gray-800 group-hover:text-orange-600 transition-colors duration-300">宠物寄养之家</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
               {/* 首页 - 所有用户可见 */}
              <NavLink 
                 to="/"
                 className={({ isActive }) => 
                   isActive 
                     ? "border-b-2 border-orange-500 text-orange-600 inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300" 
                     : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-50 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300"
                 }
               >
                 首页
               </NavLink>
               
               {/* 寄养服务 - 所有用户可见 */}
               <NavLink 
                 to="/fosters"
                 className={({ isActive }) => 
                   isActive 
                     ? "border-b-2 border-orange-500 text-orange-600 inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300" 
                     : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-50 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300"
                 }
               >
                 寄养服务
               </NavLink>
                
               {/* 供养服务 - 宠物主人和管理员可见 */}
               {canViewLink(['OWNER', 'ADMIN']) && (
                <NavLink 
                  to="/support"
                  className={({ isActive }) => 
                    isActive 
                      ? "border-b-2 border-orange-500 text-orange-600 inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300" 
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-50 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300"
                  }
                >
                  供养服务
                </NavLink>
               )}
                
               {/* 宠物商店 - 所有用户可见 */}
               <NavLink 
                 to="/food-store"
                 className={({ isActive }) => 
                   isActive 
                     ? "border-b-2 border-orange-500 text-orange-600 inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300" 
                     : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-50 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300"
                 }
               >
                 宠物商店
               </NavLink>
                
               {/* 线上问诊 - 宠物主人和管理员可见 */}
               {canViewLink(['OWNER', 'ADMIN']) && (
                 <NavLink 
                   to="/pet-consultation"
                   className={({ isActive }) => 
                     isActive 
                       ? "border-b-2 border-orange-500 text-orange-600 inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300" 
                       : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-50 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300"
                   }
                 >
                   线上问诊
                 </NavLink>
               )}
                {isAuthenticated && (
                  <NavLink 
                     to="/messages" 
                     className={({ isActive }) => 
                       isActive 
                         ? "border-b-2 border-orange-500 text-orange-600 inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300" 
                         : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-orange-50 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300"
                     }
                   >
                    <span className="relative inline-flex items-center">
                      消息
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                )}
             </div>
          </div>
          <div className="flex items-center">
            {/* 购物车图标 - 仅登录用户可见 */}
            {isAuthenticated && (
              <button 
                className="relative p-2 mr-4 text-gray-700 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110"
                onClick={toggleCart}
              >
                <i className="fa-solid fa-shopping-cart text-xl"></i>
                {/* 购物车商品数量徽章 */}
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
            {isAuthenticated ? (
               <div className="hidden md:flex items-center ml-4 relative group">
                 <div className="flex items-center mr-3 cursor-pointer hover:text-orange-500 transition-colors duration-300" onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}>
                   <i className="fa-solid fa-location-dot text-gray-500 mr-1"></i>
                   <span className="text-sm text-gray-700">{selectedCity}</span>
                   <i className="fa-solid fa-chevron-down ml-1 text-xs text-gray-500"></i>
                 </div>
                 {isCityDropdownOpen && (
                   <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-1 z-10 ring-1 ring-black ring-opacity-5 transform origin-top-left scale-95 opacity-0 animate-[fadeIn_0.2s_ease-out_forwards,_scaleUp_0.2s_ease-out_forwards]">
                     {cities.map(city => (
                       <button
                         key={city.id}
                         onClick={() => {
                           setSelectedCity(city.name);
                           setIsCityDropdownOpen(false);
                         }}
                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 w-full text-left transition-colors duration-200"
                       >
                         {city.name}
                       </button>
                     ))}
                   </div>
                 )}
                 <button
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   className="flex items-center p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
                   aria-expanded={isDropdownOpen}
                 >
                   <span className="sr-only">打开用户菜单</span>
                     <img 
                       src={userInfo?.user?.avatar || "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E8%BF%90%E5%8A%A8%E9%A3%8E%E6%A0%BC%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=66572c72fe2bc067c919e7742c2a81e6"} 
                       alt="用户头像" 
                       className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-transparent hover:border-orange-500 transition-all duration-300"
                     />
                     <span className="text-sm font-medium text-gray-700">
                       {userInfo?.user?.nickname || '用户'}
                       <span className="ml-1 text-xs text-gray-500">
                         ({userInfo?.user?.role === 'PROVIDER' ? '寄养家长' : 
                            userInfo?.user?.role === 'OWNER' ? '宠物主人' : 
                            userInfo?.user?.role === 'BUSINESS' ? '商城店家' : 
                            userInfo?.user?.role === 'VETERINARIAN' ? '宠物医生' : 
                            userInfo?.user?.role === 'ADMIN' ? '管理员' : '普通用户'})
                       </span>
                     </span>
                 </button>
                
                 {isDropdownOpen && (
                   <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl py-1 z-10 ring-1 ring-black ring-opacity-5 transform origin-top-right scale-95 opacity-0 animate-[fadeIn_0.2s_ease-out_forwards,_scaleUp_0.2s_ease-out_forwards]">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 w-full text-left transition-colors duration-200"
                    >
                      <i className="fa-solid fa-user mr-2"></i>个人资料
                    </button>
                    {/* 后台管理 - 仅管理员可见 */}
                      {canViewLink(['ADMIN']) && (
                        <button
                        onClick={() => {
                          navigate('/admin');
                          setIsDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 w-full text-left transition-colors duration-200"
                      >
                        <i className="fa-solid fa-cog mr-2"></i>后台管理
                      </button>
                      )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 w-full text-left transition-colors duration-200"
                    >
                      <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center ml-4">
                <button
                  onClick={() => navigate('/login')}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  登录
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  注册
                </button>
              </div>
            )}
            
            {/* 移动端菜单按钮 */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">打开主菜单</span>
                <i className={cn("fa-solid", isMenuOpen ? "fa-times" : "fa-bars")}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-[slideDown_0.3s_ease-out_forwards]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* 首页 - 所有用户可见 */}
            <Link
              to="/"
              className="bg-orange-50 border-orange-500 text-orange-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md"
            >
              首页
            </Link>
            
            {/* 寄养服务 - 所有用户可见 */}
            <Link
              to="/fosters"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
            >
              寄养服务
            </Link>
            
            {/* 供养服务 - 宠物主人和管理员可见 */}
            {canViewLink(['OWNER', 'ADMIN']) && (
            <Link
              to="/support"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
            >
              供养服务
            </Link>
            )}
            
            {/* 宠物商店 - 所有用户可见 */}
            <Link
              to="/food-store"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
            >
              宠物商店
            </Link>
            
            {/* 线上问诊 - 宠物主人和管理员可见 */}
            {canViewLink(['OWNER', 'ADMIN']) && (
            <Link
              to="/pet-consultation"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
            >
              线上问诊
            </Link>
            )}
            
            {isAuthenticated && (
              <Link
                to="/messages"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
              >
                消息
              </Link>
            )}
            {isAuthenticated ? (
              <>
                {/* 个人资料 - 所有登录用户可见 */}
                <Link
                  to="/profile"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
                >
                  个人资料
                </Link>
                
                {/* 后台管理 - 仅管理员可见 */}
                {canViewLink(['ADMIN']) && (
                <Link
                  to="/admin"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
                >
                  后台管理
                </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-md transition-colors duration-200"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}