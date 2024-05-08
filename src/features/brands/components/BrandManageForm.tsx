import { useEffect, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { InferType, object, string, number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Resolver, useForm } from 'react-hook-form';
import { Form, Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { SubHeader } from '@/components/Layout';
import { FormProps } from '@/types/props';
import { BrandModel } from '../types';
import { DeleteBrand } from './DeleteBrand';

const schema = object().shape({
  id: string().optional(),
  name: string().required('Campo obrigatório'),
  profitRate: number().positive('Informe um valor válido').required('Campo obrigatório'),
});

export type FormType = InferType<typeof schema>;

const defaultValues: FormType = {
  id: '',
  name: '',
  profitRate: 30,
};

function BrandManageForm({
  id,
  isEdit,
  onSubmit,
  loading,
  data,
  fetchingLoading,
}: FormProps<FormType, BrandModel>) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const title = useMemo<string>(() => {
    const currentTitle = 'Marca';
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
        setValue(key as Path<FormType>, value);
      });
    }
  }, [data, setValue]);

  return (
    <Flex direction="column" w="full" m={5}>
      <SubHeader
        id={id}
        title={title}
        isEdit={isEdit}
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        DeleteButton={DeleteBrand}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados da marca" templateColumn={3}>
          <Input control={control} name="name" label="Nome" isDisabled={!isFormEdit} required />
          <Input
            required
            isDisabled={!isFormEdit}
            control={control}
            name="profitRate"
            label="Taxa de lucro"
            type="number"
            min="1"
            leftAddon="%"
          />
        </FieldsContainer>
      </Form>
    </Flex>
  );
}

export { BrandManageForm };
