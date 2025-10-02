import { RouteObject } from 'react-router-dom';
import { UserLayout } from '@/components/layout/UserLayout.tsx';
import HomePage from '@/features/home/pages/HomePage.tsx';
import FosterHome from '@/features/foster/pages/FosterHome';
import Login from '@/features/auth/pages/LoginPage';
import Register from '@/features/auth/pages/RegisterPage';
import ForgotPassword from '@/features/auth/pages/ForgotPasswordPage';
import FosterDetail from '@/features/foster/pages/FosterDetail';
import SupportPage from '@/features/support/pages/SupportPage';
import PetConsultation from '@/features/consultation/pages/PetConsultation';
import PetStore from '@/features/petStore/pages/PetStore';
import PetStoreDetail from '@/features/petStore/pages/PetStoreDetail';
import CompleteProfilePage from '@/features/auth/pages/CompleteProfilePage';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'fosters',
        element: <FosterHome />
      },
      {
        path: 'support',
        element: <SupportPage />
      },
      {
        path: 'fosters/:id',
        element: <FosterDetail />
      },
      {
        path: 'pet-consultation',
        element: <PetConsultation />
      },
      {
        path: 'pet-store',
        element: <PetStore />
      },
      {
        path: 'pet-store/:id',
        element: <PetStoreDetail />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/complete-profile',
    element: <CompleteProfilePage />
  }
]

export default publicRoutes;