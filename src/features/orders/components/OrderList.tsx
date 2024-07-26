import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { generatePath } from 'react-router-dom';
import { Loading, Table } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';
import { Actions, generateDefaultActions } from '@/components/Elements/Table';
import { OrderRoutes } from '../routes/constants';
import { useOrders } from '../api/getOrders';
import { OrderModel } from '../types';
import { currencyFormat, dateFormat } from '@/utils/format';

function OrderList() {
  const { query } = useFilters();
  const orders = useOrders({ params: { ...query, include: { client: true, seller: true } } });

  const columns = useMemo<ColumnDef<OrderModel>[]>(
    () => [
      { header: 'Cliente', accessorKey: 'client.name', enableSorting: false },
      { header: 'Total', accessorFn: (row) => currencyFormat(row.total), enableSorting: false },
      {
        header: 'Total Pago',
        accessorFn: (row) => currencyFormat(row.totalPaid),
        enableSorting: false,
      },
      { header: 'Pago', accessorFn: (row) => (row.paid ? 'Sim' : 'Não'), enableSorting: false },
      { header: 'Vendedor', accessorKey: 'seller.name', enableSorting: false },
      { header: 'Data', accessorFn: (row) => dateFormat(row.createdAt) },
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
                generatePath(OrderRoutes.View, { id }),
                generatePath(OrderRoutes.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  if (orders.isFetching || orders.isLoading) {
    return <Loading />;
  } else if (!orders.data) {
    return null;
  }

  return (
    <Table columns={columns} data={orders.data.data || []} pages={orders.data.meta.pages || 0} />
  );
}

export { OrderList };
