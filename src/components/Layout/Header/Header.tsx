import { IconButton, Flex, Center, Button, SkeletonCircle, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/user';
import { SignOut } from '@/components/Elements';
import { ReactComponent as Logo } from '@/assets/images/logo.svg';
import { ReactComponent as LeftArrow } from '@/assets/icons/directions/left.svg';
import { ReactComponent as RightArrow } from '@/assets/icons/directions/right.svg';
import { ReactComponent as SignOutIcon } from '@/assets/icons/navigation/signOut.svg';
import { useGetAttachment } from '@/features/attachments/api/getAttachment';

type Header = {
  isOpen?: boolean;
  onToggle?: () => void;
};

function Header({ isOpen = true, onToggle }: Header) {
  const { user } = useUserStore();
  const attachment = useGetAttachment({ id: user.pictureId });

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
    >
      <Center aria-label="Logo do Cabeçalho" my="5px">
        <Logo height={50} width={200} aria-label="Thoth Logo" />
        <IconButton
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
      </Center>
      <Center aria-label="menu">
        <SignOut size="sm" colorScheme="blue" rightIcon={<SignOutIcon />} />
        {user.pictureId ? (
          <Link to="/profile">
            {attachment.isLoading ? (
              <SkeletonCircle h="32px" w="32px" minH="32px" minW="32px" rounded="full" mr={8} />
            ) : (
              <Image
                rounded="full"
                h="32px"
                w="32px"
                minW="32px"
                minH="32px"
                src={attachment.data?.presignedGetUrl}
                mr={8}
              />
            )}
          </Link>
        ) : (
          <Button
            mr={8}
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
        )}
      </Center>
    </Flex>
  );
}

export { Header };
