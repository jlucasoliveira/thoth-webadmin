import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteClient } from '../api/deleteClient';

type DeleteClient = {
  id: string;
  isDefault?: boolean;
};

function DeleteClient({ id, isDefault }: DeleteClient) {
  const navigate = useNavigate();
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteClient();
  const confirmationHandler = useCallback(
    async (id: string) => {
      console.log(`Excluíndo ${id}`);
      // await mutateAsync(id);
      // navigate(-1);
    },
    [mutateAsync, navigate]
  );

  return (
    <>
      <Button
        isDisabled={isDefault}
        variant="ghost"
        onClick={() => confirmationDialogRef.current?.handleClick()}
      >
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

export { DeleteClient };
