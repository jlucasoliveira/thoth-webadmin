import { BaseEntityInt } from '@/types/common';
import { BrandModel } from '@/features/brands/types';
import { BankAccountModel } from '@/features/bankAccounts/types';

export type ExpenseModel = BaseEntityInt & {
  value: number;
  isPaid: boolean;
  installments: number;
  brandId: number;
  bankAccountId: number;

  // relations
  readonly brand: BrandModel;
  readonly bankAccount: BankAccountModel;
};
