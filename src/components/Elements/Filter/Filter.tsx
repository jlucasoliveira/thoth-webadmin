import {
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { useFilters } from '@/hooks/useFilters';
import { ReactComponent as FilterIcon } from '@/assets/icons/navigation/filter.svg';
import { useCallback } from 'react';
import { Operator, Filter as PaginationFilter } from '@/types/pagination';

type Value = {
  label: string;
  value: string;
};

export type Option<T> = {
  label: string;
  key: keyof T;
  operator: Operator;
  defaultValue?: string;
  type?: 'radio' | 'checkbox';
  values: Value[];
};

type Filter<T> = {
  options: Option<T>[];
};

function Filter<T>(props: Filter<T>) {
  const { replaceFilter } = useFilters<T>();

  const handleOnChange = useCallback(
    (key: keyof T, op: Operator, value: string | string[]) => {
      const props =
        value === 'all'
          ? {}
          : {
              [key]: {
                [op]: Array.isArray(value) ? value[0] : value,
              },
            };

      replaceFilter(props as unknown as PaginationFilter<T>);
    },
    [replaceFilter]
  );

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        icon={<FilterIcon />}
        colorScheme="whiteAlpha"
        rounded="full"
        mx={1}
        borderStyle="solid"
        borderWidth="1px"
        borderColor="gray.390"
      />
      <MenuList zIndex={3}>
        {props.options.map((group) => (
          <MenuOptionGroup
            key={group.key.toString()}
            defaultValue={group.defaultValue}
            title={group.label}
            type={group.type}
            onChange={(value) => handleOnChange(group.key, group.operator, value)}
          >
            {group.values.map((option) => (
              <MenuItemOption key={option.value} value={option.value}>
                {option.label}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        ))}
      </MenuList>
    </Menu>
  );
}

export { Filter };
