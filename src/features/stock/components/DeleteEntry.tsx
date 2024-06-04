import { useCallback, useRef } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteEntry } from '../api/deleteEntry';

type DeleteEntry = {
  id: string;
  variationId: string;
};

function DeleteEntry({ id, variationId }: DeleteEntry) {
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteEntry();
  const confirmationHandler = useCallback(
    async (id: string, variationId: string) => {
      await mutateAsync({ id, variationId });
      confirmationDialogRef.current?.handleOnClose?.();
    },
    [mutateAsync]
  );

  return (
    <>
      <IconButton
        aria-label="Excluir"
        icon={<DeleteIcon />}
        variant="ghost"
        onClick={() => confirmationDialogRef.current?.handleClick()}
      />
      <ConfirmationDialog
        ref={confirmationDialogRef}
        isLoading={isLoading}
        confirmationAction={() => confirmationHandler(id, variationId)}
      />
    </>
  );
}

export { DeleteEntry };
