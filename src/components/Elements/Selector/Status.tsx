import { useMemo } from 'react';
import { Selector, Item, MutationVariables, MutationConfig } from './Selector';
import { UseMutationResult } from '@tanstack/react-query';

type Status = {
  isActive: boolean;
};

type Props<T, P = object> = {
  id: string;
  value: boolean;
  hook: (
    config?: MutationConfig
  ) => UseMutationResult<any, any, MutationVariables<T, P>, any> | any;
  mutationParams?: P;
};

function Status<T extends Status, P = Record<string, any>>(props: Props<T, P>) {
  const items = useMemo<Item<T, 'isActive'>[]>(
    () => [
      {
        label: 'Ativo',
        color: 'other.green',
        value: true,
      },
      {
        label: 'Inativo',
        color: 'blue.500',
        value: false,
      },
    ],
    []
  );

  return (
    <Selector<T, 'isActive', P>
      id={props.id}
      items={items}
      attribute="isActive"
      value={props.value}
      hook={props.hook}
      mutationParams={props.mutationParams}
    />
  );
}

export { Status };
