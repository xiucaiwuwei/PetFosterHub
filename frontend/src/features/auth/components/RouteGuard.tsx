import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

interface RouteGuardProps {
  // 可选的白名单路径，这些路径不需要认证
  whiteListedPaths?: string[];
  // 可选的管理员角色检查
  requireAdmin?: boolean;
}

/**
 * 全局路由守卫组件
 * 在路由切换时自动检查用户登录状态
 * 如果用户未登录，则重定向到登录页面
 * 如果需要管理员权限但用户不是管理员，则重定向到首页
 */
export const RouteGuard = ({ whiteListedPaths = [], requireAdmin = false }: RouteGuardProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 获取当前路径
        const currentPath = window.location.pathname;
        console.log('[RouteGuard] 检查路径:', currentPath);

        // 检查是否在白名单中
        const isWhiteListed = whiteListedPaths.some(path => 
          currentPath === path || currentPath.startsWith(`${path}/`)
        );
        
        if (isWhiteListed) {
          console.log('[RouteGuard] 路径在白名单中，允许访问:', currentPath);
          return;
        }

        // 检查用户是否已登录
        const loggedIn = authService.isLoggedIn();
        console.log('[RouteGuard] 登录状态检查结果:', { 
          loggedIn, 
          storeAuthenticated: isAuthenticated,
          hasUser: !!user
        });

        // 如果未登录，重定向到登录页
        if (!loggedIn) {
          console.log('[RouteGuard] 用户未登录，重定向到登录页');
          // 保存当前路径，以便登录后返回
          localStorage.setItem('redirectPath', currentPath);
          navigate('/login', { replace: true });
          return;
        }

        // 如果需要管理员权限，检查用户角色
        if (requireAdmin) {
          const userRole = user?.role || '';
          console.log('[RouteGuard] 检查管理员权限，用户角色:', userRole);
          
          if (userRole !== 'ADMIN') {
            console.log('[RouteGuard] 无管理员权限，重定向到首页');
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('[RouteGuard] 检查认证状态时出错:', error);
        // 发生错误时默认重定向到登录页
        navigate('/login', { replace: true });
      }
    };

    // 立即检查认证状态
    checkAuth();

    // 监听路由变化，再次检查认证状态
    const handleRouteChange = () => {
      checkAuth();
    };

    // 添加popstate事件监听器
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [navigate, isAuthenticated, user, whiteListedPaths, requireAdmin]);

  // 渲染子路由
  return <Outlet />;
};

export default RouteGuard;