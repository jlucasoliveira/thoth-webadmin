import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { Loading, Table } from '@/components/Elements';
import { Actions, generateDefaultActions } from '@/components/Elements/Table';
import { BankAccountModel } from '@/features/bankAccounts/types';
import { useFilters } from '@/hooks/useFilters';
import { useBankAccounts } from '../api/getAccounts';
import { BankAccountsRoutes } from '../routes/constants';
import { dateFormat } from '@/utils/format';

function BankAccountsList() {
  const { query } = useFilters();
  const accounts = useBankAccounts({
    params: { ...query, include: { ...query?.include, owner: true } },
  });

  const columns = useMemo<ColumnDef<BankAccountModel>[]>(
    () => [
      { header: 'ID', accessorKey: 'id' },
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Agência', accessorKey: 'agency' },
      { header: 'Número da conta', accessorKey: 'accountNumber' },
      { header: 'Titular', accessorFn: (row) => row.owner?.name ?? '-', enableSorting: false },
      { header: 'Data de criação', accessorFn: (row) => dateFormat(row.createdAt) },
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
                generatePath(BankAccountsRoutes.View, { id }),
                generatePath(BankAccountsRoutes.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (accounts.isFetching && accounts.isLoading) {
    return <Loading />;
  } else if (!accounts.data) {
    return null;
  }

  return (
    <Table
      columns={columns}
      data={accounts.data.data || []}
      pages={accounts.data.meta.pages || 0}
    />
  );
}

export { BankAccountsList };
