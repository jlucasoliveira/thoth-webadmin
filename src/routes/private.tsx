import { RouteObject } from 'react-router-dom';
import { lazyImport } from '@/utils/lazyImport';
import { App } from '@/components/Layout';

const { BrandsRoutes } = lazyImport(() => import('@/features/brands'), 'BrandsRoutes');
const { CategoriesRoutes } = lazyImport(() => import('@/features/categories'), 'CategoriesRoutes');
const { ProductRoutes } = lazyImport(() => import('@/features/products'), 'ProductRoutes');
const { StockRoutes } = lazyImport(() => import('@/features/stock'), 'StockRoutes');
const { UserRoutes } = lazyImport(() => import('@/features/users'), 'UserRoutes');
const { OrderRoutes } = lazyImport(() => import('@/features/orders'), 'OrderRoutes');
const { ClientRoutes } = lazyImport(() => import('@/features/clients'), 'ClientRoutes');
const { ExpenseRoutes } = lazyImport(() => import('@/features/expenses'), 'ExpenseRoutes');
const { BankAccountsRoutes } = lazyImport(
  () => import('@/features/bankAccounts'),
  'BankAccountsRoutes'
);

const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'brands/*', element: <BrandsRoutes /> },
      { path: 'categories/*', element: <CategoriesRoutes /> },
      { path: 'products/*', element: <ProductRoutes /> },
      { path: 'stocks/*', element: <StockRoutes /> },
      { path: 'users/*', element: <UserRoutes /> },
      { path: 'orders/*', element: <OrderRoutes /> },
      { path: 'clients/*', element: <ClientRoutes /> },
      { path: 'accounts/*', element: <BankAccountsRoutes /> },
      { path: 'expenses/*', element: <ExpenseRoutes /> },
    ],
  },
];

export { privateRoutes };
