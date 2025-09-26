// 路由配置文件
import { RouteObject } from 'react-router-dom';
import publicRoutes from './childRoutes/publicRoutes.tsx';
import protectedRoutes from './childRoutes/protectedRoutes.tsx';
import adminRoutes from './childRoutes/adminRoutes.tsx';

// 合并所有路由
const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes
];

export default routes;