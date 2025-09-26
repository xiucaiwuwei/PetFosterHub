import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';


export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
       <main className="flex-grow pt-16">
         {/* 页面标题 */}
         <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">成为宠物供养服务提供者</h1>
              <p className="text-lg text-orange-100 max-w-2xl">
                加入我们的平台，成为宠物服务商家，为宠物主人提供优质商品和服务，同时获得稳定收益
             </p>
           </div>
         </section>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* 商家优势 */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">为什么成为我们的服务提供者</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">庞大用户群体</h3>
                  <p className="text-sm text-gray-500">接触 thousands of 宠物主人，扩大您的客户基础</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">稳定收益来源</h3>
                  <p className="text-sm text-gray-500">灵活定价，低平台佣金，高利润空间</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5">
                  <i className="fa-solid fa-shield"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">安全交易保障</h3>
                  <p className="text-sm text-gray-500">平台担保交易，确保您的资金安全</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 个人供养者服务 */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">个人供养者服务</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 个人服务卡片 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                  <i className="fa-solid fa-home text-white text-6xl"></i>
                </div>
                 <div className="p-6">
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">家庭供养服务</h3>
                   <p className="text-gray-600 mb-4">
                    在自己家中为宠物提供临时寄养服务，给予宠物家庭般的关爱和照顾。
                   </p>
                   <Link 
                     to="/apply-foster"
                     className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition duration-150 ease-in-out inline-block text-center"
                   >
                     申请成为寄养者
                   </Link>
                </div>
              </div>
              
               {/* 个人服务卡片 2 */}
               <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                 <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                   <i className="fa-solid fa-walking text-white text-6xl"></i>
                 </div>
                 <div className="p-6">
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">宠物上门照顾</h3>
                   <p className="text-gray-600 mb-4">
                     提供上门喂养、遛狗、宠物陪伴等服务，让宠物在熟悉环境中得到照顾。
                   </p>
                   <Link 
                     to="/apply-service"
                     className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition duration-150 ease-in-out inline-block text-center"
                   >
                     申请提供服务
                   </Link>
                 </div>
               </div>
              
              {/* 个人服务卡片 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-shower text-white text-6xl"></i>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">宠物美容服务</h3>
                  <p className="text-gray-600 mb-4">
                    提供专业宠物美容服务，包括洗澡、剪毛、指甲修剪等，让宠物保持整洁美观。
                  </p>
                  <Link 
                    to="/apply-service"
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition duration-150 ease-in-out inline-block text-center"
                  >
                    申请提供服务
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* 店铺供应服务 */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">店铺供应服务</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 店铺服务卡片 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-box-open text-white text-6xl"></i>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">宠物食品供应</h3>
                  <p className="text-gray-600 mb-4">
                    提供优质宠物食品批发与零售服务，包括干粮、湿粮、零食和特殊饮食配方。
                  </p>
                  <Link to="/apply-service" className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition duration-150 ease-in-out inline-block text-center">
135|                    申请提供服务
136|                  </Link>
                </div>
              </div>
              
              {/* 店铺服务卡片 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-indigo-400 to-indigo-600 flex items-center justify-center">
                  <i className="fa-solid fa-store text-white text-6xl"></i>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">宠物用品销售</h3>
                  <p className="text-gray-600 mb-4">
                    销售宠物日常用品，包括玩具、窝垫、牵引绳、 grooming 工具和服饰等。
                  </p>
                  <button className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition duration-150 ease-in-out">
                    申请提供服务
                  </button>
                </div>
              </div>
              
              {/* 店铺服务卡片 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                  <i className="fa-solid fa-stethoscope text-white text-6xl"></i>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">宠物医疗服务</h3>
                  <p className="text-gray-600 mb-4">
                    提供宠物医疗咨询、健康检查、疫苗接种、疾病治疗等专业兽医服务。
                  </p>
                  <button className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out">
                    申请提供服务
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}