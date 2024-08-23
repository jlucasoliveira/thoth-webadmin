import { generatePath } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { useFilters } from '@/hooks/useFilters';
import { dateTimeFormat } from '@/utils/format';
import { Actions, Loading, Table, generateDefaultActions } from '@/components/Elements';
import { useExpenses } from '../api/getExpenses';
import { ExpenseRoutes } from '../routes/constants';
import { ExpenseModel } from '../types';

const columns: Array<ColumnDef<ExpenseModel>> = [
  { header: 'Marca', accessorKey: 'brand.name', enableSorting: false },
  { header: 'Conta', accessorKey: 'bankAccount.name', enableSorting: false },
  { header: 'Valor', accessorKey: 'value', enableSorting: false },
  { header: 'Pago', accessorFn: (row) => (row.isPaid ? 'Sim' : 'Não'), enableSorting: false },
  { header: 'Parcelas', accessorKey: 'installments', enableSorting: false },
  { header: 'Data de criação', accessorFn: (row) => dateTimeFormat(row.createdAt) },
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
            generatePath(ExpenseRoutes.View, { id }),
            generatePath(ExpenseRoutes.Edit, { id })
          )}
        />
      );
    },
  },
];

function ExpenseList() {
  const { query } = useFilters();
  const { data, isFetching, isLoading } = useExpenses({
    params: { ...query, include: { bankAccount: true, brand: true } },
  });

  if (isFetching && isLoading) return <Loading />;
  else if (!data) return null;

  return <Table columns={columns} data={data.data ?? []} pages={data.meta.pages ?? 1} />;
}

export { ExpenseList };
