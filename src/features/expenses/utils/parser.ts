import type { FormType } from '../components/validation';
import { Payload } from '../api/createExpense';

export function parseFormTypeToPayload(data: FormType): Payload {
  return {
    brandId: data.brand!.id,
    bankAccountId: data.account!.id,
    installments: data.installments ?? 1,
    isPaid: !!data.isPaid,
    value: data.value,
  };
}
