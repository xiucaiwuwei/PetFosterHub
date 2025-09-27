import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 店铺供应服务部分组件
 */
const StoreServiceSection: React.FC = () => {
  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 relative inline-block">
          店铺供应服务
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full mt-2"></span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">为宠物主人提供高品质的产品和专业的服务，共建宠物友好社区</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 店铺服务卡片 1 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
          <div className="h-56 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <i className="fa-solid fa-box-open text-white text-7xl transform transition-transform duration-300 group-hover:scale-110"></i>
          </div>
          <div className="p-7">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">宠物食品供应</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              提供优质宠物食品批发与零售服务，包括干粮、湿粮、零食和特殊饮食配方，满足不同宠物的营养需求。
            </p>
            <Link 
              to="/apply-service"
              className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-purple-500 hover:bg-purple-600 transition duration-300 ease-in-out inline-block text-center transform hover:-translate-y-1"
            >
              申请提供服务
            </Link>
          </div>
        </div>
        
        {/* 店铺服务卡片 2 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
          <div className="h-56 bg-gradient-to-r from-indigo-400 to-indigo-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <i className="fa-solid fa-store text-white text-7xl transform transition-transform duration-300 group-hover:scale-110"></i>
          </div>
          <div className="p-7">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">宠物用品销售</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              销售宠物日常用品，包括玩具、窝垫、牵引绳、美容工具和服饰等，为宠物提供舒适快乐的生活环境。
            </p>
            <Link 
              to="/apply-service"
              className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition duration-300 ease-in-out inline-block text-center transform hover:-translate-y-1"
            >
              申请提供服务
            </Link>
          </div>
        </div>
        
        {/* 店铺服务卡片 3 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
          <div className="h-56 bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <i className="fa-solid fa-stethoscope text-white text-7xl transform transition-transform duration-300 group-hover:scale-110"></i>
          </div>
          <div className="p-7">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">宠物医疗服务</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              提供宠物医疗咨询、健康检查、疫苗接种、疾病治疗等专业兽医服务，保障宠物的健康与安全。
            </p>
            <Link 
              to="/apply-service"
              className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out inline-block text-center transform hover:-translate-y-1"
            >
              申请提供服务
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreServiceSection;