import { ColumnDef } from '@tanstack/react-table';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { Form } from '@/components/Form';
import { Table } from '@/components/Elements';
import { ManageWrapper, SubHeader } from '@/components/Layout';
import { FormProps } from '@/types/props';
import { currencyFormat, dateFormat } from '@/utils/format';
import { translateStockKind } from '../../utils/kind';
import { Form as BatchForm } from './Form';
import { batchItemsSchema } from './validation';
import type { FormBatchType, ItemsSchema } from './validation';

const columns: ColumnDef<FormBatchType>[] = [
  {
    header: 'Variação',
    accessorFn: (row) => `${row.variation.product.name} ${row.variation.variation}`,
    enableSorting: false,
  },
  { header: 'Quantidade', accessorKey: 'amount', enableSorting: false },
  {
    header: 'Valor de custo',
    accessorFn: (row) => currencyFormat(row.costPrice),
    enableSorting: false,
  },
  {
    header: 'Tipo de entrada',
    accessorFn: (row) => translateStockKind(row.kind),
    enableSorting: false,
  },
  {
    header: 'Data do lote',
    accessorFn: (row) => dateFormat(row.expirationDate),
    enableSorting: false,
  },
  {
    header: 'Data de entrada',
    accessorFn: (row) => (row.entryDate ? dateFormat(row.entryDate) : '-'),
    enableSorting: false,
  },
];

export function BatchRegistrationManager(props: FormProps<ItemsSchema>) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(batchItemsSchema),
    defaultValues: { items: [] },
  });
  const { fields, append } = useFieldArray({ control, name: 'items' });

  return (
    <ManageWrapper>
      <SubHeader {...props} title="Entrada em lote" onClick={handleSubmit(props.onSubmit)} />
      <Form loading={props.fetchingLoading}>
        <BatchForm append={append} />
        <Table columns={columns as any} data={fields} pages={1} />
      </Form>
    </ManageWrapper>
  );
}
