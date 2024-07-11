import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';
import { Actions, Loading, Table, generateDefaultActions } from '@/components/Elements';
import { CategoriesRoutes } from '../routes/constants';
import { useCategories } from '../api/getCategories';
import { CategoryModel } from '../types';

function CategoriesList() {
  const { query } = useFilters();
  const brands = useCategories({ params: query });

  const columns = useMemo<ColumnDef<CategoryModel>[]>(
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
                generatePath(CategoriesRoutes.View, { id }),
                generatePath(CategoriesRoutes.Edit, { id })
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

export { CategoriesList };
