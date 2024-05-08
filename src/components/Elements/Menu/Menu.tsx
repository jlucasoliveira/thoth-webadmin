import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonProps,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

type Item = {
  title: string;
  onClick: () => void;
};

type Menu = {
  title: string;
  buttonProps?: ButtonProps;
  itens: Item[];
};

function Menu(props: Menu) {
  return (
    <ChakraMenu>
      <MenuButton as={Button} colorScheme="blue" leftIcon={<AddIcon />} {...props.buttonProps}>
        {props.title}
      </MenuButton>
      <MenuList>
        {props.itens.map((item) => (
          <MenuItem key={item.title} onClick={item.onClick}>
            {item.title}
          </MenuItem>
        ))}
      </MenuList>
    </ChakraMenu>
  );
}

export { Menu };
