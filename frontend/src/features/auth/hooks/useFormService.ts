import useVerificationCode from './useVerificationCode';
import useAuthFormValidation from './useAuthFormValidation';
import useInputHandlers from './useInputHandlers';
import usePasswordReset from './usePasswordReset';
import useAuthActions from './useAuthActions';

// 定义表单服务返回类型
export interface FormService {
  // 验证码相关方法
  sendVerificationCode: ReturnType<typeof useVerificationCode>['sendVerificationCode'];
  countdown: ReturnType<typeof useVerificationCode>['countdown'];
  isSending: ReturnType<typeof useVerificationCode>['isSending'];
  startCountdown: ReturnType<typeof useVerificationCode>['startCountdown'];
  clearError: ReturnType<typeof useVerificationCode>['clearError'];
  
  // 表单验证方法
  validateLoginForm: ReturnType<typeof useAuthFormValidation>['validateLoginForm'];
  validateRegisterForm: ReturnType<typeof useAuthFormValidation>['validateRegisterForm'];
  validateVerificationCodeForm: ReturnType<typeof useAuthFormValidation>['validateVerificationCodeForm'];
  validatePasswordResetForm: ReturnType<typeof useAuthFormValidation>['validatePasswordResetForm'];
  validatePhoneNumber: ReturnType<typeof useAuthFormValidation>['validatePhoneNumber'];
  clearAuthErrorState: ReturnType<typeof useAuthFormValidation>['clearAuthErrorState'];
  
  // 输入处理方法
  handleInputChange: ReturnType<typeof useInputHandlers>['handleInputChange'];
  handlePhoneChange: ReturnType<typeof useInputHandlers>['handlePhoneChange'];
  handleVerificationCodeChange: ReturnType<typeof useInputHandlers>['handleVerificationCodeChange'];
  handleTextChange: ReturnType<typeof useInputHandlers>['handleTextChange'];
  handlePasswordChange: ReturnType<typeof useInputHandlers>['handlePasswordChange'];
  handleConfirmPasswordChange: ReturnType<typeof useInputHandlers>['handleConfirmPasswordChange'];
  
  // 密码重置方法
  performResetPassword: ReturnType<typeof usePasswordReset>['performResetPassword'];
  verifyResetCode: ReturnType<typeof usePasswordReset>['verifyResetCode'];
  handleSendVerificationCode: ReturnType<typeof usePasswordReset>['handleSendVerificationCode'];
  handleVerifyCode: ReturnType<typeof usePasswordReset>['handleVerifyCode'];
  handleResetPassword: ReturnType<typeof usePasswordReset>['handleResetPassword'];
  
  // 认证操作方法
  handleLogin: ReturnType<typeof useAuthActions>['handleLogin'];
  handleRegister: ReturnType<typeof useAuthActions>['handleRegister'];
  handleLogout: ReturnType<typeof useAuthActions>['handleLogout'];
  handleRefreshToken: ReturnType<typeof useAuthActions>['handleRefreshToken'];
  updateUserInfo: ReturnType<typeof useAuthActions>['updateUserInfo'];
  
  // 工具方法
  generateTempPassword: () => string;
}

/**
 * 表单服务Hook，整合所有认证相关的表单服务
 * @returns 表单服务对象，包含所有认证相关的表单处理方法
 */
const useFormService = (): FormService => {
  // 导入各个功能模块
  const verificationCodeService = useVerificationCode();
  const validationService = useAuthFormValidation();
  const inputHandlers = useInputHandlers();
  const passwordResetService = usePasswordReset();
  const authActions = useAuthActions();

  /**
   * 生成更安全的临时密码
   * @returns 生成的临时密码，包含大小写字母、数字和特殊字符
   */
  const generateTempPassword = (): string => {
    const length = 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // 确保包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符
    password += chars.charAt(Math.floor(Math.random() * 26)); // 大写字母
    password += chars.charAt(Math.floor(Math.random() * 26) + 26); // 小写字母
    password += chars.charAt(Math.floor(Math.random() * 10) + 52); // 数字
    password += chars.charAt(Math.floor(Math.random() * 8) + 62); // 特殊字符
    
    // 填充剩余字符
    for (let i = 4; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // 打乱字符顺序
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // 整合所有服务方法
  return {
    // 验证码相关服务
    ...verificationCodeService,
    
    // 表单验证服务
    ...validationService,
    
    // 输入处理服务
    ...inputHandlers,
    
    // 密码重置服务
    ...passwordResetService,
    
    // 认证操作服务
    ...authActions,
    
    // 其他工具方法
    generateTempPassword
  };
};

export default useFormService;