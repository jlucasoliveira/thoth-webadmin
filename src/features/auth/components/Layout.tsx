import { Box } from '@chakra-ui/react';
import React from 'react';

type LayoutType = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutType) {
  return (
    <Box
      h="100vh"
      w="100vw"
      bgGradient="linear(to-tr, blue.400, blue.900)"
      display="flex"
      alignItems="stretch"
      flexDirection="row"
      paddingY={50}
    >
      {children}
    </Box>
  );
}

export { Layout };
