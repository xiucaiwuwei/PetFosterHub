import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

/**
 * 管理员侧边栏导航组件
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isSidebarOpen, 
  onToggleSidebar 
}) => {
  const menuItems = [
    {
      path: '/admin',
      icon: 'fa-tachometer-alt',
      label: '仪表盘',
      exact: true
    },
    {
      path: '/admin/users',
      icon: 'fa-users',
      label: '用户管理'
    },
    {
      path: '/admin/services',
      icon: 'fa-home',
      label: '寄养服务'
    },
    {
      path: '/admin/orders',
      icon: 'fa-shopping-cart',
      label: '订单管理'
    },
    {
      path: '/admin/products',
      icon: 'fa-box',
      label: '商品管理'
    },
    {
      path: '/admin/consultations',
      icon: 'fa-stethoscope',
      label: '问诊管理'
    },
    {
      path: '/admin/reports',
      icon: 'fa-file-chart-line',
      label: '报表分析'
    },
    {
      path: '/admin/settings',
      icon: 'fa-cog',
      label: '系统设置'
    }
  ];

  return (
    <aside 
      className={`bg-white shadow-md transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20' 
      } fixed h-[calc(100vh-4rem)] z-10 overflow-hidden`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className={`font-bold text-lg text-gray-900 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          管理中心
        </h2>
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          aria-label={isSidebarOpen ? '收起侧边栏' : '展开侧边栏'}
        >
          <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                exact={item.exact || false}
                className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
                <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};