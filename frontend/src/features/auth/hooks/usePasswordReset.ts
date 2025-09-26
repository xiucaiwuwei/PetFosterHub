import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store/store';
import { UserRole, VerificationCodeType } from '@/features/auth/types/enums';
import useVerificationCode from './useVerificationCode';
import useAuthFormValidation from './useAuthFormValidation';
import { clearError as clearAuthError, verifyVerificationCode, resetPassword } from '../slice/authSlice';

// 定义密码重置相关类型
export interface PasswordResetErrors {
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
  message?: string;
  phone?: string;
}

export interface SendVerificationCodeErrors {
  phone?: string;
}

export interface PasswordResetHandlers {
  sendResetPasswordCode: (
    phone: string,
    role: UserRole
  ) => Promise<boolean>;
  
  verifyResetCode: (
    phone: string,
    role: UserRole,
    code: string,
    setErrors: (errors: Pick<PasswordResetErrors, 'code'>) => void,
    setLoading: (loading: boolean) => void
  ) => Promise<boolean>;
  
  performResetPassword: (
    phone: string,
    role: UserRole,
    newPassword: string,
    verificationCode: string,
    setErrors: (errors: Pick<PasswordResetErrors, 'newPassword' | 'message'>) => void,
    setLoading: (loading: boolean) => void
  ) => Promise<boolean>;
  
  handleSendVerificationCode: (
    phone: string,
    role: UserRole,
    setErrors: (errors: SendVerificationCodeErrors) => void,
    setLoading: (loading: boolean) => void
  ) => Promise<void>;
  
  handleVerifyCode: (
    phone: string,
    role: UserRole,
    verificationCode: string,
    setErrors: (errors: PasswordResetErrors) => void,
    setLoading: (loading: boolean) => void,
    setCurrentStep: (step: 1 | 2) => void
  ) => Promise<void>;
  
  handleResetPassword: (
    phone: string,
    role: UserRole,
    newPassword: string,
    confirmPassword: string,
    verificationCode: string,
    setErrors: (errors: PasswordResetErrors) => void,
    setLoading: (loading: boolean) => void,
    onResetSuccess: (phone: string) => void
  ) => Promise<void>;
  
  clearError: () => void;
}

/**
 * 自定义hook，用于封装密码重置流程相关功能
 */
const usePasswordReset = (): PasswordResetHandlers => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendVerificationCode } = useVerificationCode();
  const { validateVerificationCodeForm, validatePasswordResetForm, validatePhoneNumber } = useAuthFormValidation();
  
  // 清除认证错误状态
  const clearError = (): void => {
    dispatch(clearAuthError());
  };

  // 发送重置密码验证码
  const sendResetPasswordCode = async (
    phone: string,
    role: UserRole
  ): Promise<boolean> => {
    return sendVerificationCode(
      phone, 
      role,
      VerificationCodeType.RESET_PASSWORD
    );
  };

  // 验证重置密码验证码
  const verifyResetCode = async (
    phone: string,
    role: UserRole,
    code: string,
    setErrors: (errors: Pick<PasswordResetErrors, 'code'>) => void,
    setLoading: (loading: boolean) => void
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setErrors({});

      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        setErrors({ code: '请输入6位数字验证码' });
        setLoading(false);
        return false;
      }

      if (!role) {
        setErrors({ code: '用户角色不能为空' });
        setLoading(false);
        return false;
      }

      // 使用 Redux 异步 action 验证验证码
      const result = await dispatch(
        verifyVerificationCode({
          phone,
          role,
          code,
          type: VerificationCodeType.RESET_PASSWORD,
          operationType: 'resetPassword',
          operationContent: '重置密码'
        })
      ).unwrap();

      if (result && result.success) {
        return true;
      } else {
        const errorMessage = result?.message || '验证码验证失败';
        setErrors({ code: errorMessage });
        toast.error(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || '验证码验证失败，请稍后重试';
      setErrors({ code: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 执行密码重置
  const performResetPassword = async (
    phone: string,
    role: UserRole,
    newPassword: string,
    verificationCode: string,
    setErrors: (errors: Pick<PasswordResetErrors, 'newPassword' | 'message'>) => void,
    setLoading: (loading: boolean) => void
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setErrors({});

      // 验证密码格式
      if (!newPassword || newPassword.length < 8) {
        setErrors({ newPassword: '密码长度至少为8位' });
        setLoading(false);
        return false;
      }

      // 使用 Redux 异步 action 重置密码
      const result = await dispatch(
        resetPassword({
          phone,
          verificationCode,
          newPassword,
          role,
          operationType: 'resetPassword',
          operationContent: '重置密码'
        })
      ).unwrap();

      if (result && result.success) {
        toast.success(result.message || '密码重置成功');
        return true;
      } else {
        const errorMessage = result?.message || '密码重置失败';
        setErrors({ message: errorMessage });
        toast.error(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || '密码重置失败，请稍后重试';
      setErrors({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码流程处理
  const handleSendVerificationCode = async (
    phone: string,
    role: UserRole,
    setErrors: (errors: SendVerificationCodeErrors) => void,
    setLoading: (loading: boolean) => void
  ): Promise<void> => {
    // 验证手机号
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      setErrors({ phone: phoneValidation.errorMessage || '请输入正确的手机号' });
      return;
    }

    // 发送验证码
    try {
      setLoading(true);
      const success = await sendResetPasswordCode(phone, role);
      if (success) {
        toast.success('验证码发送成功');
      }
    } catch (error) {
      toast.error('发送验证码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码流程处理
  const handleVerifyCode = async (
    phone: string,
    role: UserRole,
    verificationCode: string,
    setErrors: (errors: PasswordResetErrors) => void,
    setLoading: (loading: boolean) => void,
    setCurrentStep: (step: 1 | 2) => void
  ): Promise<void> => {
    // 验证表单数据
    if (!validateVerificationCodeForm(phone, verificationCode, setErrors)) {
      return;
    }

    try {
      setLoading(true);
      // 验证验证码
      const isVerified = await verifyResetCode(
        phone,
        role,
        verificationCode,
        setErrors,
        setLoading
      );

      if (isVerified) {
        // 验证成功，进入重置密码步骤
        setCurrentStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  // 重置密码流程处理
  const handleResetPassword = async (
    phone: string,
    role: UserRole,
    newPassword: string,
    confirmPassword: string,
    verificationCode: string,
    setErrors: (errors: PasswordResetErrors) => void,
    setLoading: (loading: boolean) => void,
    onResetSuccess: (phone: string) => void
  ): Promise<void> => {
    // 验证新密码和确认密码
    if (!validatePasswordResetForm(newPassword, confirmPassword, setErrors)) {
      return;
    }

    try {
      setLoading(true);
      // 提交重置密码请求
      const isSuccess = await performResetPassword(
        phone,
        role,
        newPassword,
        verificationCode,
        setErrors,
        setLoading
      );

      if (isSuccess) {
        // 重置成功，回调父组件
        onResetSuccess(phone);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    sendResetPasswordCode,
    verifyResetCode,
    performResetPassword,
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
    clearError
  };
};

export default usePasswordReset;