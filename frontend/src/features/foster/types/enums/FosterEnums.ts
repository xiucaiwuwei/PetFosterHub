// 寄养服务相关的枚举类型

// 服务状态枚举
export enum FosterServiceStatus {
  PENDING = 'PENDING', // 待审核
  ACTIVE = 'ACTIVE', // 活跃中
  INACTIVE = 'INACTIVE', // 非活跃
  SUSPENDED = 'SUSPENDED', // 已暂停
  DELETED = 'DELETED' // 已删除
}

// 订单状态枚举
export enum FosterOrderStatus {
  PENDING = 'PENDING', // 待支付
  PAID = 'PAID', // 已支付
  CONFIRMED = 'CONFIRMED', // 已确认
  ONGOING = 'ONGOING', // 进行中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
  REFUNDED = 'REFUNDED' // 已退款
}

// 支付方式枚举
export enum PaymentMethod {
  ALIPAY = 'ALIPAY', // 支付宝
  WECHAT_PAY = 'WECHAT_PAY', // 微信支付
  CREDIT_CARD = 'CREDIT_CARD', // 信用卡
  DEBIT_CARD = 'DEBIT_CARD' // 借记卡
}

// 宠物类型枚举
export enum PetType {
  DOG = 'DOG', // 狗
  CAT = 'CAT', // 猫
  BIRD = 'BIRD', // 鸟类
  FISH = 'FISH', // 鱼类
  REPTILE = 'REPTILE', // 爬行动物
  SMALL_ANIMAL = 'SMALL_ANIMAL', // 小型动物
  OTHER = 'OTHER' // 其他
}

// 服务提供者类型枚举
export enum ProviderType {
  INDIVIDUAL = 'INDIVIDUAL', // 个人
  STORE = 'STORE' // 店铺
}

// 导出所有枚举类型
export * from './FosterEnums';