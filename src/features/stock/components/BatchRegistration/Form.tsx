import { useMemo } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { generateStockKindOption } from '@/components/Form/utils';
import { Input, SearchableSelect, Select } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { useVariations } from '@/features/products/api/variations/getVariations';
import { schema, defaultValues, FormBatchType } from './validation';

type FormProps = {
  append: (data: FormBatchType) => void;
};

export function Form({ append }: FormProps) {
  const options = useMemo(generateStockKindOption, []);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  function onSubmit(data: FormBatchType) {
    append(data);
    reset();
  }

  return (
    <>
      <FieldsContainer templateColumn="2fr 1fr 1fr" title="Entrada em lote">
        <SearchableSelect
          required
          control={control}
          label="Variação"
          name="variation"
          useFetch={useVariations}
          fetcherExtraParams={{
            include: { stock: true, product: true },
            filter: { stock: { quantity: { gt: 0 } } },
          }}
          searchBuilder={(ilike) => [
            { variation: { ilike } },
            { externalCode: { ilike } },
            { product: { name: { ilike } } },
          ]}
          getOptionLabel={(option) => {
            if (!option.product) return '';
            if (!option.variation) return option.product.name;
            return `${option.product.name} ${option.variation}`;
          }}
        />
        <Input control={control} name="amount" label="Quantidade" type="number" />
        <Input control={control} name="costPrice" label="Valor de custo" type="number" />
      </FieldsContainer>
      <FieldsContainer templateColumn={4} gridProps={{ alignItems: 'center' }}>
        <Select control={control} name="kind" label="Tipo de entrada" options={options} />
        <Input type="date" control={control} name="entryDate" label="Data de entrada" />
        <Input type="date" control={control} name="expirationDate" label="Validade do lote" />
        <Button onClick={handleSubmit(onSubmit)} colorScheme="blue" leftIcon={<AddIcon />}>
          Adicionar lote
        </Button>
      </FieldsContainer>
    </>
  );
}
