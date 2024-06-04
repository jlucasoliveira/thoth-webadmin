import { useMemo } from 'react';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Loading, Table } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';
import { StockEntryModel } from '../types';
import { useStockEntries } from '../api/getEntries';
import { DeleteEntry } from './DeleteEntry';
import { translateStockKind } from '../utils/kind';

type StockEntriesList = {
  variationId?: string;
  stockId?: string;
};

function StockEntriesList({ variationId, stockId }: StockEntriesList) {
  const { query } = useFilters<StockEntryModel>({ context: 'entries' });
  const entries = useStockEntries({
    params: {
      stockId: stockId!,
      variationId: variationId!,
      params: { sort: '-createdAt', ...query },
    },
  });

  const columns = useMemo<ColumnDef<StockEntryModel>[]>(
    () => [
      { accessorFn: (row) => translateStockKind(row.kind), header: 'Tipo', enableSorting: false },
      { accessorKey: 'amount', header: 'Quantidade', enableSorting: false },
      { accessorKey: 'costPrice', header: 'Custo de venda', enableSorting: false },
      {
        accessorFn: ({ entryDate }) => format(new Date(entryDate), 'dd/MM/yyyy'),
        header: 'Data de entrada',
      },
      {
        accessorFn: ({ expirationDate }) => format(new Date(expirationDate), 'dd/MM/yyyy'),
        header: 'Data de vencimento',
      },
      {
        accessorKey: 'id',
        header: 'Ações',
        enableSorting: false,
        cell: (info) => {
          const id = info.getValue() as string;
          return <DeleteEntry id={id} variationId={variationId!} />;
        },
      },
    ],
    [variationId]
  );

  if (entries.isFetching && entries.isLoading) return <Loading />;
  else if (!entries.data) return null;

  return <Table columns={columns} data={entries.data.data} pages={entries.data.meta.totalPages} />;
}

export { StockEntriesList };
