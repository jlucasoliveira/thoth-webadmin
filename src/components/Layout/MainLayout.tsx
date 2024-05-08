import { PropsWithChildren } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { Header } from './Header';
import { SideBar } from './Sidebar';

function MainLayout(props: PropsWithChildren<object>) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Flex flex={1} direction="column" maxW="100vw">
      <Header isOpen={isOpen} onToggle={onToggle} />
      <Flex css="height: calc(100vh - 60px);" flex={1} direction="row" bgColor="gray.60">
        <SideBar isOpen={isOpen} />
        {props.children}
      </Flex>
    </Flex>
  );
}

export { MainLayout };
