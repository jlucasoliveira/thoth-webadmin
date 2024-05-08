import { PropsWithChildren, forwardRef } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { Loading } from '../Elements';

type Form = {
  loading?: boolean;
  props?: FlexProps;
};

const Form = forwardRef<any, PropsWithChildren<Form>>(({ children, loading, props }, ref) => {
  return (
    <Flex
      ref={ref}
      bgColor="white"
      flex={1}
      p={5}
      rounded={8}
      borderWidth={1}
      borderStyle="solid"
      borderColor="gray.450"
      direction="column"
      overflowX="hidden"
      {...props}
    >
      {loading ? <Loading /> : children}
    </Flex>
  );
});

export { Form };
