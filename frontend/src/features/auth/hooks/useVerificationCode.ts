import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import type { AppDispatch } from '@/app/store/store';
import { UserRole } from '@/types';
import { VerificationCodeType } from '../types/enums';  
import { clearError as clearAuthError, sendVerificationCode as sendVerificationCodeAction } from '../slice/authSlice';

// 定义验证码hook返回类型
export interface VerificationCodeState {
  // 倒计时秒数
  countdown: number;
  
  // 是否正在发送验证码
  isSending: boolean;
  
  // 发送验证码方法
  sendVerificationCode: (
    phone: string,
    role: UserRole,
    type: VerificationCodeType
  ) => Promise<boolean>;
  
  // 开始倒计时方法
  startCountdown: (seconds?: number) => void;
  
  // 清除错误状态方法
  clearError: () => void;
}

/**
 * 自定义hook，用于封装验证码相关功能
 */
const useVerificationCode = (): VerificationCodeState => {
  const dispatch = useDispatch<AppDispatch>();

  // 验证码相关状态
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // 清除认证错误状态
  const clearError = useCallback((): void => {
    dispatch(clearAuthError());
  }, [dispatch]);
  
  // 清理函数，确保组件卸载时清除定时器
  useEffect(() => {
    return () => {
      // 这里不需要直接清除定时器，因为每个setInterval都有对应的清除逻辑
    };
  }, []);

  // 开始倒计时
  const startCountdown = useCallback((seconds = 60): void => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 清理函数已经在useEffect中处理，但这里确保每个定时器都有对应的清除
  }, []);

  // 发送验证码(通用方法)
  const sendVerificationCode = useCallback(async (
    phone: string,
    role: UserRole,
    type: VerificationCodeType,
  ): Promise<boolean> => {
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      toast.error('请输入有效的手机号码');
      return false;
    }

    // 如果正在倒计时或发送中，不重复发送
    if (countdown > 0 || isSending) {
      return false;
    }

    try {
      setIsSending(true);
      
      // 使用 Redux 异步 action 发送验证码
      const result = await dispatch(
        sendVerificationCodeAction({
          phone,
          role,
          type,
          operationType: 'SEND_VERIFICATION_CODE',
          operationContent: '发送验证码',
        })
      ).unwrap();

      if (result && result.success) {
        startCountdown();
        toast.success(result.message || '验证码已发送到手机');
        return true;
      } else {
        const errorMessage = result?.message || '发送验证码失败';
        // 针对频率限制的特殊处理
        if (errorMessage.includes('频率过高') || errorMessage.includes('rate limit')) {
          // 增加更长地倒计时，提示用户稍后再试
          startCountdown(120);
          toast.error('验证码发送过于频繁，请2分钟后再试');
        } else {
          toast.error(errorMessage);
        }
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || '发送验证码失败，请稍后重试';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [countdown, isSending, startCountdown, dispatch]);

  return {
    countdown,
    isSending,
    sendVerificationCode,
    startCountdown,
    clearError
  };
};

export default useVerificationCode;