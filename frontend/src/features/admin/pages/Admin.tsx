import { useState } from 'react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import Dashboard from './Dashboard';
import Users from './Users';
import Orders from './Orders';
import Services from './Services';
import Products from './Products';
import Consultations from './Consultations';
import Reports from './Reports';
import Settings from './Settings';

export default function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm h-16 fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">PetFosterHub 管理中心</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative"
              aria-label="通知"
            >
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://picsum.photos/id/1005/200" 
                alt="Admin avatar" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">管理员</p>
                <p className="text-xs text-gray-500">admin@petfosterhub.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="flex pt-16 h-screen overflow-hidden">
        {/* 侧边栏 */}
        <AdminSidebar 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={toggleSidebar} 
        />
        
        {/* 内容区域 */}
        <main 
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out pt-6 pb-12 px-4 sm:px-6 lg:px-8 ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20' 
          }`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/services" element={<Services />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
