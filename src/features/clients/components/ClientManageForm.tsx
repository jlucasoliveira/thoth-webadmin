import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Resolver, useForm } from 'react-hook-form';
import { FormProps } from '@/types/props';
import { SubHeader } from '@/components/Layout';
import { Form, Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { ClientRoutes } from '../routes/constants';
import { ClientModel } from '../types';
import { DeleteClient } from './DeleteClient';
import { FormType, schema, defaultValues } from './validation';

function ClientManageForm({
  onSubmit,
  data,
  fetchingLoading,
  ...props
}: FormProps<FormType, ClientModel>) {
  const navigate = useNavigate();
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
    const currentTitle = 'cliente';
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
        DeleteButton={(props) => <DeleteClient {...props} isDefault={data?.isDefault} />}
        onClick={handleSubmit(onSubmit)}
        goBack={() => navigate(ClientRoutes.List)}
        title={title}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados do cliente" templateColumn={3}>
          <Input isDisabled={!isFormEdit} control={control} name="name" label="Nome" required />
          <Input
            isDisabled={!isFormEdit}
            control={control}
            name="email"
            label="E-mail"
            type="email"
          />
          <Input isDisabled={!isFormEdit} control={control} name="phoneNumber" label="Telefone" />
        </FieldsContainer>
      </Form>
    </Flex>
  );
}

export { ClientManageForm };
