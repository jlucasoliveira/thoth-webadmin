import { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Resolver, useForm } from 'react-hook-form';
import { FormProps } from '@/types/props';
import { Form, Input } from '@/components/Form';
import { DeleteButton } from '@/components/Helpers';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { useDeleteClient } from '../api/deleteClient';
import { ClientModel } from '../types';
import { FormType, schema, defaultValues } from './validation';
import { phoneMask } from '@/utils/format';

function format(key: keyof ClientModel, value: any): string {
  if (key === 'phoneNumber') return phoneMask(value);
  return value.toString();
}

function ClientManageForm({
  onSubmit,
  data,
  fetchingLoading,
  ...props
}: FormProps<FormType, ClientModel>) {
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
          setValue(key as Path<FormType>, format(key as keyof ClientModel, value));
        }
      });
    }
  }, [data, setValue]);

  return (
    <ManageWrapper>
      <SubHeader
        {...props}
        loading={props.loading}
        DeleteButton={() => (
          <DeleteButton
            id={props.id!}
            useMutation={useDeleteClient}
            buttonProps={{ isDisabled: data?.isDefault }}
          />
        )}
        onClick={handleSubmit(onSubmit)}
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
          <Input
            isDisabled={!isFormEdit}
            control={control}
            name="phoneNumber"
            label="Telefone"
            formatter={phoneMask}
          />
        </FieldsContainer>
      </Form>
    </ManageWrapper>
  );
}

export { ClientManageForm };
