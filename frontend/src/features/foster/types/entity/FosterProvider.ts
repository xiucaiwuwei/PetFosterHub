// 寄养服务提供者信息实体类型定义
export interface FosterProvider {
  id: string; // 提供者ID
  userId: string; // 用户ID
  name: string; // 提供者名称
  avatar: string; // 头像
  rating: number; // 评分
  reviewCount: number; // 评价数量
  contactInfo: { // 联系信息
    phone: string; // 联系电话
    email: string; // 电子邮箱
    address: string; // 地址
  };
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}