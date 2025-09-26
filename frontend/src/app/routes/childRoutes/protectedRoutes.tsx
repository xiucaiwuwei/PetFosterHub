import { RouteObject } from 'react-router-dom';
import { UserLayout } from '@/components/layout/UserLayout';
import Profile from '@/features/user/pages/Profile.tsx';
import Messages from '@/features/messages/pages/Messages.tsx';
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
        element: <Messages />
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