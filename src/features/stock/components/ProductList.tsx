import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { Loading, Table } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';
import { Actions, generateDefaultActions } from '@/components/Elements/Table';
import { useVariations } from '@/features/products/api/variations/getVariations';
import { ProductVariationModel } from '@/features/products/types';
import { StockRoutes } from '../routes/constants';

function ProductList() {
  const { query } = useFilters();
  const variations = useVariations({ params: { ...query, include: { stock: true } } });

  const columns = useMemo<ColumnDef<ProductVariationModel>[]>(
    () => [
      {
        header: 'Produto',
        accessorKey: 'product.name',
      },
      {
        header: 'Variação',
        accessorKey: 'variation',
      },
      {
        header: 'Qtd.',
        accessorKey: 'stock',
        enableSorting: false,
        cell: (info) => {
          const stock = info.getValue() as { quantity: number } | null;
          return stock ? stock.quantity : '-';
        },
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
                generatePath(StockRoutes.View, { id }),
                generatePath(StockRoutes.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (variations.isFetching || variations.isLoading) {
    return <Loading />;
  } else if (!variations.data) {
    return null;
  }

  return (
    <Table
      columns={columns}
      data={variations.data.data || []}
      pages={variations.data.meta.totalPages || 0}
    />
  );
}

export { ProductList };
