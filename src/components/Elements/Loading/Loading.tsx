import { Center, Spinner } from '@chakra-ui/react';

type Loading = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs';
};

function Loading({ size = 'xl' }: Loading) {
  return (
    <Center h="full" w="full">
      <Spinner color="blue" size={size} />
    </Center>
  );
}

export { Loading };
