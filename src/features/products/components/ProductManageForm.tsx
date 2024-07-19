import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { Path, Resolver, useForm } from 'react-hook-form';
import { FormProps } from '@/types/props';
import { SubHeader } from '@/components/Layout';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { Form, Input, SearchableSelect } from '@/components/Form';
import { BrandModel } from '@/features/brands/types';
import { useBrands } from '@/features/brands/api/getBrands';
import { ProductRoutes } from '../routes/constants';
import { ProductModel } from '../types';
import { FormType, schema } from './Forms/validation';
import { DeleteProduct } from './Delete/DeleteProduct';
import { Variations } from './Variations/Variations';

const defaultValues: FormType = {
  name: '',
  brand: {} as BrandModel,
};

function ProductManageForm({
  onSubmit,
  data,
  fetchingLoading,
  ...props
}: FormProps<FormType, ProductModel>) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            getOptionLabel={(option) => option.name}
            isDisabled={!isFormEdit}
            control={control}
            name="brand"
            label="Marca"
            placeholder="Pesquise uma marca"
            isClearable={false}
            useFetch={useBrands}
            defaultOptionValue={data?.brandId}
            handleSetValue={(option) => setValue('brand', option)}
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
