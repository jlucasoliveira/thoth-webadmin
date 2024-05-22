import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

async function deleteAttachment(id: string) {
  return axios.delete<void>(`/attachments/${id}`);
}

type UseDeleteAttachment = {
  config?: MutationConfig<typeof deleteAttachment>;
};

function useDeleteAttachment({ config }: UseDeleteAttachment = {}) {
  return useMutation({
    ...config,
    mutationFn: (id) => deleteAttachment(id),
  });
}

export { deleteAttachment, useDeleteAttachment };
