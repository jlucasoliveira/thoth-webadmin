import React from 'react';
import { Path, Link as RouterLink } from 'react-router-dom';
import { Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ReactComponent as KebabIcon } from '@/assets/icons/navigation/kebab.svg';

export type Action = {
  label: string;
  Icon: React.ElementType;
  route: string | Partial<Path>;
};

type Actions = {
  id: string;
  options: Action[];
  legacy?: boolean;
};

function LegacyActions(props: Omit<Actions, 'legacy'>) {
  return (
    <Menu>
      <MenuButton>
        <KebabIcon />
      </MenuButton>
      <MenuList>
        {props.options.map(({ Icon, label, route }) => (
          <MenuItem
            key={typeof route === 'string' ? route : route.pathname}
            as={RouterLink}
            to={route}
            icon={<Icon />}
          >
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

function Actions(props: Actions) {
  if (props.legacy) {
    return <LegacyActions {...props} />;
  }

  return (
    <Flex direction="row" columnGap={1}>
      {props.options.map(({ Icon, label, route }) => (
        <IconButton
          size="xs"
          variant="ghost"
          key={typeof route === 'string' ? route : route.pathname}
          aria-label={label}
          as={RouterLink}
          to={route}
          icon={<Icon />}
        >
          {label}
        </IconButton>
      ))}
    </Flex>
  );
}

export { Actions };
