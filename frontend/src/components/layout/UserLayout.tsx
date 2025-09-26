import {Outlet} from 'react-router-dom';
import {Navbar} from './Navbar';
import useUserInfoCheck from '@/features/auth/hooks/useUserInfoCheck';

/**
 * 用户端布局组件 - 实现上下结构
 * 上部为固定导航栏，中间为主体内容，底部为页脚
 */
export function UserLayout() {
    // 在用户登录后自动检查用户信息是否完整
    useUserInfoCheck({
      // 添加自定义配置以增强调试和功能
      checkInterval: 30000, // 每30秒检查一次，确保用户信息保持完整
      redirectStorageKey: 'redirectAfterCompleteProfile',
      customCheck: (userInfo) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[UserLayout] 检查用户信息完整性:', userInfo);
        }
        return userInfo?.user?.nickname && userInfo.user.nickname.trim() !== '';
      }
    });

    return (
    <div className="flex flex-col min-h-screen">
      {/* 头部导航 */}
      <Navbar />

      {/* 主体内容区域 - 占据剩余空间，并为固定导航栏留出顶部空间 */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}