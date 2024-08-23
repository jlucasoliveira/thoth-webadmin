import { FC } from 'react';
import {
  BadgeDollarSign,
  Building,
  Building2,
  Landmark,
  LibraryBig,
  Lock,
  Receipt,
  Users,
  UserRoundCheck,
  Warehouse,
} from 'lucide-react';
import { UserRoutes } from '@/features/users/routes/constants';
import { ClientRoutes } from '@/features/clients/routes/constants';
import { StockRoutes } from '@/features/stock/routes/constants';
import { ProductRoutes } from '@/features/products/routes/constants';
import { BrandsRoutes } from '@/features/brands/routes/constants';
import { CategoriesRoutes } from '@/features/categories/routes/constants';
import { BankAccountsRoutes } from '@/features/bankAccounts/routes/constants';
import { ExpenseRoutes } from '@/features/expenses/routes/constants';
import { OrderRoutes } from '@/features/orders/routes/constants';

type _Children = {
  label: string;
  icon: FC;
  to?: string;
  id: string | string[];
};

export type Children = _Children & { children?: _Children[] };

export type Menu = {
  title: string;
  children: Children[];
};

export const options: Menu = {
  title: '',
  children: [
    {
      id: 'user-permissions',
      label: 'Permissões',
      to: '/user-permissions',
      icon: Lock,
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      to: UserRoutes.Users,
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: UserRoundCheck,
      to: ClientRoutes.List,
    },
    {
      id: 'brands',
      label: 'Marcas',
      icon: Building,
      to: BrandsRoutes.List,
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: Building2,
      to: CategoriesRoutes.List,
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: LibraryBig,
      to: ProductRoutes.List,
    },
    {
      id: 'stocks',
      label: 'Gestão de estoque',
      icon: Warehouse,
      to: StockRoutes.List,
    },
    {
      id: 'accounts',
      label: 'Contas bancárias',
      icon: Landmark,
      to: BankAccountsRoutes.List,
    },
    {
      id: 'expenses',
      label: 'Despesas',
      to: ExpenseRoutes.List,
      icon: Receipt,
    },
    {
      id: 'orders',
      label: 'Vendas',
      icon: BadgeDollarSign,
      to: OrderRoutes.List,
    },
  ],
};

export const adminMenuItems: Menu = {
  title: 'Admin',
  children: [],
};

export const clientMenuItems: Menu = {
  title: 'Cliente',
  children: [],
};
