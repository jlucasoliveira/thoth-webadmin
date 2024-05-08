import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';
import { Actions, Loading, Table, generateDefaultActions } from '@/components/Elements';
import { GendersRoutes } from '../routes/constants';
import { useGenders } from '../api/getGenders';
import { GenderModel } from '../types';

function GendersList() {
  const { query } = useFilters();
  const brands = useGenders({ params: query });

  const columns = useMemo<ColumnDef<GenderModel>[]>(
    () => [
      {
        header: 'Nome',
        accessorKey: 'name',
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
                generatePath(GendersRoutes.View, { id }),
                generatePath(GendersRoutes.Edit, { id })
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
    <Table
      columns={columns}
      data={brands.data.data || []}
      pages={brands.data?.meta?.totalPages || 0}
    />
  );
}

export { GendersList };
