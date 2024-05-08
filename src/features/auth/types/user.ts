import { BaseEntity } from '@/types/common';

export type UserModel = BaseEntity & {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  lastLogin: string;
  isAdmin: boolean;
};
