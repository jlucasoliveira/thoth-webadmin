import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  userId: string;
  newPassword: string;
  confirmPassword: string;
};

async function changePassword(payload: Payload) {
  return axios.post('/auth/change-password', payload);
}

type UseChangePassword = {
  config?: MutationConfig<typeof changePassword>;
};

function useChangePassword({ config }: UseChangePassword = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: changePassword,
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Senha alterada!',
      });
    },
  });
}

export { changePassword, useChangePassword };
