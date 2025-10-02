/**
 * 模拟寄养订单数据
 */
import { FosterOrderStatus, PaymentMethod, PetType } from '../types/enums';
import type { FosterOrder } from '../types/entity';
import { mockFosterServices } from './mockFosterServices';

// 生成随机ID
const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// 生成随机日期
const generateRandomDate = (): string => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
};

// 生成未来日期
const generateFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// 模拟寄养订单数据
export const mockFosterOrders: FosterOrder[] = [
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[0].id,
    userId: generateId('user'),
    startDate: generateFutureDate(3),
    endDate: generateFutureDate(7),
    totalPrice: 312.00,
    status: FosterOrderStatus.PENDING,
    paymentStatus: 'UNPAID',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[1].id,
    userId: generateId('user'),
    startDate: generateFutureDate(5),
    endDate: generateFutureDate(10),
    totalPrice: 540.00,
    status: FosterOrderStatus.PAID,
    paymentStatus: 'PAID',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[2].id,
    userId: generateId('user'),
    startDate: generateFutureDate(2),
    endDate: generateFutureDate(6),
    totalPrice: 272.00,
    status: FosterOrderStatus.CONFIRMED,
    paymentStatus: 'PAID',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[3].id,
    userId: generateId('user'),
    startDate: generateRandomDate(), // 过去的日期
    endDate: generateFutureDate(2),
    totalPrice: 352.00,
    status: FosterOrderStatus.ONGOING,
    paymentStatus: 'PAID',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[4].id,
    userId: generateId('user'),
    startDate: '2023-05-10',
    endDate: '2023-05-15',
    totalPrice: 240.00,
    status: FosterOrderStatus.COMPLETED,
    paymentStatus: 'PAID',
    createdAt: '2023-05-08',
    updatedAt: '2023-05-15'
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[5].id,
    userId: generateId('user'),
    startDate: generateFutureDate(10),
    endDate: generateFutureDate(15),
    totalPrice: 740.00,
    status: FosterOrderStatus.CANCELLED,
    paymentStatus: 'REFUNDING',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[6].id,
    userId: generateId('user'),
    startDate: '2023-04-20',
    endDate: '2023-04-25',
    totalPrice: 990.00,
    status: FosterOrderStatus.REFUNDED,
    paymentStatus: 'REFUNDED',
    createdAt: '2023-04-18',
    updatedAt: '2023-04-19'
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[7].id,
    userId: generateId('user'),
    startDate: generateFutureDate(1),
    endDate: generateFutureDate(3),
    totalPrice: 96.00,
    status: FosterOrderStatus.PAID,
    paymentStatus: 'PAID',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[8].id,
    userId: generateId('user'),
    startDate: generateFutureDate(7),
    endDate: generateFutureDate(14),
    totalPrice: 1106.00,
    status: FosterOrderStatus.CONFIRMED,
    paymentStatus: 'PAID',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('order'),
    fosterServiceId: mockFosterServices[9].id,
    userId: generateId('user'),
    startDate: '2023-06-01',
    endDate: '2023-06-05',
    totalPrice: 672.00,
    status: FosterOrderStatus.COMPLETED,
    paymentStatus: 'PAID',
    createdAt: '2023-05-28',
    updatedAt: '2023-06-05'
  }
];

// 模拟宠物信息
export const mockPetInfos = [
  {
    id: generateId('pet'),
    name: '小白',
    type: PetType.DOG,
    breed: '萨摩耶',
    age: 2,
    weight: 20,
    healthCondition: '健康',
    specialRequirements: '每天需要遛弯30分钟'
  },
  {
    id: generateId('pet'),
    name: '咪咪',
    type: PetType.CAT,
    breed: '英短蓝猫',
    age: 3,
    weight: 5,
    healthCondition: '健康',
    specialRequirements: '喜欢独处，不要强迫互动'
  },
  {
    id: generateId('pet'),
    name: '旺财',
    type: PetType.DOG,
    breed: '金毛',
    age: 4,
    weight: 30,
    healthCondition: '轻微关节炎，不要剧烈运动',
    specialRequirements: '需要按时服用关节保健药物'
  },
  {
    id: generateId('pet'),
    name: '小灰',
    type: PetType.CAT,
    breed: '美短虎斑',
    age: 1,
    weight: 4,
    healthCondition: '健康',
    specialRequirements: '非常活泼，需要有玩具陪伴'
  },
  {
    id: generateId('pet'),
    name: '豆豆',
    type: PetType.SMALL_ANIMAL,
    breed: '荷兰猪',
    age: 1,
    weight: 1,
    healthCondition: '健康',
    specialRequirements: '需要提供新鲜蔬菜'
  }
];

// 创建寄养订单请求模拟数据
export const mockFosterOrderRequests = [
  {
    fosterServiceId: mockFosterServices[0].id,
    startDate: generateFutureDate(5),
    endDate: generateFutureDate(10),
    totalPrice: 390.00,
    petInfo: mockPetInfos[0],
    paymentMethod: PaymentMethod.ALIPAY
  },
  {
    fosterServiceId: mockFosterServices[1].id,
    startDate: generateFutureDate(7),
    endDate: generateFutureDate(12),
    totalPrice: 540.00,
    petInfo: mockPetInfos[1],
    paymentMethod: PaymentMethod.WECHAT_PAY
  },
  {
    fosterServiceId: mockFosterServices[2].id,
    startDate: generateFutureDate(3),
    endDate: generateFutureDate(8),
    totalPrice: 340.00,
    petInfo: mockPetInfos[2],
    paymentMethod: PaymentMethod.CREDIT_CARD
  }
];

// 创建寄养订单响应模拟数据
export const mockFosterOrderResponses = mockFosterOrderRequests.map((request, index) => ({
  orderId: generateId('order'),
  status: FosterOrderStatus.PAID,
  totalPrice: request.totalPrice,
  paymentStatus: 'PAID',
  orderTime: new Date().toISOString()
}));