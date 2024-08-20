import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { useFilters } from '@/hooks/useFilters';
import { useCallback } from 'react';
import { Operator, Filter as PaginationFilter } from '@/types/pagination';
import { buildObject, NestedKeyOf } from '@/utils/helpers';

type Value = {
  label: string;
  value: string;
};

export type Option<T extends object> = {
  label: string;
  key: NestedKeyOf<T>;
  operator: Operator;
  defaultValue?: string;
  type?: 'radio' | 'checkbox';
  values: Value[];
};

type Filter<T extends object> = {
  options: Option<T>[];
};

function Filter<T extends object>(props: Filter<T>) {
  const { replaceFilter } = useFilters<T>();

  const handleOnChange = useCallback(
    (key: NestedKeyOf<T>, op: Operator, value: string | string[]) => {
      const props = value === 'all' ? {} : buildObject(key, { [op]: value });

      replaceFilter(props as unknown as PaginationFilter<T>, true);
    },
    [replaceFilter]
  );

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="blue" rounded="5" fontSize="1rem" size="sm" pl={1}>
        Filtrar
      </MenuButton>
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
