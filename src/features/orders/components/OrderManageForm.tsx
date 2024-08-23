import { useEffect, useMemo } from 'react';
import { Flex, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import { Path, Resolver, useFieldArray, useForm } from 'react-hook-form';
import { FormProps } from '@/types/props';
import { Table } from '@/components/Elements';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { Checkbox, Form, Input, SearchableSelect } from '@/components/Form';
import { useClients } from '@/features/clients/api/getClients';
import { PaymentList } from '@/features/payments/components/PaymentList';
import { currencyFormat } from '@/utils/format';
import { OrderModel } from '../types';
import { PaymentModal } from './PaymentModel';
import { OrderItemPurchase } from './OrderItemPurchase';
import { FormType, FormItemType, defaultValues, schema } from './validations';

function OrderManageForm({
  onSubmit,
  data,
  fetchingLoading,
  ...props
}: FormProps<FormType, OrderModel>) {
  const { control, handleSubmit, setValue } = useForm<FormType>({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'items' });

  const isFormEdit = useMemo(() => {
    if (props.loading || fetchingLoading) return false;
    return props.id ? props.isEdit : true;
  }, [props, fetchingLoading]);

  const title = useMemo<string>(() => {
    const currentTitle = 'venda';
    if (props.isEdit) return `Editar ${currentTitle}`;
    if (!props.id) return `Nova ${currentTitle}`;
    return currentTitle;
  }, [props]);

  const columns = useMemo<ColumnDef<FormItemType>[]>(() => {
    const columns: ColumnDef<FormItemType>[] = [
      { header: 'Produto', accessorKey: 'variation.product.name', enableSorting: false },
      { header: 'Variante', accessorKey: 'variation.variation', enableSorting: false },
      { header: 'Quantidade', accessorKey: 'quantity', enableSorting: false },
      { header: 'Valor', accessorFn: (row) => currencyFormat(row.price), enableSorting: false },
      {
        header: 'Valor final',
        accessorFn: (row) => currencyFormat(row.total),
        enableSorting: false,
      },
    ];

    if (props.id) columns.unshift({ header: 'ID', accessorKey: '_id', enableSorting: false });
    else
      columns.push({
        header: 'Ações',
        enableSorting: false,
        cell: (info) => (
          <IconButton
            aria-label="Excluir"
            size="xs"
            icon={<DeleteIcon />}
            variant="ghost"
            onClick={() => remove(info.row.index)}
          />
        ),
      });

    return columns;
  }, [props.id, remove]);

  const totalPaid = useMemo(
    () => fields.reduce((acc, field) => acc + (field.total ?? 1), 0),
    [fields]
  );

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          setValue(key as Path<FormType>, value as any);
        }
      });
      replace(
        data.items.map((item) => ({
          _id: item.id,
          quantity: item.quantity,
          variation: item.variation,
          price: item.value,
          total: item.total,
        }))
      );
    }
  }, [data, replace, setValue]);

  useEffect(() => {
    setValue('total', currencyFormat(totalPaid));
  }, [totalPaid, setValue]);

  return (
    <ManageWrapper>
      <SubHeader
        {...props}
        loading={props.loading}
        DeleteButton={() => null}
        onClick={handleSubmit(onSubmit)}
        title={title}
        rightActions={<PaymentModal data={data} />}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer
          title="Dados da compra"
          gridProps={{ alignItems: 'flex-start' }}
          columnsByRow={6}
          templateColumn="1fr 1fr 1fr 0.5fr 0.5fr 1fr"
        >
          <SearchableSelect
            control={control}
            name="client"
            label="Cliente"
            useFetch={useClients}
            getOptionLabel={(client) => client.name}
            searchField="name"
          />
          <Input isReadOnly control={control} name="total" label="Total" />
          <Input
            isDisabled={!!data?.id}
            control={control}
            name="totalPaid"
            label="Total pago"
            type="number"
          />
          <Input
            isDisabled={!isFormEdit}
            control={control}
            name="installments"
            label="Parcelas"
            type="number"
          />
          <Checkbox
            isDisabled={totalPaid === data?.total || data?.paid}
            control={control}
            name="paid"
            label="Pago"
            type="number"
          />
          <Checkbox
            isDisabled={!!data?.id}
            control={control}
            name="retainedStock"
            label="Manter estoque"
          />
        </FieldsContainer>
        <PaymentList orderId={data?.id} />
        <Flex flexGrow={2} direction="column">
          {props.id ? null : <OrderItemPurchase append={append} />}
          <Table
            title={data?.id ? 'Itens comprados' : undefined}
            data={fields}
            columns={columns}
            pages={1}
          />
        </Flex>
      </Form>
    </ManageWrapper>
  );
}

export { OrderManageForm };
