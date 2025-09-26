import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
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
];

export default adminRoutes;