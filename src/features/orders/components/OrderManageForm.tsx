import { useCallback, useEffect, useMemo } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import { Path, Resolver, useFieldArray, useForm } from 'react-hook-form';
import { FormProps } from '@/types/props';
import { Table } from '@/components/Elements';
import { SubHeader } from '@/components/Layout';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { Checkbox, Form, Input, SearchableSelect } from '@/components/Form';
import { OrderModel } from '../types';
import { OrderRoutes } from '../routes/constants';
import {
  FormType,
  FormItemType,
  FormTempType,
  defaultValues,
  schema,
  tempVariationSchema,
} from './validations';
import { useVariations } from '@/features/products/api/variations/getVariations';
import { currencyFormat } from '@/utils/format';
import { useClients } from '@/features/clients/api/getClients';

function OrderManageForm({
  onSubmit,
  data,
  fetchingLoading,
  ...props
}: FormProps<FormType, OrderModel>) {
  const navigate = useNavigate();
  const { reset, setError, clearErrors, ...tempForm } = useForm<FormTempType>({
    defaultValues: { quantity: 1 },
    resolver: yupResolver(tempVariationSchema),
  });
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
    const currentTitle = 'compra';
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

  const onTemSubmit = useCallback(
    ({ quantity, variation }: FormTempType) => {
      if (variation) {
        console.log(variation.stock.quantity, quantity);
        if (variation.stock.quantity < quantity) {
          setError('quantity', {
            message: 'Quantidade excede o encontrado em estoque',
            type: 'max',
          });
        } else {
          clearErrors('quantity');
          const price = variation.price ?? 0;
          append({ quantity, variation, price, total: price * quantity });
          reset();
        }
      }
    },
    [append, clearErrors, reset, setError]
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
    <Flex direction="column" w="full" m={5}>
      <SubHeader
        {...props}
        loading={props.loading}
        DeleteButton={() => null}
        onClick={handleSubmit(onSubmit)}
        goBack={() => navigate(OrderRoutes.List)}
        title={title}
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
            isDisabled={!isFormEdit}
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
            isDisabled={!isFormEdit}
            control={control}
            name="paid"
            label="Pago"
            type="number"
          />
          <Checkbox
            isDisabled={!isFormEdit}
            control={control}
            name="retainedStock"
            label="Manter estoque"
          />
        </FieldsContainer>
        {props.id ? null : (
          <FieldsContainer templateColumn={5} gridProps={{ alignItems: 'center' }}>
            <SearchableSelect
              control={tempForm.control}
              label="Variação"
              name="variation"
              useFetch={useVariations}
              fetcherExtraParams={{
                include: { stock: true },
                filter: { stock: { quantity: { gt: 0 } } },
              }}
              searchBuilder={(ilike) => [
                { variation: { ilike } },
                { externalCode: { ilike } },
                { product: { name: { ilike } } },
              ]}
              getOptionLabel={(option) => {
                if (!option.variation) return option.product.name;
                return `${option.product.name} ${option.variation}`;
              }}
            />
            <Input
              control={tempForm.control}
              type="number"
              name="quantity"
              label="Quantidade"
              required
            />
            <Button colorScheme="blue" mb="5" onClick={tempForm.handleSubmit(onTemSubmit)}>
              Adicionar Produto
            </Button>
          </FieldsContainer>
        )}
        <Table data={fields} columns={columns} pages={1} />
      </Form>
    </Flex>
  );
}

export { OrderManageForm };
