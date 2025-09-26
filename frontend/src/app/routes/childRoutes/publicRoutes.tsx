import {RouteObject} from 'react-router-dom';
import {UserLayout} from '@/components/layout/UserLayout';
import Home from '@/features/home/pages/Home';
import FosterList from '@/features/foster/pages/FosterList';
import Login from '@/features/auth/pages/LoginPage';
import Register from '@/features/auth/pages/RegisterPage';
import ForgotPassword from '@/features/auth/pages/ForgotPasswordPage';
import FosterDetail from '@/features/foster/pages/FosterDetail';
import SupportPage from '@/features/support/pages/SupportPage';
import PetConsultation from '@/features/consultation/pages/PetConsultation';
import PetStore from '@/features/food/pages/FoodStore';
import FoodDetail from '@/features/food/pages/FoodDetail';
import CompleteProfilePage from '@/features/auth/pages/CompleteProfilePage';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'fosters',
        element: <FosterList />
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
        path: 'food-store',
        element: <PetStore />
      },
      {
        path: 'food-store/:id',
        element: <FoodDetail />
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
        element: <CompleteProfilePage/>
  }
]

export default publicRoutes;