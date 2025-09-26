import React, { useState } from 'react';
import React from 'react';
import { 
  StepIndicator,
  BasicInfoStep,
  LivingEnvironmentStep,
  PetTypeStep,
  ServiceInfoStep,
  ConfirmationStep,
  SuccessPage
} from './steps';
import { useFosterApply } from '../hooks/useFosterApply';

interface ApplyFosterFormProps {
  onSubmitSuccess?: () => void;
}

const ApplyFosterForm: React.FC<ApplyFosterFormProps> = ({ onSubmitSuccess }) => {
  // 使用自定义 Hook 管理表单状态和逻辑
  const {
    formData,
    errors,
    currentStep,
    isSubmitting,
    submitSuccess,
    onChange,
    handleFileChange,
    handleRemoveImage,
    handleCustomPetTypeChange,
    goToStep,
    handleSubmit,
    resetForm,
    navigateToHome
  } = useFosterApply({ onSubmitSuccess });

  // 步骤名称
  const STEP_NAMES = ['基本信息', '居住环境', '宠物类型', '服务信息', '确认提交'];

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onChange={onChange}
          />
        );
      case 2:
        return (
          <LivingEnvironmentStep
            formData={formData}
            errors={errors}
            onChange={onChange}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
          />
        );
      case 3:
        return (
          <PetTypeStep
            formData={formData}
            errors={errors}
            onChange={onChange}
            onCustomPetTypeChange={handleCustomPetTypeChange}
          />
        );
      case 4:
        return (
          <ServiceInfoStep
            formData={formData}
            errors={errors}
            onChange={onChange}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            formData={formData}
            errors={errors}
            onFileChange={handleFileChange}
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
            <option value="large">100-150平米</option>
            <option value="xlarge">150平米以上</option>
          </select>
          {formErrors.livingSpace && <p className="mt-1 text-red-500 text-sm">{formErrors.livingSpace}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="petExperience" className="block text-sm font-medium text-gray-700 mb-1">宠物经验</label>
          <select
            id="petExperience"
            name="petExperience"
            value={formData.petExperience}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.petExperience ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          >
            <option value="">请选择</option>
            <option value="none">无经验</option>
            <option value="beginner">初学者（1年以内）</option>
            <option value="intermediate">中级（1-3年）</option>
            <option value="advanced">高级（3年以上）</option>
            <option value="professional">专业人士</option>
          </select>
          {formErrors.petExperience && <p className="mt-1 text-red-500 text-sm">{formErrors.petExperience}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">可接受的宠物类型</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptDog"
                name="acceptDog"
                checked={formData.acceptDog}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptDog" className="ml-2 block text-sm text-gray-700">
                <i className="fa-solid fa-dog mr-1"></i> 狗狗
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptCat"
                name="acceptCat"
                checked={formData.acceptCat}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptCat" className="ml-2 block text-sm text-gray-700">
                <i className="fa-solid fa-cat mr-1"></i> 猫咪
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptSmallPet"
                name="acceptSmallPet"
                checked={formData.acceptSmallPet}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptSmallPet" className="ml-2 block text-sm text-gray-700">
                <i className="fa-solid fa-hamster mr-1"></i> 小型宠物（兔子、仓鼠等）
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptOther"
                name="acceptOther"
                checked={formData.acceptOther}
                onChange={(e) => {
                  handleChange(e);
                  setShowCustomPetType(e.target.checked);
                }}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptOther" className="ml-2 block text-sm text-gray-700">
                <i className="fa-solid fa-paw mr-1"></i> 其他
              </label>
            </div>
            
            {showCustomPetType && (
              <div className="ml-6 mt-1">
                <input
                  type="text"
                  id="customPetType"
                  name="customPetType"
                  value={formData.customPetType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${formErrors.customPetType ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  placeholder="请说明可接受的其他宠物类型"
                />
                {formErrors.customPetType && <p className="mt-1 text-red-500 text-sm">{formErrors.customPetType}</p>}
              </div>
            )}
            
            {formErrors.acceptDog && <p className="mt-1 text-red-500 text-sm">{formErrors.acceptDog}</p>}
          </div>
        </div>
      </>
    );
  };

  // 渲染服务信息步骤
  const renderServiceInfoStep = () => {
    return (
      <>
        <div className="mb-4">
          <label htmlFor="dailyPrice" className="block text-sm font-medium text-gray-700 mb-1">日收费标准（元）</label>
          <input
            type="number"
            id="dailyPrice"
            name="dailyPrice"
            value={formData.dailyPrice}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.dailyPrice ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入日收费标准"
            min="0"
            step="0.01"
          />
          {formErrors.dailyPrice && <p className="mt-1 text-red-500 text-sm">{formErrors.dailyPrice}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="maxDays" className="block text-sm font-medium text-gray-700 mb-1">最多可寄养天数</label>
          <input
            type="number"
            id="maxDays"
            name="maxDays"
            value={formData.maxDays}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.maxDays ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入最多可寄养天数"
            min="1"
            step="1"
          />
          {formErrors.maxDays && <p className="mt-1 text-red-500 text-sm">{formErrors.maxDays}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="serviceDesc" className="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
          <textarea
            id="serviceDesc"
            name="serviceDesc"
            value={formData.serviceDesc}
            onChange={handleChange}
            rows={5}
            className={`w-full px-3 py-2 border ${formErrors.serviceDesc ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请详细描述您能提供的寄养服务，包括日常照料、活动安排、特殊技能等"
          />
          {formErrors.serviceDesc && <p className="mt-1 text-red-500 text-sm">{formErrors.serviceDesc}</p>}
        </div>
      </>
    );
  };

  // 渲染上传照片步骤
  const renderUploadPhotosStep = () => {
    return (
      <>
        <div className="mb-4">
          <label htmlFor="idCardFront" className="block text-sm font-medium text-gray-700 mb-1">身份证正面照片</label>
          <div className={`border ${formErrors.idCardFront ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md p-4 text-center`}>
            <input
              type="file"
              id="idCardFront"
              name="idCardFront"
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="idCardFront" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center py-6">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                <span className="text-sm text-gray-500">点击上传或拖拽文件至此处</span>
                <span className="text-xs text-gray-400 mt-1">支持JPG、PNG格式，不超过5MB</span>
              </div>
            </label>
            {formData.idCardFront && (
              <div className="mt-2 text-sm text-gray-700">
                <i className="fa-solid fa-check-circle text-green-500 mr-1"></i> {formData.idCardFront.name}
              </div>
            )}
          </div>
          {formErrors.idCardFront && <p className="mt-1 text-red-500 text-sm">{formErrors.idCardFront}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="idCardBack" className="block text-sm font-medium text-gray-700 mb-1">身份证反面照片</label>
          <div className={`border ${formErrors.idCardBack ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md p-4 text-center`}>
            <input
              type="file"
              id="idCardBack"
              name="idCardBack"
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="idCardBack" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center py-6">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                <span className="text-sm text-gray-500">点击上传或拖拽文件至此处</span>
                <span className="text-xs text-gray-400 mt-1">支持JPG、PNG格式，不超过5MB</span>
              </div>
            </label>
            {formData.idCardBack && (
              <div className="mt-2 text-sm text-gray-700">
                <i className="fa-solid fa-check-circle text-green-500 mr-1"></i> {formData.idCardBack.name}
              </div>
            )}
          </div>
          {formErrors.idCardBack && <p className="mt-1 text-red-500 text-sm">{formErrors.idCardBack}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="livingEnvPhotos" className="block text-sm font-medium text-gray-700 mb-1">居住环境照片</label>
          <div className={`border ${formErrors.livingEnvPhotos ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md p-4 text-center`}>
            <input
              type="file"
              id="livingEnvPhotos"
              name="livingEnvPhotos"
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <label htmlFor="livingEnvPhotos" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center py-6">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                <span className="text-sm text-gray-500">点击上传或拖拽文件至此处（可上传多张）</span>
                <span className="text-xs text-gray-400 mt-1">支持JPG、PNG格式，每张不超过5MB，最多上传10张</span>
              </div>
            </label>
            
            {formData.livingEnvPhotos.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {formData.livingEnvPhotos.map((file, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`居住环境 ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-70"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {formErrors.livingEnvPhotos && <p className="mt-1 text-red-500 text-sm">{formErrors.livingEnvPhotos}</p>}
        </div>
      </>
    );
  };

  // 渲染其他信息步骤
  const renderOtherInfoStep = () => {
    return (
      <>
        <div className="mb-4">
          <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">紧急联系人姓名</label>
          <input
            type="text"
            id="emergencyContactName"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.emergencyContactName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入紧急联系人姓名"
          />
          {formErrors.emergencyContactName && <p className="mt-1 text-red-500 text-sm">{formErrors.emergencyContactName}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">紧急联系人电话</label>
          <input
            type="tel"
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入紧急联系人电话"
          />
          {formErrors.emergencyContactPhone && <p className="mt-1 text-red-500 text-sm">{formErrors.emergencyContactPhone}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">其他补充信息</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="如有其他需要说明的信息，请在此填写"
          />
        </div>
        
        <div className="bg-orange-50 p-4 rounded-md mb-4">
          <h4 className="font-medium text-orange-800 mb-2">申请须知</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li><i className="fa-solid fa-circle-info mr-1"></i> 提交申请后，我们将在1-3个工作日内进行审核</li>
            <li><i className="fa-solid fa-circle-info mr-1"></i> 审核通过后，您的寄养服务将会在平台上线</li>
            <li><i className="fa-solid fa-circle-info mr-1"></i> 请确保提供的所有信息真实有效</li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStepIndicator()}
      
      {renderStepContent()}
      
      <div className="flex justify-between pt-4 border-t border-gray-200">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            上一步
          </button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            下一步
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i> 提交中...
              </span>
            ) : (
              '提交申请'
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default ApplyFosterForm;