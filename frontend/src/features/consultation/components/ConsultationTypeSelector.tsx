import React from 'react';

interface ConsultationTypeSelectorProps {
  consultationType: 'video' | 'text';
  onTypeChange: (type: 'video' | 'text') => void;
  errors?: Record<string, string>;
}

const ConsultationTypeSelector: React.FC<ConsultationTypeSelectorProps> = ({
  consultationType,
  onTypeChange,
  errors
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        问诊方式
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTypeChange('video')}
          className={`py-3 px-4 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex items-center justify-center ${
            consultationType === 'video'
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <i className="fa-solid fa-video mr-2"></i>
          视频问诊
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('text')}
          className={`py-3 px-4 rounded-lg text-sm font-medium transition duration-150 ease-in-out flex items-center justify-center ${
            consultationType === 'text'
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <i className="fa-solid fa-comment mr-2"></i>
          文字问诊
        </button>
      </div>
      {errors?.consultationType && (
        <p className="mt-1 text-sm text-red-600">{errors.consultationType}</p>
      )}
    </div>
  );
};

export default ConsultationTypeSelector;