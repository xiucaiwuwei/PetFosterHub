import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 导入组件
import AuthHeader from '../components/AuthHeader';
import { ForgotPasswordForm } from '../components';

// 忘记密码页面组件
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [phone, setPhone] = useState('');

  // 处理重置密码成功
  const handleResetSuccess = (userPhone: string) => {
    setPhone(userPhone);
    setIsSuccess(true);
  };

  // 返回登录页面
  const handleBackToLogin = () => {
    navigate('/login');
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
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-orange-100 p-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <i className="fa-solid fa-check text-green-500 text-xl"></i>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">重置链接已发送</h2>
                <p className="text-gray-600">
                  我们已向 <span className="font-medium text-orange-600">{phone}</span> 发送了重置密码的链接
                </p>
              </div>
              
              <motion.button
                type="button"
                onClick={handleBackToLogin}
                className="w-full py-3 px-6 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                返回登录
              </motion.button>
            </motion.div>
          ) : (
            <ForgotPasswordForm onResetSuccess={handleResetSuccess} />
          )}
        </motion.div>
      </main>
    </div>
  );
}