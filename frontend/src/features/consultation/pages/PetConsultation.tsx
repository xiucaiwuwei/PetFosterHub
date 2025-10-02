import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HeartPulse, Calendar, UserCheck, ArrowLeft, ArrowRight } from 'lucide-react';

// 导入我们创建的组件
import {
  VetSelector,
  DateSelector,
  TimeSlotSelector,
  PetInfoForm,
  ConsultationTypeSelector,
  BookingConfirmation,
  SuccessPage
} from '../components/appointment-flow/steps';

// 导入二级导航组件
import ConsultationSecondaryNav from '../components/layout/ConsultationSecondaryNav';

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

  // 二级导航状态管理
  const [selectedNavItem, setSelectedNavItem] = useState('all-department');

  // 处理导航项变化
  const handleNavItemChange = (navId: string) => {
    setSelectedNavItem(navId);
    // 这里可以根据不同的导航项筛选兽医列表
    // 例如：根据推荐、热门、专科等进行筛选
  };

  // 处理搜索
  const handleSearch = (searchTerm: string) => {
    // 实现搜索功能，例如按医生名称、专长等搜索
    console.log('搜索:', searchTerm);
  };

  // 处理筛选
  const handleToggleFilters = () => {
    // 实现筛选面板的显示/隐藏
    console.log('切换筛选面板');
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <motion.div
      className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between">
          {/* 步骤1：选择医生 */}
          <motion.div
            className={cn("flex flex-col items-center", step >= 1 ? "text-orange-600" : "text-gray-400")}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm",
                step >= 1
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white border-2 border-orange-200"
                  : "bg-white text-gray-400 border-2 border-gray-200"
              )}
            >
              {step > 1 ? (
                <UserCheck className="w-5 h-5" />
              ) : (
                '1'
              )}
            </div>
            <span className="text-sm font-medium">选择医生</span>
          </motion.div>

          {/* 连接线1 */}
          <div className={cn("hidden md:block flex-1 flex items-center", step >= 2 ? "text-orange-500" : "text-gray-300")}>
            <div
              className="h-1 w-full rounded-full transition-all duration-500 ease-in-out"
              style={{
                backgroundColor: step >= 2 ? '#f97316' : '#e5e7eb',
                boxShadow: step >= 2 ? '0 2px 8px rgba(249, 115, 22, 0.3)' : 'none'
              }}
            ></div>
          </div>

          {/* 步骤2：预约信息 */}
          <motion.div
            className={cn("flex flex-col items-center", step >= 2 ? "text-orange-600" : "text-gray-400")}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm",
                step >= 2
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white border-2 border-orange-200"
                  : "bg-white text-gray-400 border-2 border-gray-200"
              )}
            >
              {step > 2 ? (
                <UserCheck className="w-5 h-5" />
              ) : (
                '2'
              )}
            </div>
            <span className="text-sm font-medium">预约信息</span>
          </motion.div>

          {/* 连接线2 */}
          <div className={cn("hidden md:block flex-1 flex items-center", step >= 3 ? "text-orange-500" : "text-gray-300")}>
            <div
              className="h-1 w-full rounded-full transition-all duration-500 ease-in-out"
              style={{
                backgroundColor: step >= 3 ? '#f97316' : '#e5e7eb',
                boxShadow: step >= 3 ? '0 2px 8px rgba(249, 115, 22, 0.3)' : 'none'
              }}
            ></div>
          </div>

          {/* 步骤3：提交预约 */}
          <motion.div
            className={cn("flex flex-col items-center", step >= 3 ? "text-orange-600" : "text-gray-400")}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm",
                step >= 3
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white border-2 border-orange-200"
                  : "bg-white text-gray-400 border-2 border-gray-200"
              )}
            >
              {step > 3 ? (
                <UserCheck className="w-5 h-5" />
              ) : (
                '3'
              )}
            </div>
            <span className="text-sm font-medium">提交预约</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <HeartPulse className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">选择问诊医生</h2>
            </div>

            <VetSelector
              veterinarians={veterinarians}
              selectedVet={selectedVet}
              onSelectVet={setSelectedVet}
            />

            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={() => setStep(2)}
                disabled={!selectedVet || !selectedVet.available}
                className="py-3 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  下一步
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">预约信息</h2>
            </div>

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
              <motion.button
                onClick={() => setStep(1)}
                className="py-3 px-6 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  上一步
                </div>
              </motion.button>
              <motion.button
                onClick={() => setStep(3)}
                disabled={!selectedVet || !selectedDate || !selectedTimeSlot || !petName || !petAge || !symptoms || Object.keys(errors).length > 0}
                className="py-3 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  下一步
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <UserCheck className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">确认预约信息</h2>
            </div>

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
          </motion.div>
        );

      default:
        return <div>请选择步骤开始</div>;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-orange-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 二级导航 - 放在页面顶部 */}
      <ConsultationSecondaryNav
        selectedNavItem={selectedNavItem}
        onNavItemChange={handleNavItemChange}
        onSearch={handleSearch}
        onToggleFilters={handleToggleFilters}
        notificationsCount={3} // 示例数据
      />

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="inline-block w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-200"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HeartPulse className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">宠物在线问诊</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              专业兽医团队，为您的爱宠提供便捷、高效的健康咨询服务
            </p>
          </motion.div>

          {/* 导航与内容之间的间距 */}
          <div className="h-6"></div>

          {submitSuccess ? (
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderStepContent()}
            </motion.div>
          ) : (
            <motion.div
              className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {renderStepIndicator()}

              <div className="p-6">
                {renderStepContent()}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default PetConsultation;