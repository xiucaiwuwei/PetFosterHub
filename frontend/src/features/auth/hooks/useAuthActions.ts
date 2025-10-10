import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {login, register, logout, refreshToken, updateUserProfile, loadUserFromStorage} from '../slice/authSlice';
import type {AppDispatch} from '@/app/store/store';
import {UserRole} from "@/types";
import {LoginType} from '../types/enums';
import type {LoginRequest} from '../types/dto';
import {validateUpdateUserInfo, validateLoginForm, validateVerificationCodeForm} from '../utils/validationUtils';
import authService from '../services/authService';

// 定义表单错误接口
export interface LoginFormErrors {
    phone?: string;
    verificationCode?: string;
    password?: string;
    message?: string;
}

export interface RegisterFormErrors {
    phone?: string;
    verificationCode?: string;
    message?: string;
}

export interface UserInfoErrors {
    nickname?: string;
    password?: string;
}

/**
 * 自定义hook，用于封装所有认证相关操作
 */
const useAuthActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // 登录表单处理方法
    const handleLogin = async (
        phone: string,
        loginMethod: LoginType,
        verificationCode: string,
        password: string,
        selectedRole: UserRole,
        setErrors: (errors: LoginFormErrors) => void,
        setLoading: (loading: boolean) => void
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setErrors({});

            // 使用验证工具验证登录表单
            const methodStr = loginMethod === LoginType.password ? 'password' : 'verificationCode';
            const validationResult = validateLoginForm(phone, methodStr, verificationCode, password);

            if (!validationResult.isValid) {
                setErrors(validationResult.errors);
                return false;
            }

            // 根据登录方式构建不同的参数对象，避免类型断言
            const baseLoginParams = {
                phone,
                role: selectedRole,
                loginType: loginMethod,
                operationType: 'login',
                operationContent: loginMethod === LoginType.password ? '密码登录' : '验证码登录'
            };

            let loginParams: LoginRequest;
            if (loginMethod === LoginType.password) {
                loginParams = {
                    ...baseLoginParams,
                    password
                } as LoginRequest;
            } else {
                loginParams = {
                    ...baseLoginParams,
                    verificationCode
                } as LoginRequest;
            }

            await dispatch(login(loginParams)).unwrap();

            // 登录成功
            toast.success('登录成功！');
            navigate('/', {replace: true}); // 使用replace防止用户返回登录页
            return true;

        } catch (error: any) {
            // 保留原始错误消息，提供更精确的错误反馈
            // 注意：Redux Toolkit的unwrap()抛出的错误对象中，错误信息可能在不同属性中
            const errorMessage = error?.message || error?.toString() || '登录失败，请检查您的信息';
            setErrors({message: errorMessage});
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 注册表单处理方法
    const handleRegister = async (
        phone: string,
        verificationCode: string,
        role: UserRole,
        setErrors: (errors: RegisterFormErrors) => void,
        setLoading: (loading: boolean) => void
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setErrors({});

            // 使用验证工具验证注册表单（手机号+验证码）
            const validationResult = validateVerificationCodeForm(phone, verificationCode);

            if (!validationResult.isValid) {
                setErrors(validationResult.errors);
                return false;
            }

            const registerParams = {
                phone,
                verificationCode,
                role,
                operationType: 'register',
                operationContent: '用户注册'
            };

            await dispatch(register(registerParams)).unwrap();

            toast.success('注册成功！欢迎加入宠物寄养家');
            return true;
        } catch (error: any) {
            // 保留原始错误消息，提供更精确的错误反馈
            const errorMessage = error?.message || error?.toString() || '注册时发生错误，请稍后重试';
            setErrors({message: errorMessage});
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 处理登出
    const handleLogout = async (): Promise<void> => {
        try {
            await dispatch(logout()).unwrap();
            toast.success('登出成功！');
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('登出失败:', error);
            }
            // 即使登出API调用失败，也继续导航到登录页
        } finally {
            navigate('/login', {replace: true});
        }
    };

    // 处理刷新token
    const handleRefreshToken = async (currentRefreshToken: string): Promise<string | null> => {
        try {
            const result = await dispatch(refreshToken(currentRefreshToken)).unwrap();
            if (result && result.accessToken) {
                return result.accessToken;
            }

            throw new Error('刷新token失败：未获取到有效token');
        } catch (error: any) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('刷新token失败:', error);
            }

            // 保留原始错误消息，提供更精确的错误反馈
            toast.error(error?.message || error?.toString() || '会话已过期，请重新登录');

            // 刷新失败时，跳转到登录页面
            navigate('/login', {replace: true});
            return null;
        }
    };

    // 更新用户信息方法
    const updateUserInfo = async (
        nickname: string,
        password: string,
        setErrors?: (errors: UserInfoErrors) => void,
        setLoading?: (loading: boolean) => void
    ): Promise<boolean> => {
        try {
            if (setLoading) {
                setLoading(true);
            }

            // 使用验证工具验证用户信息
            const validationResult = validateUpdateUserInfo(nickname, password);

            if (!validationResult.isValid) {
                if (setErrors) {
                    setErrors(validationResult.errors);
                }

                // 抛出第一个验证错误
                const firstErrorKey = Object.keys(validationResult.errors)[0];
                throw new Error(validationResult.errors[firstErrorKey as keyof typeof validationResult.errors] || '用户信息验证失败');
            }

            // 获取当前用户信息
            const userInfo = authService.getUserInfoFromStorage();
            const userId = userInfo?.user?.userId || '0';

            // 调用Redux异步action更新用户信息
            const result = await dispatch(updateUserProfile({
                nickname,
                password,
                userId,
                operationType: 'updateUserInfo',
                operationContent: '更新用户信息'
            })).unwrap();

            if (result && result.success) {
                toast.success(result.message || '用户信息更新成功');

                // 重新加载用户信息，确保所有组件都能获取到最新数据
                await dispatch(loadUserFromStorage());

                return true;
            } else {
                throw new Error(result?.message || '用户信息更新失败');
            }
        } catch (error: any) {
            // 保留原始错误消息，提供更精确的错误反馈
            toast.error(error?.message || error?.toString() || '更新用户信息失败，请稍后重试');
            throw error;
        } finally {
            if (setLoading) {
                setLoading(false);
            }
        }
    };

    return {
        handleLogin,
        handleRegister,
        updateUserInfo,
        handleLogout,
        handleRefreshToken
    };
};

export default useAuthActions;