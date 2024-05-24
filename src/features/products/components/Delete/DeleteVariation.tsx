import { useCallback, useRef } from 'react';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteVariation } from '../../api/variations/deleteVariation';

type DeleteVariation = {
  id: string | number;
  productId?: string;
  remove: (index: number) => void;
};

function DeleteVariation({ id, productId, remove }: DeleteVariation) {
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteVariation();

  const confirmationHandler = useCallback(
    async (id: DeleteVariation['id']) => {
      if (typeof id === 'string') await mutateAsync({ id, productId: productId! });
      else remove(id);
      confirmationDialogRef.current?.handleOnClose?.();
    },
    [productId, mutateAsync, remove]
  );

  return (
    <>
      <IconButton
        aria-label="Excluir"
        size="xs"
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

export { DeleteVariation };
