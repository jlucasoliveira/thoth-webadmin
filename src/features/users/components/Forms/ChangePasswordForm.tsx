import { Button } from '@chakra-ui/react';
import * as yup from 'yup';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { useChangePassword } from '../../api/changePassword';

// eslint-disable-next-line react-refresh/only-export-components
export const schema = yup.object().shape({
  newPassword: yup.string().required('Este campo é obrigatório'),
  confirmPassword: yup
    .string()
    .required('Este campo é obrigatório')
    .test('passwords-match', 'As senhas são diferentes!', function (value) {
      return this.parent.newPassword === value;
    }),
});

type FormType = yup.InferType<typeof schema>;

const defaultValues: FormType = {
  confirmPassword: '',
  newPassword: '',
};

type Props = {
  id?: string;
  loading?: boolean;
};

function ChangePasswordForm({ id, loading }: Props) {
  const { isLoading, mutate } = useChangePassword();
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormType>,
  });

  function onSubmit(data: FormType) {
    if (id) mutate({ ...data, userId: id });
  }

  return (
    <FieldsContainer title="Senha" gridProps={{ alignItems: 'center' }}>
      <Input
        isDisabled={loading || isLoading}
        name="newPassword"
        control={control}
        label="Nova senha"
        type="password"
      />
      <Input
        isDisabled={loading || isLoading}
        name="confirmPassword"
        control={control}
        label="Repetir nova senha"
        type="password"
      />
      <Button isDisabled={loading || isLoading} onClick={handleSubmit(onSubmit)} colorScheme="blue">
        Alterar senha
      </Button>
    </FieldsContainer>
  );
}

export { ChangePasswordForm };
