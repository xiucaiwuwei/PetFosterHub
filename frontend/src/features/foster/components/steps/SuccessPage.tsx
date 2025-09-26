import React from 'react';

interface SuccessPageProps {
  onReset: () => void;
  onNavigateHome: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onReset, onNavigateHome }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fa-solid fa-check text-green-500 text-3xl"></i>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">申请提交成功！</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        感谢您申请成为寄养服务提供者，我们将在3-5个工作日内完成审核。审核结果将通过短信通知您，请保持手机畅通。
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          返回修改
        </button>
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;