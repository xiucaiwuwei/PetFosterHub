/**
 * 寄养申请表单居住环境步骤
 * 收集用户的居住环境信息，包括是否有院子、居住空间大小等
 */
import React from 'react';
import ErrorDisplay from '@/components/forms/ErrorDisplay.tsx';

interface LivingEnvironmentStepProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (name: string, files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
}

const LivingEnvironmentStep: React.FC<LivingEnvironmentStepProps> = ({ 
  formData, 
  errors, 
  onChange, 
  onFileChange,
  onRemoveImage
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

export default LivingEnvironmentStep;