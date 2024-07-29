import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/Form';
import { useCreatePayment } from '@/features/payments/api/createPayment';
import { OrderModel } from '../types';
import {
  PaymentFormType,
  paymentSchema,
  paymentDefaultValues as defaultValues,
} from './validations';

type Props = {
  data?: OrderModel;
};

function PaymentModal({ data }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control, handleSubmit } = useForm<PaymentFormType>({
    defaultValues,
    resolver: yupResolver(paymentSchema),
  });
  const { mutateAsync, isLoading } = useCreatePayment();

  if (!data || data.paid) return null;

  async function onSubmit(form: PaymentFormType) {
    mutateAsync({
      orderId: data!.id,
      clientId: data!.clientId,
      value: form.value ?? data!.total,
    });
    onClose();
  }

  return (
    <>
      <Button ml="2" rounded="full" colorScheme="blue" onClick={onOpen}>
        Pagar
      </Button>
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInTop"
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Pagamento</AlertDialogHeader>
            <AlertDialogBody>
              <Input control={control} name="value" type="number" label="Valor pago" required />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                variant="ghost"
                isLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                Salvar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export { PaymentModal };
