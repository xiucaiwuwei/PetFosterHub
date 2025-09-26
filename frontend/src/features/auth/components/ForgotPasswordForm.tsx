import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useFormService from '../hooks/useFormService';
import { UserRole } from '../types/enums';
import type { PasswordResetErrors, SendVerificationCodeErrors } from '../hooks/usePasswordReset';

/**
 * 判断是否为开发环境
 */
const isDevMode = import.meta.env.DEV;

/**
 * 忘记密码表单组件属性接口
 */
interface ForgotPasswordFormProps {
  /**
   * 重置密码成功的回调函数
   */
  onResetSuccess: (phone: string) => void;
}

/**
 * 忘记密码表单组件
 * 提供手机号和验证码输入，用于密码重置流程
 * @param props 忘记密码表单组件属性
 * @returns 忘记密码表单组件
 */
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onResetSuccess }) => {
  const formService = useFormService();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [role, setRole] = useState<UserRole>(UserRole.OWNER);
  const [loading, setLoading] = useState(false);
  // 使用 Record<string, string> 类型以兼容表单处理方法，并确保值不为 undefined
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 类型转换包装函数 - 用于处理发送验证码的错误
  const setSendVerificationCodeErrors = (errs: SendVerificationCodeErrors) => {
    // 过滤掉 undefined 值并使用 safeSetErrors
    const filteredErrors = Object.fromEntries(
      Object.entries({ ...errors, ...errs }).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>;
    safeSetErrors(filteredErrors);
  };

  // 类型转换包装函数 - 用于处理密码重置的错误
  const setPasswordResetErrors = (errs: PasswordResetErrors) => {
    // 过滤掉 undefined 值并使用 safeSetErrors
    const filteredErrors = Object.fromEntries(
      Object.entries({ ...errors, ...errs }).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>;
    safeSetErrors(filteredErrors);
  };

  // 辅助函数：确保传递给表单处理方法的 errors 对象不包含 undefined 值
  const getSafeErrors = (): Record<string, string> => {
    return Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>;
  };

  // 辅助函数：安全地更新错误对象，符合表单处理方法期望的类型签名
  const safeSetErrors = (errorsObject: Record<string, string>): void => {
    setErrors(errorsObject);
  };

  // 辅助函数：安全地更新单个字段错误（内部使用）
  const updateFieldError = (fieldName: string, value: string | undefined): void => {
    if (value === undefined) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    } else {
      setErrors({ ...errors, [fieldName]: value });
    }
  };
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 处理发送验证码
  const handleSendCode = async () => {
    await formService.handleSendVerificationCode(
      phone,
      role,
      setSendVerificationCodeErrors,
      setLoading
    );
  };

  // 处理验证码验证
  const handleVerifyCodePress = async () => {
    await formService.handleVerifyCode(
      phone,
      role,
      verificationCode,
      setPasswordResetErrors,
      setLoading,
      setCurrentStep
    );
  };

  // 处理重置密码提交
  const handleResetPasswordPress = async () => {
    await formService.handleResetPassword(
      phone,
      role,
      newPassword,
      confirmPassword,
      verificationCode,
      setPasswordResetErrors,
      setLoading,
      onResetSuccess
    );
  };

  // 开发环境下，提供便捷的自动填充功能
  useEffect(() => {
    if (isDevMode) {
      console.log('开发环境: 验证码默认为 123456');
      setVerificationCode('123456');
    }
  }, []);

  // 处理倒计时
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdown]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-orange-100"
    >
      <div className="px-8 py-10 sm:px-10 sm:py-12">
        {/* 标题区域 - 美化版 */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "backOut", stiffness: 100 }}
            className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <i className="fa-solid fa-key text-4xl text-white"></i>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {currentStep === 1 ? '找回密码' : '重置密码'}
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {currentStep === 1
              ? '请输入您的手机号，我们将发送验证码进行验证'
              : '请设置新密码并确认'
            }
          </motion.p>
        </div>

        {currentStep === 1 ? (
          // 步骤1: 手机验证
          <div className="space-y-6">
            {/* 手机号输入框 */}
            <div className="relative group">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                手机号码
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                  <i className={`fa-solid fa-mobile-screen ${errors.phone ? 'text-red-500' : 'text-orange-400'} text-1xl`}></i>
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => formService.handlePhoneChange(e, setPhone, getSafeErrors(), safeSetErrors)}
                  className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'} rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-400 group-hover:border-orange-200 ${errors.phone ? 'group-hover:border-red-400' : ''}`}
                  placeholder="请输入手机号码"
                  maxLength={11}
                />
                <div
                  className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
              {errors.phone && (
                <p
                  className="mt-1 text-sm text-red-600"
                >
                  <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* 验证码输入框 */}
            <div className="relative group">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                验证码
              </label>
              <div className="relative flex space-x-3">
                <div className="relative flex-grow">
                  <div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                    <i className={`fa-solid fa-shield-halved ${errors.verificationCode ? 'text-red-500' : 'text-orange-400'}`}></i>
                  </div>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => formService.handleVerificationCodeChange(e, setVerificationCode, getSafeErrors(), safeSetErrors)}
                    className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.verificationCode ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'} rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-400 group-hover:border-orange-200 ${errors.verificationCode ? 'group-hover:border-red-400' : ''}`}
                    placeholder="请输入验证码"
                    maxLength={6}
                  />
                  <div
                    className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
                <motion.button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || loading}
                  className={`whitespace-nowrap px-4 py-3 border ${countdown > 0 || loading
                    ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100'} 
                  rounded-xl text-sm font-medium transition-all duration-300`}
                  whileHover={!countdown && !loading ? { scale: 1.03 } : {}}
                  whileTap={!countdown && !loading ? { scale: 0.98 } : {}}
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
                </motion.button>
              </div>
              {errors.verificationCode && (
                <p
                  className="mt-1 text-sm text-red-600"
                >
                  <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                  {errors.verificationCode}
                </p>
              )}
            </div>

            {/* 验证按钮 */}
            <motion.button
              type="button"
              onClick={handleVerifyCodePress}
              disabled={loading}
              className="w-full py-3 px-6 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  验证中...
                </div>
              ) : (
                '验证并继续'
              )}
            </motion.button>
          </div>
        ) : (
          // 步骤2: 重置密码
          <div className="space-y-6">
            {/* 新密码输入框 */}
            <div className="relative group">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                新密码
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                  <i className={`fa-solid fa-lock ${errors.password ? 'text-red-500' : 'text-orange-400'}`}></i>
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => formService.handlePasswordChange(e, setNewPassword, getSafeErrors(), safeSetErrors)}
                  className={`block w-full pl-12 pr-12 py-3 border-2 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'} rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-400 group-hover:border-orange-200 ${errors.password ? 'group-hover:border-red-400' : ''}`}
                  placeholder="请设置新密码，至少6位"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                <div
                  className="absolute -bottom-1 left-12 right-12 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
              {errors.password && (
                <p
                  className="mt-1 text-sm text-red-600"
                >
                  <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                  {errors.password}
                </p>
              )}
            </div>

            {/* 确认新密码输入框 */}
            <div className="relative group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                确认新密码
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                  <i className={`fa-solid fa-lock ${errors.confirmPassword ? 'text-red-500' : 'text-orange-400'}`}></i>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => formService.handleConfirmPasswordChange(e, setConfirmPassword, getSafeErrors(), safeSetErrors)}
                  className={`block w-full pl-12 pr-12 py-3 border-2 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'} rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-400 group-hover:border-orange-200 ${errors.confirmPassword ? 'group-hover:border-red-400' : ''}`}
                  placeholder="请再次输入新密码"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                <div
                  className="absolute -bottom-1 left-12 right-12 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
              {errors.confirmPassword && (
                <p
                  className="mt-1 text-sm text-red-600"
                >
                  <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* 重置密码按钮 */}
            <motion.button
              type="button"
              onClick={handleResetPasswordPress}
              disabled={loading}
              className="w-full py-3 px-6 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  重置中...
                </div>
              ) : (
                '重置密码'
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPasswordForm;