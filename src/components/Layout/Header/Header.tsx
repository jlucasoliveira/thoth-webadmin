import { IconButton, Flex, Center, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/user';
import { SignOut } from '@/components/Elements';
import { ReactComponent as Logo } from '@/assets/images/logo.svg';
import { ReactComponent as LeftArrow } from '@/assets/icons/directions/left.svg';
import { ReactComponent as RightArrow } from '@/assets/icons/directions/right.svg';
import { ReactComponent as SignOutIcon } from '@/assets/icons/navigation/signOut.svg';

type Header = {
  isOpen?: boolean;
  isSmall?: boolean;
  onToggle?: () => void;
};

function Header({ isOpen = true, isSmall = false, onToggle }: Header) {
  const { user } = useUserStore();
  const Icon = isOpen ? LeftArrow : RightArrow;

  return (
    <Flex
      aria-label="Cabeçalho"
      direction="row"
      justifyContent="space-between"
      width="full"
      bg="white"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="gray.450"
      px="4"
    >
      {isSmall ? (
        <Center>
          <IconButton
            aria-label="Abrir menu"
            colorScheme="blue"
            icon={<HamburgerIcon color="white" width="16px" height="16px" />}
            h="32px"
            w="32px"
            minW="32px"
            onClick={onToggle}
          />
        </Center>
      ) : null}
      <Center flex={isSmall ? 1 : undefined} aria-label="Logo do Cabeçalho" my="5px">
        <Logo height={45} width="inherit" aria-label="Thoth Logo" />
        {isSmall ? null : (
          <IconButton
            ml="2"
            aria-label="Fechar menu"
            rounded="full"
            bg="white"
            borderStyle="solid"
            borderWidth="1px"
            borderColor="gray.560"
            icon={<Icon width="16px" height="16px" />}
            h="32px"
            w="32px"
            minW="32px"
            onClick={onToggle}
          />
        )}
      </Center>
      <Center aria-label="menu">
        <SignOut isSmall={isSmall} size="sm" colorScheme="blue" rightIcon={<SignOutIcon />} />
        <Button
          aria-label="Perfil"
          as={Link}
          to="/profile"
          colorScheme="blue"
          rounded="full"
          textTransform="uppercase"
          borderColor="other.semiBlack"
          borderWidth="1px"
          borderStyle="solid"
          size="sm"
          fontSize="20px"
          paddingInline={0}
        >
          {user?.name?.charAt(0)}
        </Button>
      </Center>
    </Flex>
  );
}

export { Header };
