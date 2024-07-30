import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { Loading, Table } from '@/components/Elements';
import { Actions, generateDefaultActions } from '@/components/Elements/Table';
import { UserModel } from '@/features/auth/types';
import { useFilters } from '@/hooks/useFilters';
import { useUsers } from '../api/getUsers';
import { UserRoutesEnum } from '../routes';

function UsersList() {
  const { query } = useFilters();
  const users = useUsers({ params: query });

  const columns = useMemo<ColumnDef<UserModel>[]>(
    () => [
      { header: 'Usuário', accessorKey: 'username', enableSorting: false },
      { header: 'Nome', accessorKey: 'name', id: 'name' },
      { header: 'Telefone', accessorKey: 'phoneNumber', enableSorting: false },
      { header: 'Admin', enableSorting: false, accessorFn: (row) => (row.isAdmin ? 'Sim' : 'Não') },
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
                generatePath(UserRoutesEnum.View, { id }),
                generatePath(UserRoutesEnum.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (users.isFetching || users.isLoading) {
    return <Loading />;
  } else if (!users.data) {
    return null;
  }

  return (
    <Table columns={columns} data={users.data.data || []} pages={users.data.meta.pages || 0} />
  );
}

export { UsersList };
