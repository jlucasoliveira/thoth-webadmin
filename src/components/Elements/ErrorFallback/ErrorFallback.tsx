import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useRef } from 'react';

function ErrorFallback() {
  const refreshRef = useRef(null);
  const { onClose, isOpen } = useDisclosure({ isOpen: true });

  const refreshAction = useCallback(() => {
    onClose();
    window.location.assign(window.location.href);
  }, [onClose]);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={refreshRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Ocorreu um problema!
          </AlertDialogHeader>

          <AlertDialogBody>Por favor, atualize a página.</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={refreshRef} onClick={refreshAction}>
              Atualizar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export { ErrorFallback };
