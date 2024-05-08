import { useCallback, useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteCategory } from '../api/deleteCategory';

type DeleteCategory = {
  id: string;
};

function DeleteCategory({ id }: DeleteCategory) {
  const navigate = useNavigate();
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteCategory();
  const confirmationHandler = useCallback(
    async (id: string) => {
      await mutateAsync(id);
      navigate(-1);
    },
    [mutateAsync, navigate]
  );

  return (
    <>
      <Button variant="ghost" onClick={() => confirmationDialogRef.current?.handleClick()}>
        Excluir
      </Button>
      <ConfirmationDialog
        ref={confirmationDialogRef}
        isLoading={isLoading}
        confirmationAction={() => confirmationHandler(id)}
      />
    </>
  );
}

export { DeleteCategory };
