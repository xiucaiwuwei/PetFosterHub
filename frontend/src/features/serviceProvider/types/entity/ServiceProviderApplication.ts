/**
 * 服务提供者申请实体
 */
export interface ServiceProviderApplication {
  /** 申请ID */
  applicationId: string;
  
  /** 申请人用户ID */
  userId: string;
  
  /** 申请状态 */
  status: 'pending' | 'approved' | 'rejected';
  
  /** 申请时间 */
  createdAt: Date;
  
  /** 处理时间 */
  processedAt?: Date;
  
  /** 审核意见 */
  feedback?: string;
}