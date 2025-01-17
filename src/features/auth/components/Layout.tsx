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
      css={`
        @media (max-width: 1000px) {
          flex-direction: column;
        }
      `}
    >
      {children}
    </Box>
  );
}

export { Layout };
