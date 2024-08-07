import { useCallback, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFieldArrayAppend, useForm, useWatch } from 'react-hook-form';
import { Input, SearchableSelect } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { useVariations } from '@/features/products/api/variations/getVariations';
import { FormType, FormTempType, tempVariationSchema } from './validations';

type Props = {
  append: UseFieldArrayAppend<FormType, 'items'>;
};

function OrderItemPurchase({ append }: Props) {
  const { control, clearErrors, handleSubmit, reset, setError, setValue } = useForm<FormTempType>({
    defaultValues: { quantity: 1 },
    resolver: yupResolver(tempVariationSchema),
  });

  const variation = useWatch({ control, name: 'variation' });

  const onSubmit = useCallback(
    ({ quantity, price, variation }: FormTempType) => {
      if (variation) {
        if (variation.stock.quantity < quantity) {
          setError('quantity', {
            message: 'Quantidade excede o encontrado em estoque',
            type: 'max',
          });
        } else {
          clearErrors('quantity');
          append({ quantity, variation, price, total: price * quantity });
          reset();
        }
      }
    },
    [append, clearErrors, reset, setError]
  );

  useEffect(() => {
    setValue('price', variation?.price ?? 0);
  }, [setValue, variation]);

  return (
    <FieldsContainer
      title="Produtos"
      templateColumn="1.5fr 0.5fr 0.5fr 1fr"
      gridProps={{ alignItems: 'center' }}
    >
      <SearchableSelect
        required
        control={control}
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
      <Input control={control} type="number" name="quantity" label="Quantidade" required />
      <Input control={control} type="number" name="price" label="Valor unitário" required />
      <Button colorScheme="blue" mb="5" onClick={handleSubmit(onSubmit)}>
        Adicionar Produto
      </Button>
    </FieldsContainer>
  );
}

export { OrderItemPurchase };
