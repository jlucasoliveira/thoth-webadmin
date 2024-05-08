import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  List,
  Text,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { options } from './menu-items';
import { Item } from './Item';

type Option = Pick<UseDisclosureReturn, 'isOpen'> & {
  onClose?: () => void;
};

function Options({ isOpen = true, onClose }: Option) {
  return (
    <List mt={5} key={options.title}>
      <Text as="b" color="gray.560" fontSize={12}>
        {options.title}
      </Text>

      {options.children.map((child) => (
        <Item isSidebarOpen={isOpen} child={child} key={child.label} onClose={onClose} />
      ))}
    </List>
  );
}

function ListMenu({ isOpen = true }: Option) {
  return (
    <Flex
      direction="column"
      bg="white"
      overflowX="hidden"
      px={isOpen ? '16px' : '2'}
      borderRightStyle="solid"
      borderRightWidth="1px"
      borderRightColor="gray.450"
      maxW="240px"
      minW={isOpen ? '240px' : '20'}
      css={`
        height: calc(100vh - 60px);
      `}
    >
      <Options isOpen={isOpen} />
    </Flex>
  );
}

function DrawerMenu({ isOpen, onClose }: Pick<UseDisclosureReturn, 'isOpen' | 'onClose'>) {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Options isOpen onClose={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

type Sidebar = Pick<UseDisclosureReturn, 'isOpen' | 'onClose'> & {
  isSmall: boolean;
};

function SideBar({ isSmall, isOpen, onClose }: Sidebar) {
  if (isSmall) return <DrawerMenu isOpen={isOpen} onClose={onClose} />;

  return <ListMenu isOpen={isOpen} />;
}

export { SideBar };
