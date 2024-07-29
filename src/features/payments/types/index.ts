import { BaseEntityInt } from '@/types/common';
import { UserModel } from '@/features/auth/types';
import { ClientModel } from '@/features/clients/types';
import { OrderModel } from '@/features/orders/types';

export type PaymentModel = BaseEntityInt & {
  value: number;
  paidDate: string;
  clientId: string;
  issuerId: string;
  readonly client: ClientModel;
  readonly issuer: UserModel;
  readonly orders: OrderModel[];
};
