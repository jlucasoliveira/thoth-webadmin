import { useEffect, useMemo } from 'react';
import { Button } from '@chakra-ui/react';
import { Resolver, useForm } from 'react-hook-form';
import { InferType, number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormProps } from '@/types/props';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { Form, Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { ProductRoutes } from '@/features/products/routes/constants';
import { BrandModel } from '@/features/brands/types';
import { ProductVariationModel } from '@/features/products/types';
import { StockLaunchForm } from '@/features/stock/components/StockLaunchForm';
import { StockModel } from '../types';
import { StockEntriesList } from './StockEntriesList';

const schema = object().shape({
  id: string().optional(),
  brand: string(),
  variation: string(),
  unit: string(),
  value: number(),
  inStock: number(),
  minQuantity: number().typeError('Informe um valor válido').min(0, 'Informe um número positivo'),
});

export type FormType = InferType<typeof schema>;

const defaultValues: FormType = {
  id: '',
  variation: '',
  brand: '',
  unit: '',
  value: 0,
  inStock: 0,
  minQuantity: 0,
};

type Props = {
  stock?: StockModel;
  brand?: BrandModel;
};

function StockManageForm({
  onSubmit,
  data,
  stock,
  brand,
  ...props
}: Props & FormProps<FormType, ProductVariationModel>) {
  const navigate = useNavigate();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const isFormEdit = useMemo(() => {
    if (props.loading || props.fetchingLoading) return false;
    return props.isEdit;
  }, [props]);

  useEffect(() => {
    if (data) {
      setValue('id', data.id);
      setValue('variation', data.variation);
      setValue('brand', brand?.name);
      setValue('value', data.price);
    }
  }, [brand?.name, data, setValue]);

  useEffect(() => {
    if (stock) {
      setValue('inStock', stock.quantity);
    }
  }, [setValue, stock]);

  return (
    <ManageWrapper>
      <SubHeader
        {...props}
        onClick={handleSubmit(onSubmit)}
        rightActions={
          <Button
            ml="2"
            size="sm"
            colorScheme="blue"
            isLoading={props.fetchingLoading}
            onClick={() => {
              const pathname = generatePath(ProductRoutes.View, {
                id: data!.productId!.toString(),
              });
              navigate({
                pathname,
                search: `variations|variationId=${data!.id}`,
              });
            }}
          >
            Ver Produto
          </Button>
        }
        title="Estoque dos produtos"
      />
      <Form loading={props.fetchingLoading}>
        <FieldsContainer title="Dados do produto">
          <Input isDisabled control={control} name="variation" label="Identificação" />
          <Input isDisabled control={control} name="brand" label="Fornecedor" />
          <Input
            isDisabled={!isFormEdit}
            control={control}
            name="value"
            label="Valor"
            type="number"
            step={0.1}
          />
          <Input
            isDisabled={!isFormEdit}
            control={control}
            name="minQuantity"
            label="Quantidade mínima"
            type="number"
          />
          <Input isDisabled control={control} name="inStock" label="Quantidade em estoque" />
        </FieldsContainer>
        <StockLaunchForm id={data?.id} control={control} isEdit={isFormEdit} />
        <StockEntriesList stockId={stock?.id} variationId={props.id} />
      </Form>
    </ManageWrapper>
  );
}

export { StockManageForm };
