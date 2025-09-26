// 寄养订单状态枚举
export enum FosterOrderStatus {
  PENDING = 'PENDING', // 待支付
  PAID = 'PAID', // 已支付
  CONFIRMED = 'CONFIRMED', // 已确认
  ONGOING = 'ONGOING', // 进行中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
  REFUNDED = 'REFUNDED' // 已退款
}