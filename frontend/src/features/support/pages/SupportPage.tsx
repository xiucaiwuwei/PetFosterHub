import { 
  SupportPageHeader, 
  PersonalServiceSection, 
  StoreServiceSection 
} from '../components';

/**
 * 支持页面 - 展示成为宠物服务提供者的相关信息
 */
export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
       <main className="flex-grow">
         {/* 页面标题区域 */}
         <SupportPageHeader />
          
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* 个人供养者服务 */}
          <PersonalServiceSection />
          
          {/* 店铺供应服务 */}
          <StoreServiceSection />

        </div>
      </main>
    </div>
  );
}