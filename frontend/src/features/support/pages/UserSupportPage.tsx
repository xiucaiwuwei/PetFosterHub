import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SupportForm, SupportList } from '../components';
import { useCreateSupportRequest, useSupportRequests } from '../hooks';
import { toast } from 'react-toastify';
import { SupportRequestDto, SupportResponseDto } from '../types';

const UserSupportPage: React.FC = () => {
  const { supportRequests, loading, error, refreshSupportRequests } = useSupportRequests();
  const { createSupportRequest, isSubmitting } = useCreateSupportRequest();
  const [activeTab, setActiveTab] = useState<'new' | 'my'>('new');

  const handleSubmitSupportRequest = async (requestData: SupportRequestDto) => {
    try {
      await createSupportRequest(requestData);
      toast.success('支持请求已提交成功！');
      setActiveTab('my');
      refreshSupportRequests();
    } catch (error) {
      toast.error('提交支持请求失败，请重试');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* 页面标题 */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">获取支持</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              我们的支持团队随时为您提供帮助。提交您的问题，我们会尽快回复您。
            </p>
          </div>
        </section>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 标签页切换 */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                提交新请求
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'my' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                我的请求
              </button>
            </div>
          </div>

          {/* 标签页内容 */}
          {activeTab === 'new' ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <SupportForm onSubmit={handleSubmitSupportRequest} isSubmitting={isSubmitting} />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <SupportList 
                supportRequests={supportRequests}
                loading={loading}
                error={error}
                onRefresh={refreshSupportRequests}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserSupportPage;