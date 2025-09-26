import * as consultationApi from '../api';
import { validateConsultationForm } from '../utils/validationUtils';
import { ConsultationRequestDTO, ConsultationResponseDTO, Veterinarian, TimeSlot } from '../types';

// 预约服务类
const consultationService = {
  // 获取可用的兽医列表
  async getAvailableVeterinarians(): Promise<Veterinarian[]> {
    try {
      const veterinarians = await consultationApi.fetchVeterinarians();
      // 过滤出可用的兽医
      return veterinarians.filter(vet => vet.available);
    } catch (error) {
      console.error('Error in getAvailableVeterinarians:', error);
      throw error;
    }
  },
  
  // 获取指定医生和日期的可用时间段
  async getAvailableTimeSlots(vetId: string, date: string): Promise<TimeSlot[]> {
    try {
      if (!vetId || !date) {
        throw new Error('Veterinarian ID and date are required');
      }
      
      const timeSlots = await consultationApi.fetchTimeSlots(vetId, date);
      // 过滤出可用的时间段
      return timeSlots.filter(slot => slot.available);
    } catch (error) {
      console.error('Error in getAvailableTimeSlots:', error);
      throw error;
    }
  },
  
  // 提交预约请求
  async createConsultationBooking(request: ConsultationRequestDTO): Promise<ConsultationResponseDTO> {
    try {
      // 验证表单数据
      const validationErrors = validateConsultationForm(request);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(validationErrors).join(', '));
      }
      
      // 调用API提交预约
      const result = await consultationApi.submitConsultationRequest(request);
      
      // 可以在这里添加额外的业务逻辑，如发送通知、更新缓存等
      
      return result;
    } catch (error) {
      console.error('Error in createConsultationBooking:', error);
      throw error;
    }
  },
  
  // 检查预约状态
  async getBookingStatus(bookingId: string): Promise<any> {
    try {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      
      const status = await consultationApi.checkBookingStatus(bookingId);
      return status;
    } catch (error) {
      console.error('Error in getBookingStatus:', error);
      throw error;
    }
  },
  
  // 生成未来几天的日期选项
  generateDateOptions(days: number = 7): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // 只包含工作日和周末，不做特殊过滤
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  },
  
  // 获取表单验证工具
  getValidationUtils() {
    return {
      validateConsultationForm,
      validatePetName: (name: string) => validateConsultationForm({ petName: name }).petName,
      validatePetAge: (age: string) => validateConsultationForm({ petAge: age }).petAge,
      validateSymptoms: (symptoms: string) => validateConsultationForm({ symptoms: symptoms }).symptoms
    };
  }
};

export default consultationService;