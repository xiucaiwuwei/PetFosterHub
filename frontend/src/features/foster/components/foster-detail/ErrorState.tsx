/**
 * 错误状态展示组件
 * 当寄养服务详情加载失败时显示的界面
 */
import {Navbar} from '@/components/layout/Navbar.tsx';
import {Footer} from '@/features/home/components/Footer.tsx';
import {useNavigate} from 'react-router-dom';

export const ErrorState = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-grow flex items-center justify-center pt-16">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-exclamation-triangle text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">服务不存在或已被移除</h3>
                    <button
                        onClick={() => navigate('/fosters')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mt-4"
                    >
                        返回寄养服务列表
                    </button>
                </div>
            </main>
            <Footer/>
        </div>
    );
};