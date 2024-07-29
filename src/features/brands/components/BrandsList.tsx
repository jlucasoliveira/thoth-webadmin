import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';
import { Actions, Loading, Table, generateDefaultActions } from '@/components/Elements';
import { BrandsRoutes } from '../routes/constants';
import { useBrands } from '../api/getBrands';
import { BrandModel } from '../types';

function BrandsList() {
  const { query } = useFilters();
  const brands = useBrands({ params: query });

  const columns = useMemo<ColumnDef<BrandModel>[]>(
    () => [
      { id: 'name', header: 'Nome', accessorKey: 'name' },
      {
        header: 'Percentual de lucro',
        accessorKey: 'profitRate',
        enableSorting: false,
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
                generatePath(BrandsRoutes.View, { id }),
                generatePath(BrandsRoutes.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (brands.isFetching && brands.isLoading) {
    return <Loading />;
  } else if (!brands.data) {
    return null;
  }

  return (
    <Table columns={columns} data={brands.data.data || []} pages={brands.data?.meta?.pages || 0} />
  );
}

export { BrandsList };
