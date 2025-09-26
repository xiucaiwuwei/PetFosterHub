// 寄养服务状态枚举
export enum FosterServiceStatus {
  PENDING = 'PENDING', // 待审核
  ACTIVE = 'ACTIVE', // 活跃中
  INACTIVE = 'INACTIVE', // 非活跃
  SUSPENDED = 'SUSPENDED', // 已暂停
  DELETED = 'DELETED' // 已删除
}