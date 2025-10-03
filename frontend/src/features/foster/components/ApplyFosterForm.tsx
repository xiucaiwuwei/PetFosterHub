/**
 * 寄养申请表单组件
 * 多步骤表单，用于用户提交寄养服务申请
 */
import React from 'react';
import StepIndicator from '@/components/navigation/StepIndicator.tsx';
import {
    BasicInfoStep,
    LivingEnvironmentStep,
    PetTypeStep,
    ServiceInfoStep,
    ConfirmationStep,
    SuccessPage
} from './steps';
import {useFosterApply} from '../hooks/useFosterApply';

interface ApplyFosterFormProps {
    onSubmitSuccess?: () => void;
}

const ApplyFosterForm: React.FC<ApplyFosterFormProps> = ({onSubmitSuccess}) => {
    // 使用自定义 Hook 管理表单状态和逻辑
    const {
        formData,
        formErrors,
        currentStep,
        isSubmitting,
        submitSuccess,
        handleChange,
        handleFileUpload,
        removeImage,
        goToStep,
        handleSubmit,
        resetForm,
        navigateToHome
    } = useFosterApply();

    // 步骤名称
    const STEP_NAMES = ['基本信息', '居住环境', '宠物类型', '服务信息', '确认提交'];

    // 渲染当前步骤内容
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoStep
                        formData={formData}
                        errors={formErrors}
                        onChange={handleChange}
                    />
                );
            case 2:
                return (
                    <LivingEnvironmentStep
                        formData={formData}
                        errors={formErrors}
                        onChange={handleChange}
                        onFileChange={handleFileUpload}
                        onRemoveImage={removeImage}
                    />
                );
            case 3:
                return (
                    <PetTypeStep
                        formData={formData}
                        errors={formErrors}
                        onChange={handleChange}
                    />
                );
            case 4:
                return (
                    <ServiceInfoStep
                        formData={formData}
                        errors={formErrors}
                        onChange={handleChange}
                    />
                );
            case 5:
                return (
                    <ConfirmationStep
                        formData={formData}
                        errors={formErrors}
                        onFileChange={handleFileUpload}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {submitSuccess ? (
                <SuccessPage
                    onReset={resetForm}
                    onNavigateHome={navigateToHome}
                />
            ) : (
                <form onSubmit={handleSubmit}>
                    <StepIndicator
                        currentStep={currentStep}
                        totalSteps={STEP_NAMES.length}
                        stepNames={STEP_NAMES}
                    />

                    <div className="px-6 py-8">
                        {renderStepContent()}
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-between border-t border-gray-200">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={() => goToStep(currentStep - 1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                <i className="fa-solid fa-arrow-left mr-1"></i>
                                上一步
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={() => goToStep(currentStep + 1)}
                                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                下一步
                                <i className="fa-solid fa-arrow-right ml-1"></i>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>
            )}
        </div>
    );
};

export default ApplyFosterForm;