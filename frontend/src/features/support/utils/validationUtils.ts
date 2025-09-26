// 支持模块表单验证工具

// 验证支持请求消息长度
export const validateSupportMessage = (message: string): { isValid: boolean; error?: string } => {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: '请输入您的问题或建议' };
  }
  if (message.length < 10) {
    return { isValid: false, error: '请提供更详细的信息，至少10个字符' };
  }
  if (message.length > 500) {
    return { isValid: false, error: '消息长度不能超过500个字符' };
  }
  return { isValid: true };
};

// 验证服务类型
export const validateServiceType = (serviceType: string): { isValid: boolean; error?: string } => {
  const validServiceTypes = ['foster', 'boarding', 'grooming', 'training', 'medical', 'other'];
  if (!serviceType || !validServiceTypes.includes(serviceType)) {
    return { isValid: false, error: '请选择有效的服务类型' };
  }
  return { isValid: true };
};

// 格式化支持请求状态显示
export const formatSupportStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'processing': '处理中',
    'resolved': '已解决',
    'rejected': '已拒绝'
  };
  return statusMap[status] || status;
};

// 格式化日期时间
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};