/**
 * 寄养申请表单步骤组件集合
 * 包含基本信息、可接受宠物类型、居住环境和服务信息等表单步骤
 */
import React from 'react';
import ErrorDisplay from '@/components/forms/ErrorDisplay.tsx';

/**
 * 寄养申请表单基本信息步骤
 * 收集用户的姓名、联系方式等基本信息
 */
export const BasicInfoStep = ({ 
  formData,
  errors,
  onChange 
}: { 
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">基本信息</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入您的真实姓名"
          />
          <ErrorDisplay errors={errors} fieldName="name" />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">手机号码 <span className="text-red-500">*</span></label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入手机号码"
          />
          <ErrorDisplay errors={errors} fieldName="phone" />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">电子邮箱 <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入电子邮箱"
          />
          <ErrorDisplay errors={errors} fieldName="email" />
        </div>
        
        <div>
          <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">身份证号码 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="idCard"
            name="idCard"
            value={formData.idCard}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.idCard ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入身份证号码"
          />
          <ErrorDisplay errors={errors} fieldName="idCard" />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">详细地址 <span className="text-red-500">*</span></label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            rows={3}
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入详细地址，以便我们了解服务区域"
          />
          <ErrorDisplay errors={errors} fieldName="address" />
        </div>
      </div>
    </div>
  );
};

/**
 * 寄养申请表单宠物类型步骤
 * 收集用户可接受的宠物类型信息
 */
