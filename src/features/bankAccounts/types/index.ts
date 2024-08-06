import { BaseEntityInt } from '@/types/common';
import { UserModel } from '@/features/auth/types';
import { PaymentModel } from '@/features/payments/types';

export type BankAccountModel = BaseEntityInt & {
  name: string;
  agency?: string;
  accountNumber?: string;
  ownerId?: string;

  readonly owner: UserModel;
  readonly payments: PaymentModel[];
};
