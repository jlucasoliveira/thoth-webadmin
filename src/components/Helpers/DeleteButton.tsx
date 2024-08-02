import { useNavigate } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { Button, ButtonProps } from '@chakra-ui/react';
import { UseMutation } from '@/lib/react-query';

type Props<T = string> = {
  id: T;
  useMutation: UseMutation<T, (id: T) => Promise<any>>;
  buttonProps?: Omit<ButtonProps, 'onClick'>;
};

function DeleteButton<T = any>({ id, buttonProps, useMutation }: Props<T>) {
  const navigate = useNavigate();
  const { isLoading, mutateAsync } = useMutation();
  const confirmationDialogRef = useRef<ImperativeHandle>(null);

  const confirmationHandler = useCallback(
    async (id: T) => {
      await mutateAsync(id);
      navigate(-1);
    },
    [mutateAsync, navigate]
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        {...buttonProps}
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

export { DeleteButton };
