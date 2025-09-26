import React from 'react';

interface PetInfoFormProps {
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  symptoms: string;
  errors: Record<string, string>;
  onPetNameChange: (value: string) => void;
  onPetTypeChange: (value: 'dog' | 'cat' | 'other') => void;
  onPetAgeChange: (value: string) => void;
  onSymptomsChange: (value: string) => void;
}

const PetInfoForm: React.FC<PetInfoFormProps> = ({
  petName,
  petType,
  petAge,
  symptoms,
  errors,
  onPetNameChange,
  onPetTypeChange,
  onPetAgeChange,
  onSymptomsChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          宠物名称
        </label>
        <input
          type="text"
          value={petName}
          onChange={(e) => onPetNameChange(e.target.value)}
          className={`block w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
            errors.petName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
          }`}
          placeholder="请输入宠物名称"
        />
        {errors.petName && (
          <p className="mt-1 text-sm text-red-600">{errors.petName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          宠物类型
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onPetTypeChange('dog')}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex flex-col items-center ${
              petType === 'dog'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <i className="fa-solid fa-dog text-xl mb-1"></i>
            狗狗
          </button>
          <button
            type="button"
            onClick={() => onPetTypeChange('cat')}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex flex-col items-center ${
              petType === 'cat'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <i className="fa-solid fa-cat text-xl mb-1"></i>
            猫咪
          </button>
          <button
            type="button"
            onClick={() => onPetTypeChange('other')}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex flex-col items-center ${
              petType === 'other'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <i className="fa-solid fa-paw text-xl mb-1"></i>
            其他
          </button>
        </div>
        {errors.petType && (
          <p className="mt-1 text-sm text-red-600">{errors.petType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          宠物年龄 (岁)
        </label>
        <input
          type="text"
          value={petAge}
          onChange={(e) => onPetAgeChange(e.target.value)}
          className={`block w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
            errors.petAge ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
          }`}
          placeholder="请输入宠物年龄"
        />
        {errors.petAge && (
          <p className="mt-1 text-sm text-red-600">{errors.petAge}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          症状描述
        </label>
        <textarea
          value={symptoms}
          onChange={(e) => onSymptomsChange(e.target.value)}
          rows={4}
          className={`block w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
            errors.symptoms ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
          }`}
          placeholder="请简要描述宠物的症状或需要咨询的问题..."
        ></textarea>
        {errors.symptoms && (
          <p className="mt-1 text-sm text-red-600">{errors.symptoms}</p>
        )}
      </div>
    </div>
  );
};

export default PetInfoForm;