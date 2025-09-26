import { User } from '@/types';

// 模拟用户数据
export const users: User[] = [
  {
    id: 'u1',
    name: '张明',
    email: 'zhangming@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137',
    role: 'foster',
    phone: '13800138000',
    address: '北京市朝阳区建国路88号',
    bio: '退休教师，热爱动物，有10年养宠经验。家里有一个小院子，非常适合宠物活动。',
    rating: 4.8,
    reviewsCount: 24,
    idCardNumber: '110101196501011234'
  },
  {
    id: 'u2',
    name: '李华',
    email: 'lihua@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BC%80%E6%9C%97%E7%AC%91%E5%AE%B9%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=8dc301c48f3190d00930598ba3ff11f3',
    role: 'foster',
    phone: '13900139000',
    address: '上海市静安区南京西路1266号',
    bio: '专业宠物护理师，拥有5年宠物护理经验和专业资格证书。提供专业的宠物寄养和护理服务。',
    rating: 4.9,
    reviewsCount: 37,
    idCardNumber: '310101198502022345'
  },
  {
    id: 'u3',
    name: '王芳',
    email: 'wangfang@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E6%B8%A9%E6%9F%94%E6%B0%94%E8%B4%A8%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=a499604ce8edcd1a07b0b26633c885e7',
    role: 'foster',
    phone: '13700137000',
    address: '广州市天河区天河路385号',
    bio: '猫咪爱好者，专注于猫咪照顾多年。家中环境安静，适合猫咪生活。可提供猫咪行为训练指导。',
    rating: 4.7,
    reviewsCount: 19,
    idCardNumber: '440101199003033456'
  },
  {
    id: 'u4',
    name: '赵强',
    email: 'zhaoqiang@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E8%BF%90%E5%8A%A8%E9%A3%8E%E6%A0%BC%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=66572c72fe2bc067c919e7742c2a81e6',
    role: 'owner',
    phone: '13600136000',
    address: '深圳市福田区深南大道1000号',
    bio: '软件工程师，养有一只金毛犬。经常需要出差，寻找可靠的宠物寄养服务。',
    idCardNumber: '440301199504044567'
  }
];

// 模拟登录功能
export const login = async (email: string, password: string): Promise<User | null> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 简单模拟登录验证 (实际项目中应该有更安全的验证)
  const user = users.find(u => u.email === email);
  
  // 这里假设所有用户密码都是 'password'
  if (user && password === 'password') {
    return user;
  }
  
  return null;
};

// 模拟注册功能
export const register = async (userData: Omit<User, 'id' | 'rating' | 'reviewsCount'> & { password: string }): Promise<User> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 创建新用户
  const newUser: User = {
    ...userData,
    id: `u${users.length + 1}`,
    rating: 0,
    reviewsCount: 0
  };
  
  // 在实际应用中，这里应该是发送到服务器保存
  users.push(newUser);
  
  return newUser;
};

// 根据ID获取用户
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};