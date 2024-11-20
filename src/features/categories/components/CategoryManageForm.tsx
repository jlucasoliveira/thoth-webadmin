import { useEffect, useMemo } from 'react';
import { InferType, mixed, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Resolver, useForm } from 'react-hook-form';
import { BrandModel } from '@/features/brands/types';
import { useBrands } from '@/features/brands/api/getBrands';
import { Form, Input, SearchableSelect } from '@/components/Form';
import { DeleteButton } from '@/components/Helpers';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { FormProps } from '@/types/props';
import { CategoryModel } from '../types';
import { useDeleteCategory } from '../api/deleteCategory';

const schema = object().shape({
  id: string().optional(),
  name: string().required('Campo obrigatório'),
  brand: mixed<BrandModel>().optional(),
});

export type FormType = InferType<typeof schema>;

const defaultValues: FormType = {
  id: '',
  name: '',
};

function CategoryManageForm({
  id,
  isEdit,
  onSubmit,
  loading,
  data,
  fetchingLoading,
}: FormProps<FormType, CategoryModel>) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const title = useMemo<string>(() => {
    const currentTitle = 'Categoria';
    if (isEdit) return `Editar ${currentTitle}`;
    if (!id) return `Nova ${currentTitle}`;
    return currentTitle;
  }, [id, isEdit]);

  const isFormEdit = useMemo(() => {
    if (loading) return false;
    return id ? isEdit : true;
  }, [id, isEdit, loading]);

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value) setValue(key as Path<FormType>, value.toString());
      });
    }
  }, [data, setValue]);

  return (
    <ManageWrapper>
      <SubHeader
        id={id}
        title={title}
        isEdit={isEdit}
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        DeleteButton={() => <DeleteButton id={id!} useMutation={useDeleteCategory} />}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados da categoria" templateColumn={3}>
          <Input control={control} name="name" label="Nome" isDisabled={!isFormEdit} required />
          <SearchableSelect
            control={control}
            name="brand"
            label="Marca"
            useFetch={useBrands}
            getOptionLabel={(brand) => brand.name}
            defaultOptionValue={data?.brandId}
            handleSetValue={(brand) => setValue('brand', brand)}
            isDisabled={!isFormEdit}
          />
        </FieldsContainer>
      </Form>
    </ManageWrapper>
  );
}

export { CategoryManageForm };
