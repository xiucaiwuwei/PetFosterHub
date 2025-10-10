import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// 导入组件
import RoleSelection from './RoleSelection';
import PhoneVerification from './PhoneVerification';
import PasswordLogin from './PasswordLogin';

// 导入自定义Hook
import useFormService from '../hooks/useFormService';

// 导入枚举类型
import { UserRole } from '../../../types/enums/UserRole';
import { LoginType } from '../types/enums/LoginType';

/**
 * 登录表单组件属性接口
 */
interface LoginFormProps {
    /**
     * 返回上一步的回调函数
     */
    onPrevStep: () => void;
}

/**
 * 登录表单组件
 * 提供角色选择、登录方式选择（验证码或密码）以及完整的登录流程
 * @param props 登录表单组件属性
 */
export default function LoginForm({ onPrevStep }: LoginFormProps) {
    const formService = useFormService();
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [errors, setErrors] = useState<{ phone?: string | undefined; verificationCode?: string | undefined; password?: string | undefined; message?: string | undefined }>({});
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.OWNER);
    const [loginMethod, setLoginMethod] = useState<LoginType>(LoginType.verificationCode);
    const [rememberMe, setRememberMe] = useState(false);

    // 组件挂载时，检查localStorage中是否有记住的用户信息
    useEffect(() => {
        const savedPhone = localStorage.getItem('rememberedPhone');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedPhone && savedPassword) {
            setPhone(savedPhone);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    /**
     * 处理登录提交事件
     * 验证表单数据并执行登录操作
     * @param e 表单提交事件
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 验证登录表单
        if (!formService.validateLoginForm(phone, loginMethod, setErrors, verificationCode, password)) {
            return;
        }

        // 处理记住我功能
        if (loginMethod === LoginType.password) {
            if (rememberMe) {
                // 记住用户信息到localStorage
                localStorage.setItem('rememberedPhone', phone);
                localStorage.setItem('rememberedPassword', password);
            } else {
                // 清除记住的用户信息
                localStorage.removeItem('rememberedPhone');
                localStorage.removeItem('rememberedPassword');
            }
        }

        await formService.handleLogin(phone, loginMethod, verificationCode, password, selectedRole, setErrors, setLoading);
    };

    const navigate = useNavigate();

    // 处理忘记密码
    const handleForgotPassword = () => {
        // 跳转到忘记密码页面
        navigate('/forgot-password');
    };

    /**
     * 切换到下一步（角色选择后进入登录方式选择）
     */
    const handleNextStep = () => {
        setCurrentStep(2);
    };

    /**
     * 返回上一步（从登录方式选择返回角色选择）
     */
    const handlePrevStep = () => {
        onPrevStep();
        // 同时更新组件内部的currentStep状态
        setCurrentStep(1);
        // 清空第二步填写的表单数据
        setPhone('');
        setVerificationCode('');
        setPassword('');
        setErrors({});
    };

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
                            <i className="fa-solid fa-paw text-4xl text-white"></i>
                        </motion.div>
                        <motion.h2
                            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            {currentStep === 1 ? '请选择角色' : '欢迎回来'}
                        </motion.h2>
                        <motion.p
                            className="text-gray-600"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            {currentStep === 1 ? '请选择您的身份，以便我们为您提供更好的服务' : '请选择登录方式'}
                        </motion.p>
                    </div>

                    {currentStep === 1 ? (
                        // 步骤1: 角色选择
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <RoleSelection
                                role={selectedRole}
                                onRoleChange={setSelectedRole}
                            />
                            <motion.button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full mt-8 py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span>下一步</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            </motion.button>
                        </motion.div>
                    ) : (
                        // 步骤2: 登录方式选择和表单
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 登录方式选择 */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <motion.button
                                    type="button"
                                    onClick={() => setLoginMethod(LoginType.verificationCode)}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${loginMethod === LoginType.verificationCode
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                  `}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <i className="fa-solid fa-shield-halved"></i>
                                        <span>验证码登录</span>
                                    </div>
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => setLoginMethod(LoginType.password)}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${loginMethod === LoginType.password
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                  `}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <i className="fa-solid fa-lock"></i>
                                        <span>密码登录</span>
                                    </div>
                                </motion.button>
                            </div>

                            {/* 使用独立的登录组件 */}
                            {loginMethod === LoginType.verificationCode ? (
                                <PhoneVerification
                                    phone={phone}
                                    setPhone={setPhone}
                                    verificationCode={verificationCode}
                                    setVerificationCode={(code) => setVerificationCode(code.replace(/\D/g, ''))}
                                    countdown={countdown}
                                    setCountdown={setCountdown}
                                    errors={{ phone: errors.phone, verificationCode: errors.verificationCode }}
                                    setErrors={(newErrors) => setErrors({ ...errors, ...newErrors })}
                                    type="login"
                                />
                            ) : (
                                <PasswordLogin
                                    phone={phone}
                                    setPhone={setPhone}
                                    password={password}
                                    setPassword={setPassword}
                                    errors={{ phone: errors.phone, password: errors.password }}
                                    setErrors={(newErrors) => setErrors({ ...errors, ...newErrors })}
                                    rememberMe={rememberMe}
                                    setRememberMe={setRememberMe}
                                    onForgotPassword={handleForgotPassword}
                                />
                            )}

                            {/* 登录按钮 - 美化版 */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <motion.i
                                            className="fa-solid fa-spinner fa-spin"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        ></motion.i>
                                        <span>登录中...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <motion.i
                                            className="fa-solid fa-right-to-bracket"
                                            initial={{ x: 0 }}
                                            whileHover={{ x: 2 }}
                                            transition={{ duration: 0.2 }}
                                        ></motion.i>
                                        <span>立即登录</span>
                                    </div>
                                )}
                            </button>

                            {/* 错误消息显示 */}
                            {errors.message && (
                                <motion.div
                                    className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-600 text-sm"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                    {errors.message}
                                </motion.div>
                            )}

                            {/* 返回按钮 - 步骤2 */}
                            <motion.button
                                type="button"
                                onClick={handlePrevStep}
                                className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <i className="fa-solid fa-arrow-left"></i>
                                    <span>返回角色选择</span>
                                </div>
                            </motion.button>
                        </form>
                    )}

                    {/* 注册链接 - 美化版 */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        <p className="text-sm text-gray-600">
                            还没有账户？{' '}
                            <Link
                                to="/register"
                                className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-all duration-300 inline-flex items-center group"
                            >
                                立即注册
                                <motion.i
                                    className="fa-solid fa-arrow-right text-xs ml-1 group-hover:translate-x-0.5 transition-transform duration-300"
                                ></motion.i>
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        );
    }