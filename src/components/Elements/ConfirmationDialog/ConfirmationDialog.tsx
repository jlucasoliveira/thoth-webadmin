import { Ref, forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
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

type Props = {
  isLoading: boolean;
  confirmationAction: () => void;
  isEdit?: boolean;
};

export type ImperativeHandle = {
  handleClick: () => void;
  handleOnClose: () => void;
};

const ConfirmationDialog = forwardRef((props: Props, ref: Ref<ImperativeHandle>) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const title = useMemo(
    () => (props.isEdit ? 'Atualizar cadastro' : 'Excluir cadastro'),
    [props.isEdit]
  );
  const body = useMemo(() => {
    if (props.isEdit) {
      return 'Tem certeza de que deseja alterar este cadastro?';
    }
    return 'Tem certeza de que deseja excluir este cadastro? Esta ação não pode ser revertida.';
  }, [props.isEdit]);

  useImperativeHandle(ref, () => ({
    handleClick: onOpen,
    handleOnClose: onClose,
  }));

  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} variant="ghost" onClick={onClose}>
              Não, cancelar
            </Button>
            <Button
              colorScheme="blue"
              variant="ghost"
              isLoading={props.isLoading}
              onClick={props.confirmationAction}
            >
              Sim, {props.isEdit ? 'editar' : 'excluir'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
});

export { ConfirmationDialog };
