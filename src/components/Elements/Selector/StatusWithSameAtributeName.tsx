import { useMemo } from 'react';
import { Selector, Item, MutationVariables, MutationConfig } from './Selector';
import { UseMutationResult } from '@tanstack/react-query';

type Status = {
  status: boolean;
};

type Props<T> = {
  id: string;
  value: boolean;
  hook: (config?: MutationConfig) => UseMutationResult<any, any, MutationVariables<T>, any>;
};

// TODO: Refactor Status component to accept other atributes names
function Status<T extends Status>(props: Props<T>) {
  const items = useMemo<Item<T, 'status'>[]>(
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
    <Selector<T, 'status'>
      id={props.id}
      items={items}
      attribute="status"
      value={props.value}
      hook={props.hook}
    />
  );
}

export { Status };
