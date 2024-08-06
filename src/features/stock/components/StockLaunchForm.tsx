import { Input, Select } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, Resolver, useFieldArray, useForm } from 'react-hook-form';
import { batchSchema } from '../../products/components/Forms/validation';
import { AddIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { InferType } from 'yup';
import { useInventoryEntry } from '@/features/stock/api/inventoryEntry';
import { StockKind } from '@/features/stock/types';
import { useMemo } from 'react';
import { generateStockKindOption } from '@/components/Form/utils';
import { BrandModel } from '@/features/brands/types';

export type BatchForm = InferType<typeof batchSchema>;

type StockLaunchFormProps = {
  control: Control<any, any>;
  id?: string;
  isEdit?: boolean;
  brand?: BrandModel;
};

const defaultValues: BatchForm = {
  entryDate: new Date(),
  expirationDate: new Date(),
  costPrice: 0,
  kind: StockKind.Entry,
  amount: 1,
};

function StockLaunchForm({ control, id, isEdit, brand }: StockLaunchFormProps) {
  const options = useMemo(generateStockKindOption, []);
  const { append } = useFieldArray({ control, name: 'entries' });
  const { mutateAsync, isLoading } = useInventoryEntry();
  const {
    handleSubmit,
    control: listControl,
    reset,
  } = useForm<BatchForm>({
    defaultValues,
    resolver: yupResolver(batchSchema) as Resolver<BatchForm>,
  });

  async function onSubmit(data: BatchForm) {
    if (id) {
      append(data);
      await mutateAsync({
        variationId: id,
        payload: {
          ...data,
          entryDate: data.entryDate!.toJSON(),
          expirationDate: data.expirationDate.toJSON(),
          newPrice: data.costPrice
            ? (1 + (brand?.profitRate ?? 0) / 100) * data.costPrice
            : undefined,
        },
      });
    }
    reset();
  }

  return (
    <FieldsContainer
      title="Inventário"
      gridProps={{ alignItems: 'center' }}
      style={{
        borderRadius: 5,
        borderColor: '--chakra-colors-whiteAlpha-50',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '5px',
        margin: '-5px -1px 5px',
      }}
    >
      <Input
        isDisabled={!isEdit || isLoading}
        control={listControl}
        name="amount"
        label="Quantidade"
        type="number"
      />
      <Input
        isDisabled={!isEdit || isLoading}
        control={listControl}
        name="costPrice"
        label="Valor de custo"
        type="number"
      />
      <Select
        isDisabled={!isEdit || isLoading}
        control={listControl}
        name="kind"
        label="Tipo de entrada"
        options={options}
      />
      <Input
        type="date"
        isDisabled={!isEdit || isLoading}
        control={listControl}
        name="entryDate"
        label="Data de entrada"
      />
      <Input
        type="date"
        isDisabled={!isEdit || isLoading}
        control={listControl}
        name="expirationDate"
        label="Validade do lote"
      />
      <Button
        isLoading={isLoading}
        isDisabled={!isEdit}
        onClick={handleSubmit(onSubmit)}
        colorScheme="blue"
        leftIcon={<AddIcon />}
      >
        Adicionar lote
      </Button>
    </FieldsContainer>
  );
}

export { StockLaunchForm };
