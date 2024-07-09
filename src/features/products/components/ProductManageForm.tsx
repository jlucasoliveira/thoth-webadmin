import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { Path, Resolver, useForm } from 'react-hook-form';
import { InferType, array, mixed, number, object, string } from 'yup';
import { FormProps } from '@/types/props';
import { SubHeader } from '@/components/Layout';
import { generateGenderOption } from '@/components/Form/utils';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { Form, Input, SearchableSelect, Select } from '@/components/Form';
import { useBrands } from '@/features/brands/api/getBrands';
import { useCategories } from '@/features/categories/api/getCategories';
import { ProductRoutes } from '../routes/constants';
import { Gender, ProductModel } from '../types';
import { variationSchema } from './Forms/validation';
import { DeleteProduct } from './Delete/DeleteProduct';
import { Variations } from './Variations/Variations';

const optionValue = {
  label: string().required(),
  value: string().required(),
};

const optionValueDefault = {
  label: '',
  value: '',
};

const schema = object().shape({
  id: string().optional(),
  name: string().required('Campo obrigatório'),
  weight: number().positive('Informe um valor válido').typeError('Informe um número').optional(),
  volume: number().positive('Informe um valor válido').typeError('Informe um número').optional(),
  brand: object().shape(optionValue).required('Campo obrigatório'),
  category: object().shape(optionValue).required('Campo obrigatório'),
  gender: mixed<Gender>().oneOf(Object.values(Gender)),
  variations: array(variationSchema),
});

const defaultValues: FormType = {
  name: '',
  volume: 0,
  weight: 0,
  brand: optionValueDefault,
  category: optionValueDefault,
  gender: Gender.None,
};

export type FormType = InferType<typeof schema>;

function ProductManageForm({
  onSubmit,
  data,
  fetchingLoading,
  ...props
}: FormProps<FormType, ProductModel>) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const genderOptions = useMemo(generateGenderOption, []);

  const { control, handleSubmit, setValue } = useForm<FormType>({
    context: { isNewEntry: !props.id },
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const isFormEdit = useMemo(() => {
    if (props.loading || fetchingLoading) return false;
    return props.id ? props.isEdit : true;
  }, [props, fetchingLoading]);

  const title = useMemo<string>(() => {
    const currentTitle = 'produto';
    if (props.isEdit) return `Editar ${currentTitle}`;
    if (!props.id) return `Novo ${currentTitle}`;
    return currentTitle;
  }, [props]);

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          setValue(key as Path<FormType>, value.toString());
        }
      });
    }
  }, [data, setValue]);

  return (
    <Flex direction="column" w="full" m={5}>
      <SubHeader
        {...props}
        loading={props.loading}
        DeleteButton={DeleteProduct}
        onClick={handleSubmit(onSubmit)}
        goBack={() => navigate(ProductRoutes.List)}
        title={title}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados do produto" templateColumn={3}>
          <Input isDisabled={!isFormEdit} control={control} name="name" label="Nome" required />
          <SearchableSelect
            required
            isDisabled={!isFormEdit}
            control={control}
            name="brand"
            label="Marca"
            placeholder="Pesquise uma marca"
            isClearable={false}
            useFetch={useBrands}
            parseOptions={(brand) => ({
              label: brand.name,
              value: brand.id,
              obj: brand,
            })}
            defaultOptionValue={data?.brandId}
            handleSetValue={(option) => setValue('brand', option)}
          />
          <SearchableSelect
            required
            isDisabled={!isFormEdit}
            control={control}
            name="category"
            label="Categoria"
            placeholder="Pesquise uma categoria"
            isClearable={false}
            useFetch={useCategories}
            parseOptions={(category) => ({
              label: category.name,
              value: category.id,
            })}
            defaultOptionValue={data?.categoryId}
            handleSetValue={(option) => setValue('category', option)}
          />
          <Select
            required
            isDisabled={!isFormEdit}
            name="gender"
            control={control}
            label="Gênero"
            options={genderOptions}
          />
          <Input
            type="number"
            isDisabled={!isFormEdit}
            control={control}
            name="weight"
            label="Peso"
          />
          <Input
            type="number"
            isDisabled={!isFormEdit}
            control={control}
            name="volume"
            label="Volume"
          />
        </FieldsContainer>
        <Variations
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          control={control}
          isEdit={isFormEdit}
          productId={data?.id}
        />
      </Form>
    </Flex>
  );
}

export { ProductManageForm };
