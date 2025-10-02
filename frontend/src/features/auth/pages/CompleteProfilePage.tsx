import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import AuthHeader from '../components/AuthHeader';
import UserInfoForm from '../components/UserInfoForm';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';

interface FormValues {
  name?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
}

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ name?: string | undefined; password?: string | undefined; confirmPassword?: string | undefined }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key in keyof FormValues]?: string } = {};
    
    if (!formValues.name || formValues.name.length < 2 || formValues.name.length > 20) {
      newErrors.name = !formValues.name ? '请输入昵称' : (formValues.name.length < 2 ? '昵称长度至少为2个字符' : '昵称长度不能超过20个字符');
    }
    
    if (!formValues.password || formValues.password.length < 6) {
      newErrors.password = '密码长度至少为6个字符';
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(formValues.password)) {
      newErrors.password = '密码至少包含字母和数字';
    }
    
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!validateForm()) {
        return;
      }

      setLoading(true);

      // 调用服务更新用户信息
      const userInfo: any = LocalStorageManager.getItem('userInfo');
      await authService.updateUserInfo({
        userId: userInfo && 'userId' in userInfo ? String(userInfo.userId) : '',
        nickname: formValues.name || '',
        password: formValues.password || '',
        operationType: 'UPDATE',
        operationContent: '完善用户信息'
      });

      // 更新本地存储中的用户信息
      const updatedUserInfo: any = LocalStorageManager.getItem('userInfo');
      if (updatedUserInfo && 'user' in updatedUserInfo && updatedUserInfo.user) {
        updatedUserInfo.user.nickname = formValues.name || '';
        LocalStorageManager.setItem('userInfo', updatedUserInfo);
      }

      // 从本地存储获取之前保存的重定向路径，如果没有则使用默认路径
      const redirectPath = LocalStorageManager.getItem('redirectAfterCompleteProfile');
      const redirectPathString = typeof redirectPath === 'string' ? redirectPath : '/';
      
      // 确保跳转路径是有效的
      const isValidPath = redirectPathString.startsWith('/') && !redirectPathString.includes('complete-profile');
      const finalRedirectPath = isValidPath ? redirectPathString : '/';
      
      // 添加调试信息
      if (process.env.NODE_ENV !== 'production') {
        console.log('[CompleteProfilePage] 重定向路径:', finalRedirectPath);
      }
      
      // 清除重定向路径
      LocalStorageManager.removeItem('redirectAfterCompleteProfile');
      
      // 显示成功消息
      toast.success('用户信息完善成功！');
      
      // 立即跳转，减少用户等待感
      setTimeout(() => {
        // 使用replace选项防止用户返回此页面
        navigate(finalRedirectPath, { replace: true });
      }, 500); // 减少延迟时间，仍保留短暂延迟确保用户能看到成功提示
    } catch (error) {
      console.error('更新用户信息失败:', error);
      toast.error('更新用户信息失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-orange-100/30 to-white">
      {/* 装饰元素 - 增强版 */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -mr-48 -mt-48 z-0"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -ml-48 -mb-48 z-0"></div>
      <div className="fixed top-1/3 left-1/4 w-64 h-64 bg-orange-300 rounded-full filter blur-3xl opacity-10 z-0"></div>
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-orange-400 rounded-full filter blur-3xl opacity-10 z-0"></div>

      {/* 通用认证页面头部组件 */}
      <AuthHeader />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">完善用户信息</h1>
            <form onSubmit={handleSubmit}>
              <UserInfoForm
                name={formValues.name || ''}
                setName={(name) => setFormValues(prev => ({ ...prev, name }))}
                password={formValues.password || ''}
                setPassword={(password) => setFormValues(prev => ({ ...prev, password }))}
                confirmPassword={formValues.confirmPassword || ''}
                setConfirmPassword={(confirmPassword) => setFormValues(prev => ({ ...prev, confirmPassword }))}
                errors={errors}
                setErrors={setErrors}
              />

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      处理中...
                    </div>
                  ) : (
                    '完成'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CompleteProfilePage;