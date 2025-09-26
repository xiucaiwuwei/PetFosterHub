import React from 'react';
import {motion} from 'framer-motion';

// Hooks
import useFormService from '../hooks/useFormService';
import { VerificationCodeType } from '../types/enums/VerificationCodeType';
import { UserRole } from '../types/enums/UserRole';

/**
 * 判断是否为开发环境
 */
const isDevMode = import.meta.env.DEV;

interface PhoneVerificationProps {
    phone: string;
    setPhone: (phone: string) => void;
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    countdown: number;
    setCountdown: (seconds: number) => void;
    errors: {
        phone?: string | undefined;
        verificationCode?: string | undefined;
    };
    setErrors: (errors: { phone?: string | undefined; verificationCode?: string | undefined }) => void;
    type?: 'login' | 'register';
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
                                                                 phone,
                                                                 setPhone,
                                                                 verificationCode,
                                                                 setVerificationCode,
                                                                 countdown,
                                                                 setCountdown,
                                                                 errors,
                                                                 setErrors,
                                                                 type = 'register'
                                                             }) => {
    const formService = useFormService();
    const [loading, setLoading] = React.useState(false);
    
    // 获取验证码
    const handleGetVerificationCode = async () => {
        if (!formService.validatePhoneNumber(phone)) {
            setErrors({ phone: '请输入有效的手机号码' });
            return;
        }
        
        setLoading(true);
        try {
            const codeType = type === 'login' ? VerificationCodeType.LOGIN : VerificationCodeType.REGISTER;
            const success = await formService.sendVerificationCode(
                phone, 
                UserRole.OWNER, // 默认使用OWNER角色
                codeType
            );
            if (success) {
                setCountdown(60);
            }
        } catch (error) {
            setErrors({ phone: '发送验证码失败，请稍后重试' });
        } finally {
            setLoading(false);
        }
    };

    // 开发环境下，提供便捷的自动填充功能
    React.useEffect(() => {
        if (isDevMode) {
            console.log('开发环境: 验证码默认为 123456');
            // 可选：自动填充验证码
            // setVerificationCode('123456');
        }
    }, []);

    return (
        <>
            <div
                className="relative group mb-6"
            >
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

            <div
                className="relative group"
            >
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                    验证码
                </label>
                <div className="flex space-x-2.5">
                    <div className="relative flex-1">
                        <div
                            className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                            <i className={`fa-solid fa-shield-alt ${errors.verificationCode ? 'text-red-500' : 'text-orange-400'}`}></i>
                        </div>
                        <input
                            id="verificationCode"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.verificationCode ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}
                rounded-xl focus:outline-none transition-all duration-300
                placeholder-gray-400 group-hover:border-orange-200 ${errors.verificationCode ? 'group-hover:border-red-400' : ''}`}
                            placeholder="6位数字验证码"
                            maxLength={6}
                        />
                        <div
                            className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                    <motion.button
                        type="button"
                        onClick={handleGetVerificationCode}
                        disabled={countdown > 0 || !!errors.phone || loading}
                        className={`flex-shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${countdown > 0 || errors.phone || loading
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
                        whileHover={countdown === 0 && !errors.phone && !loading ? {scale: 1.03} : {}}
                        whileTap={countdown === 0 && !errors.phone && !loading ? {scale: 0.98} : {}}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <i className="fa-solid fa-spinner fa-spin mr-1.5"></i>
                                发送中...
                            </span>
                        ) : (
                            countdown > 0 ? `重新获取(${countdown}s)` : '获取验证码'
                        )}
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
        </>
    );
};

export default PhoneVerification;