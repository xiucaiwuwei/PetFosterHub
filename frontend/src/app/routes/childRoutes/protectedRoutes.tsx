import { RouteObject } from 'react-router-dom';
import { UserLayout } from '@/components/layout/UserLayout.tsx';
import { RouteGuard } from '@/features/auth/components/RouteGuard';
import Profile from '@/features/user/pages/ProfilePage';
import MessagesHome from '@/features/messages/pages/MessagesHome.tsx';
import ApplyFoster from '@/features/foster/pages/ApplyFoster';
import ApplyServiceProvider from '@/features/serviceProvider/pages/ApplyServiceProvider';
import OrderDetail from '@/features/order/pages/OrderDetail';

const protectedRoutes: RouteObject[] = [
  // 个人中心页面 - 使用固定高度布局
  {
    path: '/profile',
    element: <UserLayout fixedHeight={true} />,
    children: [
      {
        element: <RouteGuard />,
        children: [
          {
            path: '',
            element: <Profile />
          },
          {
            path: 'orders/:id',
            element: <OrderDetail />
          }
        ]
      }
    ]
  },
  // 其他需要认证的页面 - 使用正常布局
  {
    path: '/',
    element: <UserLayout />,
    children: [
      // 使用RouteGuard保护所有需要认证的路由
      {
        element: <RouteGuard />,
        children: [
          {
            path: 'messages',
            element: <MessagesHome />
          },
          {
            path: 'apply-foster',
            element: <ApplyFoster />
          },
          {
            path: 'apply-service',
            element: <ApplyServiceProvider />
          }
        ]
      }
    ]
  }
];

export default protectedRoutes;