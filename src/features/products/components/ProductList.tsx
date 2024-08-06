import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { Loading, Table } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';
import { Actions, generateDefaultActions } from '@/components/Elements/Table';
import { ProductRoutes } from '../routes/constants';
import { useProducts } from '../api/getProducts';
import { ProductModel } from '../types';
import { dateFormat } from '@/utils/format';

function ProductList() {
  const { query } = useFilters();
  const products = useProducts({ params: { ...query, include: { brand: true } } });

  const columns = useMemo<ColumnDef<ProductModel>[]>(
    () => [
      { id: 'name', header: 'Nome', accessorKey: 'name' },
      { header: 'Marca', enableSorting: false, accessorKey: 'brand.name' },
      {
        id: 'createdAt',
        header: 'Data de criação',
        accessorFn: (row) => dateFormat(row.createdAt),
      },
      {
        header: 'Ações',
        accessorKey: 'id',
        enableSorting: false,
        cell: (info) => {
          const id = info.getValue() as string;
          return (
            <Actions
              id={id}
              options={generateDefaultActions(
                generatePath(ProductRoutes.View, { id }),
                generatePath(ProductRoutes.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (products.isFetching && products.isLoading) {
    return <Loading />;
  } else if (!products.data) {
    return null;
  }

  return (
    <Table
      columns={columns}
      data={products.data.data || []}
      pages={products.data.meta.pages || 0}
    />
  );
}

export { ProductList };
