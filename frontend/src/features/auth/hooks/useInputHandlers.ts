import React from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store/store';
import { clearError as clearAuthError } from '../slice/authSlice';
import { filterNumeric } from '../utils/validationUtils';

// 定义输入处理类型
export interface InputHandlers {
  handlePhoneChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setPhone: (phone: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ) => void;
  
  handleVerificationCodeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setVerificationCode: (code: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ) => void;
  
  handleTextChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setValue: (value: string) => void,
    fieldName: string,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ) => void;
  
  handlePasswordChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setPassword: (password: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ) => void;
  
  handleConfirmPasswordChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setConfirmPassword: (password: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ) => void;
  
  clearError: () => void;
  
  // 通用输入处理方法
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setValue: (value: string) => void,
    fieldName: string,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void,
    filter?: (value: string) => string
  ) => void;
}

/**
 * 自定义hook，用于封装所有表单输入处理相关功能
 */
const useInputHandlers = (): InputHandlers => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 清除认证错误状态
  const clearError = (): void => {
    dispatch(clearAuthError());
  };
  
  // 通用输入处理方法
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setValue: (value: string) => void,
    fieldName: string,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void,
    filter?: (value: string) => string
  ): void => {
    let value = e.target.value;
    
    // 如果提供了过滤函数，则应用过滤
    if (filter) {
      value = filter(value);
    }
    
    setValue(value);
    
    // 清除对应字段的错误信息
    if (errors[fieldName]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[fieldName];
      setErrors(updatedErrors);
    }
  };

  // 手机号输入处理
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPhone: (phone: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ): void => {
    handleInputChange(e, setPhone, 'phone', errors, setErrors, filterNumeric);
  };

  // 验证码输入处理
  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setVerificationCode: (code: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ): void => {
    handleInputChange(e, setVerificationCode, 'verificationCode', errors, setErrors, filterNumeric);
  };

  // 通用文本输入处理
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setValue: (value: string) => void,
    fieldName: string,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ): void => {
    handleInputChange(e, setValue, fieldName, errors, setErrors);
  };

  // 密码输入处理
  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPassword: (password: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ): void => {
    handleInputChange(e, setPassword, 'password', errors, setErrors);
  };

  // 确认密码输入处理
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setConfirmPassword: (password: string) => void,
    errors: Record<string, string>,
    setErrors: (errors: Record<string, string>) => void
  ): void => {
    handleInputChange(e, setConfirmPassword, 'confirmPassword', errors, setErrors);
  };

  return {
    handlePhoneChange,
    handleVerificationCodeChange,
    handleTextChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    clearError,
    handleInputChange
  };
};

export default useInputHandlers;