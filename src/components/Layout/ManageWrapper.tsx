import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

function ManageWrapper({ children }: PropsWithChildren<object>) {
  return (
    <Flex direction="column" w="full" my="1" mx="2">
      {children}
    </Flex>
  );
}

export { ManageWrapper };
