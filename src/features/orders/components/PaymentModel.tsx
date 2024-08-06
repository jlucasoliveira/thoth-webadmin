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
import { Input, SearchableSelect } from '@/components/Form';
import { useCreatePayment } from '@/features/payments/api/createPayment';
import { useBankAccounts } from '@/features/bankAccounts/api/getAccounts';
import { BankAccountModel } from '@/features/bankAccounts/types';
import { OrderModel } from '../types';
import {
  PaymentFormType,
  paymentSchema,
  paymentDefaultValues as defaultValues,
} from './validations';

function getOptionLabel(account: BankAccountModel) {
  const labels = [account.name];
  if (account.agency) labels.push(account.agency);
  if (account.accountNumber) labels.push(account.accountNumber);
  return labels.join(' ');
}

type Props = {
  data?: OrderModel;
};

function PaymentModal({ data }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutateAsync, isLoading } = useCreatePayment();
  const { control, handleSubmit } = useForm<PaymentFormType>({
    defaultValues,
    resolver: yupResolver(paymentSchema),
  });

  if (!data || data.paid) return null;

  async function onSubmit(form: PaymentFormType) {
    mutateAsync({
      orderId: data!.id,
      clientId: data!.clientId,
      value: form.value ?? data!.total,
      accountId: form.account.id,
    });
    onClose();
  }

  return (
    <>
      <Button ml="2" rounded="5" size="sm" colorScheme="blue" onClick={onOpen}>
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
              <SearchableSelect
                control={control}
                name="account"
                label="Conta"
                useFetch={useBankAccounts}
                getOptionLabel={getOptionLabel}
              />
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
