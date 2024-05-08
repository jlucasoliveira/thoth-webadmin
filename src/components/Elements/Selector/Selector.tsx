import { useCallback, useMemo, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Button, ColorProps, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { SelectorIcon } from './Icon';

export type Item<T, Key extends keyof T> = {
  label: string;
  value: T[Key];
  color: ColorProps['color'];
};

export type MutationVariables<T, P = Record<string, any>> = { id: string; payload: Partial<T> } & P;

export type MutationConfig = {
  forAttribute?: boolean;
};

type SelectorProps<T, Key extends keyof T, P = Record<string, any>> = {
  attribute: Key;
  value: T[Key];
  items: Item<T, Key>[];
  id: string;
  hook: (config?: MutationConfig) => UseMutationResult<any, any, MutationVariables<T, P>, any>;
  mutationParams?: P;
};

function Selector<T, K extends keyof T = any, P = object>(props: SelectorProps<T, K, P>) {
  const [option, setOption] = useState<T[K] | null>(null);
  const { isLoading, mutateAsync } = props.hook({ forAttribute: true });

  const [label, color, value] = useMemo<[string, ColorProps['color'], T[K]]>(() => {
    const value = option !== null ? option : props.value;
    const selected = props.items.find((item) => value === item.value);
    return selected ? [selected.label, selected.color, value] : ['Selecione', undefined, value];
  }, [props, option]);

  const handleClick = useCallback(
    async (value: T[K]) => {
      await mutateAsync({
        id: props.id,
        ...props.mutationParams,
        payload: { [props.attribute]: value },
      } as unknown as MutationVariables<T, P>);
      setOption(value);
    },
    [mutateAsync, props]
  );

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        bgColor="gray.300"
        rightIcon={<ChevronDownIcon />}
        leftIcon={<SelectorIcon color={color} />}
        isLoading={isLoading}
      >
        {label}
      </MenuButton>
      <MenuList>
        {props.items.map((item) => (
          <MenuItem
            key={item.label}
            isDisabled={item.value === value}
            onClick={() => handleClick(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export { Selector };
