import { useCallback, useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteUser } from '../api/deleteUser';
import { useNavigate } from 'react-router-dom';

type DeleteUser = {
  id: string;
};

function DeleteUser({ id }: DeleteUser) {
  const navigate = useNavigate();
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteUser();
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

export { DeleteUser };
