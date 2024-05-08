import { Flex, Heading, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '.';

function NotFound() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Flex flexGrow={1} justifyContent="center" alignItems="center" direction="column">
        <Heading fontFamily="Open sans">Página não encontrada!</Heading>
        <Link fontSize={15} onClick={() => navigate(-1)}>
          Voltar
        </Link>
      </Flex>
    </MainLayout>
  );
}

export { NotFound };
