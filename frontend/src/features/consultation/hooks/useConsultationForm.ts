import { useState, useEffect } from 'react';
import consultationService from '../services/consultationService';
import { ConsultationRequestDTO, Veterinarian, TimeSlot } from '../types';
import { validateConsultationForm } from '../utils/validationUtils';

// 自定义hook类型定义
interface UseConsultationFormReturn {
  // 表单状态
  step: number;
  selectedVet: Veterinarian | null;
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  consultationType: 'video' | 'text';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  symptoms: string;
  submitSuccess: boolean;
  isSubmitting: boolean;
  
  // 数据列表
  veterinarians: Veterinarian[];
  dateOptions: string[];
  timeSlots: TimeSlot[];
  
  // 错误信息
  errors: Record<string, string>;
  
  // 操作函数
  setStep: (step: number) => void;
  setSelectedVet: (vet: Veterinarian | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTimeSlot: (slot: TimeSlot | null) => void;
  setConsultationType: (type: 'video' | 'text') => void;
  setPetName: (name: string) => void;
  setPetType: (type: 'dog' | 'cat' | 'other') => void;
  setPetAge: (age: string) => void;
  setSymptoms: (symptoms: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const useConsultationForm = (): UseConsultationFormReturn => {
  // 状态定义
  const [step, setStep] = useState<number>(1);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'text'>('video');
  const [petName, setPetName] = useState<string>('');
  const [petType, setPetType] = useState<'dog' | 'cat' | 'other'>('dog');
  const [petAge, setPetAge] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // 数据列表
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // 错误信息
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 初始化数据
  useEffect(() => {
    // 获取兽医列表
    const loadVeterinarians = async () => {
      try {
        const vets = await consultationService.getAvailableVeterinarians();
        setVeterinarians(vets);
      } catch (error) {
        console.error('Failed to load veterinarians:', error);
      }
    };
    
    // 生成日期选项
    const dates = consultationService.generateDateOptions();
    setDateOptions(dates);
    
    // 如果有日期选项，默认选择第一个
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
    
    loadVeterinarians();
  }, []);
  
  // 当选择的医生或日期改变时，更新时间段列表
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (selectedVet && selectedDate) {
        try {
          const slots = await consultationService.getAvailableTimeSlots(selectedVet.id, selectedDate);
          setTimeSlots(slots);
          // 重置已选择的时间段
          setSelectedTimeSlot(null);
        } catch (error) {
          console.error('Failed to load time slots:', error);
          // 设置默认时间段数据
          setTimeSlots([
            { id: '1', time: '09:00-09:30', available: true },
            { id: '2', time: '09:30-10:00', available: true },
            { id: '3', time: '10:00-10:30', available: false }
          ]);
        }
      }
    };
    
    loadTimeSlots();
  }, [selectedVet, selectedDate]);
  
  // 表单验证
  useEffect(() => {
    // 构建当前表单数据
    const formData: Partial<ConsultationRequestDTO> = {
      vetId: selectedVet?.id,
      date: selectedDate,
      timeSlotId: selectedTimeSlot?.id,
      consultationType,
      petName,
      petType,
      petAge,
      symptoms
    };
    
    // 只在第二步和第三步进行验证
    if (step >= 2) {
      const validationErrors = validateConsultationForm(formData);
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
  }, [step, selectedVet, selectedDate, selectedTimeSlot, consultationType, petName, petType, petAge, symptoms]);
  
  // 提交表单
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // 构建完整的表单数据
    const formData: ConsultationRequestDTO = {
      vetId: selectedVet?.id || '',
      date: selectedDate,
      timeSlotId: selectedTimeSlot?.id || '',
      consultationType,
      petName,
      petType,
      petAge,
      symptoms
    };
    
    // 验证表单
    const validationErrors = validateConsultationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await consultationService.createConsultationBooking(formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Failed to submit consultation request:', error);
      // 这里可以添加错误提示逻辑
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 重置表单
  const resetForm = () => {
    setStep(1);
    setSelectedVet(null);
    setSelectedDate(dateOptions[0] || '');
    setSelectedTimeSlot(null);
    setConsultationType('video');
    setPetName('');
    setPetType('dog');
    setPetAge('');
    setSymptoms('');
    setSubmitSuccess(false);
    setErrors({});
  };
  
  return {
    // 状态
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
  };
};

export default useConsultationForm;