import { RouteObject } from 'react-router-dom';
import { UserLayout } from '@/components/layout/UserLayout.tsx';
import Profile from '@/features/user/pages/Profile.tsx';
import MessagesHome from '@/features/messages/pages/MessagesHome.tsx';
import ApplyFoster from '@/features/foster/pages/ApplyFoster';
import ApplyServiceProvider from '@/features/serviceProvider/pages/ApplyServiceProvider';
import OrderDetail from '@/features/order/pages/OrderDetail';

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: 'profile',
        element: <Profile />
      },
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
      },
      {
        path: 'profile/orders/:id',
        element: <OrderDetail />
      }
    ]
  }
];

export default protectedRoutes;