interface SuccessPageProps {
  onBackToHome?: () => void;
}

/**
 * 申请提交成功页面组件
 * 用于在服务提供者申请成功后显示确认信息
 */
const SuccessPage = ({ onBackToHome }: SuccessPageProps) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="bg-green-100 text-green-500 rounded-full p-3 inline-flex items-center justify-center mb-6">
            <i className="fa-solid fa-check text-2xl"></i>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">申请已成功提交</h2>
          
          <p className="text-gray-600 mb-8">
            感谢您申请成为我们的服务提供者！我们已收到您的申请，
            工作人员将在3-5个工作日内完成审核。审核结果将通过短信通知您，
            请保持手机畅通。
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-medium text-blue-800 mb-2">申请进度查询</h3>
            <p className="text-sm text-blue-700">
              您可以在个人中心查看申请进度，或拨打客服热线 400-123-4567 咨询。
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full flex justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              返回首页
            </button>
            
            <button
              type="button"
              className="w-full flex justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              查看申请状态
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          如有疑问，请联系客服：
          <a href="mailto:support@petfosterhub.com" className="text-green-600 hover:text-green-700 mx-1">
            support@petfosterhub.com
          </a>
          或拨打
          <a href="tel:4001234567" className="text-green-600 hover:text-green-700 mx-1">
            400-123-4567
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;