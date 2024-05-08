import { Container, Divider } from '@chakra-ui/react';
import { ReactComponent as AccessAsset } from '@/assets/presentation/access-plan.svg';
import { ReactComponent as BrandLogoAsset } from '@/assets/images/logo.svg';
import { Layout, ResetPasswordForm } from '@/features/auth/components';
import { container } from './styles';

function ResetPassword() {
  return (
    <Layout>
      <Container css={container}>
        <AccessAsset />
      </Container>
      <Divider orientation="vertical" />
      <Container css={container} flexDirection="column">
        <BrandLogoAsset width={150} />
        <ResetPasswordForm />
      </Container>
    </Layout>
  );
}

export { ResetPassword };
