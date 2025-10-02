import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {stepNames.map((name, index) => (
          <div key={index} className="flex-1 text-center relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors duration-300 ${currentStep > index + 1 ? 'bg-green-500 text-white' : currentStep === index + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {currentStep > index + 1 ? (
                <i className="fa-solid fa-check"></i>
              ) : (
                index + 1
              )}
            </div>
            <span className={`text-sm ${currentStep === index + 1 ? 'font-medium text-orange-500' : 'text-gray-500'}`}>
              {name}
            </span>
          </div>
        ))}
      </div>
      
      {/* 连接线 */}
      <div className="relative h-1 bg-gray-200 -mt-12 mb-16">
        {Array.from({ length: totalSteps - 1 }).map((_, index) => (
          <div 
            key={index} 
            className={`absolute h-full bg-orange-500 transition-all duration-300`}
            style={{ width: currentStep > index + 1 ? '100%' : '0%', left: `${(100 / (totalSteps - 1)) * index}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;