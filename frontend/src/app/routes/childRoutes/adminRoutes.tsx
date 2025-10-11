import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout.tsx';
import { RouteGuard } from '@/features/auth/components/RouteGuard';
import Admin from '@/features/admin/pages/Admin.tsx';
import Users from '@/features/admin/pages/Users.tsx';
import Products from '@/features/admin/pages/Products.tsx';
import Orders from '@/features/admin/pages/Orders.tsx';
import Consultations from '@/features/admin/pages/Consultations.tsx';
import Reports from '@/features/admin/pages/Reports.tsx';

const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      // 使用RouteGuard保护管理员路由，并要求管理员权限
      {
        element: <RouteGuard requireAdmin={true} />,
        children: [
          {
            path: 'users',
            element: <Users />
          },
          {
            path: 'products',
            element: <Products />
          },
          {
            path: 'orders',
            element: <Orders />
          },
          {
            path: 'consultations',
            element: <Consultations />
          },
          {
            path: 'reports',
            element: <Reports />
          },
          {
            path: '',
            element: <Admin />
          }
        ]
      }
    ]
  }
];

export default adminRoutes;