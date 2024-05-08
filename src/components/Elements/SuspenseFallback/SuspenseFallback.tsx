import * as S from './styles';
import { Spinner } from '@chakra-ui/react';

function SuspenseFallback() {
  return (
    <S.Container>
      <Spinner size="xl" />
    </S.Container>
  );
}

export { SuspenseFallback };
