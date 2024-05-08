import { FC } from 'react';
import { ReactComponent as DashboardIcon } from '@/assets/icons/sidebar/dashboard.svg';
import { ReactComponent as ClientIcon } from '@/assets/icons/sidebar/cliente.svg';
import { ReactComponent as PermissionIcon } from '@/assets/icons/sidebar/permissoes.svg';
import { ReactComponent as FornecedoresIcon } from '@/assets/icons/sidebar/fornecedor.svg';
import { ReactComponent as LubrificanteIcon } from '@/assets/icons/sidebar/lubrificante.svg';
import { ReactComponent as EstoqueIcon } from '@/assets/icons/sidebar/estoque.svg';
import { UserRoutes } from '@/features/users/routes/constants';
import { StockRoutes } from '@/features/stock/routes/constants';
import { ProductRoutes } from '@/features/products/routes/constants';
import { DashboardRoutes } from '@/features/dashboard/routes/constants';
import { BrandsRoutes } from '@/features/brands/routes/constants';

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
  title: 'Opções',
  children: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      to: DashboardRoutes.Dashboard,
    },
    {
      id: 'user-permissions',
      label: 'Permissões',
      to: '/user-permissions',
      icon: PermissionIcon,
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: ClientIcon,
      to: UserRoutes.Users,
    },
    {
      id: 'brands',
      label: 'Marcas',
      icon: FornecedoresIcon,
      to: BrandsRoutes.List,
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: LubrificanteIcon,
      to: ProductRoutes.List,
    },
    {
      id: 'stocks',
      label: 'Gestão de estoque',
      icon: EstoqueIcon,
      to: StockRoutes.List,
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