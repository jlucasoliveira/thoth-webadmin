import { ElementType, useRef } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';

type SaveDialogProps = {
  loading?: boolean;
  onClick: () => void | Promise<void>;
  isEdit?: boolean;
  Button?: ElementType<ButtonProps>;
};

function SaveDialog({ onClick, isEdit, loading, Button: Btn }: SaveDialogProps) {
  const confirmationDialogRef = useRef<ImperativeHandle>(null);

  function handleClick() {
    if (!isEdit) onClick();
    else confirmationDialogRef.current?.handleClick?.();
  }

  return (
    <>
      {Btn ? (
        <Btn size="sm" isLoading={loading} onClick={handleClick} />
      ) : (
        <Button
          isLoading={loading}
          colorScheme="blue"
          rounded="5"
          px={10}
          ml={5}
          onClick={handleClick}
          size="sm"
        >
          Salvar
        </Button>
      )}
      <ConfirmationDialog
        isEdit
        ref={confirmationDialogRef}
        isLoading={!!loading}
        confirmationAction={async () => {
          await onClick();
          confirmationDialogRef.current?.handleOnClose();
        }}
      />
    </>
  );
}

export { SaveDialog };
