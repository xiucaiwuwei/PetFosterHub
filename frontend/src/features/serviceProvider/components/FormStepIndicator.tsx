/**
 * 表单步骤指示器组件
 * 显示当前进度和各步骤名称
 */
interface FormStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const FormStepIndicator = ({ currentStep, totalSteps }: FormStepIndicatorProps) => {
  // 步骤名称映射
  const stepNames = {
    1: '基本信息',
    2: '服务详情',
    3: '服务时间与定价',
    4: '提交审核'
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep > step ? 'bg-green-500 text-white' : 
              currentStep === step ? 'bg-green-500 text-white ring-4 ring-green-100' : 
              'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > step ? (
                <i className="fa-solid fa-check"></i>
              ) : (
                step
              )}
            </div>
            <span className={`text-xs mt-2 ${
              currentStep >= step ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}>
              {stepNames[step] || `步骤 ${step}`}
            </span>
          </div>
        ))}
      </div>
      
      {/* 连接线 */}
      <div className="relative mt-[-2.5rem] z-[-1]">
        <div className="absolute left-[5.5rem] right-[5.5rem] h-1 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FormStepIndicator;