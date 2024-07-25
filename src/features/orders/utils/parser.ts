import { Payload } from '../api/createOrder';
import { FormType } from '../components/validations';
import { useUserStore } from '@/stores/user';

const state = useUserStore.getState();

export function parseFormTypeToPayload(data: FormType): Payload {
  const total = data.items?.reduce((acc, cur) => acc + cur.quantity * cur.variation.price, 0) ?? 0;
  return {
    total,
    clientId: data.client?.id,
    paid: data.paid,
    sellerId: state.user.id,
    items:
      data.items?.map((cur) => ({ quantity: cur.quantity, variationId: cur.variation.id })) ?? [],
    totalPaid: data.totalPaid ?? 0,
  };
}
