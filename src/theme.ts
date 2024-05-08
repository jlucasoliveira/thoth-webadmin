import { extendTheme, ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  variants: {
    solid: {
      _disabled: {
        bgColor: 'gray.450',
      },
      _hover: {
        _disabled: {
          bgColor: 'gray.390',
        },
      },
    },
  },
  baseStyle: {
    fontWeight: 600,
  },
};

const theme = extendTheme({
  fonts: {
    heading: `'Open sans', sans-serif`,
    body: `'Open sans', Lexend, sans-serif`,
  },
  colors: {
    gray: {
      60: '#F3F3F3',
      390: '#C4C4C4',
      450: '#B0B0B0',
      460: '#727272',
      550: '#909090',
      560: '#5E5E5E',
    },
    other: {
      semiBlack: '#444444',
      carbonBlack: '#2C2C2C',
      black: '#1E1E1E',
      yellow: '#FFCA00',
      brown: '#473D3D',
      cream: '#F2E7D8',
      green: '#0FDB62',
      darkGreen: '#009CA6',
      redAlpha: '#FFEFEF',
      blueAlpha: '#005e7d90',
      neuterBlack: '#1B1A1A',
      gray: '#656263',
    },
  },
  components: {
    Button,
  },
});

export { theme };
