import { Booking } from '@/types';

// 生成模拟日期
const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);
const twoWeeksLater = new Date();
twoWeeksLater.setDate(today.getDate() + 14);

// 模拟预订数据
export const bookings: Booking[] = [
  {
    id: 'b1',
    fosterServiceId: 'f1',
    petId: 'p1',
    ownerId: 'u4',
    startDate: yesterday,
    endDate: tomorrow,
    totalPrice: 240,
    status: 'confirmed',
    notes: '豆豆喜欢在早上和傍晚散步，晚餐不要喂太多。',
    createdAt: new Date(yesterday.getTime() - 86400000 * 3) // 3天前创建
  },
  {
    id: 'b2',
    fosterServiceId: 'f2',
    petId: 'p2',
    ownerId: 'u4',
    startDate: nextWeek,
    endDate: twoWeeksLater,
    totalPrice: 840,
    status: 'pending',
    notes: '咪咪胆子比较小，需要安静的环境，不要强行抱它。',
    createdAt: today
  }
];

// 获取用户的预订
export const getBookingsByOwnerId = (ownerId: string): Booking[] => {
  return bookings.filter(booking => booking.ownerId === ownerId);
};

// 获取寄养提供者的预订
export const getBookingsByProviderId = (providerId: string): Booking[] => {
  return bookings.filter(booking => {
    // 在实际应用中，这里应该通过fosterServiceId查询对应的providerId
    // 这里简化处理，直接根据fosterServiceId推断providerId
    const fosterServiceId = booking.fosterServiceId;
    const providerIdFromService = fosterServiceId.replace('f', 'u');
    return providerIdFromService === providerId;
  });
};

// 创建新预订
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 创建新预订
  const newBooking: Booking = {
    ...bookingData,
    id: `b${bookings.length + 1}`,
    createdAt: new Date()
  };
  
  // 在实际应用中，这里应该是发送到服务器保存
  bookings.push(newBooking);
  
  return newBooking;
};

// 更新预订状态
export const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<Booking | null> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    return null;
  }
  
  bookings[bookingIndex].status = status;
  
  return bookings[bookingIndex];
};