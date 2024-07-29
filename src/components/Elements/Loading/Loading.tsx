import { Center, CenterProps, Spinner } from '@chakra-ui/react';

type Loading = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs';
  centerProps?: CenterProps;
};

function Loading({ size = 'xl', centerProps }: Loading) {
  return (
    <Center h="full" w="full" {...centerProps}>
      <Spinner color="blue" size={size} />
    </Center>
  );
}

export { Loading };
