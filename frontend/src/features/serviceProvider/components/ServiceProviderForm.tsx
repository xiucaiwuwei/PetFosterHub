import useApplyServiceProvider from '../hooks/useApplyServiceProvider';
import FormStepIndicator from './FormStepIndicator';
import FormStepsContent from './FormStepsContent';
import SuccessPage from './SuccessPage';

/**
 * 服务提供者申请表单组件
 * 整合表单状态管理和各个步骤的内容展示
 */
const ServiceProviderForm = () => {
  const {
    currentStep,
    formData,
    isSubmitting,
    submitSuccess,
    formErrors,
    activeImageIndex,
    handleChange,
    handleFileUpload,
    removeImage,
    handleSubmit,
    goToStep,
    returnToHome,
    setSubmitSuccess
  } = useApplyServiceProvider();
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      {submitSuccess ? (
        <SuccessPage onBack={() => setSubmitSuccess(false)} onReturnToHome={returnToHome} />
      ) : (
        <>
          <FormStepIndicator currentStep={currentStep} totalSteps={4} />
          
          <div className="px-6 py-8">
            <FormStepsContent
              currentStep={currentStep}
              formData={formData}
              formErrors={formErrors}
              activeImageIndex={activeImageIndex}
              handleChange={handleChange}
              handleFileUpload={handleFileUpload}
              removeImage={removeImage}
            />
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-between border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <i className="fa-solid fa-arrow-left mr-1"></i>
                上一步
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => goToStep(currentStep + 1)}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                下一步
                <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    提交中...
                  </>
                ) : (
                  <>
                    提交申请
                    <i className="fa-solid fa-paper-plane ml-1"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default ServiceProviderForm;