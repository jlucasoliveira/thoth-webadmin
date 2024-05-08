import { ElementType, PropsWithChildren } from 'react';
import { BaseEntity } from './common';

export type Params = {
  id?: string;
};

export type GeneralRegistryParams = Params;

export type ClientParams<P = Params> = P & {
  clientId?: string;
};

export type FormProps<Payload = object, T = BaseEntity, P = Params> = Partial<P> & {
  isEdit?: boolean;
  loading?: boolean;
  fetchingLoading?: boolean;
  data?: T;
  onSubmit: (data: Payload) => Promise<T | void>;
  isModal?: boolean;
  Wrapper?: ElementType<
    PropsWithChildren<{ onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void> }>
  >;
};
