import { BaseEntity, BaseEntityInt } from '@/types/common';
import { UserModel } from '@/features/auth/types';
import { ClientModel } from '@/features/clients/types';
import { PaymentModel } from '@/features/payments/types';
import { ProductVariationModel } from '@/features/products/types';

export type OrderItemModel = BaseEntityInt & {
  quantity: number;
  total: number;
  value: number;
  orderId: string;
  variationId: string;

  readonly order: OrderModel;
  readonly variation: ProductVariationModel;
};

export type OrderModel = BaseEntity & {
  paid: boolean;
  total: number;
  totalPaid?: number;
  paidDate?: string;
  installments?: number;
  clientId: string;
  sellerId: string;

  readonly items: OrderItemModel[];
  readonly client: ClientModel;
  readonly seller: UserModel;
  readonly payments: PaymentModel[];
};
