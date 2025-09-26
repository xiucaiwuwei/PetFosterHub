import { useDispatch } from 'react-redux';
import { clearError as clearAuthError } from '../slice/authSlice';
import type { AppDispatch } from '@/app/store/store';
import { validateLoginForm as baseValidateLoginForm, validateRegisterForm as baseValidateRegisterForm, validateVerificationCodeForm as baseValidateVerificationCodeForm, validatePasswordResetForm as baseValidatePasswordResetForm, validatePhone } from '../utils/validationUtils';

// 导出表单错误类型
export interface LoginFormErrors {
  phone?: string;
  verificationCode?: string;
  password?: string;
}

export interface RegisterFormErrors {
  phone?: string;
  verificationCode?: string;
}

export interface VerificationCodeErrors {
  phone?: string;
  verificationCode?: string;
}

export interface PasswordResetErrors {
  password?: string;
  confirmPassword?: string;
}

/**
 * 自定义hook，用于封装所有认证表单验证相关功能
 */
const useAuthFormValidation = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 清除认证错误状态
  const clearAuthErrorState = (): void => {
    dispatch(clearAuthError());
  };
  
  // 登录表单验证方法
  const validateLoginForm = (
    phone: string,
    loginMethod: 'verificationCode' | 'password',
    setErrors: (errors: LoginFormErrors) => void,
    verificationCode?: string,
    password?: string
  ): boolean => {
    const validationResult = baseValidateLoginForm(
      phone,
      loginMethod,
      verificationCode,
      password
    );
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  // 注册表单验证方法
  const validateRegisterForm = (
    step: number,
    phone: string,
    verificationCode: string,
    setErrors: (errors: RegisterFormErrors) => void
  ): boolean => {
    const validationResult = baseValidateRegisterForm(
      step,
      phone,
      verificationCode
    );
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  // 密码重置表单验证方法 - 验证码验证
  const validateVerificationCodeForm = (
    phone: string,
    verificationCode: string,
    setErrors: (errors: VerificationCodeErrors) => void
  ): boolean => {
    const validationResult = baseValidateVerificationCodeForm(phone, verificationCode);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  // 密码重置表单验证方法 - 密码重置
  const validatePasswordResetForm = (
    newPassword: string,
    confirmPassword: string,
    setErrors: (errors: PasswordResetErrors) => void
  ): boolean => {
    const validationResult = baseValidatePasswordResetForm(newPassword, confirmPassword);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  // 验证手机号
  const validatePhoneNumber = (phone: string): { isValid: boolean; errorMessage?: string } => {
    return validatePhone(phone);
  };

  return {
    validateLoginForm,
    validateRegisterForm,
    validateVerificationCodeForm,
    validatePasswordResetForm,
    validatePhoneNumber,
    clearAuthErrorState
  };
};

export default useAuthFormValidation;