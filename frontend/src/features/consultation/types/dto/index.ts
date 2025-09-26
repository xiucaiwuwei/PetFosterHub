// 问诊预约请求DTO
export interface ConsultationRequestDTO {
  vetId: string;
  date: string;
  timeSlotId: string;
  consultationType: 'video' | 'text';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  symptoms: string;
}

// 问诊预约响应DTO
export interface ConsultationResponseDTO {
  id: string;
  status: string;
  appointmentDetails: {
    vetName: string;
    specialty: string;
    date: string;
    time: string;
    consultationType: string;
    petInfo: string;
    price: number;
  };
}