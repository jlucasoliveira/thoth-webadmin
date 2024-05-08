import * as yup from 'yup';
import { Box, Button, Center, Stack, Link, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/Form/Input';
import { Link as RouterLink } from 'react-router-dom';
import { AuthRoutes } from '../routes/constants';
import { usePasswordRecovery } from '../api/passwordRecovery';

const schema = yup.object().shape({
  email: yup.string().email('Informe um e-mail válido').required('Este campo é obrigatório'),
});

type FormType = yup.InferType<typeof schema>;

const defaultValues: FormType = {
  email: '',
};

function PasswordRecoveryForm() {
  const { isLoading, mutate } = usePasswordRecovery();
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  async function handleMutation({ email }: FormType) {
    mutate(email);
  }

  return (
    <Box bg="white" rounded={8} mt={10} p="24px" w="sm">
      <Stack>
        <Center>
          <Text as="b">Esqueceu a senha?</Text>
        </Center>
        <Center w="xs">
          <Text as="b" noOfLines={2}>
            Digite seu e-mail e lhe enviaremos instruções para alteração da senha
          </Text>
        </Center>
      </Stack>
      <Input control={control} name="email" label="E-mail" required />
      <Button
        isLoading={isLoading}
        colorScheme="blue"
        w="full"
        rounded="full"
        onClick={handleSubmit(handleMutation)}
      >
        Enviar
      </Button>
      <Center mt={5}>
        Lembrou a senha?
        <Link as={RouterLink} to={AuthRoutes.Login} color="blue.900" fontWeight="bold" pl={2}>
          Fazer login
        </Link>
      </Center>
    </Box>
  );
}

export { PasswordRecoveryForm };
