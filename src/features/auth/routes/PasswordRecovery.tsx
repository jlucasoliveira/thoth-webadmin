import { Container, Divider } from '@chakra-ui/react';
import { ReactComponent as BrandLogoAsset } from '@/assets/images/logo.svg';
import { Layout, PasswordRecoveryForm } from '@/features/auth/components';
import { container } from './styles';

function PasswordRecovery() {
  return (
    <Layout>
      <Container css={container}>
        <BrandLogoAsset width={500} />
      </Container>
      <Divider orientation="vertical" />
      <Container css={container} flexDirection="column">
        <PasswordRecoveryForm />
      </Container>
    </Layout>
  );
}

export { PasswordRecovery };
