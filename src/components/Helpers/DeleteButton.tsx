import { useNavigate } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { Button } from '@chakra-ui/react';

export const DeleteButton = ({
  id,
  mutateAsync,
    isLoading,
  }: {
  id: string;
  mutateAsync: (id: string) => Promise<any>;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  const confirmationDialogRef = useRef<ImperativeHandle>(null);

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
};
