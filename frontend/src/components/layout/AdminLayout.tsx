import { Link, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';

/**
 * 管理员端布局组件 - 实现上左右结构
 * 上部为系统LOGO和返回用户端链接，左侧为菜单，右侧为主体内容
 */
export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部栏 - 包含系统LOGO和返回用户端链接 */}
      <header className="bg-white shadow-sm fixed w-full z-20 top-0 left-0 h-16 flex items-center px-4">
        <div className="flex items-center">
          <i className="fa-solid fa-paw text-2xl text-orange-500 mr-2"></i>
          <span className="font-bold text-xl text-gray-800">宠物寄养家管理中心</span>
        </div>
        <div className="ml-auto">
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            返回用户端
          </Link>
        </div>
      </header>
      
      <div className="flex flex-1 pt-16">
        {/* 左侧菜单栏 */}
        <aside 
          className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-[calc(100vh-4rem)] z-10 overflow-hidden`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className={`font-bold text-lg text-gray-900 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              管理中心
            </h2>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/admin"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-tachometer-alt w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    仪表盘
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/users"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-users w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    用户管理
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/services"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-home w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    寄养服务
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/orders"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-shopping-cart w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    订单管理
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/products"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-box w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    商品管理
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/consultations"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-stethoscope w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    问诊管理
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/reviews"
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-star w-6 text-center"></i>
                  <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    评价管理
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* 右侧主体内容区域 - 根据左侧菜单宽度调整左边距 */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}