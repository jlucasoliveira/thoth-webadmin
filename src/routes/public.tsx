import { EntryRoute } from '@/components/Routers';
import { lazyImport } from '@/utils/lazyImport';
import { RouteObject } from 'react-router-dom';

const { AuthRoutes } = lazyImport(() => import('@/features/auth'), 'AuthRoutes');

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <EntryRoute />,
  },
  {
    path: '/auth/*',
    element: <AuthRoutes />,
  },
];

export { publicRoutes };
