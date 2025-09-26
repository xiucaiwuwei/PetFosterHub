import React from 'react';
import Navbar from '../../shared/components/Navbar';
import Footer from '../../shared/components/Footer';
import { motion } from 'framer-motion';
import { cn } from '../../shared/utils';

// 导入我们创建的组件
import { 
  VetSelector, 
  DateSelector, 
  TimeSlotSelector, 
  PetInfoForm, 
  ConsultationTypeSelector,
  BookingConfirmation,
  SuccessPage
} from '../components';

// 导入自定义hook
import useConsultationForm from '../hooks/useConsultationForm';

const PetConsultation: React.FC = () => {
  // 使用自定义hook管理表单状态和逻辑
  const {
    // 表单状态
    step,
    selectedVet,
    selectedDate,
    selectedTimeSlot,
    consultationType,
    petName,
    petType,
    petAge,
    symptoms,
    submitSuccess,
    isSubmitting,
    
    // 数据列表
    veterinarians,
    dateOptions,
    timeSlots,
    
    // 错误信息
    errors,
    
    // 操作函数
    setStep,
    setSelectedVet,
    setSelectedDate,
    setSelectedTimeSlot,
    setConsultationType,
    setPetName,
    setPetType,
    setPetAge,
    setSymptoms,
    handleSubmit,
    resetForm
  } = useConsultationForm();

  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between">
          <div className={cn("flex flex-col items-center", step >= 1 ? "text-orange-500" : "text-gray-400")}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200")}>
              1
            </div>
            <span className="text-sm font-medium">选择医生</span>
          </div>
          <div className={cn("hidden md:block flex-1 flex items-center", step >= 2 ? "text-orange-500" : "text-gray-300")}>
            <div className="h-0.5 w-full" style={{ backgroundColor: step >= 2 ? '#f97316' : '#e5e7eb' }}></div>
          </div>
          <div className={cn("flex flex-col items-center", step >= 2 ? "text-orange-500" : "text-gray-400")}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200")}>
              2
            </div>
            <span className="text-sm font-medium">预约信息</span>
          </div>
          <div className={cn("hidden md:block flex-1 flex items-center", step >= 3 ? "text-orange-500" : "text-gray-300")}>
            <div className="h-0.5 w-full" style={{ backgroundColor: step >= 3 ? '#f97316' : '#e5e7eb' }}></div>
          </div>
          <div className={cn("flex flex-col items-center", step >= 3 ? "text-orange-500" : "text-gray-400")}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", step >= 3 ? "bg-orange-500 text-white" : "bg-gray-200")}>
              3
            </div>
            <span className="text-sm font-medium">提交预约</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染步骤内容
  const renderStepContent = () => {
    if (submitSuccess) {
      return (
        <SuccessPage
          selectedVet={selectedVet}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          consultationType={consultationType}
          petName={petName}
          petType={petType}
          petAge={petAge}
          onViewDetails={() => setStep(1)}
          onBookNew={() => {
            resetForm();
          }}
        />
      );
    }

    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">选择问诊医生</h2>
            
            <VetSelector
              veterinarians={veterinarians}
              selectedVet={selectedVet}
              onSelectVet={setSelectedVet}
            />
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedVet || !selectedVet.available}
                className="py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">预约信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择日期
                  </label>
                  <DateSelector
                    dateOptions={dateOptions}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择时间段
                  </label>
                  <TimeSlotSelector
                    timeSlots={timeSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    onSelectTimeSlot={setSelectedTimeSlot}
                  />
                </div>
                
                <ConsultationTypeSelector
                  consultationType={consultationType}
                  onTypeChange={setConsultationType}
                  errors={errors}
                />
              </div>
              
              <PetInfoForm
                petName={petName}
                petType={petType}
                petAge={petAge}
                symptoms={symptoms}
                errors={errors}
                onPetNameChange={setPetName}
                onPetTypeChange={setPetType}
                onPetAgeChange={setPetAge}
                onSymptomsChange={setSymptoms}
              />
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
              >
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedVet || !selectedDate || !selectedTimeSlot || !petName || !petAge || !symptoms || Object.keys(errors).length > 0}
                className="py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">确认预约信息</h2>
            
            <BookingConfirmation
              selectedVet={selectedVet}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              consultationType={consultationType}
              petName={petName}
              petType={petType}
              petAge={petAge}
              symptoms={symptoms}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
            />
          </div>
        );
        
      default:
        return <div>请选择步骤开始</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-900">宠物在线问诊</h1>
          
          {submitSuccess ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              {renderStepContent()}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              {renderStepIndicator()}
              
              <div className="p-6">
                {renderStepContent()}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PetConsultation;