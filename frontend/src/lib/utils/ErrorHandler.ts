/**
 * 错误处理工具类
 */
export class ErrorHandler {
  /**
   * 标准化错误消息
   * @param error 错误对象
   * @param defaultMessage 默认错误消息
   * @returns 格式化的错误消息
   */
  static normalizeError(
    error: any,
    defaultMessage: string = '操作失败，请稍后重试'
  ): string {
    // 检查错误是否存在
    if (!error) {
      return defaultMessage;
    }

    // 如果是字符串，直接返回
    if (typeof error === 'string') {
      return error;
    }

    // 检查是否有message字段
    if (error.message) {
      return error.message;
    }

    // 检查是否有data字段（API响应格式）
    if (error.data && error.data.message) {
      return error.data.message;
    }

    // 检查是否有response字段（Axios错误格式）
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }

    // 检查是否有error字段
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.message) {
        return error.error.message;
      }
    }

    // 如果是对象，尝试JSON序列化
    try {
      return JSON.stringify(error);
    } catch (e) {
      // 如果序列化失败，返回默认消息
      return defaultMessage;
    }
  }

  /**
   * 显示错误提示
   * @param message 错误消息
   * @param options 配置项
   */
  static showError(message: string, options: { type?: 'toast' | 'alert'; duration?: number } = {}): void {
    const { type = 'toast', duration = 3000 } = options;

    if (type === 'alert') {
      // 简单的alert实现
      alert(message);
    } else {
      // 这里可以集成UI库的toast组件
      // 例如：Notification.error({ message, duration });
      console.error('Error:', message);
      
      // 如果没有UI库，可以简单实现一个toast
      if (typeof document !== 'undefined') {
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff4d4f;
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, duration);
      }
    }
  }
}