import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 导入组件
import AuthHeader from '../components/AuthHeader';
import RegisterForm from '../components/RegisterForm';

// 美化后的注册界面

export default function RegisterPage() {
    const navigate = useNavigate();

    // 处理注册成功
    const handleRegisterSuccess = () => {
        // 注册成功后可以跳转到登录页面或首页
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-orange-100/30 to-white">
            {/* 装饰元素 - 增强版 */}
            <div
                className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -mr-48 -mt-48 z-0"></div>
            <div
                className="fixed bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -ml-48 -mb-48 z-0"></div>
            <div
                className="fixed top-1/3 left-1/4 w-64 h-64 bg-orange-300 rounded-full filter blur-3xl opacity-10 z-0"></div>
            <div
                className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-orange-400 rounded-full filter blur-3xl opacity-10 z-0"></div>

            {/* 通用认证页面头部组件 */}
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-orange-100"
                    >
                        <div className="px-8 py-10 sm:px-10 sm:py-12">
                            {/* 标题区域 - 美化版 */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ rotate: -5, scale: 0.9 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ duration: 0.7, delay: 0.3, ease: "backOut", stiffness: 100 }}
                                    className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                                >
                                    <i className="fa-solid fa-user-plus text-4xl text-white"></i>
                                </motion.div>
                                <motion.h2
                                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    创建账户
                                </motion.h2>
                                <motion.p
                                    className="text-gray-600"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    加入宠物寄养家，开始您的寄养之旅
                                </motion.p>
                            </div>

                            {/* 使用封装的注册表单组件 */}
                            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />

                            {/* 登录链接 - 美化版 */}
                            <motion.div
                                className="mt-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                            >
                                <p className="text-sm text-gray-600">
                                    已有账户？{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-all duration-300 inline-flex items-center group"
                                    >
                                        立即登录
                                        <motion.i
                                            className="fa-solid fa-arrow-right text-xs ml-1 group-hover:translate-x-0.5 transition-transform duration-300"
                                        ></motion.i>
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
