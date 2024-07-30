import { Payload } from '../api/createOrder';
import { FormType } from '../components/validations';
import { useUserStore } from '@/stores/user';

const state = useUserStore.getState();

export function parseFormTypeToPayload(data: FormType): Payload {
  const total = data.items?.reduce((acc, cur) => acc + cur.quantity * cur.variation.price, 0) ?? 0;
  return {
    total,
    paid: data.paid,
    clientId: data.client?.id,
    sellerId: state.user.id,
    totalPaid: data.totalPaid,
    installments: data.installments,
    retainedStock: data.retainedStock,
    items:
      data.items?.map((cur) => ({ quantity: cur.quantity, variationId: cur.variation.id })) ?? [],
  };
}
