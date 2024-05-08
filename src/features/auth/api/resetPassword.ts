import { axios } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AuthRoutes } from '@/features/auth/routes/constants';
import { useNotificationStore } from '@/stores/notifications';

type Payload = {
  token: string;
  newPassword: string;
};

async function resetPassword(payload: Payload) {
  return axios.post('/auth/reset-password', payload);
}

function usePasswordReset() {
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: resetPassword,
    onSuccess: () => {
      addNotification({
        title: 'Tudo certo!',
        message: 'Senha alterada com sucesso!',
        type: 'success',
      });
      navigate(AuthRoutes.Login);
    },
  });
}

export { resetPassword, usePasswordReset };
