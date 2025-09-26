import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

/**
 * 密码登录组件属性接口
 */
interface PasswordLoginProps {
    phone: string;
    setPhone: (phone: string) => void;
    password: string;
    setPassword: (password: string) => void;
    errors: {
        phone?: string | undefined;
        password?: string | undefined;
    };
    setErrors: (errors: { phone?: string | undefined; password?: string | undefined }) => void;
    rememberMe?: boolean;
    setRememberMe?: (rememberMe: boolean) => void;
    onForgotPassword?: () => void;
}

/**
 * 密码登录组件
 * 提供手机号和密码输入框，用于密码登录方式
 * @param props 密码登录组件属性
 * @returns 密码登录表单组件
 */
const PasswordLogin: React.FC<PasswordLoginProps> = ({
    phone,
    setPhone,
    password,
    setPassword,
    errors,
    rememberMe: propsRememberMe = false,
    setRememberMe: propsSetRememberMe,
    onForgotPassword }) => {
    const [localRememberMe, setLocalRememberMe] = useState(propsRememberMe);
    
    // 当props中的rememberMe变化时，更新本地状态
    useEffect(() => {
        setLocalRememberMe(propsRememberMe);
    }, [propsRememberMe]);
    
    // 处理记住我状态变化
    const handleRememberMeChange = (checked: boolean) => {
        setLocalRememberMe(checked);
        if (propsSetRememberMe) {
            propsSetRememberMe(checked);
        }
    };
    
    return (
        <>
            {/* 手机号输入框 */}
            <div className="relative group mb-6">
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
                        onChange={(e) => setPhone(e.target.value)}
                        className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}
          rounded-xl focus:outline-none transition-all duration-300
          placeholder-gray-400 group-hover:border-orange-200 ${errors.phone ? 'group-hover:border-red-400' : ''}`}
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

            {/* 密码输入框 */}
            <div className="relative group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    密码
                </label>
                <div className="relative">
                    <div
                        className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                        <i className={`fa-solid fa-lock ${errors.password ? 'text-red-500' : 'text-orange-400'}`}></i>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}
          rounded-xl focus:outline-none transition-all duration-300
          placeholder-gray-400 group-hover:border-orange-200 ${errors.password ? 'group-hover:border-red-400' : ''}`}
                        placeholder="请输入密码"
                    />
                    <div
                        className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
                {errors.password && (
                    <motion.p
                        className="mt-1 text-sm text-red-600 animate-fadeIn"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                        {errors.password}
                    </motion.p>
                )}
            </div>
            
            {/* 记住我和忘记密码 */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={localRememberMe}
                        onChange={(e) => handleRememberMeChange(e.target.checked)}
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-200 transition-colors"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                        记住我
                    </label>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-orange-500 hover:text-orange-600 transition-colors focus:outline-none"
                    >
                        忘记密码？
                    </button>
                </div>
            </div>
        </>
    );
};

export default PasswordLogin;