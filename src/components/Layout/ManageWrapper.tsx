import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

function ManageWrapper({ children }: PropsWithChildren<object>) {
  return (
    <Flex direction="column" w="full" py="1" px="2">
      {children}
    </Flex>
  );
}

export { ManageWrapper };
