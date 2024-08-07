import { PropsWithChildren } from 'react';
import { Flex, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { Header } from './Header';
import { SideBar } from './Sidebar';

function MainLayout(props: PropsWithChildren<object>) {
  const [isSmallScreenSize] = useMediaQuery('(max-width: 1100px)');
  const { isOpen, onToggle, onClose } = useDisclosure({ defaultIsOpen: !isSmallScreenSize });

  return (
    <Flex flex={1} direction="column" maxW="100vw">
      <Header isSmall={isSmallScreenSize} isOpen={isOpen} onToggle={onToggle} />
      <Flex css="height: calc(100vh - 60px);" flex={1} direction="row" bgColor="white">
        <SideBar isOpen={isOpen} isSmall={isSmallScreenSize} onClose={onClose} />
        {props.children}
      </Flex>
    </Flex>
  );
}

export { MainLayout };
