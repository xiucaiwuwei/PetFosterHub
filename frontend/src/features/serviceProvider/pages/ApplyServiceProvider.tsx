import {Navbar} from '@/components/layout/Navbar.tsx';
import {Footer} from '@/features/home/components/Footer.tsx';
import { ServiceProviderForm } from '../components';

const ApplyServiceProvider = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">申请成为服务提供者</h1>
            <p className="mt-2 text-xl text-gray-500">
              填写以下信息，加入我们的宠物服务平台
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ServiceProviderForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplyServiceProvider;