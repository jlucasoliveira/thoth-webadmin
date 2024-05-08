import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { useNotificationStore } from '@/stores/notifications';
import { AuthRoutes } from '@/features/auth/routes/constants';

async function passwordRecovery(email: string) {
  return axios.post('/auth/forgot-password', { email });
}

function usePasswordRecovery() {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationKey: ['password-recovery'],
    mutationFn: passwordRecovery,
    onSuccess: () => {
      addNotification({
        title: 'Tudo certo!',
        message: 'Enviamos um e-mail com as instruções para a alteração da senha.',
        type: 'success',
      });
      navigate(AuthRoutes.Login);
    },
  });
}

export { passwordRecovery, usePasswordRecovery };
