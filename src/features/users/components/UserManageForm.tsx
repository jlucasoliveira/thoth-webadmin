import { useEffect, useMemo } from 'react';
import { Control, FormProvider, Path, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserModel } from '@/features/auth/types';
import { Form } from '@/components/Form';
import { SubHeader, ManageWrapper } from '@/components/Layout';
import { DeleteButton } from '@/components/Helpers';
import { FormProps } from '@/types/props';
import { useDeleteUser } from '../api/deleteUser';
import {
  SetPasswordForm,
  SetPasswordFormType,
  schema as setPasswordFormSchema,
} from './Forms/SetPasswordForm';
import { ChangePasswordForm } from './Forms/ChangePasswordForm';
import { UserDataForm, UserDataFormType, schema as userDataFormSchema } from './Forms/UserDataForm';

export type FormType = UserDataFormType & Partial<SetPasswordFormType>;

const defaultValues: FormType = {
  id: '',
  name: '',
  password: '',
  username: '',
  phoneNumber: '',
};

const schema = userDataFormSchema.when('$isNewEntry', {
  is: true,
  then: (parent) => parent.concat(setPasswordFormSchema),
});

function CreateUserForm({
  id,
  isEdit,
  loading,
  data,
  fetchingLoading,
  onSubmit,
}: FormProps<FormType, UserModel>) {
  const { handleSubmit, ...methods } = useForm<FormType>({
    defaultValues: { id, ...defaultValues },
    context: {
      isNewEntry: !id,
    },
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  const isFormEdit = useMemo(() => {
    if (loading) return false;
    return id ? isEdit : true;
  }, [id, isEdit, loading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => methods.reset(), []);

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          methods.setValue(key as Path<FormType>, value as any);
        }
      });
    }
  }, [methods, data]);

  return (
    <ManageWrapper>
      <SubHeader
        title="Usuários"
        id={id}
        isEdit={isEdit}
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        DeleteButton={() => <DeleteButton id={id!} useMutation={useDeleteUser} />}
      />
      <FormProvider {...methods} handleSubmit={handleSubmit}>
        <Form loading={fetchingLoading}>
          <UserDataForm control={methods.control} isEdit={isFormEdit} />
          {id ? (
            <ChangePasswordForm id={id} loading={loading} />
          ) : (
            <SetPasswordForm
              control={methods.control as unknown as Control<SetPasswordFormType, any>}
            />
          )}
        </Form>
      </FormProvider>
    </ManageWrapper>
  );
}

export { CreateUserForm };
