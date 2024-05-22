import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { AttachmentEntity } from '@/features/attachments/types';

type Response = {
  attachment: AttachmentEntity;
  presignedPutUrl: string;
};

async function getSignedURI(filename: string) {
  const { data } = await axios.post<Response>(`/attachments`, { filename });
  return data;
}

type UseGetSignedURI = {
  config?: MutationConfig<typeof getSignedURI>;
};

function useGetSignedURI({ config }: UseGetSignedURI = {}) {
  return useMutation({
    ...config,
    mutationKey: ['get-signed-uri'],
    mutationFn: getSignedURI,
  });
}

export { getSignedURI, useGetSignedURI };
