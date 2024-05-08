import { useCallback } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Center, Checkbox, Link } from '@chakra-ui/react';
import { Input } from '@/components/Form';
import { useLogin } from '../api/login';
import { AuthRoutes } from '../routes/constants';

const schema = yup.object().shape({
  username: yup.string().required('Este campo é obrigatório'),
  password: yup.string().required('Este campo é obrigatório'),
});

type FormType = yup.InferType<typeof schema>;

const defaultValues: FormType = {
  username: '',
  password: '',
};

function LoginForm() {
  const { isLoading, mutate } = useLogin();
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    (payload: FormType) => {
      mutate({
        username: payload.username,
        password: payload.password,
      });
    },
    [mutate]
  );

  return (
    <Box bg="white" rounded={8} mt={10} p="24px" w="sm">
      <Input control={control} name="username" label="E-mail" required isDisabled={isLoading} />
      <Input
        autoComplete="password"
        control={control}
        name="password"
        label="Senha"
        type="password"
        required
        isDisabled={isLoading}
      />
      <Checkbox isDisabled={isLoading} colorScheme="blue" defaultChecked mb={5} color="gray.550">
        Lembrar de mim
      </Checkbox>

      <Button
        w="full"
        rounded="full"
        colorScheme="blue"
        isLoading={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        Entrar
      </Button>
      <Center mt={5}>
        Esqueceu a senha?
        <Link
          as={RouterLink}
          to={AuthRoutes.PasswordRecovery}
          color="blue.900"
          fontWeight="bold"
          pl={2}
        >
          Recuperar senha
        </Link>
      </Center>
    </Box>
  );
}

export { LoginForm };
