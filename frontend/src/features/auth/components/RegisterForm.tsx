import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';

// 组件
import RoleSelection from './RoleSelection';
import PhoneVerification from './PhoneVerification';
import useFormService from '../hooks/useFormService';
import { UserRole } from '../types/enums/UserRole';

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const formService = useFormService();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [role, setRole] = useState<UserRole>(UserRole.OWNER);
  const [loading, setLoading] = useState(false);

    // 当前注册步骤 1: 选择角色, 2: 填写手机号和验证码
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{
    phone?: string | undefined;
    verificationCode?: string | undefined;
  }>({});

    // 处理注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 2) {
        // 验证手机号和验证码
      if (!formService.validateRegisterForm(step, phone, verificationCode, setErrors)) {
        return;
      }

      const success = await formService.handleRegister(
        phone, 
        verificationCode,
        role, 
        setErrors, 
        setLoading
      );

      if (success) {
          handleRegisterSuccess();
      }
    }
  };

    // 注册成功后的处理逻辑
    const handleRegisterSuccess = () => {
        // 注册成功后，调用回调并跳转到登录页面
        if (onRegisterSuccess) {
            onRegisterSuccess();
        }
        navigate('/login');
  };

  // 下一步
  const handleNextStep = () => {
    setStep(prev => prev + 1);
    // 清除错误提示
    setErrors({});
  };

  // 上一步
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    // 清除错误提示
    setErrors({});
    // 清空第二步填写的表单数据
    setPhone('');
    setVerificationCode('');
  };

    // 渲染第一步：角色选择
    const renderRoleSelection = () => {
        if (step !== 1) return null;
        return <RoleSelection role={role} onRoleChange={(newRole: UserRole) => setRole(newRole)}/>;
    };

    // 渲染第二步：手机号验证
    const renderPhoneVerification = () => {
        if (step !== 2) return null;
        return (
            <PhoneVerification
                phone={phone}
                setPhone={setPhone}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                countdown={countdown}
                setCountdown={setCountdown}
                errors={{
                    phone: errors.phone ?? '',
                    verificationCode: errors.verificationCode ?? ''
                }}
                setErrors={(newErrors: {
                    phone?: string | undefined;
                    verificationCode?: string | undefined
                }) => setErrors({...errors, ...newErrors})}
            />
        );
    };

    // 渲染按钮区域
    const renderButtons = () => {
        // 第一步：只有下一步按钮
        if (step === 1) {
            return (
        <motion.button
          type="button"
          onClick={handleNextStep}
          initial={{opacity: 0, x: 10}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.3}}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.3)'
          }}
          whileTap={{scale: 0.98}}
          className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>下一步</span>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </motion.button>
            );
        }

        // 第二步：显示"立即注册"按钮和返回按钮
        if (step === 2) {
            return (
        <div className="flex flex-col space-y-4 mt-8">
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>注册中...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <i className="fa-solid fa-user-plus"></i>
                <span>立即注册</span>
              </div>
            )}
          </motion.button>

            <motion.button
                type="button"
                onClick={handlePrevStep}
                className="w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                <div className="flex items-center justify-center space-x-2">
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>返回角色选择</span>
                </div>
            </motion.button>
        </div>
            );
        }

        return null;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 表单内容区域 */}
            {renderRoleSelection()}
            {renderPhoneVerification()}

            {/* 按钮区域 */}
            {renderButtons()}
    </form>
  );
};

export default RegisterForm;