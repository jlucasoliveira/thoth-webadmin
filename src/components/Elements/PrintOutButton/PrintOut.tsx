import { Button, ButtonProps } from '@chakra-ui/react';
import { PrinterIcon } from './Icon';

function PrintOut(props: ButtonProps) {
  return (
    <Button
      colorScheme="blue"
      rounded="full"
      leftIcon={<PrinterIcon color="white" />}
      w="xs"
      {...props}
    >
      Imprimir
    </Button>
  );
}

export { PrintOut };
