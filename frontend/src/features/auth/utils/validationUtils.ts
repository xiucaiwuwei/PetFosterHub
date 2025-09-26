// 验证工具类，用于封装表单验证规则

// 验证结果接口定义
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// 过滤非数字字符
export const filterNumeric = (input: string): string => {
  return input.replace(/\D/g, '');
}

// 验证手机号
export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  
  if (!phone) {
    return { isValid: false, errorMessage: '请输入手机号码' };
  }
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, errorMessage: '请输入有效的手机号码' };
  }
  
  return { isValid: true };
};

// 验证验证码
export const validateVerificationCode = (code: string): ValidationResult => {
  const codeRegex = /^\d{6}$/;
  
  if (!code) {
    return { isValid: false, errorMessage: '请输入验证码' };
  }
  
  if (!codeRegex.test(code)) {
    return { isValid: false, errorMessage: '验证码应为6位数字' };
  }
  
  return { isValid: true };
};

// 验证密码
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, errorMessage: '请输入密码' };
  }
  
  if (password.length < 6) {
    return { isValid: false, errorMessage: '密码长度至少为6个字符' };
  }
  
  return { isValid: true };
};

// 验证确认密码
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, errorMessage: '请确认密码' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, errorMessage: '两次输入的密码不一致' };
  }
  
  return { isValid: true };
};

// 验证用户名/昵称
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, errorMessage: '请输入您的昵称' };
  }
  
  return { isValid: true };
};

// 验证用户信息更新表单
export const validateUpdateUserInfo = (
  nickname: string,
  password: string
): { isValid: boolean; errors: { nickname?: string; password?: string } } => {
  const errors: { nickname?: string; password?: string } = {};
  
  // 验证昵称
  if (!nickname || nickname.trim() === '') {
    errors.nickname = '昵称不能为空';
  }
  
  // 验证密码
  if (!password || password.length < 8) {
    errors.password = '密码长度至少为8位';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// 综合验证函数，用于登录表单
export const validateLoginForm = (
  phone: string,
  method: 'verificationCode' | 'password',
  verificationCode?: string,
  password?: string
): { isValid: boolean; errors: { phone?: string; verificationCode?: string; password?: string } } => {
  const errors: { phone?: string; verificationCode?: string; password?: string } = {};
  
  // 验证手机号
  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.errorMessage || '手机号验证失败';
  }
  
  // 根据登录方式验证
  if (method === 'verificationCode') {
    const codeValidation = validateVerificationCode(verificationCode || '');
    if (!codeValidation.isValid) {
      errors.verificationCode = codeValidation.errorMessage || '验证码验证失败';
    }
  } else {
    const passwordValidation = validatePassword(password || '');
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errorMessage || '密码验证失败';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 综合验证函数，用于验证码表单（手机号+验证码）
export const validateVerificationCodeForm = (
  phone: string,
  verificationCode: string,
): { isValid: boolean; errors: { phone?: string; verificationCode?: string } } => {
  const errors: { phone?: string; verificationCode?: string } = {};
  
  // 验证手机号
  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.errorMessage || '手机号验证失败';
  }
  
  // 验证验证码
  const codeValidation = validateVerificationCode(verificationCode);
  if (!codeValidation.isValid) {
    errors.verificationCode = codeValidation.errorMessage || '验证码验证失败';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 综合验证函数，用于密码重置表单（新密码+确认密码）
export const validatePasswordResetForm = (
  newPassword: string,
  confirmPassword: string,
): { isValid: boolean; errors: { password?: string; confirmPassword?: string } } => {
  const errors: { password?: string; confirmPassword?: string } = {};
  
  // 验证新密码
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errorMessage || '密码验证失败';
  }
  
  // 验证确认密码
  if (passwordValidation.isValid) {
    const confirmPasswordValidation = validateConfirmPassword(newPassword, confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.errorMessage || '确认密码验证失败';
    }
  } else if (!confirmPassword) {
    errors.confirmPassword = '请确认新密码';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 综合验证函数，用于注册表单
export const validateRegisterForm = (
  step: number,
  phone: string,
  verificationCode: string
): { isValid: boolean; errors: { phone?: string; verificationCode?: string } } => {
  const errors: { phone?: string; verificationCode?: string } = {};
  
  // 验证手机号（步骤2及以上）
  if (step >= 2) {
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.errorMessage || '手机号验证失败';
    }
    
    // 验证验证码（步骤2及以上）
    const codeValidation = validateVerificationCode(verificationCode);
    if (!codeValidation.isValid) {
      errors.verificationCode = codeValidation.errorMessage || '验证码验证失败';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};