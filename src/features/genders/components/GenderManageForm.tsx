import { useEffect, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { InferType, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Resolver, useForm } from 'react-hook-form';
import { Form, Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { SubHeader } from '@/components/Layout';
import { FormProps } from '@/types/props';
import { GenderModel } from '../types';
import { DeleteGender } from './DeleteGender';

const schema = object().shape({
  id: string().optional(),
  name: string().required('Campo obrigatório'),
});

export type FormType = InferType<typeof schema>;

const defaultValues: FormType = {
  id: '',
  name: '',
};

function GenderManageForm({
  id,
  isEdit,
  onSubmit,
  loading,
  data,
  fetchingLoading,
}: FormProps<FormType, GenderModel>) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const title = useMemo<string>(() => {
    const currentTitle = 'Gênero';
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
        DeleteButton={DeleteGender}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados do gênero" templateColumn={3}>
          <Input control={control} name="name" label="Nome" isDisabled={!isFormEdit} required />
        </FieldsContainer>
      </Form>
    </Flex>
  );
}

export { GenderManageForm };
