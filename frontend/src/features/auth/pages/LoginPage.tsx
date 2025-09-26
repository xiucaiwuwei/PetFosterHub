import { useState } from 'react';
import { motion } from 'framer-motion';

// 导入组件
import AuthHeader from '../components/AuthHeader';
import LoginForm from '../components/LoginForm';

// 登录页组件
export default function LoginPage() {
  const [, setCurrentStep] = useState<1 | 2>(1);

  // 返回上一步
  const handlePrevStep = () => {
    setCurrentStep(1);
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
          <LoginForm onPrevStep={handlePrevStep} />
        </motion.div>
      </main>
    </div>
  );
}
