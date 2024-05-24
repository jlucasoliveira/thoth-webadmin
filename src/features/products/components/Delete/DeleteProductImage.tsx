import { useCallback, useRef } from 'react';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteAttachment } from '@/features/attachments/api/deleteAttachment';

type DeleteProductImage = {
  id: string | number;
  remove: (index: number) => void;
};

function DeleteProductImage({ id, remove }: DeleteProductImage) {
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteAttachment();

  const confirmationHandler = useCallback(
    async (id: DeleteProductImage['id']) => {
      if (typeof id === 'string') await mutateAsync(id);
      else remove(id);
      confirmationDialogRef.current?.handleOnClose?.();
    },
    [mutateAsync, remove]
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
        confirmationAction={() => confirmationHandler(id)}
      />
    </>
  );
}

export { DeleteProductImage };
