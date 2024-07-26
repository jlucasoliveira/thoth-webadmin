import { UserModel } from '@/features/auth/types';
import { ClientModel } from '@/features/clients/types';
import { ProductVariationModel } from '@/features/products/types';
import { BaseEntity, BaseEntityInt } from '@/types/common';

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
  paymentId?: string;

  readonly items: OrderItemModel[];
  readonly client: ClientModel;
  readonly seller: UserModel;
  readonly payment: any;
};
