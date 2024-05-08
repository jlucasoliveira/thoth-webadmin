import { RouteObject } from 'react-router-dom';
import { lazyImport } from '@/utils/lazyImport';
import { App } from '@/components/Layout';

const { BrandsRoutes } = lazyImport(() => import('@/features/brands'), 'BrandsRoutes');
const { CategoriesRoutes } = lazyImport(() => import('@/features/categories'), 'CategoriesRoutes');
const { GendersRoutes } = lazyImport(() => import('@/features/genders'), 'GendersRoutes');
const { ProductRoutes } = lazyImport(() => import('@/features/products'), 'ProductRoutes');

const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'brands/*', element: <BrandsRoutes /> },
      { path: 'genders/*', element: <GendersRoutes /> },
      { path: 'categories/*', element: <CategoriesRoutes /> },
      { path: 'products/*', element: <ProductRoutes /> },
    ],
  },
];

export { privateRoutes };
