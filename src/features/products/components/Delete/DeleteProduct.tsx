import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { ConfirmationDialog, ImperativeHandle } from '@/components/Elements';
import { useDeleteProduct } from '../../api/deleteProduct';

type DeleteProduct = {
  id: string;
};

function DeleteProduct({ id }: DeleteProduct) {
  const navigate = useNavigate();
  const confirmationDialogRef = useRef<ImperativeHandle>(null);
  const { isLoading, mutateAsync } = useDeleteProduct();
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

export { DeleteProduct };
