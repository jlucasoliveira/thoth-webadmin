import { Button, ButtonProps } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@/stores/notifications';
import { AuthRoutes } from '@/features/auth/routes/constants';
import { useUserStore } from '@/stores/user';
import { storage } from '@/utils/storage';

type Props = {
  isSmall?: boolean;
};

function SignOut({ isSmall, ...props }: ButtonProps & Props) {
  const { removeToken, removeUserData } = useUserStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  function handleLogOut() {
    storage.clearToken();
    removeToken();
    removeUserData();
    addNotification({
      type: 'warning',
      message: 'Você saiu de sua conta!',
    });
    navigate(AuthRoutes.Login, { replace: true });
  }

  return (
    <Button mr={5} rounded="full" colorScheme="blackAlpha" {...props} onClick={handleLogOut}>
      {isSmall ? null : 'Sair'}
    </Button>
  );
}

export { SignOut };
