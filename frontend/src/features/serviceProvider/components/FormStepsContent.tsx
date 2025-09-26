import { ServiceType } from '../types/enums';
import ApplicationSummary from './ApplicationSummary';

interface FormStepsContentProps {
  currentStep: number;
  formData: Record<string, any>;
  formErrors: Record<string, string>;
  activeImageIndex: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

/**
 * 渲染错误提示
 */
const renderError = (fieldName: string, errors: Record<string, string>) => {
  if (errors[fieldName]) {
    return (
      <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
    );
  }
  return null;
};

/**
 * 表单步骤内容组件
 * 根据当前步骤显示不同的表单内容
 */
const FormStepsContent = ({ 
  currentStep, 
  formData, 
  formErrors, 
  activeImageIndex, 
  handleChange, 
  handleFileUpload, 
  removeImage 
}: FormStepsContentProps) => {
  // 渲染步骤内容
  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="请输入您的真实姓名"
              />
              {renderError('name', formErrors)}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                手机号码 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.phone ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="请输入您的手机号码"
              />
              {renderError('phone', formErrors)}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                电子邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="请输入您的电子邮箱"
              />
              {renderError('email', formErrors)}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">
                身份证号码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="idCard"
                name="idCard"
                value={formData.idCard || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.idCard ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="请输入您的身份证号码"
              />
              <p className="mt-1 text-xs text-gray-500">
                我们将对您的身份信息严格保密，仅用于身份验证
              </p>
              {renderError('idCard', formErrors)}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                详细地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.address ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="请输入您的详细服务地址"
              />
              {renderError('address', formErrors)}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">身份证照片上传</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="idCardFront" className="block text-sm font-medium text-gray-700 mb-1">
                  身份证正面 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <i className="fa-solid fa-id-card text-3xl text-gray-400"></i>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="idCardFront"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-500 hover:text-green-600 focus-within:outline-none"
                      >
                        <span>上传照片</span>
                        <input id="idCardFront" name="idCardFront" type="file" className="sr-only" accept="image/*" onChange={handleFileUpload} />
                      </label>
                      <p className="pl-1">或拖放文件</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (最大 10MB)
                    </p>
                  </div>
                </div>
                {renderError('idCardFront', formErrors)}
              </div>
              
              <div>
                <label htmlFor="idCardBack" className="block text-sm font-medium text-gray-700 mb-1">
                  身份证反面 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <i className="fa-solid fa-id-card text-3xl text-gray-400"></i>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="idCardBack"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-500 hover:text-green-600 focus-within:outline-none"
                      >
                        <span>上传照片</span>
                        <input id="idCardBack" name="idCardBack" type="file" className="sr-only" accept="image/*" onChange={handleFileUpload} />
                      </label>
                      <p className="pl-1">或拖放文件</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (最大 10MB)
                    </p>
                  </div>
                </div>
                {renderError('idCardBack', formErrors)}
              </div>
            </div>
          </div>
        </div>
      );
    
    case 2:
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">服务详情</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                服务类型 <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.serviceType ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              >
                <option value="">请选择服务类型</option>
                <option value={ServiceType.PET_SITTING}>宠物上门照顾</option>
                <option value={ServiceType.DOG_WALKING}>宠物外出遛弯</option>
                <option value={ServiceType.PET_GROOMING}>宠物美容服务</option>
                <option value={ServiceType.MULTI_SERVICE}>多项服务</option>
              </select>
              {renderError('serviceType', formErrors)}
            </div>
            
            <div className="flex items-center">
              <input
                id="hasExperience"
                name="hasExperience"
                type="checkbox"
                checked={formData.hasExperience || false}
                onChange={handleChange}
                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="hasExperience" className="ml-3 block text-sm font-medium text-gray-700">
                我有相关服务经验
              </label>
            </div>
            
            {(formData.hasExperience || false) && (
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                  服务经验年限
                </label>
                <select
                  id="experienceYears"
                  name="experienceYears"
                  value={formData.experienceYears || ''}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">请选择经验年限</option>
                  <option value="less1">1年以内</option>
                  <option value="1-3">1-3年</option>
                  <option value="3-5">3-5年</option>
                  <option value="more5">5年以上</option>
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="serviceDesc" className="block text-sm font-medium text-gray-700 mb-1">
                服务特色描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="serviceDesc"
                name="serviceDesc"
                rows={4}
                value={formData.serviceDesc || ''}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  formErrors.serviceDesc ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                placeholder="请描述您的服务特色，例如服务流程、特殊技能、过往经验等"
              ></textarea>
              {renderError('serviceDesc', formErrors)}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">服务环境/成果展示照片</h3>
            <label htmlFor="servicePhotos" className="block text-sm font-medium text-gray-700 mb-1">
              上传服务相关照片 (至少2张)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <i className="fa-solid fa-camera text-3xl text-gray-400"></i>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="servicePhotos"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-500 hover:text-green-600 focus-within:outline-none"
                  >
                    <span>上传照片</span>
                    <input id="servicePhotos" name="servicePhotos" type="file" multiple className="sr-only" accept="image/*" onChange={handleFileUpload} />
                  </label>
                  <p className="pl-1">或拖放文件</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG (最大 10MB 每张，最多 10 张)
                </p>
              </div>
            </div>
            
            {renderError('servicePhotos', formErrors)}
            
            {formData.servicePhotos && formData.servicePhotos.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">已上传照片</h4>
                <div className="grid grid-cols-4 gap-3">
                  {(formData.servicePhotos || []).map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                        <img
                          src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                          alt={`服务照片 ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    
    case 3:
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">服务时间与定价</h3>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">可用服务时间</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="availableWeekdays"
                  name="availableWeekdays"
                  type="checkbox"
                  checked={formData.availableWeekdays || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="availableWeekdays" className="ml-3 block text-sm font-medium text-gray-700">
                  工作日 (周一至周五)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="availableWeekends"
                  name="availableWeekends"
                  type="checkbox"
                  checked={formData.availableWeekends || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="availableWeekends" className="ml-3 block text-sm font-medium text-gray-700">
                  周末 (周六至周日)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="availableEvenings"
                  name="availableEvenings"
                  type="checkbox"
                  checked={formData.availableEvenings || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="availableEvenings" className="ml-3 block text-sm font-medium text-gray-700">
                  晚间服务 (晚上7点后)
                </label>
              </div>
            </div>
            
            {renderError('availability', formErrors)}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">服务定价</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                  基础服务价格 (元) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice || ''}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    formErrors.basePrice ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="请输入基础服务价格"
                />
                <p className="mt-1 text-xs text-gray-500">
                  根据服务类型填写基础价格，例如：上门照顾每次价格或遛狗每小时价格
                </p>
                {renderError('basePrice', formErrors)}
              </div>
              
              <div>
                <label htmlFor="additionalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  附加服务价格 (元)
                </label>
                <input
                  type="number"
                  id="additionalPrice"
                  name="additionalPrice"
                  value={formData.additionalPrice || ''}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="请输入附加服务价格（可选）"
                />
                <p className="mt-1 text-xs text-gray-500">
                  如额外宠物、特殊护理等附加服务的价格，无附加服务可不填
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">紧急联系人</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName || ''}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    formErrors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="请输入紧急联系人姓名"
                />
                {renderError('emergencyContactName', formErrors)}
              </div>
              
              <div>
                <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  手机号码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone || ''}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    formErrors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="请输入紧急联系人手机号码"
                />
                {renderError('emergencyContactPhone', formErrors)}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  其他补充信息
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={3}
                  value={formData.additionalInfo || ''}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="如有其他需要说明的信息，请在此填写"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 4:
      return (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
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
          
          <ApplicationSummary formData={formData} />
        </div>
      );
    
    default:
      return null;
  }
};

export default FormStepsContent;