export const PetTypeStep = ({ 
  formData,
  errors,
  onChange,
  onCustomPetTypeChange 
}: { 
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomPetTypeChange: (value: string) => void;
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">可接受宠物类型</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="acceptDog"
              name="acceptDog"
              checked={formData.acceptDog}
              onChange={onChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptDog" className="ml-2 block text-sm font-medium text-gray-700">
              狗狗
            </label>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="acceptCat"
              name="acceptCat"
              checked={formData.acceptCat}
              onChange={onChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptCat" className="ml-2 block text-sm font-medium text-gray-700">
              猫咪
            </label>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="acceptSmallPet"
              name="acceptSmallPet"
              checked={formData.acceptSmallPet}
              onChange={onChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptSmallPet" className="ml-2 block text-sm font-medium text-gray-700">
              小型宠物 (仓鼠、兔子等)
            </label>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="acceptOther"
              name="acceptOther"
              checked={formData.acceptOther}
              onChange={onChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptOther" className="ml-2 block text-sm font-medium text-gray-700">
              其他宠物
            </label>
          </div>
          
          {formData.acceptOther && (
            <div className="ml-6 mt-2">
              <input
                type="text"
                value={formData.customPetType}
                onChange={(e) => onCustomPetTypeChange(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.customPetType ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="请输入其他宠物类型"
              />
              <ErrorDisplay errors={errors} fieldName="customPetType" />
            </div>
          )}
        </div>
        
        {errors.acceptDog && (
          <p className="mt-1 text-red-500 text-sm">{errors.acceptDog}</p>
        )}
      </div>
    </div>
  );
};

/**
 * 寄养申请表单居住环境步骤
 * 收集用户的居住环境信息，包括是否有院子、居住空间大小等
 */
export const LivingEnvironmentStep = ({ 
  formData,
  errors,
  onChange,
  onFileChange,
  onRemoveImage 
}: { 
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (name: string, files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">居住环境</h2>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasYard"
            name="hasYard"
            checked={formData.hasYard}
            onChange={onChange}
            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="hasYard" className="ml-2 block text-sm font-medium text-gray-700">
            有院子/露台
          </label>
        </div>
        
        <div>
          <label htmlFor="livingSpace" className="block text-sm font-medium text-gray-700 mb-1">
            居住空间大小 <span className="text-red-500">*</span>
          </label>
          <select
            id="livingSpace"
            name="livingSpace"
            value={formData.livingSpace}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.livingSpace ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          >
            <option value="">请选择</option>
            <option value="small">小型 (&lt; 60㎡)</option>
            <option value="medium">中型 (60-100㎡)</option>
            <option value="large">大型 (100-150㎡)</option>
            <option value="xlarge">超大 (&gt; 150㎡)</option>
          </select>
          <ErrorDisplay errors={errors} fieldName="livingSpace" />
        </div>
        
        <div>
          <label htmlFor="petExperience" className="block text-sm font-medium text-gray-700 mb-1">
            宠物饲养经验 <span className="text-red-500">*</span>
          </label>
          <select
            id="petExperience"
            name="petExperience"
            value={formData.petExperience}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.petExperience ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          >
            <option value="">请选择</option>
            <option value="beginner">新手</option>
            <option value="intermediate">有经验</option>
            <option value="advanced">资深</option>
            <option value="professional">专业</option>
          </select>
          <ErrorDisplay errors={errors} fieldName="petExperience" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            居住环境照片 <span className="text-red-500">*</span>
          </label>
          
          {/* 已上传照片预览 */}
          {formData.livingEnvPhotos.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {formData.livingEnvPhotos.map((file: File, index: number) => {
                const fileURL = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative w-24 h-24">
                    <img 
                      src={fileURL} 
                      alt={`居住环境照片 ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 上传区域 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
            <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-2xl mb-2"></i>
            <p className="text-sm text-gray-500 mb-2">拖放照片到此处，或点击上传</p>
            <p className="text-xs text-gray-400">支持 JPG、PNG 格式，最多上传 5 张</p>
            <input
              type="file"
              name="livingEnvPhotos"
              multiple
              accept="image/jpeg,image/png"
              onChange={(e) => onFileChange('livingEnvPhotos', e.target.files)}
              className="hidden"
              id="livingEnvPhotos"
            />
            <label
              htmlFor="livingEnvPhotos"
              className="inline-block px-4 py-2 mt-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 cursor-pointer"
            >
              上传照片
            </label>
          </div>
          <ErrorDisplay errors={errors} fieldName="livingEnvPhotos" />
        </div>
      </div>
    </div>
  );
};

/**
 * 寄养申请表单服务信息步骤
 * 收集用户提供的寄养服务价格、服务描述等信息
 */
export const ServiceInfoStep = ({ 
  formData,
  errors,
  onChange 
}: { 
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">服务信息</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="dailyPrice" className="block text-sm font-medium text-gray-700 mb-1">
            每日寄养价格（元） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="dailyPrice"
            name="dailyPrice"
            value={formData.dailyPrice}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.dailyPrice ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请输入每日寄养价格"
            min="0"
            step="0.01"
          />
          <ErrorDisplay errors={errors} fieldName="dailyPrice" />
        </div>
        
        <div>
          <label htmlFor="maxDays" className="block text-sm font-medium text-gray-700 mb-1">
            最长可寄养天数 <span className="text-red-500">*</span>
          </label>
          <select
            id="maxDays"
            name="maxDays"
            value={formData.maxDays}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${errors.maxDays ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          >
            <option value="">请选择</option>
            <option value="7">1周以内</option>
            <option value="14">2周以内</option>
            <option value="30">1个月以内</option>
            <option value="60">2个月以内</option>
            <option value="unlimited">不限</option>
          </select>
          <ErrorDisplay errors={errors} fieldName="maxDays" />
        </div>
        
        <div>
          <label htmlFor="serviceDesc" className="block text-sm font-medium text-gray-700 mb-1">
            服务特色描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="serviceDesc"
            name="serviceDesc"
            value={formData.serviceDesc}
            onChange={onChange}
            rows={4}
            className={`w-full px-3 py-2 border ${errors.serviceDesc ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            placeholder="请描述您能提供的服务特色，如遛狗、喂食、陪玩等"
          />
          <ErrorDisplay errors={errors} fieldName="serviceDesc" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">紧急联系人</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                联系人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={onChange}
                className={`w-full px-3 py-2 border ${errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="请输入紧急联系人姓名"
              />
              <ErrorDisplay errors={errors} fieldName="emergencyContactName" />
            </div>
            
            <div>
              <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={onChange}
                className={`w-full px-3 py-2 border ${errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="请输入紧急联系人电话"
              />
              <ErrorDisplay errors={errors} fieldName="emergencyContactPhone" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};