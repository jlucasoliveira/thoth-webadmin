import { useEffect, useMemo } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@chakra-ui/react';
import { Path, Resolver, useForm } from 'react-hook-form';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { Form, Input, SearchableSelect } from '@/components/Form';
import { DeleteButton } from '@/components/Helpers';
import { BrandModel } from '@/features/brands/types';
import { useBrands } from '@/features/brands/api/getBrands';
import { BrandsRoutes } from '@/features/brands/routes/constants';
import { useFilters } from '@/hooks/useFilters';
import { FormProps } from '@/types/props';
import { VARIATION_ID } from '../utils/params';
import { ProductModel } from '../types';
import { useDeleteProduct } from '../api/deleteProduct';
import { FormType, schema } from './Forms/validation';
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
  const { getParam } = useFilters({ context: 'variations' });
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: !!getParam(VARIATION_ID) });
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
    <ManageWrapper>
      <SubHeader
        {...props}
        loading={props.loading}
        DeleteButton={() => <DeleteButton id={props.id!} useMutation={useDeleteProduct} />}
        onClick={handleSubmit(onSubmit)}
        title={title}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados do produto">
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
            viewRoute={(brand) =>
              navigate(generatePath(BrandsRoutes.View, { id: brand.id.toString() }))
            }
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
    </ManageWrapper>
  );
}

export { ProductManageForm };
