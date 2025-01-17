import { Container, Divider } from '@chakra-ui/react';
import { ReactComponent as BrandLogoAsset } from '@/assets/images/logo.svg';
import { Layout, LoginForm } from '@/features/auth/components';
import { container } from './styles';

function Login() {
  return (
    <Layout>
      <Container css={container}>
        <BrandLogoAsset width={500} />
      </Container>
      <Divider
        orientation="vertical"
        css={`
          @media (max-width: 1000px) {
            display: none;
          }
        `}
      />
      <Container css={container} flexDirection="column">
        <LoginForm />
      </Container>
    </Layout>
  );
}

export { Login };
