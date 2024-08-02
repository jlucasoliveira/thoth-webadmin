import { Flex } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Loading, Table } from '@/components/Elements';
import { useFilters } from '@/hooks/useFilters';
import { dateFormat } from '@/utils/format';
import { usePayments } from '../api/getPayments';
import { PaymentModel } from '../types';

const columns: ColumnDef<PaymentModel>[] = [
  { header: 'Emissor', accessorKey: 'issuer.name', enableSorting: false },
  { header: 'Valor', accessorKey: 'value', enableSorting: false },
  {
    header: 'Data de pagamento',
    accessorFn: (row) => dateFormat(row.paidDate),
    enableSorting: false,
  },
];

type Props = {
  orderId?: string;
};

function PaymentList({ orderId }: Props) {
  const { query } = useFilters();
  const { data, isLoading, isFetching } = usePayments({
    params: {
      ...query,
      filter: { ...query.filter, orders: { id: { eq: orderId } } },
      include: { issuer: true },
    },
    config: { enabled: !!orderId },
  });

  if (!orderId) return null;

  return (
    <Flex flexGrow={0.5} mb="2">
      {isLoading && isFetching ? (
        <Loading centerProps={{ flexGrow: 1 }} />
      ) : (
        <Table
          forceScroll
          title="Pagamentos"
          columns={columns}
          data={data?.data ?? []}
          pages={data?.meta?.pages ?? 1}
        />
      )}
    </Flex>
  );
}

export { PaymentList };
