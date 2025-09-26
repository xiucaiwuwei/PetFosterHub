// 兽医实体
export interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  price: number;
  available: boolean;
  avatar: string;
}

// 时间段实体
export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// 预约实体
export interface ConsultationBooking {
  id: string;
  vetId: string;
  userId: string;
  date: string;
  timeSlotId: string;
  consultationType: 'video' | 'text';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}