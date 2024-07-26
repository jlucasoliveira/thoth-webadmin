import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { Loading, Table } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';
import { Actions, generateDefaultActions } from '@/components/Elements/Table';
import { ClientRoutes } from '../routes/constants';
import { useClients } from '../api/getClients';
import { ClientModel } from '../types';

function ClientList() {
  const { query } = useFilters();
  const clients = useClients({ params: query });

  const columns = useMemo<ColumnDef<ClientModel>[]>(
    () => [
      { header: 'Cliente', accessorKey: 'name', enableSorting: false },
      { header: 'Total', accessorKey: 'email', enableSorting: false },
      { header: 'Total', accessorKey: 'phoneNumber', enableSorting: false },
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
                generatePath(ClientRoutes.View, { id }),
                generatePath(ClientRoutes.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (clients.isFetching || clients.isLoading) {
    return <Loading />;
  } else if (!clients.data) {
    return null;
  }

  return (
    <Table columns={columns} data={clients.data.data || []} pages={clients.data.meta.pages || 0} />
  );
}

export { ClientList };
