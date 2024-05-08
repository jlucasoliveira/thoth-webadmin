import { RouteObject } from 'react-router-dom';
import { lazyImport } from '@/utils/lazyImport';
import { App } from '@/components/Layout';

const { BrandsRoutes } = lazyImport(() => import('@/features/brands'), 'BrandsRoutes');

const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [{ path: 'brands/*', element: <BrandsRoutes /> }],
  },
];

export { privateRoutes };
