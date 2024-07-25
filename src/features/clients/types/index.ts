import { OrderModel } from '@/features/orders/types';
import { BaseEntity } from '@/types/common';

export type ClientModel = BaseEntity & {
  name: string;
  phoneNumber?: string;
  email?: string;
  isDefault: boolean;
  readonly purchases: OrderModel[];
};
