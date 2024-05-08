import { Flex, List, Text } from '@chakra-ui/react';
import { options } from './menu-items';
import { Item } from './Item';

type SideBar = {
  isOpen?: boolean;
};

function SideBar({ isOpen = true }: SideBar) {
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
      <List mt={5} key={options.title}>
        <Text as="b" color="gray.560" fontSize={12}>
          {options.title}
        </Text>

        {options.children.map((child) => (
          <Item isSidebarOpen={isOpen} child={child} key={child.label} />
        ))}
      </List>
    </Flex>
  );
}

export { SideBar };
