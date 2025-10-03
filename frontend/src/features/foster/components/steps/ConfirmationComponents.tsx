/**
 * 寄养申请表单确认步骤组件
 * 展示用户填写的所有申请信息，供用户确认和提交
 */
import React from 'react';
import ErrorDisplay from '@/components/forms/ErrorDisplay.tsx';

/**
 * 寄养申请表单确认步骤
 * 展示用户填写的所有申请信息，供用户确认和提交
 */
interface ConfirmationStepProps {
  formData: any;
  errors: Record<string, string>;
  onFileChange: (name: string, files: FileList | null) => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, errors, onFileChange }) => {
  // 格式化居住空间大小
  const formatLivingSpace = () => {
    switch (formData.livingSpace) {
      case 'small': return '小型 (< 60㎡)';
      case 'medium': return '中型 (60-100㎡)';
      case 'large': return '大型 (100-150㎡)';
      case 'xlarge': return '超大 (> 150㎡)';
      default: return '';
    }
  };

  // 格式化宠物经验
  const formatPetExperience = () => {
    switch (formData.petExperience) {
      case 'beginner': return '新手';
      case 'intermediate': return '有经验';
      case 'advanced': return '资深';
      case 'professional': return '专业';
      default: return '';
    }
  };

  // 格式化最长寄养天数
  const formatMaxDays = () => {
    switch (formData.maxDays) {
      case '7': return '1周以内';
      case '14': return '2周以内';
      case '30': return '1个月以内';
      case '60': return '2个月以内';
      case 'unlimited': return '不限';
      default: return '';
    }
  };

  return (
    <div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fa-solid fa-info-circle text-green-500 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">提交前请确认</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>请确保您提供的所有信息真实有效，我们将在3-5个工作日内完成审核。审核通过后，您将收到短信通知。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">申请信息摘要</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            请确认以下信息无误，提交后将无法修改。
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">基本信息</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>{formData.name} ({formData.phone})</p>
                <p>{formData.email}</p>
                <p>{formData.address}</p>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">居住环境</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>{formatLivingSpace()}{formData.hasYard && '，带院子/露台'}</p>
                <p>宠物经验: {formatPetExperience()}</p>
                <p>环境照片: {formData.livingEnvPhotos.length} 张</p>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">可接受宠物</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  {formData.acceptDog && <li>狗狗</li>}
                  {formData.acceptCat && <li>猫咪</li>}
                  {formData.acceptSmallPet && <li>小型宠物 (仓鼠、兔子等)</li>}
                  {formData.acceptOther && (
                    <li>其他宠物: {formData.customPetType || '未指定'}</li>
                  )}
                </ul>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">服务信息</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>每日价格: ¥{formData.dailyPrice} /天</p>
                <p>最长寄养: {formatMaxDays()}</p>
                <p className="mt-1 font-medium">服务特色:</p>
                <p className="mt-0.5">{formData.serviceDesc}</p>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">紧急联系人</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>{formData.emergencyContactName} ({formData.emergencyContactPhone})</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          身份证照片 <span className="text-red-500">*</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 身份证正面 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors">
            <p className="text-sm text-gray-500 mb-2">身份证正面</p>
            {formData.idCardFront ? (
              <div className="relative">
                <img 
                  src={URL.createObjectURL(formData.idCardFront)} 
                  alt="身份证正面" 
                  className="max-w-full h-auto rounded-md border border-gray-200 mx-auto"
                />
              </div>
            ) : (
              <>
                <i className="fa-solid fa-id-card text-gray-400 text-4xl mb-2"></i>
                <p className="text-xs text-gray-400 mb-2">点击上传身份证正面照片</p>
                <input
                  type="file"
                  name="idCardFront"
                  accept="image/jpeg,image/png"
                  onChange={(e) => onFileChange('idCardFront', e.target.files)}
                  className="hidden"
                  id="idCardFront"
                />
                <label
                  htmlFor="idCardFront"
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 cursor-pointer"
                >
                  上传照片
                </label>
              </>
            )}
            <ErrorDisplay errors={errors} fieldName="idCardFront" />
          </div>
          
          {/* 身份证反面 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors">
            <p className="text-sm text-gray-500 mb-2">身份证反面</p>
            {formData.idCardBack ? (
              <div className="relative">
                <img 
                  src={URL.createObjectURL(formData.idCardBack)} 
                  alt="身份证反面" 
                  className="max-w-full h-auto rounded-md border border-gray-200 mx-auto"
                />
              </div>
            ) : (
              <>
                <i className="fa-solid fa-id-card text-gray-400 text-4xl mb-2"></i>
                <p className="text-xs text-gray-400 mb-2">点击上传身份证反面照片</p>
                <input
                  type="file"
                  name="idCardBack"
                  accept="image/jpeg,image/png"
                  onChange={(e) => onFileChange('idCardBack', e.target.files)}
                  className="hidden"
                  id="idCardBack"
                />
                <label
                  htmlFor="idCardBack"
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 cursor-pointer"
                >
                  上传照片
                </label>
              </>
            )}
            <ErrorDisplay errors={errors} fieldName="idCardBack" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 申请提交成功页面组件
 * 寄养申请表单提交成功后显示的页面，包含成功提示和后续操作选项
 */
interface SuccessPageProps {
  onReset: () => void;
  onNavigateHome: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onReset, onNavigateHome }) => {
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