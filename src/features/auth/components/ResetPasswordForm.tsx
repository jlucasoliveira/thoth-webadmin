import * as yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Center, Stack, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useNotificationStore } from '@/stores/notifications';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/Form/Input';
import { AuthRoutes } from '../routes/constants';
import { usePasswordReset } from '../api/resetPassword';

const schema = yup.object().shape({
  password: yup.string().required('Este campo é obrigatório'),
  confirmPassword: yup
    .string()
    .required('Este campo é obrigatório')
    .test('passwords-match', 'As senhas são diferentes!', function (value) {
      return this.parent.password === value;
    }),
});

type FormType = yup.InferType<typeof schema>;

const defaultValues: FormType = {
  password: '',
  confirmPassword: '',
};

type Params = {
  token: string;
};

function ResetPasswordForm() {
  const navigate = useNavigate();
  const { token } = useParams<Params>();
  const { isLoading, mutate } = usePasswordReset();
  const { addNotification } = useNotificationStore();
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  async function handleMutation(newPassword: string, token: string) {
    mutate({ newPassword, token });
  }

  useEffect(() => {
    if (!token) {
      addNotification({
        title: 'Oops!',
        message: 'Token expirado ou inválido. Tente solicitar novamente!',
        type: 'error',
      });
      navigate(AuthRoutes.PasswordRecovery);
    }
  }, [token, addNotification, navigate]);

  return (
    <Box bg="white" rounded={8} mt={10} p="24px" w="sm">
      <Stack>
        <Center>
          <Text as="b">Alteração de senha</Text>
        </Center>
        <Center w="xs">
          <Text as="b" noOfLines={2}>
            Digite sua nova senha e confirme
          </Text>
        </Center>
      </Stack>
      <Input control={control} name="password" label="Senha" type="password" required />
      <Input
        control={control}
        name="confirmPassword"
        label="Confirmação de senha"
        type="password"
        required
      />
      <Button
        isLoading={isLoading}
        colorScheme="blue"
        w="full"
        rounded="full"
        onClick={
          token ? handleSubmit(({ password }) => handleMutation(password, token)) : undefined
        }
      >
        Enviar
      </Button>
      <Center mt={5}>
        Lembrou a senha?
        <Link as={RouterLink} to={AuthRoutes.Login} color="blue.900" fontWeight="bold" pl={2}>
          Fazer login
        </Link>
      </Center>
      <Center mt={5}>
        <Link
          as={RouterLink}
          to={AuthRoutes.PasswordRecovery}
          color="blue.900"
          fontWeight="bold"
          pl={2}
        >
          Solicitar novamente
        </Link>
      </Center>
    </Box>
  );
}

export { ResetPasswordForm };
