import React from 'react';
import ErrorDisplay from '@/components/forms/ErrorDisplay.tsx';

interface PetTypeStepProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomPetTypeChange: (value: string) => void;
}

const PetTypeStep: React.FC<PetTypeStepProps> = ({ 
  formData, 
  errors, 
  onChange,
  onCustomPetTypeChange
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

export default PetTypeStep;