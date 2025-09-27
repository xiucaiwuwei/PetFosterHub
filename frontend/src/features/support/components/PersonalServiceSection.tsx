import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 个人供养者服务部分组件
 */
const PersonalServiceSection: React.FC = () => {
  return (
    <div className="mt-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 relative inline-block">
          个人供养者服务
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mt-2"></span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">加入我们，为宠物提供专业的关爱服务，实现您的爱心与价值</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 个人服务卡片 1 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
          <div className="h-56 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <i className="fa-solid fa-home text-white text-7xl transform transition-transform duration-300 group-hover:scale-110"></i>
          </div>
           <div className="p-7">
             <h3 className="text-2xl font-bold text-gray-800 mb-3">家庭供养服务</h3>
             <p className="text-gray-600 mb-6 leading-relaxed">
              在自己家中为宠物提供临时寄养服务，给予宠物家庭般的关爱和照顾，让宠物感受到如家般的温暖。
             </p>
             <Link 
               to="/apply-foster"
               className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 transition duration-300 ease-in-out inline-block text-center transform hover:-translate-y-1"
             >
               申请成为寄养者
             </Link>
          </div>
        </div>
        
         {/* 个人服务卡片 2 */}
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
           <div className="h-56 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <i className="fa-solid fa-walking text-white text-7xl transform transition-transform duration-300 group-hover:scale-110"></i>
           </div>
           <div className="p-7">
             <h3 className="text-2xl font-bold text-gray-800 mb-3">宠物上门照顾</h3>
             <p className="text-gray-600 mb-6 leading-relaxed">
               提供上门喂养、遛狗、宠物陪伴等服务，让宠物在熟悉的环境中得到专业的照顾，减少应激反应。
             </p>
             <Link 
               to="/apply-service"
               className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out inline-block text-center transform hover:-translate-y-1"
             >
               申请提供服务
             </Link>
           </div>
         </div>
        
        {/* 个人服务卡片 3 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
          <div className="h-56 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <i className="fa-solid fa-shower text-white text-7xl transform transition-transform duration-300 group-hover:scale-110"></i>
          </div>
          <div className="p-7">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">宠物美容服务</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              提供专业宠物美容服务，包括洗澡、剪毛、指甲修剪等，让宠物保持整洁美观，提升健康水平。
            </p>
            <Link 
              to="/apply-service"
              className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out inline-block text-center transform hover:-translate-y-1"
            >
              申请提供服务
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalServiceSection;