import { useEffect, useMemo } from 'react';
import { InferType, object, string, mixed } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Resolver, useForm } from 'react-hook-form';
import { FormProps } from '@/types/props';
import { UserModel } from '@/features/auth/types';
import { useUsers } from '@/features/users/api/getUsers';
import { DeleteButton } from '@/components/Helpers';
import { Form, Input, SearchableSelect } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { useDeleteAccount } from '../api/deleteAccount';
import { BankAccountModel } from '../types';

const schema = object().shape({
  id: string().optional(),
  name: string().required('Campo obrigatório'),
  agency: string().optional(),
  accountNumber: string().optional(),
  owner: mixed<UserModel>().optional(),
});

export type FormType = InferType<typeof schema>;

const defaultValues: FormType = {
  id: '',
  name: '',
  agency: '',
  accountNumber: '',
  owner: { id: '' } as UserModel,
};

function BankAccountManageForm({
  id,
  isEdit,
  onSubmit,
  loading,
  data,
  fetchingLoading,
}: FormProps<FormType, BankAccountModel>) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const title = useMemo<string>(() => {
    const currentTitle = 'Conta bancária';
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
        if (value !== null && value !== undefined) setValue(key as Path<FormType>, value as any);
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
        DeleteButton={() => <DeleteButton id={id!} useMutation={useDeleteAccount} />}
      />
      <Form loading={fetchingLoading}>
        <FieldsContainer title="Dados da marca" templateColumn={4}>
          <Input control={control} name="name" label="Nome" isDisabled={!isFormEdit} required />
          <Input isDisabled={!isFormEdit} control={control} name="agency" label="Agência" />
          <Input
            control={control}
            isDisabled={!isFormEdit}
            label="Número da conta"
            name="accountNumber"
          />
          <SearchableSelect
            control={control}
            name="owner"
            label="Titular"
            useFetch={useUsers}
            getOptionLabel={(user) => user.name ?? user.username}
            defaultOptionValue={data?.ownerId}
            handleSetValue={(owner) => setValue('owner', owner)}
          />
        </FieldsContainer>
      </Form>
    </ManageWrapper>
  );
}

export { BankAccountManageForm };
