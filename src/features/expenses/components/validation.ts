import { InferType, boolean, mixed, number, object } from 'yup';
import { BrandModel } from '@/features/brands/types';
import { BankAccountModel } from '@/features/bankAccounts/types';

export const schema = object().shape({
  value: number().required().positive('Informe um número positivo'),
  isPaid: boolean(),
  installments: number().positive('Informe um número positivo'),
  brand: mixed<BrandModel>().required(),
  account: mixed<BankAccountModel>().required(),
});

export type FormType = InferType<typeof schema>;

export const defaultValues: FormType = {
  account: { name: '' } as BankAccountModel,
  brand: { name: '' } as BrandModel,
  value: 0,
  installments: 1,
  isPaid: false,
};
